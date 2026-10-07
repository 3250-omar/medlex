-- Unified, joined payment feed for the admin dashboard.

create index if not exists course_payment_attempts_created_at_idx
  on public.course_payment_attempts (created_at desc);
create index if not exists session_payment_attempts_created_at_idx
  on public.session_payment_attempts (created_at desc);

create or replace function public.get_admin_payments(
  p_limit integer default 200,
  p_offset integer default 0
)
returns table (
  id uuid,
  kind text,
  purpose text,
  user_name text,
  user_email text,
  course_title text,
  course_slug text,
  amount_minor integer,
  currency text,
  provider text,
  provider_transaction_id text,
  status text,
  failure_code text,
  completed_at timestamptz,
  created_at timestamptz,
  total_count bigint
)
language sql
stable
security definer
set search_path = public
as $$
  select
    payment.id,
    payment.kind,
    payment.purpose,
    payment.user_name,
    payment.user_email,
    payment.course_title,
    payment.course_slug,
    payment.amount_minor,
    payment.currency,
    payment.provider,
    payment.provider_transaction_id,
    payment.status,
    payment.failure_code,
    payment.completed_at,
    payment.created_at,
    count(*) over () as total_count
  from (
    select
      attempt.id,
      'course'::text as kind,
      null::text as purpose,
      profile.full_name as user_name,
      auth_user.email as user_email,
      course.title_en as course_title,
      course.slug as course_slug,
      attempt.amount_minor,
      attempt.currency,
      attempt.provider,
      attempt.provider_transaction_id,
      attempt.status,
      attempt.failure_code,
      attempt.completed_at,
      attempt.created_at
    from public.course_payment_attempts as attempt
    left join public.profiles as profile on profile.id = attempt.user_id
    left join auth.users as auth_user on auth_user.id = attempt.user_id
    left join public.courses as course on course.id = attempt.course_id

    union all

    select
      attempt.id,
      'private_session'::text as kind,
      attempt.purpose,
      profile.full_name as user_name,
      auth_user.email as user_email,
      course.title_en as course_title,
      course.slug as course_slug,
      attempt.amount_minor,
      attempt.currency,
      attempt.provider,
      attempt.provider_transaction_id,
      attempt.status,
      attempt.failure_code,
      attempt.paid_at as completed_at,
      attempt.created_at
    from public.session_payment_attempts as attempt
    left join public.profiles as profile on profile.id = attempt.user_id
    left join auth.users as auth_user on auth_user.id = attempt.user_id
    left join public.courses as course on course.id = attempt.course_id
  ) as payment
  order by payment.created_at desc
  limit least(greatest(coalesce(p_limit, 200), 1), 500)
  offset greatest(coalesce(p_offset, 0), 0);
$$;

revoke all on function public.get_admin_payments(integer, integer)
  from public, anon, authenticated;
grant execute on function public.get_admin_payments(integer, integer)
  to service_role;