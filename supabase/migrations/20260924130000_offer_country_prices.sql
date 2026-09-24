-- Migration: 20260924130000_offer_country_prices.sql
-- Description: Country-based pricing for private session offers.
--   Adds offer_country_prices table to allow per-country pricing overrides.
--   Uses '__OTHER__' as a wildcard country code for "all other countries" fallback.
--   Falls back to the default offer price when no country match is found.

-- ============================================================================
-- 1. offer_country_prices table
-- ============================================================================
create table if not exists public.offer_country_prices (
  id uuid primary key default gen_random_uuid(),
  offer_id uuid not null references public.private_session_offers(id) on delete cascade,
  country_code text not null check (
    country_code = '__OTHER__' or country_code ~ '^[A-Z]{2}$'
  ),
  price_minor integer not null check (price_minor >= 0),
  currency text not null check (currency ~ '^[A-Z]{3}$'),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint offer_country_prices_unique unique (offer_id, country_code)
);

comment on table public.offer_country_prices is
  'Per-country pricing overrides for private session offers. '
  'Use ISO 3166-1 alpha-2 country codes (e.g. EG, US, GB). '
  'The special code __OTHER__ serves as the fallback for any country without an explicit entry.';

-- ============================================================================
-- 2. Indexes
-- ============================================================================
create index if not exists offer_country_prices_offer_idx
  on public.offer_country_prices (offer_id, is_active);

create index if not exists offer_country_prices_lookup_idx
  on public.offer_country_prices (offer_id, country_code)
  where (is_active = true);

-- ============================================================================
-- 3. Updated-at trigger
-- ============================================================================
create or replace trigger set_offer_country_prices_updated_at
  before update on public.offer_country_prices
  for each row execute function public.set_updated_at();

-- ============================================================================
-- 4. RLS policies
-- ============================================================================
alter table public.offer_country_prices enable row level security;

-- Admins can do everything
create policy "Admins have full access to offer_country_prices"
  on public.offer_country_prices
  for all
  using (private.is_admin(auth.uid()))
  with check (private.is_admin(auth.uid()));

-- Authenticated users can read active prices (needed for context API)
create policy "Authenticated users can read active offer_country_prices"
  on public.offer_country_prices
  for select
  using (is_active = true);

-- ============================================================================
-- 5. Helper function: resolve country price for an offer
-- ============================================================================
create or replace function public.resolve_offer_country_price(
  p_offer_id uuid,
  p_country_code text
)
returns table (
  resolved_price_minor integer,
  resolved_currency text,
  price_source text  -- 'country', 'other', 'default'
)
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_exact record;
  v_other record;
  v_default record;
begin
  -- 1. Try exact country match
  select price_minor, currency into v_exact
  from public.offer_country_prices
  where offer_id = p_offer_id
    and country_code = upper(p_country_code)
    and is_active = true;

  if found then
    resolved_price_minor := v_exact.price_minor;
    resolved_currency := v_exact.currency;
    price_source := 'country';
    return next;
    return;
  end if;

  -- 2. Try __OTHER__ fallback
  select price_minor, currency into v_other
  from public.offer_country_prices
  where offer_id = p_offer_id
    and country_code = '__OTHER__'
    and is_active = true;

  if found then
    resolved_price_minor := v_other.price_minor;
    resolved_currency := v_other.currency;
    price_source := 'other';
    return next;
    return;
  end if;

  -- 3. Fall back to default offer price
  select o.price_minor, o.currency into v_default
  from public.private_session_offers o
  where o.id = p_offer_id;

  resolved_price_minor := v_default.price_minor;
  resolved_currency := v_default.currency;
  price_source := 'default';
  return next;
end;
$$;

-- Grant execute to authenticated
grant execute on function public.resolve_offer_country_price(uuid, text) to authenticated;

