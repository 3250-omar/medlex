-- Course Step Completion and Progress Tracking RPCs

-- 1. Function to mark a learning unit as completed and return updated progress stats
create or replace function public.mark_unit_completed(
  target_course_slug text,
  target_unit_slug text
)
returns jsonb
language plpgsql
security definer
set search_path = public, private
as $$
declare
  v_user_id uuid := auth.uid();
  v_course_id uuid;
  v_release_id uuid;
  v_enrollment_id uuid;
  v_unit_id uuid;
  v_unit_seq integer;
  v_total_units integer := 0;
  v_completed_units integer := 0;
  v_progress_pct integer := 0;
  v_next_unit_slug text;
  v_is_course_completed boolean := false;
begin
  if v_user_id is null then
    raise exception 'authentication_required' using errcode = '28000';
  end if;

  -- 1. Find the active enrollment for this course
  select c.id, e.id, e.release_id
    into v_course_id, v_enrollment_id, v_release_id
  from public.courses c
  join public.enrollments e on e.course_id = c.id
  where c.slug = target_course_slug
    and e.user_id = v_user_id
    and e.status in ('active', 'paused', 'completed')
    and (e.expires_at is null or e.expires_at > now())
  order by e.enrolled_at desc
  limit 1;

  if v_enrollment_id is null then
    raise exception 'active_enrollment_required' using errcode = 'P0002';
  end if;

  -- 2. Find the target unit within this release
  select u.id, u.sequence_number
    into v_unit_id, v_unit_seq
  from public.learning_units u
  where u.release_id = v_release_id
    and u.slug = target_unit_slug
    and u.is_published
  limit 1;

  if v_unit_id is null then
    raise exception 'unit_not_found' using errcode = 'P0002';
  end if;

  -- 3. Upsert unit progress as completed (100%)
  insert into public.unit_progress (
    enrollment_id,
    unit_id,
    status,
    progress_percent,
    started_at,
    completed_at,
    last_accessed_at
  )
  values (
    v_enrollment_id,
    v_unit_id,
    'completed',
    100,
    now(),
    now(),
    now()
  )
  on conflict (enrollment_id, unit_id) do update
    set status = 'completed',
        progress_percent = 100,
        completed_at = coalesce(public.unit_progress.completed_at, now()),
        last_accessed_at = now();

  -- 4. Update the enrollment's last accessed unit
  update public.enrollments
  set last_accessed_unit_id = v_unit_id,
      updated_at = now()
  where id = v_enrollment_id;

  -- 5. Calculate total published units and completed units
  select count(*) into v_total_units
  from public.learning_units
  where release_id = v_release_id
    and is_published;

  select count(*) into v_completed_units
  from public.unit_progress up
  join public.learning_units u on u.id = up.unit_id
  where up.enrollment_id = v_enrollment_id
    and up.status = 'completed'
    and u.release_id = v_release_id
    and u.is_published;

  if v_total_units > 0 then
    v_progress_pct := round((v_completed_units::numeric / v_total_units) * 100);
  else
    v_progress_pct := 0;
  end if;

  -- 6. Check if entire course is completed
  if v_total_units > 0 and v_completed_units >= v_total_units then
    v_is_course_completed := true;
    update public.enrollments
    set status = 'completed',
        completed_at = coalesce(completed_at, now()),
        updated_at = now()
    where id = v_enrollment_id;
  end if;

  -- 7. Find next unit slug in sequence
  select u.slug into v_next_unit_slug
  from public.learning_units u
  where u.release_id = v_release_id
    and u.is_published
    and u.sequence_number > v_unit_seq
  order by u.sequence_number asc
  limit 1;

  return jsonb_build_object(
    'completed', true,
    'unitId', v_unit_id,
    'unitSlug', target_unit_slug,
    'completedUnits', v_completed_units,
    'totalUnits', v_total_units,
    'progressPercent', v_progress_pct,
    'isCourseCompleted', v_is_course_completed,
    'nextUnitSlug', v_next_unit_slug
  );
end;
$$;

-- 2. Function to record when a learner opens a unit and update current step
create or replace function public.record_unit_opened(
  target_course_slug text,
  target_unit_slug text
)
returns jsonb
language plpgsql
security definer
set search_path = public, private
as $$
declare
  v_user_id uuid := auth.uid();
  v_enrollment_id uuid;
  v_release_id uuid;
  v_unit_id uuid;
begin
  if v_user_id is null then
    raise exception 'authentication_required' using errcode = '28000';
  end if;

  select e.id, e.release_id into v_enrollment_id, v_release_id
  from public.courses c
  join public.enrollments e on e.course_id = c.id
  where c.slug = target_course_slug
    and e.user_id = v_user_id
    and e.status in ('active', 'paused', 'completed')
    and (e.expires_at is null or e.expires_at > now())
  order by e.enrolled_at desc
  limit 1;

  if v_enrollment_id is null then
    raise exception 'active_enrollment_required' using errcode = 'P0002';
  end if;

  select u.id into v_unit_id
  from public.learning_units u
  where u.release_id = v_release_id
    and u.slug = target_unit_slug
    and u.is_published
  limit 1;

  if v_unit_id is null then
    raise exception 'unit_not_found' using errcode = 'P0002';
  end if;

  -- Upsert progress as in_progress (10%) if not already completed
  insert into public.unit_progress (
    enrollment_id,
    unit_id,
    status,
    progress_percent,
    started_at,
    last_accessed_at
  )
  values (
    v_enrollment_id,
    v_unit_id,
    'in_progress',
    10,
    now(),
    now()
  )
  on conflict (enrollment_id, unit_id) do update
    set status = case when public.unit_progress.status = 'completed' then 'completed' else 'in_progress' end,
        progress_percent = greatest(public.unit_progress.progress_percent, 10),
        last_accessed_at = now();

  -- Update current step in enrollment
  update public.enrollments
  set last_accessed_unit_id = v_unit_id,
      updated_at = now()
  where id = v_enrollment_id;

  return jsonb_build_object(
    'success', true,
    'unitId', v_unit_id,
    'unitSlug', target_unit_slug
  );
end;
$$;

-- Revoke from public and grant to authenticated
revoke all on function public.mark_unit_completed(text, text) from public;
revoke all on function public.record_unit_opened(text, text) from public;
grant execute on function public.mark_unit_completed(text, text) to authenticated;
grant execute on function public.record_unit_opened(text, text) to authenticated;
