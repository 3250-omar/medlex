-- Migration: Cleanup unused LMS blueprint tables and obsolete/superseded RPC functions
-- Keeps all 12 Private Sessions tables and all active tables/functions intact.

-- ============================================================================
-- A. Update active RPCs so they no longer reference tables being dropped
-- ============================================================================

CREATE OR REPLACE FUNCTION public.get_course_refund_eligibility(
  p_user_id uuid,
  p_course_slug text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_enrollment record;
  v_days_elapsed integer;
  v_exam_completions integer := 0;
  v_completed_units integer := 0;
  v_is_within_14_days boolean;
  v_is_eligible boolean;
  v_reason text := null;
BEGIN
  -- Fetch the latest enrollment for this user and course
  SELECT
    e.id,
    e.enrolled_at,
    e.status,
    e.cancellation_waiver_accepted,
    e.cancellation_waiver_accepted_at,
    e.cancellation_waiver_text
  INTO v_enrollment
  FROM public.enrollments e
  JOIN public.courses c ON c.id = e.course_id
  WHERE e.user_id = p_user_id
    AND c.slug = p_course_slug
  ORDER BY e.enrolled_at DESC
  LIMIT 1;

  IF v_enrollment.id IS NULL THEN
    RETURN jsonb_build_object(
      'enrolled', false,
      'isRefundEligible', false,
      'reason', 'No enrollment found for this course.'
    );
  END IF;

  -- Days since enrollment
  v_days_elapsed := floor(extract(epoch FROM (now() - v_enrollment.enrolled_at)) / 86400)::integer;
  v_is_within_14_days := (v_days_elapsed <= 14);

  -- Count Exam Mode completions via unit_progress.exam_completed
  SELECT count(DISTINCT up.unit_id) INTO v_exam_completions
  FROM public.unit_progress up
  WHERE up.enrollment_id = v_enrollment.id
    AND up.exam_completed = true;

  -- Count total completed stations
  SELECT count(DISTINCT up.unit_id) INTO v_completed_units
  FROM public.unit_progress up
  WHERE up.enrollment_id = v_enrollment.id
    AND up.status = 'completed';

  -- If the user did NOT accept the cancellation waiver, statutory 14-day applies without station limits
  IF NOT coalesce(v_enrollment.cancellation_waiver_accepted, false) THEN
    IF v_is_within_14_days THEN
      v_is_eligible := true;
      v_reason := 'Statutory 14-day cancellation applies (no waiver recorded).';
    ELSE
      v_is_eligible := false;
      v_reason := 'Statutory 14-day cancellation window has expired.';
    END IF;
  ELSE
    -- With waiver: MedLex 14-day policy applies (within 14 days AND <= 3 Exam Mode completions)
    IF NOT v_is_within_14_days THEN
      v_is_eligible := false;
      v_reason := format('Refund window expired (%s days since purchase, max allowed: 14 days).', v_days_elapsed);
    ELSIF v_exam_completions > 3 THEN
      v_is_eligible := false;
      v_reason := format('Completed %s stations in Exam Mode (maximum allowed for refund is 3 stations).', v_exam_completions);
    ELSE
      v_is_eligible := true;
      v_reason := format('Eligible for refund: %s days since purchase, %s Exam Mode completions (limit is 3).', v_days_elapsed, v_exam_completions);
    END IF;
  END IF;

  RETURN jsonb_build_object(
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
END;
$$;

REVOKE ALL ON FUNCTION public.get_course_refund_eligibility(uuid, text) FROM public;
GRANT EXECUTE ON FUNCTION public.get_course_refund_eligibility(uuid, text) TO authenticated;

CREATE OR REPLACE FUNCTION public.cascade_delete_user(target_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
DECLARE
  v_enrollment_ids uuid[];
  v_cert_ids uuid[];
BEGIN
  -- 1. Gather all user enrollment IDs
  SELECT COALESCE(array_agg(id), ARRAY[]::uuid[]) INTO v_enrollment_ids
  FROM public.enrollments
  WHERE user_id = target_user_id;

  IF array_length(v_enrollment_ids, 1) > 0 THEN
    -- Certificates & certificate downloads
    SELECT COALESCE(array_agg(id), ARRAY[]::uuid[]) INTO v_cert_ids
    FROM public.certificates
    WHERE enrollment_id = ANY(v_enrollment_ids);

    IF array_length(v_cert_ids, 1) > 0 THEN
      DELETE FROM public.certificate_download_events WHERE certificate_id = ANY(v_cert_ids);
      DELETE FROM public.certificates WHERE id = ANY(v_cert_ids);
    END IF;

    -- Unit progress
    DELETE FROM public.unit_progress WHERE enrollment_id = ANY(v_enrollment_ids);

    -- Enrollments
    DELETE FROM public.enrollments WHERE id = ANY(v_enrollment_ids);
  END IF;

  -- 2. Direct user records cleanup
  DELETE FROM public.certificate_download_events WHERE user_id = target_user_id;
  DELETE FROM public.feedbacks WHERE user_id = target_user_id;
  DELETE FROM public.profiles WHERE id = target_user_id;
END;
$$;

COMMENT ON FUNCTION public.cascade_delete_user(uuid) IS 'Atomic RPC to cascade and delete all associated learner records before removing Supabase auth account';
REVOKE EXECUTE ON FUNCTION public.cascade_delete_user(uuid) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.cascade_delete_user(uuid) TO service_role;

-- ============================================================================
-- B. Drop obsolete / superseded RPC functions
-- ============================================================================

DO $$
DECLARE
  v_fn record;
BEGIN
  FOR v_fn IN
    SELECT
      n.nspname AS schema_name,
      p.proname AS function_name,
      pg_get_function_identity_arguments(p.oid) AS identity_args
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.proname IN (
        'start_assessment',
        'submit_single_choice_answer',
        'submit_exam_attempt',
        'submit_production',
        'complete_learn_assessment',
        'mark_unit_opened',
        'get_admin_payments',
        'get_admin_users_list',
        'create_direct_session_hold',
        'resolve_offer_country_price'
      )
  LOOP
    EXECUTE format(
      'DROP FUNCTION IF EXISTS %I.%I(%s) CASCADE',
      v_fn.schema_name,
      v_fn.function_name,
      v_fn.identity_args
    );
  END LOOP;
END $$;

-- ============================================================================
-- C. Drop 28 unused/empty LMS blueprint tables (reverse dependency order)
-- ============================================================================

-- Rubrics (5)
DROP TABLE IF EXISTS public.rubric_item_scores CASCADE;
DROP TABLE IF EXISTS public.rubric_submissions CASCADE;
DROP TABLE IF EXISTS public.rubric_items CASCADE;
DROP TABLE IF EXISTS public.rubric_sections CASCADE;
DROP TABLE IF EXISTS public.rubrics CASCADE;

-- Production tasks (4)
DROP TABLE IF EXISTS public.production_self_checks CASCADE;
DROP TABLE IF EXISTS public.production_submissions CASCADE;
DROP TABLE IF EXISTS public.production_criteria CASCADE;
DROP TABLE IF EXISTS public.production_tasks CASCADE;

-- Practice packs (4)
DROP TABLE IF EXISTS public.practice_participants CASCADE;
DROP TABLE IF EXISTS public.practice_sessions CASCADE;
DROP TABLE IF EXISTS public.practice_roles CASCADE;
DROP TABLE IF EXISTS public.practice_packs CASCADE;

-- Legacy assessment attempts (3)
DROP TABLE IF EXISTS public.attempt_answers CASCADE;
DROP TABLE IF EXISTS public.attempt_question_order CASCADE;
DROP TABLE IF EXISTS public.assessment_attempts CASCADE;

-- Competencies / telemetry / points (6)
DROP TABLE IF EXISTS public.mastery_evidence CASCADE;
DROP TABLE IF EXISTS public.unit_competencies CASCADE;
DROP TABLE IF EXISTS public.competencies CASCADE;
DROP TABLE IF EXISTS public.learning_events CASCADE;
DROP TABLE IF EXISTS public.learning_sessions CASCADE;
DROP TABLE IF EXISTS public.point_ledger CASCADE;

-- Categories / policies / media / imports (6)
DROP TABLE IF EXISTS public.course_category_assignments CASCADE;
DROP TABLE IF EXISTS public.course_categories CASCADE;
DROP TABLE IF EXISTS public.course_release_features CASCADE;
DROP TABLE IF EXISTS public.course_completion_policies CASCADE;
DROP TABLE IF EXISTS public.content_imports CASCADE;
DROP TABLE IF EXISTS public.media_assets CASCADE;
