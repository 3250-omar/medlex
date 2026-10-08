-- Expose course-bundle private-session quantity in the existing paginated feed.

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
    coalesce(course_attempt.session_quantity, 0) as session_quantity,
    payment.total_count
  from public.get_admin_payments(
    p_limit,
    p_offset,
    p_status,
    p_kind,
    p_query
  ) as payment
  left join public.course_payment_attempts as course_attempt
    on payment.kind = 'course'
    and course_attempt.id = payment.id;
$$;

revoke all on function public.get_admin_payments_with_sessions(integer, integer, text, text, text)
  from public, anon, authenticated;
grant execute on function public.get_admin_payments_with_sessions(integer, integer, text, text, text)
  to service_role;
