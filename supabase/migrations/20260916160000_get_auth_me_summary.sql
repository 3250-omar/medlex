-- Migration: Create get_user_me_summary RPC
-- Consolidates enrolled courses progress and private sessions booking/package state
-- in a single high-performance database roundtrip.

create or replace function public.get_user_me_summary(p_user_id uuid)
returns jsonb
language plpgsql
security definer

set search_path = public
as $$
declare
  v_enrolled_courses jsonb := '[]'::jsonb;
  v_upcoming_bookings jsonb := '[]'::jsonb;
  v_packages jsonb := '[]'::jsonb;
  v_total_remaining integer := 0;
  v_has_upcoming boolean := false;
  v_has_package boolean := false;
  v_has_active boolean := false;
  v_has_direct boolean := false;
  v_has_credit boolean := false;
  v_session_type text := 'none';
  v_next_booking jsonb := null;
  v_result jsonb;
begin
  -- Security check: authenticated users can only query their own summary unless admin
  if auth.role() = 'authenticated' and auth.uid() is not null and auth.uid() != p_user_id then
    if not exists (select 1 from public.profiles where id = auth.uid() and role = 'admin') then
      raise exception 'Unauthorized to access summary for another user';
    end if;
  end if;

  -- 1. Aggregate enrolled courses
  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'enrollmentId', e.id,
        'status', e.status,
        'expiresAt', e.expires_at,
        'slug', c.slug,
        'titleEn', coalesce(c.title_en, ''),
        'titleAr', c.title_ar,
        'descriptionEn', c.description_en,
        'descriptionAr', c.description_ar,
        'firstUnitSlug', u_stats.first_unit_slug,
        'currentUnitSlug', coalesce(
          case
            when e.last_accessed_unit_id is not null then
              case
                when exists (
                  select 1 from public.unit_progress up_last
                  where up_last.enrollment_id = e.id
                    and up_last.unit_id = e.last_accessed_unit_id
                    and up_last.status = 'completed'
                ) then (
                  select u_next.slug
                  from public.learning_units u_curr
                  join public.learning_units u_next
                    on u_next.release_id = e.release_id
                   and u_next.is_published = true
                   and u_next.sequence_number > u_curr.sequence_number
                  where u_curr.id = e.last_accessed_unit_id
                  order by u_next.sequence_number asc
                  limit 1
                )
                else (
                  select u_curr.slug
                  from public.learning_units u_curr
                  where u_curr.id = e.last_accessed_unit_id
                    and u_curr.is_published = true
                )
              end
            else null
          end,
          u_stats.first_incomplete_slug,
          u_stats.first_unit_slug
        ),
        'completedUnits', u_stats.completed_units,
        'totalUnits', u_stats.total_units,
        'progressPercent', case
          when u_stats.total_units > 0
            then round((u_stats.completed_units::numeric / u_stats.total_units::numeric) * 100)::int
          else 0
        end
      )
      order by e.enrolled_at desc
    ),
    '[]'::jsonb
  )
  into v_enrolled_courses
  from public.enrollments e
  join public.courses c on c.id = e.course_id
  left join lateral (
    select
      count(u.id)::int as total_units,
      count(case when up.status = 'completed' then 1 end)::int as completed_units,
      (
        select u1.slug
        from public.learning_units u1
        where u1.release_id = e.release_id and u1.is_published = true
        order by u1.sequence_number asc
        limit 1
      ) as first_unit_slug,
      (
        select u2.slug
        from public.learning_units u2
        left join public.unit_progress up2
          on up2.enrollment_id = e.id
         and up2.unit_id = u2.id
         and up2.status = 'completed'
        where u2.release_id = e.release_id
          and u2.is_published = true
          and up2.unit_id is null
        order by u2.sequence_number asc
        limit 1
      ) as first_incomplete_slug
    from public.learning_units u
    left join public.unit_progress up
      on up.enrollment_id = e.id
     and up.unit_id = u.id
    where u.release_id = e.release_id
      and u.is_published = true
  ) u_stats on true
  where e.user_id = p_user_id
    and e.status in ('active', 'paused', 'completed');

  -- 2. Aggregate upcoming bookings
  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'id', b.id,
        'courseSlug', coalesce(c.slug, 'casc-academy'),
        'startsAt', b.starts_at,
        'endsAt', b.ends_at,
        'status', b.status,
        'fundingType', b.funding_type,
        'joinUrl', coalesce(m.join_url, b.session_link),
        'sessionLink', coalesce(b.session_link, m.join_url),
        'meetingStatus', coalesce(m.meeting_status, 'pending'),
        'emailStatus', coalesce(m.email_status, 'pending')
      )
      order by b.starts_at asc
    ),
    '[]'::jsonb
  )
  into v_upcoming_bookings
  from public.sessions_booking b
  left join public.courses c on c.id = b.course_id
  left join public.private_session_meetings m on m.booking_id = b.id
  where b.user_id = p_user_id
    and b.starts_at > now()
    and b.status in ('pending_payment', 'confirmed', 'fulfillment_pending', 'ready');

  -- 3. Aggregate packages (session entitlements)
  select
    coalesce(
      jsonb_agg(
        jsonb_build_object(
          'id', ent.id,
          'courseSlug', coalesce(c.slug, 'casc-academy'),
          'packageCode', o.code,
          'purchased', ent.purchased_quantity,
          'remaining', ent.remaining_quantity,
          'status', ent.status
        )
        order by ent.created_at asc
      ),
      '[]'::jsonb
    ),
    coalesce(sum(ent.remaining_quantity), 0)::int
  into v_packages, v_total_remaining
  from public.session_entitlements ent
  left join public.courses c on c.id = ent.course_id
  left join public.private_session_offers o on o.id = ent.offer_id
  where ent.user_id = p_user_id
    and ent.status = 'active';

  -- 4. Calculate aggregate statuses
  v_has_upcoming := jsonb_array_length(v_upcoming_bookings) > 0;
  v_has_package := v_total_remaining > 0 or jsonb_array_length(v_packages) > 0;
  v_has_active := v_has_upcoming or v_has_package;

  if v_has_upcoming then
    v_next_booking := v_upcoming_bookings->0;
  end if;

  -- Check funding types for upcoming bookings
  select
    bool_or(b.funding_type = 'direct_payment'),
    bool_or(b.funding_type = 'package_credit')
  into v_has_direct, v_has_credit
  from public.sessions_booking b
  where b.user_id = p_user_id
    and b.starts_at > now()
    and b.status in ('pending_payment', 'confirmed', 'fulfillment_pending', 'ready');

  v_has_direct := coalesce(v_has_direct, false);
  v_has_credit := coalesce(v_has_credit, false);

  if (v_has_package or v_has_credit) and v_has_direct then
    v_session_type := 'both';
  elsif v_has_package or v_has_credit then
    v_session_type := 'package';
  elsif v_has_direct then
    v_session_type := 'direct';
  else
    v_session_type := 'none';
  end if;

  -- 5. Construct final JSON
  v_result := jsonb_build_object(
    'enrolledCourses', v_enrolled_courses,
    'privateSessions', jsonb_build_object(
      'hasActiveSession', v_has_active,
      'sessionType', v_session_type,
      'hasUpcomingBooking', v_has_upcoming,
      'nextBooking', v_next_booking,
      'upcomingBookings', v_upcoming_bookings,
      'hasPackage', v_has_package,
      'totalRemainingCredits', v_total_remaining,
      'packages', v_packages
    )
  );

  return v_result;
end;
$$;

grant execute on function public.get_user_me_summary(uuid) to authenticated, service_role;
