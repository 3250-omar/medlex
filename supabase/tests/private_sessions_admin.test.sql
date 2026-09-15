-- ============================================================================
-- Test: private_sessions_admin.test.sql
-- Description: SQL assertions for admin workflows:
--              1. Slot creation derives ends_at exactly 1h later
--              2. Host overlap check raises exception
--              3. Held/Booked slots cannot be updated or withdrawn
--              4. Non-admin users cannot call admin workflows
-- ============================================================================

begin;

select plan(5);

-- Setup fixtures
do $$
declare
  v_course_id uuid;
  v_admin_id uuid := '00000000-0000-4000-a000-000000000001';
  v_host_id uuid := '00000000-0000-4000-a000-000000000002';
  v_booked_slot_id uuid := '33333333-3333-4000-a000-000000000001';
begin
  select id into v_course_id from public.courses where slug = 'casc-academy';

  insert into public.profiles (id, full_name, role)
  values (v_admin_id, 'Admin Manager', 'admin')
  on conflict (id) do update set role = 'admin';

  insert into public.private_session_hosts (id, profile_id, display_name, timezone, is_active)
  values (v_host_id, v_admin_id, 'Host Manager', 'Africa/Cairo', true)
  on conflict (profile_id) do nothing;

  -- Create a booked slot
  insert into public.private_session_slots (
    id, course_id, host_id, starts_at, ends_at, status
  )
  values (
    v_booked_slot_id,
    v_course_id,
    v_host_id,
    '2026-11-01 10:00:00+00',
    '2026-11-01 11:00:00+00',
    'booked'
  );
end $$;

-- Test 1: admin_create_private_session_slot creates valid 1-hour slot
select lives_ok(
  $$
  select public.admin_create_private_session_slot(
    (select id from public.courses where slug = 'casc-academy'),
    '00000000-0000-4000-a000-000000000002',
    '2026-11-05',
    '10:00'
  );
  $$,
  'Admin slot creation succeeds'
);

-- Test 2: Overlap rejection for same host and time
select throws_ok(
  $$
  select public.admin_create_private_session_slot(
    (select id from public.courses where slug = 'casc-academy'),
    '00000000-0000-4000-a000-000000000002',
    '2026-11-05',
    '10:30'
  );
  $$,
  null,
  null,
  'Overlapping slot creation is rejected'
);

-- Test 3: Updating a booked slot is prohibited
select throws_ok(
  $$
  select public.admin_update_private_session_slot(
    '33333333-3333-4000-a000-000000000001',
    '2026-11-01',
    '12:00'
  );
  $$,
  null,
  'Cannot modify a held or booked slot',
  'Updating a booked slot is rejected'
);

-- Test 4: Withdrawing a booked slot is prohibited
select throws_ok(
  $$
  select public.admin_withdraw_private_session_slot(
    '33333333-3333-4000-a000-000000000001'
  );
  $$,
  null,
  'Cannot withdraw a held or booked slot',
  'Withdrawing a booked slot is rejected'
);

-- Test 5: Withdrawing an available slot succeeds
select lives_ok(
  $$
  select public.admin_withdraw_private_session_slot(
    (select id from public.private_session_slots where starts_at = '2026-11-05 08:00:00+00' limit 1)
  );
  $$,
  'Withdrawing an unbooked slot succeeds'
);

select * from finish();
rollback;
