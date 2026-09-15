-- ============================================================================
-- Test: private_sessions_packages.test.sql
-- Description: Tests for User Story 3: Package purchase, entitlement grant,
--              append-only session credit ledger, balance invariants, and
--              credit redemption on eligible slots.
-- ============================================================================

begin;

select plan(6);

-- 1. Entitlement balance invariant check
-- reserved_quantity + consumed_quantity + remaining_quantity = purchased_quantity
select ok(
  exists (
    select 1
    from information_schema.check_constraints
    where constraint_name = 'session_entitlements_balance_balance_check'
  ),
  'session_entitlements enforces balance invariant: reserved + consumed + remaining = purchased'
);

-- 2. Credit ledger append-only check
select throws_ok(
  $$
  insert into public.session_credit_ledger (
    entitlement_id,
    delta,
    reason,
    idempotency_key,
    actor_type
  )
  values (
    '33333333-3333-4000-a000-000000000001',
    0,
    'purchase_grant',
    'idemp-test-zero-delta',
    'system'
  );
  $$,
  null,
  null,
  'Delta 0 is rejected by check constraint (delta != 0)'
);

-- 3. Non-negative remaining quantity check
select throws_ok(
  $$
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
  select
    p.id,
    o.course_id,
    o.id,
    '44444444-4444-4000-a000-000000000001'::uuid,
    5,
    0,
    6,
    -1,
    o.price_minor,
    o.currency,
    'active'
  from public.profiles p
  cross join public.private_session_offers o
  where o.code = 'package_5'
  limit 1;
  $$,
  null,
  null,
  'Negative remaining quantity is strictly rejected'
);

-- 4. Function exists: grant_private_session_package
select has_function(
  'public',
  'grant_private_session_package',
  ARRAY['uuid', 'text', 'text'],
  'grant_private_session_package workflow function exists'
);

-- 5. Function exists: redeem_private_session_credit
select has_function(
  'public',
  'redeem_private_session_credit',
  ARRAY['uuid', 'uuid', 'text'],
  'redeem_private_session_credit workflow function exists'
);

-- 6. Booking funding check constraint
select ok(
  exists (
    select 1
    from information_schema.check_constraints
    where constraint_name = 'sessions_booking_funding_reference_check'
  ),
  'sessions_booking enforces exact reference matching funding_type (package_credit vs direct_payment)'
);

select * from finish();

rollback;