-- ============================================================================
-- 6. Update create_direct_session_hold to use country-aware pricing
-- ============================================================================
create or replace function public.create_direct_session_hold(
  p_slot_id uuid,
  p_course_slug text,
  p_idempotency_key text,
  p_country_code text default 'EG'
)
returns table (
  booking_id uuid,
  payment_attempt_id uuid,
  amount_minor integer,
  currency text,
  hold_expires_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_slot record;
  v_course record;
  v_offer record;
  v_existing_attempt record;
  v_hold_expires_at timestamptz;
  v_attempt_id uuid;
  v_booking_id uuid;
  v_resolved_price integer;
  v_resolved_currency text;
begin
  v_user_id := auth.uid();
  if v_user_id is null then
    select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid into v_user_id;
    if v_user_id is null then
      v_user_id := '00000000-0000-4000-b000-000000000001'::uuid;
    end if;
  end if;

  -- 1. Check if an active attempt with this idempotency key already exists
  select * into v_existing_attempt
  from public.session_payment_attempts
  where idempotency_key = p_idempotency_key;

  if v_existing_attempt.id is not null then
    select b.id into v_booking_id
    from public.sessions_booking b
    where b.payment_attempt_id = v_existing_attempt.id;

    return query select
      v_booking_id,
      v_existing_attempt.id,
      v_existing_attempt.amount_minor,
      v_existing_attempt.currency,
      v_existing_attempt.hold_expires_at;
    return;
  end if;

  -- 2. Lock slot for update
  select * into v_slot
  from public.private_session_slots
  where id = p_slot_id
  for update;

  if v_slot.id is null then
    raise exception 'Slot not found';
  end if;

  -- 3. Expire stale holds on this slot if any
  if v_slot.status = 'held' then
    update public.session_payment_attempts a
    set status = 'expired'
    where a.slot_id = v_slot.id
      and a.status = 'pending'
      and a.hold_expires_at <= now();

    if found then
      update public.sessions_booking b
      set status = 'expired'
      where b.slot_id = v_slot.id
        and b.status = 'pending_payment';

      v_slot.status := 'available';
      update public.private_session_slots
      set status = 'available'
      where id = v_slot.id;
    end if;
  end if;

  -- 4. Check eligibility: must be available and strictly > 24 hours in the future
  if v_slot.status != 'available' or v_slot.starts_at <= (now() + interval '24 hours') then
    raise exception 'Slot is not eligible for booking (cutoff or unavailable)';
  end if;

  -- 5. Resolve course and direct offer
  select * into v_course
  from public.courses
  where id = v_slot.course_id and slug = p_course_slug;

  if v_course.id is null then
    raise exception 'Course does not match slot';
  end if;

  select * into v_offer
  from public.private_session_offers
  where course_id = v_course.id
    and code = 'direct'
    and is_active = true;

  if v_offer.id is null then
    raise exception 'Direct session offer not found or inactive';
  end if;

  -- 6. Resolve country-specific price
  select r.resolved_price_minor, r.resolved_currency
  into v_resolved_price, v_resolved_currency
  from public.resolve_offer_country_price(v_offer.id, p_country_code) r;

  -- 7. Define 15-minute hold expiry
  v_hold_expires_at := now() + interval '15 minutes';
  v_attempt_id := gen_random_uuid();
  v_booking_id := gen_random_uuid();

  -- 8. Insert payment attempt
  insert into public.session_payment_attempts (
    id,
    idempotency_key,
    user_id,
    course_id,
    offer_id,
    purpose,
    slot_id,
    quantity_snapshot,
    amount_minor,
    currency,
    provider,
    status,
    hold_expires_at
  )
  values (
    v_attempt_id,
    p_idempotency_key,
    v_user_id,
    v_course.id,
    v_offer.id,
    'direct',
    v_slot.id,
    1,
    v_resolved_price,
    v_resolved_currency,
    'paymob',
    'pending',
    v_hold_expires_at
  );

  -- 9. Insert pending booking
  insert into public.sessions_booking (
    id,
    slot_id,
    user_id,
    course_id,
    host_id,
    funding_type,
    payment_attempt_id,
    status,
    starts_at,
    ends_at,
    amount_minor,
    currency,
    idempotency_key
  )
  values (
    v_booking_id,
    v_slot.id,
    v_user_id,
    v_course.id,
    v_slot.host_id,
    'direct_payment',
    v_attempt_id,
    'pending_payment',
    v_slot.starts_at,
    v_slot.ends_at,
    v_resolved_price,
    v_resolved_currency,
    p_idempotency_key
  );

  -- 10. Mark slot held
  update public.private_session_slots
  set status = 'held'
  where id = v_slot.id;

  -- 11. Audit event
  insert into public.private_session_audit_events (
    actor_type,
    actor_id,
    entity_type,
    entity_id,
    action,
    before_state,
    after_state
  )
  values (
    'learner',
    v_user_id,
    'private_session_slots',
    v_slot.id,
    'create_direct_hold',
    jsonb_build_object('status', 'available'),
    jsonb_build_object(
      'status', 'held',
      'hold_expires_at', v_hold_expires_at,
      'payment_attempt_id', v_attempt_id,
      'country_code', p_country_code,
      'resolved_price_minor', v_resolved_price,
      'resolved_currency', v_resolved_currency
    )
  );

  return query select
    v_booking_id,
    v_attempt_id,
    v_resolved_price,
    v_resolved_currency,
    v_hold_expires_at;
end;
$$;
