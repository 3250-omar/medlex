-- Phase 6: paid course access is granted only from a verified Paddle webhook.
-- A repurchase extends from the later of now() or the current expiry and keeps
-- the learner's existing enrollment, progress, and completion history.

create table if not exists public.course_payment_attempts (
  id uuid primary key default gen_random_uuid(),
  idempotency_key text not null unique,
  user_id uuid not null references auth.users(id) on delete restrict,
  course_id uuid not null references public.courses(id) on delete restrict,
  release_id uuid not null references public.course_releases(id) on delete restrict,
  amount_minor integer not null check (amount_minor > 0),
  currency text not null check (currency ~ '^[A-Z]{3}$'),
  access_duration_days integer not null check (access_duration_days > 0),
  provider text not null default 'paddle' check (provider = 'paddle'),
  provider_transaction_id text unique,
  provider_customer_id text,
  status text not null default 'created'
    check (status in ('created', 'pending', 'paid', 'failed', 'cancelled', 'refunded')),
  completed_at timestamptz,
  failure_code text,
  failure_detail text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (provider_transaction_id is null or char_length(provider_transaction_id) between 1 and 255)
);

create index if not exists course_payment_attempts_user_course_idx
  on public.course_payment_attempts(user_id, course_id, created_at desc);

create table if not exists public.course_payment_webhook_events (
  id uuid primary key default gen_random_uuid(),
  provider_event_id text not null unique,
  provider_transaction_id text not null,
  course_payment_attempt_id uuid references public.course_payment_attempts(id) on delete set null,
  payload_hash text not null check (payload_hash ~ '^[a-f0-9]{64}$'),
  verified boolean not null default false,
  processing_status text not null default 'received'
    check (processing_status in ('received', 'processed', 'rejected')),
  error_detail text,
  received_at timestamptz not null default now(),
  processed_at timestamptz
);

create index if not exists course_payment_webhook_attempt_idx
  on public.course_payment_webhook_events(course_payment_attempt_id, received_at desc);

alter table public.course_payment_attempts enable row level security;
alter table public.course_payment_webhook_events enable row level security;

drop policy if exists "learners read own course payment attempts" on public.course_payment_attempts;

create policy "learners read own course payment attempts"
  on public.course_payment_attempts
  for select to authenticated
  using (user_id = auth.uid());

create or replace function public.process_paddle_course_webhook(
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
  enrollment_id uuid,
  expires_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_event public.course_payment_webhook_events;
  v_attempt public.course_payment_attempts;
  v_enrollment public.enrollments;
  v_next_expiry timestamptz;
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
    insert into public.enrollments (
      user_id, course_id, release_id, status, expires_at
    ) values (
      v_attempt.user_id, v_attempt.course_id, v_attempt.release_id, 'active', v_next_expiry
    ) returning * into v_enrollment;
  else
    v_next_expiry := greatest(coalesce(v_enrollment.expires_at, now()), now())
      + make_interval(days => v_attempt.access_duration_days);
    update public.enrollments
    set expires_at = v_next_expiry,
        status = case when status = 'completed' then 'completed' else 'active' end
    where id = v_enrollment.id
    returning * into v_enrollment;
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
