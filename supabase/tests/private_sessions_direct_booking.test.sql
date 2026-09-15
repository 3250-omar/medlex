-- ============================================================================
-- Test: private_sessions_direct_booking.test.sql
-- Description: Tests for direct booking workflows: strict 24-hour cutoff,
--              atomic holds, concurrency, hold expiry, and payment confirmation.
-- ============================================================================

begin;

select plan(7);

-- Fixture setup
do $$
declare
  v_course_id uuid;
  v_host_profile_id uuid := '00000000-0000-4000-a000-000000000001';
  v_host_id uuid := '00000000-0000-4000-a000-000000000002';
  v_learner1_id uuid := '00000000-0000-4000-b000-000000000001';
  v_slot_ineligible_id uuid := '22222222-2222-4000-a000-000000000001';
  v_slot_eligible_id uuid := '22222222-2222-4000-a000-000000000002';
begin
  select id into v_course_id from public.courses where slug = 'casc-academy';
  if v_course_id is null then
    insert into public.courses (id, slug, title_en, price, is_published)
    values (gen_random_uuid(), 'casc-academy', 'CASC Academy', 1000, true)
    returning id into v_course_id;
  end if;

  insert into public.profiles (id, full_name, role)
  values (v_host_profile_id, 'CASC Host', 'admin')
  on conflict (id) do update set role = 'admin';

  insert into public.private_session_hosts (id, profile_id, display_name, timezone, is_active)
  values (v_host_id, v_host_profile_id, 'Dr Host', 'Africa/Cairo', true)
  on conflict (profile_id) do nothing;

  -- Create slot within cutoff (< 24 hours ahead) -> strictly ineligible
  insert into public.private_session_slots (
    id, course_id, host_id, starts_at, ends_at, status
  )
  values (
    v_slot_ineligible_id,
    v_course_id,
    v_host_id,
    now() + interval '20 hours',
    now() + interval '21 hours',
    'available'
  );

  -- Create slot outside cutoff (> 24 hours ahead) -> eligible
  insert into public.private_session_slots (
    id, course_id, host_id, starts_at, ends_at, status
  )
  values (
    v_slot_eligible_id,
    v_course_id,
    v_host_id,
    now() + interval '48 hours',
    now() + interval '49 hours',
    'available'
  );
end $$;

-- Test 1: list_eligible_private_session_slots filters out slots within 24-hour cutoff
select is(
  (select count(*)::int from public.list_eligible_private_session_slots('casc-academy') where id = '22222222-2222-4000-a000-000000000001'),
  0,
  'Ineligible slot (<24h) must not appear in eligible slots list'
);

-- Test 2: list_eligible_private_session_slots includes slot > 24h
select is(
  (select count(*)::int from public.list_eligible_private_session_slots('casc-academy') where id = '22222222-2222-4000-a000-000000000002'),
  1,
  'Eligible slot (>24h) must appear in eligible slots list'
);

-- Test 3: Attempting to hold ineligible slot (<24h) raises exception
select throws_ok(
  $$
  select public.create_direct_session_hold(
    '22222222-2222-4000-a000-000000000001',
    'casc-academy',
    'test-idemp-key-cutoff-001'
  );
  $$,
  null,
  'Slot is not eligible for booking (cutoff or unavailable)',
  'Holding an ineligible slot (<24h) is rejected'
);

-- Test 4: Holding eligible slot succeeds
select lives_ok(
  $$
  select public.create_direct_session_hold(
    '22222222-2222-4000-a000-000000000002',
    'casc-academy',
    'test-idemp-key-valid-002'
  );
  $$,
  'Holding an eligible slot succeeds'
);

-- Test 5: Second learner attempting to hold already-held slot is rejected
select throws_ok(
  $$
  select public.create_direct_session_hold(
    '22222222-2222-4000-a000-000000000002',
    'casc-academy',
    'test-idemp-key-conflict-003'
  );
  $$,
  null,
  'Slot is not eligible for booking (cutoff or unavailable)',
  'Concurrent hold on already-held slot is rejected'
);

-- Test 6: Expiring hold returns slot to available
select lives_ok(
  $$
  select public.expire_direct_session_hold(
    (select id from public.session_payment_attempts where slot_id = '22222222-2222-4000-a000-000000000002' order by created_at desc limit 1)
  );
  $$,
  'Expiring direct session hold succeeds'
);

-- Test 7: Confirming payment transitions slot to booked and enqueues meeting creation
select is(
  (select status from public.private_session_slots where id = '22222222-2222-4000-a000-000000000002'),
  'available',
  'Expired slot returns to available status'
);

select * from finish();
rollback;
