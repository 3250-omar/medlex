import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { bookingRedemptionSchema } from "@/lib/private-sessions/schemas";
import {
  getCorrelationId,
  getIdempotencyKey,
  validationError,
  conflictError,
  internalError,
  authenticateAndRequireVerifiedUser,
} from "@/lib/private-sessions/http";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const correlationId = getCorrelationId(req);

  // 1. Validate Idempotency-Key
  const idempotencyKey = getIdempotencyKey(req);
  if (!idempotencyKey) {
    return validationError(
      "Missing or invalid Idempotency-Key header (must be 16-128 characters)",
      undefined,
      correlationId
    );
  }

  // 2. Parse and validate body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return validationError("Invalid JSON request body", undefined, correlationId);
  }

  const validation = bookingRedemptionSchema.safeParse(body);
  if (!validation.success) {
    return validationError(
      "Invalid booking redemption request payload",
      validation.error.flatten().fieldErrors,
      correlationId
    );
  }

  const { entitlementId, slotId } = validation.data;

  try {
    const supabase = await createClient();

    // 3. Authenticate and require email verification
    const authResult = await authenticateAndRequireVerifiedUser(supabase, correlationId);
    if (!authResult.success) {
      return authResult.response;
    }

    // 4. Call redeem_private_session_credit RPC
    const { data: bookingData, error: redeemError } = await supabase.rpc(
      "redeem_private_session_credit",
      {
        p_slot_id: slotId,
        p_entitlement_id: entitlementId,
        p_idempotency_key: idempotencyKey,
      }
    );

    if (redeemError) {
      const msg = redeemError.message.toLowerCase();

      if (msg.includes("cutoff") || msg.includes("no longer available") || msg.includes("in advance")) {
        return conflictError(
          "This slot is no longer available or falls within the 24-hour cutoff. Please choose another slot.",
          "SLOT_NOT_AVAILABLE",
          correlationId
        );
      }

      if (msg.includes("no remaining session credits") || msg.includes("balance")) {
        return conflictError(
          "No remaining session credits available in this package.",
          "NO_CREDITS_REMAINING",
          correlationId
        );
      }

      if (msg.includes("own this package")) {
        return NextResponse.json(
          { error: "Forbidden: You do not own this package entitlement", correlationId },
          { status: 403 }
        );
      }

      return internalError(redeemError.message, correlationId);
    }

    const booking = Array.isArray(bookingData) ? bookingData[0] : bookingData;

    return NextResponse.json(
      {
        data: {
          bookingId: booking.id,
          slotId: booking.slot_id,
          status: booking.status,
          startsAt: booking.starts_at,
          endsAt: booking.ends_at,
          fundingType: "package_credit",
        },
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error redeeming session credit";
    return internalError(message, correlationId);
  }
}
