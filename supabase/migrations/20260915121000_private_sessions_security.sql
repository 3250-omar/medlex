-- Migration: 20260915121000_private_sessions_security.sql
-- Description: Row Level Security policies, role permissions, and access controls for private session tables.

-- ============================================================================
-- Enable RLS on all private session tables
-- ============================================================================
alter table public.private_session_hosts enable row level security;
alter table public.private_session_offers enable row level security;
alter table public.private_session_slots enable row level security;
alter table public.session_payment_attempts enable row level security;
alter table public.session_payment_webhook_events enable row level security;
alter table public.session_entitlements enable row level security;
alter table public.session_credit_ledger enable row level security;
alter table public.sessions_booking enable row level security;
alter table public.private_session_meetings enable row level security;
alter table public.private_session_outbox enable row level security;
alter table public.private_session_audit_events enable row level security;

-- ============================================================================
-- 1. private_session_hosts policies
-- ============================================================================
create policy "anyone can view active hosts"
  on public.private_session_hosts
  for select
  using (is_active = true);

create policy "admins can manage hosts"
  on public.private_session_hosts
  for all
  using (private.is_admin(auth.uid()))
  with check (private.is_admin(auth.uid()));

-- ============================================================================
-- 2. private_session_offers policies
-- ============================================================================
create policy "anyone can view active offers"
  on public.private_session_offers
  for select
  using (is_active = true);

create policy "admins can manage offers"
  on public.private_session_offers
  for all
  using (private.is_admin(auth.uid()))
  with check (private.is_admin(auth.uid()));

-- ============================================================================
-- 3. private_session_slots policies
-- ============================================================================
create policy "learners can view eligible slots"
  on public.private_session_slots
  for select
  using (
    status = 'available'
    and starts_at > now() + interval '24 hours'
  );

create policy "admins can manage slots"
  on public.private_session_slots
  for all
  using (private.is_admin(auth.uid()))
  with check (private.is_admin(auth.uid()));

-- ============================================================================
-- 4. session_payment_attempts policies
-- ============================================================================
create policy "learners can view own payment attempts"
  on public.session_payment_attempts
  for select
  using (auth.uid() = user_id);

create policy "admins can view all payment attempts"
  on public.session_payment_attempts
  for select
  using (private.is_admin(auth.uid()));

-- Note: Inserts and updates are restricted to SECURITY DEFINER functions and service_role.

-- ============================================================================
-- 5. session_payment_webhook_events policies
-- ============================================================================
create policy "admins can view webhook events"
  on public.session_payment_webhook_events
  for select
  using (private.is_admin(auth.uid()));

-- Note: Webhook ingestion is executed via service_role.

-- ============================================================================
-- 6. session_entitlements policies
-- ============================================================================
create policy "learners can view own entitlements"
  on public.session_entitlements
  for select
  using (auth.uid() = user_id);

create policy "admins can view all entitlements"
  on public.session_entitlements
  for select
  using (private.is_admin(auth.uid()));

-- Note: Grants and balance adjustments are restricted to SECURITY DEFINER functions and service_role.

-- ============================================================================
-- 7. session_credit_ledger policies
-- ============================================================================
create policy "learners can view own credit ledger entries"
  on public.session_credit_ledger
  for select
  using (
    exists (
      select 1 from public.session_entitlements e
      where e.id = session_credit_ledger.entitlement_id
        and e.user_id = auth.uid()
    )
  );

create policy "admins can view all credit ledger entries"
  on public.session_credit_ledger
  for select
  using (private.is_admin(auth.uid()));

-- Note: Inserts occur only via SECURITY DEFINER functions; updates and deletes are prohibited by trigger.

-- ============================================================================
-- 8. sessions_booking policies
-- ============================================================================
create policy "learners can view own bookings"
  on public.sessions_booking
  for select
  using (auth.uid() = user_id);

create policy "admins can view and manage bookings"
  on public.sessions_booking
  for all
  using (private.is_admin(auth.uid()))
  with check (private.is_admin(auth.uid()));

-- Note: Direct booking creation is handled exclusively through SECURITY DEFINER workflows.

-- ============================================================================
-- 9. private_session_meetings policies
-- ============================================================================
create policy "learners can view meetings for own bookings"
  on public.private_session_meetings
  for select
  using (
    exists (
      select 1 from public.sessions_booking b
      where b.id = private_session_meetings.booking_id
        and b.user_id = auth.uid()
    )
  );

create policy "admins can view and manage meetings"
  on public.private_session_meetings
  for all
  using (private.is_admin(auth.uid()))
  with check (private.is_admin(auth.uid()));

-- ============================================================================
-- 10. private_session_outbox policies
-- ============================================================================
create policy "admins can view outbox entries"
  on public.private_session_outbox
  for select
  using (private.is_admin(auth.uid()));

-- Note: Outbox workers operate with service_role.

-- ============================================================================
-- 11. private_session_audit_events policies
-- ============================================================================
create policy "admins can view audit events"
  on public.private_session_audit_events
  for select
  using (private.is_admin(auth.uid()));

-- Note: Direct updates and deletes are blocked by append-only trigger.
