-- Migration: Enforce 6-Month Course Access Duration & Auto-Calculate expires_at
-- 1. Updates course access duration to 180 days (6 months).
-- 2. Sets default on courses table to 180 days.
-- 3. Adds a BEFORE INSERT trigger on public.enrollments to auto-populate expires_at based on course access_duration_days if not explicitly provided.
-- 4. Backfills existing enrollments that have null expires_at.

-- 1. Update courses access duration to 180 days (6 months)
update public.courses
set access_duration_days = 180
where access_duration_days is distinct from 180;

-- 2. Alter column default for future courses
alter table public.courses
  alter column access_duration_days set default 180;

-- 3. Trigger function to auto-calculate expires_at on new enrollments
create or replace function public.set_enrollment_duration()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_duration_days integer;
begin
  -- Only auto-calculate if expires_at is not explicitly provided
  if new.expires_at is null then
    select access_duration_days into v_duration_days
    from public.courses
    where id = new.course_id;

    if v_duration_days is not null and v_duration_days > 0 then
      new.expires_at := coalesce(new.access_starts_at, now()) + (v_duration_days * interval '1 day');
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists set_enrollment_duration on public.enrollments;

create trigger set_enrollment_duration
before insert on public.enrollments
for each row
execute function public.set_enrollment_duration();

-- 4. Backfill existing enrollments that currently have null expires_at
-- Uses greatest to ensure existing active learners get at least 180 days from now
update public.enrollments e
set expires_at = greatest(
  e.enrolled_at + (coalesce(c.access_duration_days, 180) * interval '1 day'),
  now() + interval '180 days'
)
from public.courses c
where e.course_id = c.id
  and e.expires_at is null;
