-- Return filtered payment statistics with the paginated payment response.

drop function if exists public.get_admin_payments_with_sessions(integer, integer, text, text, text);

create function public.get_admin_payments_with_sessions(
  p_limit integer default 25,
  p_offset integer default 0,
  p_status text default null,
  p_kind text default null,
  p_query text default null
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
  session_quantity integer,
  total_count bigint,
  paid_count bigint,
  pending_count bigint,
  failed_count bigint
)
language sql
stable
security definer
set search_path = public
as $$
  with all_payments as (
    select
      attempt.id, 'course'::text as kind, null::text as purpose,
      profile.full_name as user_name, auth_user.email as user_email,
      course.title_en as course_title, course.slug as course_slug,
      attempt.amount_minor, attempt.currency, attempt.provider,
      attempt.provider_transaction_id, attempt.status, attempt.failure_code,
      attempt.completed_at, attempt.created_at, attempt.session_quantity
    from public.course_payment_attempts as attempt
    left join public.profiles as profile on profile.id = attempt.user_id
    left join auth.users as auth_user on auth_user.id = attempt.user_id
    left join public.courses as course on course.id = attempt.course_id

    union all

    select
      attempt.id, 'private_session'::text as kind, attempt.purpose,
      profile.full_name as user_name, auth_user.email as user_email,
      course.title_en as course_title, course.slug as course_slug,
      attempt.amount_minor, attempt.currency, attempt.provider,
      attempt.provider_transaction_id, attempt.status, attempt.failure_code,
      attempt.paid_at as completed_at, attempt.created_at, 0::integer as session_quantity
    from public.session_payment_attempts as attempt
    left join public.profiles as profile on profile.id = attempt.user_id
    left join auth.users as auth_user on auth_user.id = attempt.user_id
    left join public.courses as course on course.id = attempt.course_id
  ), filtered_payments as (
    select *
    from all_payments as payment
    where (nullif(trim(p_status), '') is null or payment.status = p_status)
      and (nullif(trim(p_kind), '') is null or payment.kind = p_kind)
      and (
        nullif(trim(p_query), '') is null
        or concat_ws(' ', payment.user_name, payment.user_email, payment.course_title,
          payment.course_slug, payment.provider_transaction_id, payment.id::text)
          ilike '%' || trim(p_query) || '%'
      )
  )
  select
    payment.*,
    count(*) over () as total_count,
    count(*) filter (where payment.status = 'paid') over () as paid_count,
    count(*) filter (where payment.status in ('pending', 'created')) over () as pending_count,
    count(*) filter (where payment.status = 'failed') over () as failed_count
  from filtered_payments as payment
  order by payment.created_at desc
  limit least(greatest(coalesce(p_limit, 25), 1), 100)
  offset greatest(coalesce(p_offset, 0), 0);
$$;

revoke all on function public.get_admin_payments_with_sessions(integer, integer, text, text, text)
  from public, anon, authenticated;
grant execute on function public.get_admin_payments_with_sessions(integer, integer, text, text, text)
  to service_role;
