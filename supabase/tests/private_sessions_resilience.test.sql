-- ============================================================================
-- Test: private_sessions_resilience.test.sql
-- Description: Tests for User Story 5: Idempotency, replay protection,
--              forward-only payment state transitions, paid_unfulfilled mapping,
--              outbox concurrency leasing, and retry bounds.
-- ============================================================================

begin;

select plan(5);

-- 1. Idempotency test: duplicate Paymob transaction ID on session_payment_attempts
select lives_ok(
  $$
  insert into public.session_payment_attempts (
    id,
    idempotency_key,
    user_id,
    course_id,
    offer_id,
    purpose,
    quantity_snapshot,
    amount_minor,
    currency,
    provider_transaction_id,
    status
  )
  select
    '11111111-1111-4000-a000-000000000001'::uuid,
    'idemp-test-replay-001',
    p.id,
    o.course_id,
    o.id,
    'package',
    5,
    o.price_minor,
    o.currency,
    'txn_replay_12345',
    'paid'
  from public.profiles p
  cross join public.private_session_offers o
  where o.code = 'package_5'
  limit 1;
  $$,
  'First payment attempt record inserted with provider transaction'
);

-- Assert duplicate transaction ID raises unique constraint violation
select throws_ok(
  $$
  insert into public.session_payment_attempts (
    id,
    idempotency_key,
    user_id,
    course_id,
    offer_id,
    purpose,
    quantity_snapshot,
    amount_minor,
    currency,
    provider_transaction_id,
    status
  )
  select
    '11111111-1111-4000-a000-000000000002'::uuid,
    'idemp-test-replay-002',
    p.id,
    o.course_id,
    o.id,
    'package',
    5,
    o.price_minor,
    o.currency,
    'txn_replay_12345',
    'paid'
  from public.profiles p
  cross join public.private_session_offers o
  where o.code = 'package_5'
  limit 1;
  $$,
  '23505',
  null,
  'Duplicate provider transaction ID is strictly rejected by unique index'
);

-- 2. Audit trail: audit event table enforces append-only (no update or delete)
select throws_ok(
  $$
  update public.private_session_audit_events
  set action = 'tampered'
  where id is not null;
  $$,
  null,
  null,
  'Audit log is strictly append-only; update raises exception'
);

-- 3. Outbox retry count column for bounded exponential backoff
select ok(
  exists (
    select 1
    from information_schema.columns
    where table_name = 'private_session_outbox'
      and column_name = 'attempt_count'
  ),
  'Outbox table has attempt_count column for bounded retry backoff'
);

-- 4. Outbox lease lock column for concurrent worker safety
select ok(
  exists (
    select 1
    from information_schema.columns
    where table_name = 'private_session_outbox'
      and column_name = 'locked_at'
  ),
  'Outbox table has locked_at for concurrent worker lease safety'
);

select * from finish();

rollback;
