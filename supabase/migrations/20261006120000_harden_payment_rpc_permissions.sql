-- Restrict payment confirmation, entitlement grants, reconciliation, and
-- background-worker controls to the trusted service role. These SECURITY
-- DEFINER functions must never be callable from browser-facing roles.

revoke all on function public.confirm_direct_session_payment(uuid, text, text)
  from public, anon, authenticated;
grant execute on function public.confirm_direct_session_payment(uuid, text, text)
  to service_role;

revoke all on function public.grant_private_session_package(uuid, text, text)
  from public, anon, authenticated;
grant execute on function public.grant_private_session_package(uuid, text, text)
  to service_role;

revoke all on function public.reconcile_payment_attempt(uuid, text, text, boolean, text, text)
  from public, anon, authenticated;
grant execute on function public.reconcile_payment_attempt(uuid, text, text, boolean, text, text)
  to service_role;

revoke all on function public.expire_direct_session_hold(uuid)
  from public, anon, authenticated;
grant execute on function public.expire_direct_session_hold(uuid)
  to service_role;

revoke all on function public.claim_outbox_batch(text, integer, integer)
  from public, anon, authenticated;
grant execute on function public.claim_outbox_batch(text, integer, integer)
  to service_role;

revoke all on function public.complete_outbox_job(uuid)
  from public, anon, authenticated;
grant execute on function public.complete_outbox_job(uuid)
  to service_role;

revoke all on function public.fail_outbox_job(uuid, text)
  from public, anon, authenticated;
grant execute on function public.fail_outbox_job(uuid, text)
  to service_role;

-- The current four-argument hold function is intentionally available only to
-- authenticated learners. Remove access to the obsolete three-argument
-- overload left behind when country-aware pricing was introduced.
revoke all on function public.create_direct_session_hold(uuid, text, text)
  from public, anon, authenticated;

revoke all on function public.create_direct_session_hold(uuid, text, text, text)
  from public, anon, authenticated;
grant execute on function public.create_direct_session_hold(uuid, text, text, text)
  to authenticated;

revoke all on function public.redeem_private_session_credit(uuid, uuid, text)
  from public, anon, authenticated;
grant execute on function public.redeem_private_session_credit(uuid, uuid, text)
  to authenticated;
