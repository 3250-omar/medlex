-- Migration: Clear all private session slots and their associated bookings
-- Date: 2026-09-16
-- Description: Safely deletes all private session slots and their dependent bookings,
-- meetings, and outbox jobs, without deleting user profiles or accounts.
-- Also cleans up related booking ledger entries and slot payment attempts.

-- 1. Temporarily disable user triggers on append-only session_credit_ledger
ALTER TABLE public.session_credit_ledger DISABLE TRIGGER USER;

-- 2. Delete consumed/restored credit ledger rows tied to bookings (avoids reason_booking_check violation)
DELETE FROM public.session_credit_ledger
WHERE booking_id IS NOT NULL;

-- 3. Restore entitlement remaining quantities for learners whose booking credits were consumed
UPDATE public.session_entitlements
SET consumed_quantity = 0,
    reserved_quantity = 0,
    remaining_quantity = purchased_quantity
WHERE consumed_quantity > 0 OR reserved_quantity > 0;

-- 4. Re-enable user triggers on session_credit_ledger
ALTER TABLE public.session_credit_ledger ENABLE TRIGGER USER;

-- 5. Delete meeting delivery records and queued outbox jobs referencing bookings
DELETE FROM public.private_session_outbox;
DELETE FROM public.private_session_meetings;

-- 6. Delete all session bookings (leaves user profiles and accounts completely untouched)
DELETE FROM public.sessions_booking;

-- 7. Unlink webhook events referencing direct slot payment attempts
UPDATE public.session_payment_webhook_events
SET attempt_id = NULL
WHERE attempt_id IN (
    SELECT id FROM public.session_payment_attempts WHERE slot_id IS NOT NULL
);

-- 8. Delete direct payment attempts associated with the slots
DELETE FROM public.session_payment_attempts
WHERE slot_id IS NOT NULL;

-- 9. Empty the private_session_slots table completely
DELETE FROM public.private_session_slots;
