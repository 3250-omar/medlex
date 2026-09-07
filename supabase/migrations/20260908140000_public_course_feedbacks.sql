create or replace view public.public_course_feedbacks
with (security_invoker = false) as
select
  f.feedback,
  f.updated_at,
  c.slug as course_slug
from public.feedbacks f
join public.courses c on c.id = f.course_id
where c.is_published = true;

grant select on public.public_course_feedbacks to anon, authenticated;
