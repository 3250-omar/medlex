-- Migration: Prevent duplicate course subscriptions / enrollments for the same user

-- 1. Upgrade the partial index to a strict unique constraint on (user_id, course_id)
-- First drop the old partial index if it exists
drop index if exists public.one_open_enrollment_per_course;

-- Add a unique constraint on (user_id, course_id) to public.enrollments
-- This ensures that at the relational storage level, a user can never have more than one enrollment record for the same course.
alter table public.enrollments
  drop constraint if exists enrollments_user_id_course_id_key;

alter table public.enrollments
  drop constraint if exists enrollments_user_course_unique;

alter table public.enrollments
  add constraint enrollments_user_course_unique unique (user_id, course_id);

-- 2. Add a BEFORE INSERT trigger on public.enrollments to reject duplicate enrollments cleanly
create or replace function public.assert_single_course_enrollment()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if exists (
    select 1
    from public.enrollments
    where user_id = new.user_id
      and course_id = new.course_id
      and id is distinct from new.id
  ) then
    raise exception 'already_subscribed'
      using hint = 'User cannot subscribe to the same course multiple times.',
            errcode = '23505';
  end if;
  return new;
end;
$$;

drop trigger if exists assert_single_course_enrollment on public.enrollments;

create trigger assert_single_course_enrollment
before insert on public.enrollments
for each row
execute function public.assert_single_course_enrollment();

-- 3. Update the RPC function subscribe_to_free_course to explicitly validate and raise an error
create or replace function public.subscribe_to_free_course(target_course_slug text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_course_id uuid;
  v_release_id uuid;
  v_enrollment_id uuid;
  v_first_unit_slug text;
begin
  if v_user_id is null then
    raise exception 'authentication_required' using errcode = '28000';
  end if;

  select c.id, r.id into v_course_id, v_release_id
  from public.courses c
  join public.course_releases r on r.course_id = c.id and r.status = 'published'
  where c.slug = target_course_slug and c.is_published
  limit 1;

  if v_course_id is null then
    raise exception 'course_not_found' using errcode = 'P0002';
  end if;
  if exists (select 1 from public.courses where id = v_course_id and price > 0) then
    raise exception 'payment_required' using errcode = 'P0001';
  end if;

  -- Validate that the user is not already subscribed to this course
  if exists (
    select 1
    from public.enrollments
    where user_id = v_user_id and course_id = v_course_id
  ) then
    raise exception 'already_subscribed' using errcode = '23505';
  end if;

  insert into public.enrollments(user_id, course_id, release_id, status)
  values (v_user_id, v_course_id, v_release_id, 'active')
  returning id into v_enrollment_id;

  select slug into v_first_unit_slug
  from public.learning_units
  where release_id = v_release_id and is_published
  order by sequence_number
  limit 1;

  return jsonb_build_object(
    'enrollmentId', v_enrollment_id,
    'releaseId', v_release_id,
    'firstUnitSlug', v_first_unit_slug
  );
end;
$$;

revoke all on function public.subscribe_to_free_course(text) from public;
grant execute on function public.subscribe_to_free_course(text) to authenticated;
