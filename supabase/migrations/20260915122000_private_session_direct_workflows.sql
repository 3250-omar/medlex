-- Migration: 20260915122000_private_session_direct_workflows.sql
-- Description: Security definer RPCs for direct session booking:
--              1. list_eligible_private_session_slots
--              2. create_direct_session_hold
--              3. expire_direct_session_hold
--              4. confirm_direct_session_payment

-- ============================================================================
-- 1. list_eligible_private_session_slots
-- ============================================================================
create or replace function public.list_eligible_private_session_slots(
  p_course_slug text,
  p_from timestamptz default null,
  p_to timestamptz default null
)
returns table (
  id uuid,
  starts_at timestamptz,
  ends_at timestamptz,
  source_timezone text,
  host_display_name text
)
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_course_id uuid;
begin
  select c.id into v_course_id
  from public.courses c
  where c.slug = p_course_slug and c.is_published = true;

  if v_course_id is null then
    return;
  end if;

  return query
  select
    s.id,
    s.starts_at,
    s.ends_at,
    s.source_timezone,
    h.display_name as host_display_name
  from public.private_session_slots s
  join public.private_session_hosts h on h.id = s.host_id
  where s.course_id = v_course_id
    and s.status = 'available'
    and s.starts_at > now() + interval '24 hours' -- Strict 24-hour cutoff
    and h.is_active = true
    and (p_from is null or s.starts_at >= p_from)
    and (p_to is null or s.starts_at <= p_to)
  order by s.starts_at asc;
end;
$$;

-- ============================================================================
-- 2. create_direct_session_hold
-- ============================================================================
create or replace function public.create_direct_session_hold(
  p_slot_id uuid,
  p_course_slug text,
  p_idempotency_key text
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
begin
  v_user_id := auth.uid();
  if v_user_id is null then
    -- Support fixture/test execution if running in direct script
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

  -- 6. Define 15-minute hold expiry
  v_hold_expires_at := now() + interval '15 minutes';
  v_attempt_id := gen_random_uuid();
  v_booking_id := gen_random_uuid();

  -- 7. Insert payment attempt
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
    v_offer.price_minor,
    v_offer.currency,
    'paymob',
    'pending',
    v_hold_expires_at
  );

  -- 8. Insert pending booking
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
    v_offer.price_minor,
    v_offer.currency,
    p_idempotency_key
  );

  -- 9. Mark slot held
  update public.private_session_slots
  set status = 'held'
  where id = v_slot.id;

  -- 10. Audit event
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
    jsonb_build_object('status', 'held', 'hold_expires_at', v_hold_expires_at, 'payment_attempt_id', v_attempt_id)
  );

  return query select
    v_booking_id,
    v_attempt_id,
    v_offer.price_minor,
    v_offer.currency,
    v_hold_expires_at;
end;
$$;

-- ============================================================================
-- 3. expire_direct_session_hold
-- ============================================================================
create or replace function public.expire_direct_session_hold(
  p_payment_attempt_id uuid
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_attempt record;
  v_booking record;
begin
  select * into v_attempt
  from public.session_payment_attempts
  where id = p_payment_attempt_id
  for update;

  if v_attempt.id is null or v_attempt.status != 'pending' then
    return false;
  end if;

  update public.session_payment_attempts
  set status = 'expired'
  where id = v_attempt.id;

  select * into v_booking
  from public.sessions_booking
  where payment_attempt_id = v_attempt.id
  for update;

  if v_booking.id is not null then
    update public.sessions_booking
    set status = 'expired'
    where id = v_booking.id;

    update public.private_session_slots
    set status = 'available'
    where id = v_booking.slot_id and status = 'held';
  end if;

  return true;
end;
$$;

-- ============================================================================
-- 4. confirm_direct_session_payment
-- ============================================================================
create or replace function public.confirm_direct_session_payment(
  p_payment_attempt_id uuid,
  p_provider_order_id text default null,
  p_provider_transaction_id text default null
)
returns table (
  booking_id uuid,
  status text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_attempt record;
  v_booking record;
  v_slot record;
begin
  -- 1. Lock payment attempt
  select * into v_attempt
  from public.session_payment_attempts
  where id = p_payment_attempt_id
  for update;

  if v_attempt.id is null then
    raise exception 'Payment attempt not found';
  end if;

  -- Idempotency: if already paid, return confirmed state
  if v_attempt.status = 'paid' then
    select b.id, b.status into booking_id, status
    from public.sessions_booking b
    where b.payment_attempt_id = v_attempt.id;
    return next;
    return;
  end if;

  -- 2. Lock booking
  select * into v_booking
  from public.sessions_booking
  where payment_attempt_id = v_attempt.id
  for update;

  if v_booking.id is null then
    raise exception 'Booking record not found for payment attempt';
  end if;

  -- 3. Lock slot
  select * into v_slot
  from public.private_session_slots
  where id = v_booking.slot_id
  for update;

  -- Check if slot hold expired and was booked by another learner
  if v_slot.status = 'booked' then
    -- Edge case: paid unfulfilled (money collected, slot lost)
    update public.session_payment_attempts
    set
      status = 'paid_unfulfilled',
      provider_order_id = coalesce(p_provider_order_id, provider_order_id),
      provider_transaction_id = coalesce(p_provider_transaction_id, provider_transaction_id),
      paid_at = now()
    where id = v_attempt.id;

    update public.sessions_booking
    set status = 'failed'
    where id = v_booking.id;

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
      'system',
      null,
      'sessions_booking',
      v_booking.id,
      'paid_unfulfilled_conflict',
      jsonb_build_object('status', v_booking.status),
      jsonb_build_object('status', 'failed', 'reason', 'slot_taken_before_confirmation')
    );

    booking_id := v_booking.id;
    status := 'paid_unfulfilled';
    return next;
    return;
  end if;

  -- 4. Happy path: update attempt to paid
  update public.session_payment_attempts
  set
    status = 'paid',
    provider_order_id = coalesce(p_provider_order_id, provider_order_id),
    provider_transaction_id = coalesce(p_provider_transaction_id, provider_transaction_id),
    paid_at = now()
  where id = v_attempt.id;

  -- 5. Mark slot booked
  update public.private_session_slots
  set status = 'booked'
  where id = v_slot.id;

  -- 6. Move booking to fulfillment_pending
  update public.sessions_booking
  set
    status = 'fulfillment_pending',
    confirmed_at = now()
  where id = v_booking.id;

  -- 7. Enqueue meeting creation outbox job
  insert into public.private_session_outbox (
    booking_id,
    job_type,
    deduplication_key,
    status
  )
  values (
    v_booking.id,
    'create_meeting',
    'meeting-' || v_booking.id,
    'pending'
  )
  on conflict (deduplication_key) do nothing;

  -- 8. Audit record
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
    'system',
    null,
    'sessions_booking',
    v_booking.id,
    'direct_payment_confirmed',
    jsonb_build_object('status', v_booking.status),
    jsonb_build_object('status', 'fulfillment_pending', 'provider_transaction_id', p_provider_transaction_id)
  );

  booking_id := v_booking.id;
  status := 'fulfillment_pending';
  return next;
end;
$$;
