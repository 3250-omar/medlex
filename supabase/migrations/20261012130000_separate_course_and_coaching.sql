-- Migration: Separate course online subscription and private coaching
-- Course subscription is standalone via Paddle (session_quantity = 0, session_offer_id is null, session_amount_minor = 0).
-- 1-on-1 private coaching sessions are separate and will be offered via a dedicated scheduling & payment provider.

-- 1. Ensure private session offers for CASC Academy bundled checkout are marked inactive.
update public.private_session_offers
set is_active = false
where code in ('direct', 'package_5', 'package_10')
  and course_id in (select id from public.courses where slug = 'casc-academy');

-- 2. Validate course_payment_attempts check constraint allows standalone course checkout (session_quantity = 0).
-- Note: Already enforced by course_payment_attempts_session_snapshot_check in 20261007153000:
-- (session_quantity = 0 and session_offer_id is null and session_amount_minor = 0)
