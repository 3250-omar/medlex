-- Migration: Create get_pathway_feedback RPC
-- Retrieves approved pathway feedback with course name, certificate download date, and user profile details in a single query.

create or replace function public.get_pathway_feedback(
  target_scope text default 'all',
  feedback_limit int default 6
)
returns table (
  feedback text,
  updated_at timestamptz,
  course_slug text,
  course_name text,
  course_name_ar text,
  certificate_date timestamptz,
  full_name text,
  exam_date text,
  avatar_path text
)
language sql
security definer
set search_path = public
as $$
  select
    f.feedback,
    f.updated_at,
    c.slug as course_slug,
    coalesce(c.title_en, cert.course_title_snapshot) as course_name,
    c.title_ar as course_name_ar,
    dl.downloaded_at as certificate_date,
    p.full_name,
    p.exam_date::text,
    p.avatar_path
  from public.feedbacks f
  join public.courses c on c.id = f.course_id
  left join public.profiles p on p.id = f.user_id
  left join public.enrollments e on e.user_id = f.user_id and e.course_id = f.course_id
  left join public.certificates cert on cert.enrollment_id = e.id
  left join lateral (
    select cde.downloaded_at
    from public.certificate_download_events cde
    join public.certificates cert_sub on cert_sub.id = cde.certificate_id
    join public.enrollments e_sub on e_sub.id = cert_sub.enrollment_id
    where cde.user_id = f.user_id
      and e_sub.course_id = f.course_id
    order by cde.downloaded_at desc
    limit 1
  ) dl on true
  where c.is_published = true
    and f.is_approved = true
    and (target_scope = 'all' or c.slug = target_scope)
  order by f.updated_at desc
  limit feedback_limit;
$$;

grant execute on function public.get_pathway_feedback(text, int) to anon, authenticated, service_role;
