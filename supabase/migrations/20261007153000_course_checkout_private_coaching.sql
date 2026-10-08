-- Bundle CASC course access and private-coaching credits in one verified Paddle payment.

alter table public.course_payment_attempts
  add column if not exists session_offer_id uuid references public.private_session_offers(id) on delete restrict,
  add column if not exists session_quantity integer not null default 0 check (session_quantity between 0 and 20),
  add column if not exists session_amount_minor integer not null default 0 check (session_amount_minor >= 0);

alter table public.course_payment_attempts
  drop constraint if exists course_payment_attempts_session_snapshot_check;
alter table public.course_payment_attempts
  add constraint course_payment_attempts_session_snapshot_check check (
    (session_quantity = 0 and session_offer_id is null and session_amount_minor = 0)
    or (session_quantity > 0 and session_offer_id is not null and session_amount_minor > 0)
  );

alter table public.session_entitlements
  add column if not exists course_payment_attempt_id uuid unique references public.course_payment_attempts(id) on delete restrict;
alter table public.session_entitlements
  alter column payment_attempt_id drop not null;
alter table public.session_entitlements
  drop constraint if exists session_entitlements_purchased_quantity_check,
  drop constraint if exists session_entitlements_payment_source_check;
alter table public.session_entitlements
  add constraint session_entitlements_purchased_quantity_check check (purchased_quantity > 0),
  add constraint session_entitlements_payment_source_check check (
    (payment_attempt_id is not null and course_payment_attempt_id is null)
    or (payment_attempt_id is null and course_payment_attempt_id is not null)
  );

create or replace function public.process_paddle_course_webhook(
  p_provider_event_id text,
  p_provider_transaction_id text,
  p_event_type text,
  p_payload_hash text,
  p_custom_payment_attempt_id uuid,
  p_is_success boolean,
  p_failure_code text default null
)
returns table (outcome text, enrollment_id uuid, expires_at timestamptz)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_event public.course_payment_webhook_events;
  v_attempt public.course_payment_attempts;
  v_enrollment public.enrollments;
  v_next_expiry timestamptz;
  v_entitlement_id uuid;
begin
  if p_provider_event_id is null or char_length(p_provider_event_id) not between 1 and 255 then
    raise exception 'Invalid Paddle event ID';
  end if;
  if p_provider_transaction_id is null or char_length(p_provider_transaction_id) not between 1 and 255 then
    raise exception 'Invalid Paddle transaction ID';
  end if;
  if p_event_type not in ('transaction.completed', 'transaction.payment_failed', 'transaction.canceled') then
    raise exception 'Unsupported Paddle event type';
  end if;
  if p_payload_hash is null or p_payload_hash !~ '^[a-f0-9]{64}$' then
    raise exception 'Invalid webhook payload hash';
  end if;

  insert into public.course_payment_webhook_events (
    provider_event_id, provider_transaction_id, payload_hash, verified, processing_status
  ) values (
    p_provider_event_id, p_provider_transaction_id, p_payload_hash, true, 'received'
  ) on conflict (provider_event_id) do nothing
  returning * into v_event;

  if v_event.id is null then
    return query select 'duplicate'::text, null::uuid, null::timestamptz;
    return;
  end if;

  select * into v_attempt
  from public.course_payment_attempts
  where provider = 'paddle' and provider_transaction_id = p_provider_transaction_id
  for update;

  if v_attempt.id is null or p_custom_payment_attempt_id is null
    or p_custom_payment_attempt_id <> v_attempt.id then
    update public.course_payment_webhook_events
    set processing_status = 'rejected',
        course_payment_attempt_id = v_attempt.id,
        error_detail = case when v_attempt.id is null then 'Unknown Paddle transaction'
          else 'Paddle custom payment attempt does not match the transaction owner' end,
        processed_at = now()
    where id = v_event.id;
    return query select 'rejected'::text, null::uuid, null::timestamptz;
    return;
  end if;

  if not p_is_success then
    update public.course_payment_attempts
    set status = case when p_event_type = 'transaction.canceled' then 'cancelled' else 'failed' end,
        failure_code = coalesce(p_failure_code, p_event_type),
        updated_at = now()
    where id = v_attempt.id and status not in ('paid', 'refunded');

    update public.course_payment_webhook_events
    set course_payment_attempt_id = v_attempt.id, processing_status = 'processed', processed_at = now()
    where id = v_event.id;
    return query select 'processed'::text, null::uuid, null::timestamptz;
    return;
  end if;

  select * into v_enrollment
  from public.enrollments
  where user_id = v_attempt.user_id and course_id = v_attempt.course_id
  for update;

  if v_enrollment.id is null then
    v_next_expiry := now() + make_interval(days => v_attempt.access_duration_days);
    insert into public.enrollments (user_id, course_id, release_id, status, expires_at)
    values (v_attempt.user_id, v_attempt.course_id, v_attempt.release_id, 'active', v_next_expiry)
    returning * into v_enrollment;
  else
    v_next_expiry := greatest(coalesce(v_enrollment.expires_at, now()), now())
      + make_interval(days => v_attempt.access_duration_days);
    update public.enrollments
    set expires_at = v_next_expiry,
        status = case when status = 'completed' then 'completed' else 'active' end
    where id = v_enrollment.id
    returning * into v_enrollment;
  end if;

  if v_attempt.session_quantity > 0 then
    insert into public.session_entitlements (
      user_id, course_id, offer_id, payment_attempt_id, course_payment_attempt_id,
      purchased_quantity, reserved_quantity, consumed_quantity, remaining_quantity,
      amount_minor, currency, status
    ) values (
      v_attempt.user_id, v_attempt.course_id, v_attempt.session_offer_id, null, v_attempt.id,
      v_attempt.session_quantity, 0, 0, v_attempt.session_quantity,
      v_attempt.session_amount_minor, v_attempt.currency, 'active'
    ) on conflict (course_payment_attempt_id) do nothing
    returning id into v_entitlement_id;

    if v_entitlement_id is not null then
      insert into public.session_credit_ledger (
        entitlement_id, delta, reason, idempotency_key, actor_type, actor_id
      ) values (
        v_entitlement_id, v_attempt.session_quantity, 'purchase_grant',
        'course-grant-' || v_attempt.id, 'system', v_attempt.user_id
      ) on conflict (idempotency_key) do nothing;
    end if;
  end if;

  update public.course_payment_attempts
  set status = 'paid', completed_at = coalesce(completed_at, now()), failure_code = null,
      failure_detail = null, updated_at = now()
  where id = v_attempt.id;

  update public.course_payment_webhook_events
  set course_payment_attempt_id = v_attempt.id, processing_status = 'processed', processed_at = now()
  where id = v_event.id;

  return query select 'processed'::text, v_enrollment.id, v_enrollment.expires_at;
end;
$$;

revoke all on function public.process_paddle_course_webhook(text, text, text, text, uuid, boolean, text)
  from public, anon, authenticated;
grant execute on function public.process_paddle_course_webhook(text, text, text, text, uuid, boolean, text)
  to service_role;