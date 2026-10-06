-- Phase 3: atomic payment snapshots and a safe Paddle transaction-creation claim.

alter table public.session_payment_attempts
  add column if not exists provider_creation_claim_id uuid,
  add column if not exists provider_creation_claimed_at timestamptz;

create index if not exists session_payment_attempts_provider_claim_idx
  on public.session_payment_attempts (provider, provider_creation_claimed_at)
  where provider_creation_claim_id is not null;

create or replace function public.create_paddle_direct_session_hold(
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
  v_user_id uuid := auth.uid();
  v_existing_attempt record;
  v_hold record;
  v_course_id uuid;
  v_offer_id uuid;
  v_currency text;
  v_country_code text := upper(trim(p_country_code));
begin
  if v_user_id is null then
    raise exception 'Authentication required';
  end if;

  if v_country_code !~ '^[A-Z]{2}$' then
    v_country_code := 'EG';
  end if;

  select * into v_existing_attempt
  from public.session_payment_attempts
  where idempotency_key = p_idempotency_key;

  if v_existing_attempt.id is not null then
    if v_existing_attempt.user_id <> v_user_id then
      raise exception 'Idempotency key is already in use';
    end if;
    if v_existing_attempt.purpose <> 'direct' or v_existing_attempt.slot_id <> p_slot_id then
      raise exception 'Idempotency key belongs to a different checkout request';
    end if;
  end if;

  select s.course_id into v_course_id
  from public.private_session_slots s
  join public.courses c on c.id = s.course_id
  where s.id = p_slot_id and c.slug = p_course_slug;

  if v_course_id is null then
    raise exception 'Slot not found or does not match course';
  end if;

  select id into v_offer_id
  from public.private_session_offers
  where course_id = v_course_id and code = 'direct' and is_active = true;

  if v_offer_id is null then
    raise exception 'Direct session offer not found or inactive';
  end if;

  select resolved_currency into v_currency
  from public.resolve_offer_country_price(v_offer_id, v_country_code);

  if v_currency not in (
    'USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CLP', 'HKD', 'SGD',
    'SEK', 'ARS', 'BRL', 'CNY', 'COP', 'CZK', 'DKK', 'HUF', 'ILS', 'INR',
    'KRW', 'MXN', 'NOK', 'NZD', 'PEN', 'PLN', 'RUB', 'THB', 'TRY', 'TWD',
    'UAH', 'VND', 'ZAR'
  ) then
    raise exception 'Unsupported Paddle currency: %', v_currency;
  end if;

  select * into v_hold
  from public.create_direct_session_hold(
    p_slot_id,
    p_course_slug,
    p_idempotency_key,
    v_country_code
  );

  if v_hold.payment_attempt_id is null then
    raise exception 'Could not create direct-session payment attempt';
  end if;

  if v_hold.currency not in (
    'USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CLP', 'HKD', 'SGD',
    'SEK', 'ARS', 'BRL', 'CNY', 'COP', 'CZK', 'DKK', 'HUF', 'ILS', 'INR',
    'KRW', 'MXN', 'NOK', 'NZD', 'PEN', 'PLN', 'RUB', 'THB', 'TRY', 'TWD',
    'UAH', 'VND', 'ZAR'
  ) then
    raise exception 'Unsupported Paddle currency: %', v_hold.currency;
  end if;

  update public.session_payment_attempts
  set provider = 'paddle'
  where id = v_hold.payment_attempt_id
    and user_id = v_user_id;

  return query select
    v_hold.booking_id,
    v_hold.payment_attempt_id,
    v_hold.amount_minor,
    v_hold.currency,
    v_hold.hold_expires_at;
end;
$$;

create or replace function public.create_paddle_package_payment_attempt(
  p_course_slug text,
  p_offer_id uuid,
  p_idempotency_key text,
  p_country_code text default 'EG'
)
returns table (
  payment_attempt_id uuid,
  amount_minor integer,
  currency text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_course record;
  v_offer record;
  v_existing_attempt record;
  v_country_code text := upper(trim(p_country_code));
  v_amount_minor integer;
  v_currency text;
  v_attempt_id uuid;
begin
  if v_user_id is null then
    raise exception 'Authentication required';
  end if;

  if v_country_code !~ '^[A-Z]{2}$' then
    v_country_code := 'EG';
  end if;

  select * into v_existing_attempt
  from public.session_payment_attempts
  where idempotency_key = p_idempotency_key;

  if v_existing_attempt.id is not null then
    if v_existing_attempt.user_id <> v_user_id then
      raise exception 'Idempotency key is already in use';
    end if;
    if v_existing_attempt.purpose <> 'package' or v_existing_attempt.offer_id <> p_offer_id then
      raise exception 'Idempotency key belongs to a different checkout request';
    end if;

    return query select
      v_existing_attempt.id,
      v_existing_attempt.amount_minor,
      v_existing_attempt.currency;
    return;
  end if;

  select * into v_course
  from public.courses
  where slug = p_course_slug;

  if v_course.id is null then
    raise exception 'Course not found';
  end if;

  select * into v_offer
  from public.private_session_offers
  where id = p_offer_id
    and course_id = v_course.id
    and kind = 'package'
    and session_count in (5, 10)
    and is_active = true;

  if v_offer.id is null then
    raise exception 'Package offer not found or inactive';
  end if;

  select resolved_price_minor, resolved_currency
  into v_amount_minor, v_currency
  from public.resolve_offer_country_price(v_offer.id, v_country_code);

  if v_amount_minor is null or v_amount_minor <= 0 then
    raise exception 'A paid checkout requires a positive price';
  end if;

  if v_currency not in (
    'USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CLP', 'HKD', 'SGD',
    'SEK', 'ARS', 'BRL', 'CNY', 'COP', 'CZK', 'DKK', 'HUF', 'ILS', 'INR',
    'KRW', 'MXN', 'NOK', 'NZD', 'PEN', 'PLN', 'RUB', 'THB', 'TRY', 'TWD',
    'UAH', 'VND', 'ZAR'
  ) then
    raise exception 'Unsupported Paddle currency: %', v_currency;
  end if;

  v_attempt_id := gen_random_uuid();

  insert into public.session_payment_attempts (
    id, idempotency_key, user_id, course_id, offer_id, purpose, slot_id,
    quantity_snapshot, amount_minor, currency, provider, status, hold_expires_at
  )
  values (
    v_attempt_id, p_idempotency_key, v_user_id, v_course.id, v_offer.id,
    'package', null, v_offer.session_count, v_amount_minor, v_currency,
    'paddle', 'created', null
  )
  on conflict (idempotency_key) do nothing;

  if not found then
    select * into v_existing_attempt
    from public.session_payment_attempts
    where idempotency_key = p_idempotency_key;

    if v_existing_attempt.user_id <> v_user_id
      or v_existing_attempt.purpose <> 'package'
      or v_existing_attempt.offer_id <> p_offer_id then
      raise exception 'Idempotency key is already in use';
    end if;

    return query select
      v_existing_attempt.id,
      v_existing_attempt.amount_minor,
      v_existing_attempt.currency;
    return;
  end if;

  return query select v_attempt_id, v_amount_minor, v_currency;
end;
$$;

-- The base hold RPC is an internal implementation detail. Browser callers use
-- the Paddle-specific wrapper, which validates the currency and ownership.
revoke all on function public.create_direct_session_hold(uuid, text, text, text)
  from public, anon, authenticated;

revoke all on function public.create_paddle_direct_session_hold(uuid, text, text, text)
  from public, anon, authenticated;
grant execute on function public.create_paddle_direct_session_hold(uuid, text, text, text)
  to authenticated;

revoke all on function public.create_paddle_package_payment_attempt(text, uuid, text, text)
  from public, anon, authenticated;
grant execute on function public.create_paddle_package_payment_attempt(text, uuid, text, text)
  to authenticated;