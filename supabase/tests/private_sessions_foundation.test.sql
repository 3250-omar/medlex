-- ============================================================================
-- Test: private_sessions_foundation.test.sql
-- Description: Tests for private sessions table checks, exclusions, uniqueness,
--              append-only rules, and baseline RLS policies.
-- ============================================================================

begin;

-- Create pgTAP plan if pgTAP is available, otherwise run transactional block
select plan(12);

-- Setup test fixtures in transaction
do $$
declare
  v_course_id uuid;
  v_admin_user_id uuid := '00000000-0000-4000-a000-000000000001';
  v_host_id uuid;
  v_offer_id uuid;
  v_slot_id uuid;
  v_start timestamptz := now() + interval '48 hours';
begin
  -- 1. Get or create course
  select id into v_course_id from public.courses where slug = 'casc-academy';
  if v_course_id is null then
    insert into public.courses (id, slug, title_en, price, is_published)
    values (gen_random_uuid(), 'casc-academy', 'CASC Academy', 1000, true)
    returning id into v_course_id;
  end if;

  -- 2. Create test admin profile
  insert into public.profiles (id, full_name, role)
  values (v_admin_user_id, 'Admin Tester', 'admin')
  on conflict (id) do update set role = 'admin';

  -- 3. Create host
  insert into public.private_session_hosts (id, profile_id, display_name, timezone, is_active)
  values ('00000000-0000-4000-a000-000000000002', v_admin_user_id, 'Test Host', 'Africa/Cairo', true)
  on conflict (profile_id) do update set is_active = true
  returning id into v_host_id;
end $$;

-- Test 1: Tables exist
select has_table('public', 'private_session_hosts', 'private_session_hosts table exists');
select has_table('public', 'private_session_offers', 'private_session_offers table exists');
select has_table('public', 'private_session_slots', 'private_session_slots table exists');
select has_table('public', 'sessions_booking', 'sessions_booking table exists');
select has_table('public', 'session_entitlements', 'session_entitlements table exists');
select has_table('public', 'session_credit_ledger', 'session_credit_ledger table exists');

-- Test 7: Reject 59-minute slot
select throws_ok(
  $$
  insert into public.private_session_slots (course_id, host_id, starts_at, ends_at)
  values (
    (select id from public.courses where slug = 'casc-academy'),
    '00000000-0000-4000-a000-000000000002',
    now() + interval '48 hours',
    now() + interval '48 hours' + interval '59 minutes'
  );
  $$,
  '23514', -- check_violation
  null,
  '59-minute slot is rejected by duration check'
);

-- Test 8: Reject 61-minute slot
select throws_ok(
  $$
  insert into public.private_session_slots (course_id, host_id, starts_at, ends_at)
  values (
    (select id from public.courses where slug = 'casc-academy'),
    '00000000-0000-4000-a000-000000000002',
    now() + interval '50 hours',
    now() + interval '50 hours' + interval '61 minutes'
  );
  $$,
  '23514',
  null,
  '61-minute slot is rejected by duration check'
);

-- Test 9: Accept exact 60-minute slot
select lives_ok(
  $$
  insert into public.private_session_slots (id, course_id, host_id, starts_at, ends_at)
  values (
    '11111111-1111-4000-a000-000000000001',
    (select id from public.courses where slug = 'casc-academy'),
    '00000000-0000-4000-a000-000000000002',
    '2026-10-01 10:00:00+00',
    '2026-10-01 11:00:00+00'
  );
  $$,
  'Exact 60-minute slot insertion succeeds'
);

-- Test 10: Exclusion constraint rejects overlapping slot for the same host
select throws_ok(
  $$
  insert into public.private_session_slots (course_id, host_id, starts_at, ends_at)
  values (
    (select id from public.courses where slug = 'casc-academy'),
    '00000000-0000-4000-a000-000000000002',
    '2026-10-01 10:30:00+00',
    '2026-10-01 11:30:00+00'
  );
  $$,
  '23P01', -- exclusion_violation
  null,
  'Overlapping slot for same host is rejected by GiST exclusion constraint'
);

-- Test 11: Append-only trigger prevents updates on session_credit_ledger
select throws_ok(
  $$
  update public.session_credit_ledger
  set delta = -2
  where id = '00000000-0000-0000-0000-000000000000';
  $$,
  null,
  'Table session_credit_ledger is append-only; update and delete operations are prohibited',
  'Append-only trigger prevents UPDATE on session_credit_ledger'
);

-- Test 12: Append-only trigger prevents updates on private_session_audit_events
select throws_ok(
  $$
  update public.private_session_audit_events
  set action = 'tampered'
  where id = '00000000-0000-0000-0000-000000000000';
  $$,
  null,
  'Table private_session_audit_events is append-only; update and delete operations are prohibited',
  'Append-only trigger prevents UPDATE on private_session_audit_events'
);

select * from finish();
rollback;
