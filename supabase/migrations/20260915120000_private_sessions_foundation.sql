-- Migration: 20260915120000_private_sessions_foundation.sql
-- Description: Private sessions foundational schema, tables, constraints, indexes, triggers, and seed data.

create extension if not exists "btree_gist";

-- ============================================================================
-- 1. private_session_hosts
-- ============================================================================
create table if not exists public.private_session_hosts (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references public.profiles(id) on delete restrict,
  display_name text not null check (char_length(trim(display_name)) > 0),
  timezone text not null default 'Africa/Cairo',
  google_calendar_id text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================================
-- 2. private_session_offers
-- ============================================================================
create table if not exists public.private_session_offers (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  code text not null check (code in ('direct', 'package_5', 'package_10')),
  kind text not null check (kind in ('direct', 'package')),
  session_count integer not null check (session_count in (1, 5, 10)),
  price_minor integer not null check (price_minor >= 0),
  currency text not null check (currency ~ '^[A-Z]{3}$'),
  title_en text not null check (char_length(trim(title_en)) between 1 and 120),
  title_ar text not null check (char_length(trim(title_ar)) between 1 and 120),
  is_active boolean not null default true,
  created_by uuid references public.profiles(id) on delete set null,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint private_session_offers_course_code_key unique (course_id, code),
  constraint private_session_offers_code_kind_count_check check (
    (code = 'direct' and kind = 'direct' and session_count = 1) or
    (code = 'package_5' and kind = 'package' and session_count = 5) or
    (code = 'package_10' and kind = 'package' and session_count = 10)
  )
);

-- ============================================================================
-- 3. private_session_slots
-- ============================================================================
create table if not exists public.private_session_slots (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  host_id uuid not null references public.private_session_hosts(id) on delete restrict,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  source_timezone text not null default 'Africa/Cairo',
  status text not null default 'available' check (status in ('available', 'held', 'booked', 'withdrawn', 'completed')),
  created_by uuid references public.profiles(id) on delete set null,
  updated_by uuid references public.profiles(id) on delete set null,
  withdrawn_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint private_session_slots_duration_check check (ends_at = starts_at + interval '1 hour'),
  constraint private_session_slots_range_check check (starts_at < ends_at),
  constraint private_session_slots_withdrawn_check check (withdrawn_at is null or status = 'withdrawn'),
  constraint private_session_slots_no_overlap exclude using gist (
    host_id with =,
    tstzrange(starts_at, ends_at, '[)') with &&
  ) where (status != 'withdrawn')
);

create index if not exists private_session_slots_lookup_idx
  on public.private_session_slots (course_id, status, starts_at);

-- ============================================================================
-- 4. session_payment_attempts
-- ============================================================================
create table if not exists public.session_payment_attempts (
  id uuid primary key default gen_random_uuid(),
  idempotency_key text not null unique check (char_length(idempotency_key) between 16 and 128),
  user_id uuid not null references auth.users(id) on delete restrict,
  course_id uuid not null references public.courses(id) on delete cascade,
  offer_id uuid not null references public.private_session_offers(id) on delete restrict,
  purpose text not null check (purpose in ('direct', 'package')),
  slot_id uuid references public.private_session_slots(id) on delete restrict,
  quantity_snapshot integer not null check (quantity_snapshot in (1, 5, 10)),
  amount_minor integer not null check (amount_minor >= 0),
  currency text not null check (currency ~ '^[A-Z]{3}$'),
  provider text not null default 'paymob',
  provider_order_id text unique,
  provider_transaction_id text unique,
  status text not null default 'created' check (status in ('created', 'pending', 'paid', 'failed', 'cancelled', 'expired', 'paid_unfulfilled')),
  hold_expires_at timestamptz,
  failure_code text,
  failure_detail text,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint session_payment_attempts_purpose_slot_check check (
    (purpose = 'direct' and slot_id is not null and quantity_snapshot = 1 and hold_expires_at is not null) or
    (purpose = 'package' and slot_id is null and quantity_snapshot in (5, 10) and hold_expires_at is null)
  )
);

create index if not exists session_payment_attempts_user_idx
  on public.session_payment_attempts (user_id, status, created_at desc);

-- ============================================================================
-- 5. session_payment_webhook_events
-- ============================================================================
create table if not exists public.session_payment_webhook_events (
  id uuid primary key default gen_random_uuid(),
  provider_event_id text not null unique,
  provider_transaction_id text,
  payload_hash text not null,
  verified boolean not null default false,
  processing_status text not null default 'received' check (processing_status in ('received', 'processed', 'duplicate', 'rejected', 'failed')),
  attempt_id uuid references public.session_payment_attempts(id) on delete set null,
  error_detail text,
  received_at timestamptz not null default now(),
  processed_at timestamptz
);

create index if not exists session_payment_webhook_events_tx_idx
  on public.session_payment_webhook_events (provider_transaction_id);

-- ============================================================================
-- 6. session_entitlements
-- ============================================================================
create table if not exists public.session_entitlements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete restrict,
  course_id uuid not null references public.courses(id) on delete cascade,
  offer_id uuid not null references public.private_session_offers(id) on delete restrict,
  payment_attempt_id uuid not null unique references public.session_payment_attempts(id) on delete restrict,
  purchased_quantity integer not null check (purchased_quantity in (5, 10)),
  reserved_quantity integer not null default 0 check (reserved_quantity >= 0),
  consumed_quantity integer not null default 0 check (consumed_quantity >= 0),
  remaining_quantity integer not null default 0 check (remaining_quantity >= 0),
  amount_minor integer not null check (amount_minor >= 0),
  currency text not null check (currency ~ '^[A-Z]{3}$'),
  status text not null default 'active' check (status in ('active', 'exhausted', 'suspended')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint session_entitlements_balance_balance_check check (
    reserved_quantity + consumed_quantity + remaining_quantity = purchased_quantity
  )
);

create index if not exists session_entitlements_user_course_idx
  on public.session_entitlements (user_id, course_id, status);

-- ============================================================================
-- 7. sessions_booking
-- ============================================================================
create table if not exists public.sessions_booking (
  id uuid primary key default gen_random_uuid(),
  slot_id uuid not null references public.private_session_slots(id) on delete restrict,
  user_id uuid not null references auth.users(id) on delete restrict,
  course_id uuid not null references public.courses(id) on delete cascade,
  host_id uuid not null references public.private_session_hosts(id) on delete restrict,
  funding_type text not null check (funding_type in ('direct_payment', 'package_credit')),
  payment_attempt_id uuid references public.session_payment_attempts(id) on delete restrict,
  entitlement_id uuid references public.session_entitlements(id) on delete restrict,
  status text not null default 'pending_payment' check (status in ('pending_payment', 'confirmed', 'fulfillment_pending', 'ready', 'expired', 'failed', 'cancelled')),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  amount_minor integer not null check (amount_minor >= 0),
  currency text not null check (currency ~ '^[A-Z]{3}$'),
  session_link text,
  idempotency_key text not null unique check (char_length(idempotency_key) between 16 and 128),
  confirmed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint sessions_booking_duration_check check (ends_at = starts_at + interval '1 hour'),
  constraint sessions_booking_funding_reference_check check (
    (funding_type = 'direct_payment' and payment_attempt_id is not null and entitlement_id is null) or
    (funding_type = 'package_credit' and entitlement_id is not null and payment_attempt_id is null)
  )
);

-- Exactly one active booking per slot
create unique index if not exists sessions_booking_one_active_per_slot_idx
  on public.sessions_booking (slot_id)
  where (status in ('pending_payment', 'confirmed', 'fulfillment_pending', 'ready'));

create index if not exists sessions_booking_user_idx
  on public.sessions_booking (user_id, status, starts_at);

-- ============================================================================
-- 8. session_credit_ledger
-- ============================================================================
create table if not exists public.session_credit_ledger (
  id uuid primary key default gen_random_uuid(),
  entitlement_id uuid not null references public.session_entitlements(id) on delete restrict,
  booking_id uuid references public.sessions_booking(id) on delete restrict,
  delta integer not null check (delta != 0),
  reason text not null check (reason in ('purchase_grant', 'booking_consumed', 'booking_restored')),
  idempotency_key text not null unique check (char_length(idempotency_key) between 16 and 128),
  actor_type text not null check (actor_type in ('system', 'learner', 'admin')),
  actor_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  constraint session_credit_ledger_reason_booking_check check (
    (reason in ('booking_consumed', 'booking_restored') and booking_id is not null) or
    (reason = 'purchase_grant')
  )
);

create index if not exists session_credit_ledger_entitlement_idx
  on public.session_credit_ledger (entitlement_id, created_at asc);

-- ============================================================================
-- 9. private_session_meetings
-- ============================================================================
create table if not exists public.private_session_meetings (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null unique references public.sessions_booking(id) on delete cascade,
  provider text not null default 'google_calendar',
  provider_event_id text unique,
  conference_id text unique,
  join_url text,
  meeting_status text not null default 'pending' check (meeting_status in ('pending', 'creating', 'ready', 'failed')),
  email_status text not null default 'pending' check (email_status in ('pending', 'sending', 'sent', 'failed')),
  meeting_attempts integer not null default 0 check (meeting_attempts >= 0),
  email_attempts integer not null default 0 check (email_attempts >= 0),
  last_error_code text,
  last_error_at timestamptz,
  email_sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================================
-- 10. private_session_outbox
-- ============================================================================
create table if not exists public.private_session_outbox (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.sessions_booking(id) on delete cascade,
  job_type text not null check (job_type in ('create_meeting', 'send_confirmation_email')),
  deduplication_key text not null unique,
  status text not null default 'pending' check (status in ('pending', 'processing', 'completed', 'failed')),
  available_at timestamptz not null default now(),
  locked_at timestamptz,
  locked_by text,
  attempt_count integer not null default 0 check (attempt_count >= 0),
  max_attempts integer not null default 5 check (max_attempts > 0),
  last_error_code text,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists private_session_outbox_queue_idx
  on public.private_session_outbox (status, available_at)
  where (status in ('pending', 'failed'));

-- ============================================================================
-- 11. private_session_audit_events
-- ============================================================================
create table if not exists public.private_session_audit_events (
  id uuid primary key default gen_random_uuid(),
  actor_type text not null check (actor_type in ('system', 'learner', 'admin', 'provider')),
  actor_id uuid references auth.users(id) on delete set null,
  entity_type text not null,
  entity_id uuid not null,
  action text not null,
  before_state jsonb,
  after_state jsonb,
  correlation_id text,
  created_at timestamptz not null default now()
);

create index if not exists private_session_audit_events_entity_idx
  on public.private_session_audit_events (entity_type, entity_id);

create index if not exists private_session_audit_events_correlation_idx
  on public.private_session_audit_events (correlation_id);

-- ============================================================================
-- Append-only triggers
-- ============================================================================
create or replace function public.prevent_append_only_mutation()
returns trigger
language plpgsql
as $$
begin
  raise exception 'Table % is append-only; update and delete operations are prohibited', TG_TABLE_NAME;
end;
$$;

drop trigger if exists session_credit_ledger_append_only on public.session_credit_ledger;
create trigger session_credit_ledger_append_only
  before update or delete on public.session_credit_ledger
  for each row execute function public.prevent_append_only_mutation();

drop trigger if exists private_session_audit_events_append_only on public.private_session_audit_events;
create trigger private_session_audit_events_append_only
  before update or delete on public.private_session_audit_events
  for each row execute function public.prevent_append_only_mutation();

-- ============================================================================
-- Updated-at triggers
-- ============================================================================
create or replace trigger set_private_session_hosts_updated_at
  before update on public.private_session_hosts
  for each row execute function public.set_updated_at();

create or replace trigger set_private_session_offers_updated_at
  before update on public.private_session_offers
  for each row execute function public.set_updated_at();

create or replace trigger set_private_session_slots_updated_at
  before update on public.private_session_slots
  for each row execute function public.set_updated_at();

create or replace trigger set_session_payment_attempts_updated_at
  before update on public.session_payment_attempts
  for each row execute function public.set_updated_at();

create or replace trigger set_session_entitlements_updated_at
  before update on public.session_entitlements
  for each row execute function public.set_updated_at();

create or replace trigger set_sessions_booking_updated_at
  before update on public.sessions_booking
  for each row execute function public.set_updated_at();

create or replace trigger set_private_session_meetings_updated_at
  before update on public.private_session_meetings
  for each row execute function public.set_updated_at();

-- ============================================================================
-- Seed data: CASC Academy offers and default host
-- ============================================================================
do $$
declare
  v_course_id uuid;
  v_admin_id uuid;
begin
  select id into v_course_id from public.courses where slug = 'casc-academy';

  if v_course_id is not null then
    -- 1. Seed CASC Offers
    insert into public.private_session_offers (
      course_id, code, kind, session_count, price_minor, currency, title_en, title_ar, is_active
    )
    values
      (v_course_id, 'direct', 'direct', 1, 250000, 'EGP', '1-on-1 Practice Session', 'جلسة تدريب فردية', true),
      (v_course_id, 'package_5', 'package', 5, 1125000, 'EGP', '5 Sessions Package', 'باقة 5 جلسات', true),
      (v_course_id, 'package_10', 'package', 10, 2000000, 'EGP', '10 Sessions Package', 'باقة 10 جلسات', true)
    on conflict (course_id, code) do update set
      price_minor = excluded.price_minor,
      currency = excluded.currency,
      title_en = excluded.title_en,
      title_ar = excluded.title_ar,
      is_active = excluded.is_active;

    -- 2. Seed v1 Host linked to an existing admin profile (if any exists)
    select id into v_admin_id from public.profiles where role = 'admin' order by created_at asc limit 1;
    if v_admin_id is not null then
      insert into public.private_session_hosts (
        profile_id, display_name, timezone, google_calendar_id, is_active
      )
      values (
        v_admin_id, 'Dr. CASC Lead Instructor', 'Africa/Cairo', 'casc-host-calendar@group.calendar.google.com', true
      )
      on conflict (profile_id) do nothing;
    end if;
  end if;
end $$;
