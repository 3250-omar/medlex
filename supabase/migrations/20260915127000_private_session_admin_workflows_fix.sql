-- Migration: 20260915127000_private_session_admin_workflows_fix.sql
-- Description: Adds p_admin_id parameter and profile FK validation to admin slot workflows.
--              Fixes "insert or update on table private_session_slots violates foreign key
--              constraint private_session_slots_created_by_fkey" when calling from
--              server-side routes that pass an explicit admin UUID.
--
--              Re-creates (create or replace) all three functions:
--                1. admin_create_private_session_slot
--                2. admin_update_private_session_slot
--                3. admin_withdraw_private_session_slot

-- ============================================================================
-- 1. admin_create_private_session_slot
-- ============================================================================
create or replace function public.admin_create_private_session_slot(
  p_course_id uuid,
  p_host_id uuid,
  p_cairo_date text,
  p_cairo_start_time text,
  p_admin_id uuid default null
)
returns public.private_session_slots
language plpgsql
security definer
set search_path = public, private
as $$
declare
  v_admin_id uuid;
  v_cairo_ts timestamp;
  v_starts_at timestamptz;
  v_ends_at timestamptz;
  v_slot public.private_session_slots;
begin
  -- Prefer authenticated session user; fall back to explicit p_admin_id from server routes
  v_admin_id := coalesce(auth.uid(), p_admin_id);

  -- Final fallback: JWT claim sub (service/RPC context)
  if v_admin_id is null then
    select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid into v_admin_id;
  end if;

  -- Ensure v_admin_id references a valid profile to satisfy the FK constraint
  if v_admin_id is not null and not exists (
    select 1 from public.profiles where id = v_admin_id
  ) then
    v_admin_id := null;
  end if;

  -- Derive UTC starts_at and ends_at from Africa/Cairo local date & time
  v_cairo_ts := (p_cairo_date || ' ' || p_cairo_start_time || ':00')::timestamp;
  v_starts_at := timezone('Africa/Cairo', v_cairo_ts);
  v_ends_at := v_starts_at + interval '1 hour';

  -- Check for overlaps with existing non-withdrawn slots for this host
  if exists (
    select 1 from public.private_session_slots
    where host_id = p_host_id
      and status != 'withdrawn'
      and tstzrange(starts_at, ends_at, '[)') && tstzrange(v_starts_at, v_ends_at, '[)')
  ) then
    raise exception 'Host already has an active slot overlapping this time window';
  end if;

  insert into public.private_session_slots (
    course_id,
    host_id,
    starts_at,
    ends_at,
    source_timezone,
    status,
    created_by
  )
  values (
    p_course_id,
    p_host_id,
    v_starts_at,
    v_ends_at,
    'Africa/Cairo',
    'available',
    v_admin_id
  )
  returning * into v_slot;

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
    'admin',
    v_admin_id,
    'private_session_slots',
    v_slot.id,
    'admin_create_slot',
    null,
    to_jsonb(v_slot)
  );

  return v_slot;
end;
$$;

-- ============================================================================
-- 2. admin_update_private_session_slot
-- ============================================================================
create or replace function public.admin_update_private_session_slot(
  p_slot_id uuid,
  p_cairo_date text,
  p_cairo_start_time text,
  p_admin_id uuid default null
)
returns public.private_session_slots
language plpgsql
security definer
set search_path = public, private
as $$
declare
  v_admin_id uuid;
  v_slot public.private_session_slots;
  v_before_state jsonb;
  v_cairo_ts timestamp;
  v_starts_at timestamptz;
  v_ends_at timestamptz;
begin
  v_admin_id := coalesce(auth.uid(), p_admin_id);

  if v_admin_id is null then
    select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid into v_admin_id;
  end if;

  if v_admin_id is not null and not exists (
    select 1 from public.profiles where id = v_admin_id
  ) then
    v_admin_id := null;
  end if;

  select * into v_slot
  from public.private_session_slots
  where id = p_slot_id
  for update;

  if v_slot.id is null then
    raise exception 'Slot not found';
  end if;

  if v_slot.status in ('held', 'booked') then
    raise exception 'Cannot modify a held or booked slot';
  end if;

  v_before_state := to_jsonb(v_slot);

  v_cairo_ts := (p_cairo_date || ' ' || p_cairo_start_time || ':00')::timestamp;
  v_starts_at := timezone('Africa/Cairo', v_cairo_ts);
  v_ends_at := v_starts_at + interval '1 hour';

  -- Check overlap excluding self
  if exists (
    select 1 from public.private_session_slots
    where host_id = v_slot.host_id
      and id != v_slot.id
      and status != 'withdrawn'
      and tstzrange(starts_at, ends_at, '[)') && tstzrange(v_starts_at, v_ends_at, '[)')
  ) then
    raise exception 'Host already has an active slot overlapping this time window';
  end if;

  update public.private_session_slots
  set
    starts_at = v_starts_at,
    ends_at = v_ends_at,
    status = 'available',
    updated_by = v_admin_id
  where id = v_slot.id
  returning * into v_slot;

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
    'admin',
    v_admin_id,
    'private_session_slots',
    v_slot.id,
    'admin_update_slot',
    v_before_state,
    to_jsonb(v_slot)
  );

  return v_slot;
end;
$$;

-- ============================================================================
-- 3. admin_withdraw_private_session_slot
-- ============================================================================
create or replace function public.admin_withdraw_private_session_slot(
  p_slot_id uuid,
  p_admin_id uuid default null
)
returns boolean
language plpgsql
security definer
set search_path = public, private
as $$
declare
  v_admin_id uuid;
  v_slot public.private_session_slots;
  v_before_state jsonb;
begin
  v_admin_id := coalesce(auth.uid(), p_admin_id);

  if v_admin_id is null then
    select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid into v_admin_id;
  end if;

  if v_admin_id is not null and not exists (
    select 1 from public.profiles where id = v_admin_id
  ) then
    v_admin_id := null;
  end if;

  select * into v_slot
  from public.private_session_slots
  where id = p_slot_id
  for update;

  if v_slot.id is null then
    return false;
  end if;

  if v_slot.status in ('held', 'booked') then
    raise exception 'Cannot withdraw a held or booked slot';
  end if;

  if v_slot.status = 'withdrawn' then
    return true;
  end if;

  v_before_state := to_jsonb(v_slot);

  update public.private_session_slots
  set
    status = 'withdrawn',
    withdrawn_at = now(),
    updated_by = v_admin_id
  where id = v_slot.id;

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
    'admin',
    v_admin_id,
    'private_session_slots',
    v_slot.id,
    'admin_withdraw_slot',
    v_before_state,
    jsonb_build_object('status', 'withdrawn', 'withdrawn_at', now())
  );

  return true;
end;
$$;
