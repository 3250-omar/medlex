-- Migration: 20260915125000_private_session_package_workflows.sql
-- Description: Security-definer workflows for package purchase grant and credit redemption:
--              1. grant_private_session_package
--              2. redeem_private_session_credit

-- ============================================================================
-- 1. grant_private_session_package
-- ============================================================================
create or replace function public.grant_private_session_package(
  p_payment_attempt_id uuid,
  p_provider_order_id text default null,
  p_provider_transaction_id text default null
)
returns public.session_entitlements
language plpgsql
security definer
set search_path = public
as $$
declare
  v_attempt public.session_payment_attempts;
  v_entitlement public.session_entitlements;
  v_existing_grant public.session_credit_ledger;
begin
  -- 1. Lock payment attempt
  select * into v_attempt
  from public.session_payment_attempts
  where id = p_payment_attempt_id
  for update;

  if v_attempt.id is null then
    raise exception 'Payment attempt not found';
  end if;

  if v_attempt.purpose != 'package' then
    raise exception 'Payment attempt is not for a package';
  end if;

  -- Check if already granted
  select * into v_entitlement
  from public.session_entitlements
  where payment_attempt_id = v_attempt.id;

  if v_entitlement.id is not null then
    return v_entitlement;
  end if;

  -- 2. Create entitlement
  insert into public.session_entitlements (
    user_id,
    course_id,
    offer_id,
    payment_attempt_id,
    purchased_quantity,
    reserved_quantity,
    consumed_quantity,
    remaining_quantity,
    amount_minor,
    currency,
    status
  )
  values (
    v_attempt.user_id,
    v_attempt.course_id,
    v_attempt.offer_id,
    v_attempt.id,
    v_attempt.quantity_snapshot,
    0,
    0,
    v_attempt.quantity_snapshot,
    v_attempt.amount_minor,
    v_attempt.currency,
    'active'
  )
  returning * into v_entitlement;

  -- 3. Append grant entry to ledger
  insert into public.session_credit_ledger (
    entitlement_id,
    delta,
    reason,
    idempotency_key,
    actor_type,
    actor_id
  )
  values (
    v_entitlement.id,
    v_entitlement.purchased_quantity,
    'purchase_grant',
    'grant-' || v_attempt.id,
    'system',
    v_attempt.user_id
  );

  -- 4. Mark attempt paid
  update public.session_payment_attempts
  set
    status = 'paid',
    provider_order_id = coalesce(p_provider_order_id, provider_order_id),
    provider_transaction_id = coalesce(p_provider_transaction_id, provider_transaction_id),
    paid_at = now()
  where id = v_attempt.id;

  -- 5. Audit log
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
    v_attempt.user_id,
    'session_entitlements',
    v_entitlement.id,
    'grant_package_entitlement',
    null,
    to_jsonb(v_entitlement)
  );

  return v_entitlement;
end;
$$;

-- ============================================================================
-- 2. redeem_private_session_credit
-- ============================================================================
create or replace function public.redeem_private_session_credit(
  p_slot_id uuid,
  p_entitlement_id uuid,
  p_idempotency_key text
)
returns public.sessions_booking
language plpgsql
security definer
set search_path = public
as $$
declare
  v_learner_id uuid;
  v_entitlement public.session_entitlements;
  v_slot public.private_session_slots;
  v_booking public.sessions_booking;
  v_existing_booking public.sessions_booking;
begin
  -- 1. Identify caller
  v_learner_id := auth.uid();
  if v_learner_id is null then
    select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid into v_learner_id;
  end if;

  if v_learner_id is null then
    raise exception 'Authentication required to redeem session credit';
  end if;

  -- Check existing booking by idempotency key
  select * into v_existing_booking
  from public.sessions_booking
  where idempotency_key = p_idempotency_key;

  if v_existing_booking.id is not null then
    return v_existing_booking;
  end if;

  -- 2. Lock entitlement
  select * into v_entitlement
  from public.session_entitlements
  where id = p_entitlement_id
  for update;

  if v_entitlement.id is null then
    raise exception 'Entitlement not found';
  end if;

  if v_entitlement.user_id != v_learner_id then
    raise exception 'You do not own this package entitlement';
  end if;

  if v_entitlement.status != 'active' or v_entitlement.remaining_quantity < 1 then
    raise exception 'No remaining session credits available in this package';
  end if;

  -- 3. Lock slot
  select * into v_slot
  from public.private_session_slots
  where id = p_slot_id
  for update;

  if v_slot.id is null then
    raise exception 'Slot not found';
  end if;

  if v_slot.status != 'available' then
    raise exception 'Slot is no longer available';
  end if;

  -- Strict 24-hour cutoff
  if v_slot.starts_at < (now() + interval '24 hours') then
    raise exception 'Sessions must be scheduled at least 24 hours in advance';
  end if;

  -- 4. Deduct credit from entitlement
  update public.session_entitlements
  set
    consumed_quantity = consumed_quantity + 1,
    remaining_quantity = remaining_quantity - 1,
    status = case when (remaining_quantity - 1) = 0 then 'exhausted' else 'active' end
  where id = v_entitlement.id;

  -- 5. Mark slot booked
  update public.private_session_slots
  set status = 'booked'
  where id = v_slot.id;

  -- 6. Create confirmed booking
  insert into public.sessions_booking (
    slot_id,
    user_id,
    course_id,
    host_id,
    funding_type,
    entitlement_id,
    status,
    starts_at,
    ends_at,
    amount_minor,
    currency,
    idempotency_key,
    confirmed_at
  )
  values (
    v_slot.id,
    v_learner_id,
    v_slot.course_id,
    v_slot.host_id,
    'package_credit',
    v_entitlement.id,
    'confirmed',
    v_slot.starts_at,
    v_slot.ends_at,
    0,
    v_entitlement.currency,
    p_idempotency_key,
    now()
  )
  returning * into v_booking;

  -- 7. Record debit in append-only ledger
  insert into public.session_credit_ledger (
    entitlement_id,
    booking_id,
    delta,
    reason,
    idempotency_key,
    actor_type,
    actor_id
  )
  values (
    v_entitlement.id,
    v_booking.id,
    -1,
    'booking_consumed',
    'redeem-' || p_idempotency_key,
    'learner',
    v_learner_id
  );

  -- 8. Create meeting record & enqueue fulfillment
  insert into public.private_session_meetings (
    booking_id,
    meeting_status,
    email_status
  )
  values (
    v_booking.id,
    'pending',
    'pending'
  );

  insert into public.private_session_outbox (
    booking_id,
    job_type,
    deduplication_key,
    status,
    available_at
  )
  values (
    v_booking.id,
    'create_meeting',
    'meeting-' || v_booking.id,
    'pending',
    now()
  );

  -- 9. Audit event
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
    v_learner_id,
    'sessions_booking',
    v_booking.id,
    'redeem_credit_booking',
    null,
    to_jsonb(v_booking)
  );

  return v_booking;
end;
$$;
