-- Temporarily allow enrolled learners to claim certificates at any course progress.
-- The previous 50% guard remains below as comments for easy restoration.

create or replace function public.issue_course_certificate(
  target_course_slug text,
  recipient_name_override text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public, private
as $$
declare
  v_user_id uuid := auth.uid();
  v_course_id uuid;
  v_course_title text;
  v_release_id uuid;
  v_release_version integer;
  v_enrollment_id uuid;
  v_completed_at timestamptz;
  v_total_units integer := 0;
  v_completed_units integer := 0;
  v_progress_pct integer := 0;
  v_cert_id uuid;
  v_cert_number text;
  v_recipient_name text;
  v_existing_recipient_name text;
  v_issued_at timestamptz;
begin
  if v_user_id is null then
    raise exception 'authentication_required' using errcode = '28000';
  end if;

  -- 1. Find enrollment
  select c.id, c.title_en, e.id, e.release_id, r.version_number, e.completed_at
    into v_course_id, v_course_title, v_enrollment_id, v_release_id, v_release_version, v_completed_at
  from public.courses c
  join public.enrollments e on e.course_id = c.id
  join public.course_releases r on r.id = e.release_id
  where c.slug = target_course_slug
    and e.user_id = v_user_id
    and e.status in ('active', 'paused', 'completed')
    and (e.expires_at is null or e.expires_at > now())
  order by e.enrolled_at desc
  limit 1;

  if v_enrollment_id is null then
    raise exception 'active_enrollment_required' using errcode = 'P0002';
  end if;

  -- 2. Verify progress >= 50%
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

  -- Temporarily disabled: require at least 50% course progress before issuing
  -- a certificate. Keep this block for straightforward restoration later.
  -- if v_progress_pct < 50 then
  --   raise exception 'progress_threshold_not_met: Progress is % percent, 50 percent required', v_progress_pct
  --     using errcode = 'P0003';
  -- end if;

  -- 3. Resolve recipient name
  v_recipient_name := nullif(trim(recipient_name_override), '');
  if v_recipient_name is null then
    select coalesce(
      nullif(trim(p.full_name), ''),
      nullif(trim(u.raw_user_meta_data ->> 'full_name'), ''),
      nullif(trim(u.raw_user_meta_data ->> 'name'), ''),
      'Distinguished Colleague'
    ) into v_recipient_name
    from auth.users u
    left join public.profiles p on p.id = u.id
    where u.id = v_user_id;
  end if;

  -- 4. Check existing certificate
  select id, certificate_number, recipient_name_snapshot, issued_at
    into v_cert_id, v_cert_number, v_existing_recipient_name, v_issued_at
  from public.certificates
  where enrollment_id = v_enrollment_id
    and revoked_at is null;

  if v_cert_id is not null then
    -- Update recipient name snapshot if override was explicitly provided
    if recipient_name_override is not null and trim(recipient_name_override) <> '' then
      update public.certificates
      set recipient_name_snapshot = trim(recipient_name_override)
      where id = v_cert_id;
      v_recipient_name := trim(recipient_name_override);
    else
      v_recipient_name := v_existing_recipient_name;
    end if;
  else
    -- Generate certificate number
    v_cert_number := 'MEDLEX-' || upper(replace(target_course_slug, '-', '')) || '-' || to_char(now(), 'YYYY') || '-' || upper(substring(replace(gen_random_uuid()::text, '-', ''), 1, 6));

    insert into public.certificates (
      certificate_number,
      enrollment_id,
      recipient_name_snapshot,
      course_title_snapshot,
      release_version_snapshot,
      issued_at
    )
    values (
      v_cert_number,
      v_enrollment_id,
      v_recipient_name,
      coalesce(v_course_title, 'The CASC Academy'),
      coalesce(v_release_version, 1),
      now()
    )
    returning id, issued_at into v_cert_id, v_issued_at;
  end if;

  return jsonb_build_object(
    'success', true,
    'certificate_id', v_cert_id,
    'certificate_number', v_cert_number,
    'recipient_name', v_recipient_name,
    'course_title', coalesce(v_course_title, 'The CASC Academy'),
    'issued_at', v_issued_at,
    'progress_percent', v_progress_pct
  );
end;
$$;
