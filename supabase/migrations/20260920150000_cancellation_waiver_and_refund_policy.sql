-- Migration: Cancellation Waiver Consent Tracking & 14-Day Refund Policy Verification
-- 1. Add waiver and consent audit fields to public.enrollments
alter table public.enrollments
  add column if not exists cancellation_waiver_accepted boolean not null default false,
  add column if not exists cancellation_waiver_accepted_at timestamptz,
  add column if not exists cancellation_waiver_text text,
  add column if not exists cancellation_waiver_ip text,
  add column if not exists cancellation_waiver_user_agent text;

-- 2. Add Exam Mode completion tracking columns to public.unit_progress
alter table public.unit_progress
  add column if not exists exam_completed boolean not null default false,
  add column if not exists exam_completed_at timestamptz,
  add column if not exists exam_score integer,
  add column if not exists exam_total integer;

-- 3. Create dedicated audit log table for cancellation waivers / statutory rights loss consent
create table if not exists public.cancellation_waivers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  enrollment_id uuid references public.enrollments(id) on delete set null,
  course_slug text not null,
  waiver_text text not null,
  accepted boolean not null default true,
  accepted_at timestamptz not null default now(),
  ip_address text,
  user_agent text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists cancellation_waivers_user_course_idx
  on public.cancellation_waivers(user_id, course_slug);

create index if not exists cancellation_waivers_enrollment_idx
  on public.cancellation_waivers(enrollment_id);

alter table public.cancellation_waivers enable row level security;

-- Learners can view their own waiver consent records
create policy "learners can read own waivers"
  on public.cancellation_waivers
  for select
  using (auth.uid() = user_id);

-- Admins can view all waivers
create policy "admins can read all waivers"
  on public.cancellation_waivers
  for all
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

-- Service role or functions can insert
create policy "authenticated can insert waiver"
  on public.cancellation_waivers
  for insert
  with check (auth.uid() = user_id);

-- 4. Create function to calculate refund eligibility based on:
-- a) ≤ 14 days from enrollment date
-- b) ≤ 3 stations completed in Exam Mode
create or replace function public.get_course_refund_eligibility(
  p_user_id uuid,
  p_course_slug text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_enrollment record;
  v_days_elapsed integer;
  v_exam_completions integer := 0;
  v_completed_units integer := 0;
  v_is_within_14_days boolean;
  v_is_eligible boolean;
  v_reason text := null;
begin
  -- Fetch the latest enrollment for this user and course
  select
    e.id,
    e.enrolled_at,
    e.status,
    e.cancellation_waiver_accepted,
    e.cancellation_waiver_accepted_at,
    e.cancellation_waiver_text
  into v_enrollment
  from public.enrollments e
  join public.courses c on c.id = e.course_id
  where e.user_id = p_user_id
    and c.slug = p_course_slug
  order by e.enrolled_at desc
  limit 1;

  if v_enrollment.id is null then
    return jsonb_build_object(
      'enrolled', false,
      'isRefundEligible', false,
      'reason', 'No enrollment found for this course.'
    );
  end if;

  -- Days since enrollment
  v_days_elapsed := floor(extract(epoch from (now() - v_enrollment.enrolled_at)) / 86400)::integer;
  v_is_within_14_days := (v_days_elapsed <= 14);

  -- Count Exam Mode completions (either via unit_progress.exam_completed or passed assessment_attempts)
  select count(distinct up.unit_id) into v_exam_completions
  from public.unit_progress up
  where up.enrollment_id = v_enrollment.id
    and (up.exam_completed = true or exists (
      select 1 from public.assessment_attempts a
      where a.enrollment_id = v_enrollment.id
        and a.passed = true
    ));

  -- Count total completed stations
  select count(distinct up.unit_id) into v_completed_units
  from public.unit_progress up
  where up.enrollment_id = v_enrollment.id
    and up.status = 'completed';

  -- If the user did NOT accept the cancellation waiver, statutory 14-day applies without station limits
  if not coalesce(v_enrollment.cancellation_waiver_accepted, false) then
    if v_is_within_14_days then
      v_is_eligible := true;
      v_reason := 'Statutory 14-day cancellation applies (no waiver recorded).';
    else
      v_is_eligible := false;
      v_reason := 'Statutory 14-day cancellation window has expired.';
    end if;
  else
    -- With waiver: MedLex 14-day policy applies (within 14 days AND ≤ 3 Exam Mode completions)
    if not v_is_within_14_days then
      v_is_eligible := false;
      v_reason := format('Refund window expired (%s days since purchase, max allowed: 14 days).', v_days_elapsed);
    elsif v_exam_completions > 3 then
      v_is_eligible := false;
      v_reason := format('Completed %s stations in Exam Mode (maximum allowed for refund is 3 stations).', v_exam_completions);
    else
      v_is_eligible := true;
      v_reason := format('Eligible for refund: %s days since purchase, %s Exam Mode completions (limit is 3).', v_days_elapsed, v_exam_completions);
    end if;
  end if;

  return jsonb_build_object(
    'enrolled', true,
    'enrollmentId', v_enrollment.id,
    'enrolledAt', v_enrollment.enrolled_at,
    'daysElapsed', v_days_elapsed,
    'isWithin14Days', v_is_within_14_days,
    'examModeCompletions', v_exam_completions,
    'maxAllowedExamCompletions', 3,
    'completedStationsCount', v_completed_units,
    'cancellationWaiverAccepted', v_enrollment.cancellation_waiver_accepted,
    'cancellationWaiverAcceptedAt', v_enrollment.cancellation_waiver_accepted_at,
    'cancellationWaiverText', v_enrollment.cancellation_waiver_text,
    'isRefundEligible', v_is_eligible,
    'reason', v_reason
  );
end;
$$;

revoke all on function public.get_course_refund_eligibility(uuid, text) from public;
grant execute on function public.get_course_refund_eligibility(uuid, text) to authenticated;
