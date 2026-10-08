-- Migration: Update Paddle webhook processing to support case-insensitive and simulation IDs
-- Allows Paddle simulation events and uppercase ULIDs to be processed cleanly.

create or replace function public.process_paddle_private_session_webhook(
  p_provider_event_id text,
  p_provider_transaction_id text,
  p_event_type text,
  p_payload_hash text,
  p_custom_payment_attempt_id uuid,
  p_is_success boolean,
  p_failure_code text default null
)
returns table (
  outcome text,
  reconciliation_status text
)

language plpgsql
security definer
set search_path = public
as $$
declare
  v_event public.session_payment_webhook_events;
  v_attempt public.session_payment_attempts;
  v_reconciliation_status text;
begin
  if p_provider_event_id is null or p_provider_event_id !~* '^evt_[a-z0-9_]{10,50}$' then
    raise exception 'Invalid Paddle event ID';
  end if;

  if p_provider_transaction_id is null or p_provider_transaction_id !~* '^txn_[a-z0-9_]{10,50}$' then
    raise exception 'Invalid Paddle transaction ID';
  end if;

  if p_event_type not in ('transaction.completed', 'transaction.payment_failed', 'transaction.canceled') then
    raise exception 'Unsupported Paddle event type';
  end if;

  if p_payload_hash is null or p_payload_hash !~* '^[a-f0-9]{64}$' then
    raise exception 'Invalid webhook payload hash';
  end if;

  insert into public.session_payment_webhook_events (
    provider_event_id, provider_transaction_id, payload_hash, verified, processing_status
  )
  values (
    p_provider_event_id, p_provider_transaction_id, p_payload_hash, true, 'received'
  )
  on conflict (provider_event_id) do nothing
  returning * into v_event;

  if v_event.id is null then
    return query select 'duplicate'::text, 'already_recorded'::text;
    return;
  end if;

  select * into v_attempt
  from public.session_payment_attempts
  where provider = 'paddle' and provider_transaction_id = p_provider_transaction_id
  for update;

  if v_attempt.id is null then
    update public.session_payment_webhook_events
    set processing_status = 'rejected', error_detail = 'Unknown Paddle transaction', processed_at = now()
    where id = v_event.id;
    return query select 'rejected'::text, 'unknown_transaction'::text;
    return;
  end if;

  if p_custom_payment_attempt_id is null or p_custom_payment_attempt_id <> v_attempt.id then
    update public.session_payment_webhook_events
    set
      processing_status = 'rejected',
      attempt_id = v_attempt.id,
      error_detail = 'Paddle custom payment attempt does not match the transaction owner',
      processed_at = now()
    where id = v_event.id;
    return query select 'rejected'::text, 'attempt_mismatch'::text;
    return;
  end if;

  select public.reconcile_payment_attempt(
    v_attempt.id,
    p_provider_transaction_id,
    null,
    p_is_success,
    p_failure_code,
    case when p_is_success then null else p_event_type end
  ) into v_reconciliation_status;

  update public.session_payment_webhook_events
  set attempt_id = v_attempt.id, processing_status = 'processed', processed_at = now(), error_detail = null
  where id = v_event.id;

  return query select 'processed'::text, coalesce(v_reconciliation_status, 'unknown')::text;
end;
$$;

revoke all on function public.process_paddle_private_session_webhook(text, text, text, text, uuid, boolean, text)
  from public, anon, authenticated;
grant execute on function public.process_paddle_private_session_webhook(text, text, text, text, uuid, boolean, text)
  to service_role;
