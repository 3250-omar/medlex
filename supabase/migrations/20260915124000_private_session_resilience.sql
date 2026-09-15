-- Migration: 20260915124000_private_session_resilience.sql
-- Description: Failure resilience, outbox leasing (FOR UPDATE SKIP LOCKED),
--              bounded exponential retry backoff, and forward-only payment transitions.

-- ============================================================================
-- 1. claim_outbox_batch
-- ============================================================================
create or replace function public.claim_outbox_batch(
  p_worker_id text,
  p_batch_size integer default 10,
  p_stale_timeout_minutes integer default 5
)
returns setof public.private_session_outbox
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
  with available_jobs as (
    select id
    from public.private_session_outbox
    where (
      (status in ('pending', 'failed') and available_at <= now() and (locked_at is null or locked_at < now() - (p_stale_timeout_minutes || ' minutes')::interval))
    )
    and attempt_count < max_attempts
    order by available_at asc
    limit p_batch_size
    for update skip locked
  )
  update public.private_session_outbox o
  set
    status = 'processing',
    locked_at = now(),
    locked_by = p_worker_id,
    attempt_count = o.attempt_count + 1
  from available_jobs
  where o.id = available_jobs.id
  returning o.*;
end;
$$;

-- ============================================================================
-- 2. complete_outbox_job
-- ============================================================================
create or replace function public.complete_outbox_job(
  p_job_id uuid
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.private_session_outbox
  set
    status = 'completed',
    completed_at = now(),
    locked_at = null,
    locked_by = null
  where id = p_job_id;

  return found;
end;
$$;

-- ============================================================================
-- 3. fail_outbox_job (bounded exponential backoff)
-- ============================================================================
create or replace function public.fail_outbox_job(
  p_job_id uuid,
  p_error_code text
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_job public.private_session_outbox;
  v_backoff_seconds integer;
begin
  select * into v_job
  from public.private_session_outbox
  where id = p_job_id;

  if v_job.id is null then
    return false;
  end if;

  -- 30s, 60s, 120s, 240s, capped at 600s
  v_backoff_seconds := least(600, power(2, least(v_job.attempt_count, 5))::integer * 15);

  update public.private_session_outbox
  set
    status = case when v_job.attempt_count >= v_job.max_attempts then 'failed' else 'pending' end,
    locked_at = null,
    locked_by = null,
    last_error_code = p_error_code,
    available_at = now() + (v_backoff_seconds || ' seconds')::interval
  where id = p_job_id;

  return true;
end;
$$;

-- ============================================================================
-- 4. reconcile_payment_attempt (Forward-only & paid_unfulfilled mapping)
-- ============================================================================
create or replace function public.reconcile_payment_attempt(
  p_attempt_id uuid,
  p_provider_transaction_id text,
  p_provider_order_id text,
  p_is_success boolean,
  p_failure_code text default null,
  p_failure_detail text default null
)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_attempt public.session_payment_attempts;
  v_slot public.private_session_slots;
  v_result text;
begin
  select * into v_attempt
  from public.session_payment_attempts
  where id = p_attempt_id
  for update;

  if v_attempt.id is null then
    return 'attempt_not_found';
  end if;

  -- Forward-only: cannot revert from terminal paid state
  if v_attempt.status = 'paid' then
    return 'already_paid';
  end if;

  if p_is_success then
    if v_attempt.purpose = 'direct' then
      -- Check slot status
      select * into v_slot
      from public.private_session_slots
      where id = v_attempt.slot_id
      for update;

      -- If hold expired or slot was taken/withdrawn
      if v_slot.id is null or v_slot.status != 'held' or (v_attempt.hold_expires_at is not null and v_attempt.hold_expires_at < now()) then
        -- Mark attempt as paid_unfulfilled
        update public.session_payment_attempts
        set
          status = 'paid_unfulfilled',
          provider_transaction_id = coalesce(p_provider_transaction_id, provider_transaction_id),
          provider_order_id = coalesce(p_provider_order_id, provider_order_id),
          paid_at = now(),
          failure_code = 'HOLD_EXPIRED_SLOT_LOST',
          failure_detail = 'Payment succeeded after hold expired; requires manual fulfillment or refund'
        where id = v_attempt.id;

        insert into public.private_session_audit_events (
          actor_type,
          actor_id,
          entity_type,
          entity_id,
          action,
          before_state,
          after_state
        )
        values (
          'system',
          v_attempt.user_id,
          'session_payment_attempts',
          v_attempt.id,
          'paid_unfulfilled_recorded',
          to_jsonb(v_attempt),
          jsonb_build_object('status', 'paid_unfulfilled', 'reason', 'hold_expired')
        );

        return 'paid_unfulfilled';
      else
        -- Confirm booking
        perform public.confirm_direct_session_payment(
          v_attempt.id,
          p_provider_order_id,
          p_provider_transaction_id
        );
        return 'paid_confirmed';
      end if;
    else
      -- Package grant
      perform public.grant_private_session_package(
        v_attempt.id,
        p_provider_order_id,
        p_provider_transaction_id
      );

      return 'paid_package';
    end if;
  else
    -- Payment failed
    if v_attempt.status = 'pending' or v_attempt.status = 'created' then
      update public.session_payment_attempts
      set
        status = 'failed',
        failure_code = p_failure_code,
        failure_detail = p_failure_detail
      where id = v_attempt.id;

      if v_attempt.purpose = 'direct' and v_attempt.slot_id is not null then
        perform public.expire_direct_session_hold(v_attempt.id);
      end if;
    end if;

    return 'payment_failed';
  end if;
end;
$$;
