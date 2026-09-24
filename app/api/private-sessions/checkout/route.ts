import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkoutRequestSchema } from "@/lib/private-sessions/schemas";
import {
  getCorrelationId,
  getIdempotencyKey,
  validationError,
  conflictError,
  internalError,
  authenticateAndRequireVerifiedUser,
} from "@/lib/private-sessions/http";
// TODO: Re-import paymentAdapter once Paymob payment integration is enabled
// import { paymentAdapter } from "@/lib/private-sessions/payment";
import { fulfillBookingImmediately } from "@/lib/private-sessions/fulfillment";

export async function POST(req: NextRequest) {
  const correlationId = getCorrelationId(req);

  // 1. Validate Idempotency-Key header
  const idempotencyKey = getIdempotencyKey(req);
  if (!idempotencyKey) {
    return validationError(
      "Missing or invalid Idempotency-Key header (must be 16-128 characters)",
      undefined,
      correlationId,
    );
  }

  // 2. Parse and validate request body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return validationError(
      "Invalid JSON request body",
      undefined,
      correlationId,
    );
  }

  const validation = checkoutRequestSchema.safeParse(body);
  if (!validation.success) {
    return validationError(
      "Invalid checkout request payload",
      validation.error.flatten().fieldErrors,
      correlationId,
    );
  }

  const payload = validation.data;

  try {
    const supabase = await createClient();

    // 3. Authenticate and require verified email
    const authResult = await authenticateAndRequireVerifiedUser(
      supabase,
      correlationId,
    );
    if (!authResult.success) {
      return authResult.response;
    }
    const { user } = authResult;

    const origin = process.env.APP_ORIGIN || "http://localhost:3000";
    const returnUrl = `${origin}/pathways/casc-academy?oneToOne=open`;
    const admin = createAdminClient();

    // Resolve country code from middleware-injected header
    const countryCode = (
      req.headers.get("x-user-country") || "EG"
    ).toUpperCase();

    if (payload.mode === "direct") {
      // Direct session booking checkout
      const { data: holdData, error: holdError } = await supabase.rpc(
        "create_direct_session_hold",
        {
          p_slot_id: payload.slotId,
          p_course_slug: payload.courseSlug,
          p_idempotency_key: idempotencyKey,
          p_country_code: countryCode,
        },
      );

      if (holdError) {
        // Map eligibility/conflict errors to 409
        if (
          holdError.message.includes("cutoff") ||
          holdError.message.includes("unavailable") ||
          holdError.message.includes("not eligible")
        ) {
          return conflictError(
            "This slot is no longer eligible or has been reserved by another learner. Please select another slot.",
            "SLOT_NOT_AVAILABLE",
            correlationId,
          );
        }
        return internalError(holdError.message, correlationId);
      } 

      const hold = Array.isArray(holdData) ? holdData[0] : holdData;
      if (!hold || !hold.payment_attempt_id) {
        return conflictError(
          "Could not reserve slot. Please select another available time.",
          "HOLD_FAILED",
          correlationId,
        );
      }

      // TODO: Add Paymob payment integration soon. Currently disabled for direct session subscription without routing to payment page.
      /*
      // Create Hosted Checkout intention via Paymob adapter
      const intention = await paymentAdapter.createPaymentIntention({
        amountMinor: hold.amount_minor,
        currency: hold.currency,
        purchaseId: hold.payment_attempt_id,
        idempotencyKey,
        learner: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
        },
        returnUrl,
      });

      return NextResponse.json(
        {
          data: {
            purchaseId: hold.payment_attempt_id,
            status: "pending",
            checkoutUrl: intention.checkoutUrl,
            holdExpiresAt: hold.hold_expires_at,
          },
        },
        { status: 201 }
      );
      */

      // Directly confirm the session subscription without external payment routing
      type GenericRpc = (
        fn: string,
        args: Record<string, unknown>,
      ) => Promise<{ data: unknown; error: { message: string } | null }>;
      const rpc = admin.rpc.bind(admin) as unknown as GenericRpc;

      const { error: confirmError } = await rpc(
        "confirm_direct_session_payment",
        {
          p_payment_attempt_id: hold.payment_attempt_id,
          p_provider_order_id: `direct-order-${Date.now()}`,
          p_provider_transaction_id: `direct-tx-${Date.now()}`,
        },
      );

      if (confirmError) {
        return internalError(confirmError.message, correlationId);
      }

      // Directly fulfill Google Meet creation for this booking immediately
      const { data: bookingRow } = await admin
        .from("sessions_booking")
        .select("id, session_link")
        .eq("payment_attempt_id", hold.payment_attempt_id)
        .maybeSingle();

      let sessionLink: string | null = bookingRow?.session_link || null;
      if (bookingRow?.id && !sessionLink) {
        try {
          sessionLink = await fulfillBookingImmediately(bookingRow.id);
        } catch (fErr) {
          console.error("[Checkout Immediate Fulfillment Error]", fErr);
        }
      }

      return NextResponse.json(
        {
          data: {
            purchaseId: hold.payment_attempt_id,
            status: "paid",
            checkoutUrl: returnUrl,
            holdExpiresAt: hold.hold_expires_at,
            sessionLink: sessionLink,
          },
        },
        { status: 201 },
      );
    } else {
      // Package checkout
      // Resolve package offer
      const { data: offer, error: offerError } = await admin
        .from("private_session_offers")
        .select("id, course_id, code, session_count, price_minor, currency")
        .eq("id", payload.offerId)
        .eq("is_active", true)
        .single();

      if (
        offerError ||
        !offer ||
        (offer.code !== "package_5" && offer.code !== "package_10")
      ) {
        return validationError(
          "Invalid or inactive package offer selected",
          undefined,
          correlationId,
        );
      }

      // Resolve country-specific price for the package offer
      let resolvedPriceMinor = offer.price_minor;
      let resolvedCurrency = offer.currency;

      const { data: countryPriceRow } = await admin
        .from("offer_country_prices")
        .select("price_minor, currency")
        .eq("offer_id", offer.id)
        .eq("country_code", countryCode)
        .eq("is_active", true)
        .maybeSingle();

      if (countryPriceRow) {
        resolvedPriceMinor = countryPriceRow.price_minor;
        resolvedCurrency = countryPriceRow.currency;
      } else {
        // Try __OTHER__ fallback
        const { data: otherPriceRow } = await admin
          .from("offer_country_prices")
          .select("price_minor, currency")
          .eq("offer_id", offer.id)
          .eq("country_code", "__OTHER__")
          .eq("is_active", true)
          .maybeSingle();

        if (otherPriceRow) {
          resolvedPriceMinor = otherPriceRow.price_minor;
          resolvedCurrency = otherPriceRow.currency;
        }
      }

      // Create package payment attempt
      const attemptId = crypto.randomUUID();
      const { data: attempt, error: attemptError } = await admin
        .from("session_payment_attempts")
        .insert({
          id: attemptId,
          idempotency_key: idempotencyKey,
          user_id: user.id,
          course_id: offer.course_id,
          offer_id: offer.id,
          purpose: "package",
          slot_id: null,
          quantity_snapshot: offer.session_count,
          amount_minor: resolvedPriceMinor,
          currency: resolvedCurrency,
          provider: "paymob",
          status: "pending",
          hold_expires_at: null,
        })
        .select("id, amount_minor, currency")
        .single();

      if (attemptError || !attempt) {
        return conflictError(
          "A transaction with this idempotency key already exists",
          "IDEMPOTENCY_CONFLICT",
          correlationId,
        );
      }

      // TODO: Add Paymob payment integration soon. Currently disabled for direct package subscription without routing to payment page.
      /*
      const intention = await paymentAdapter.createPaymentIntention({
        amountMinor: attempt.amount_minor,
        currency: attempt.currency,
        purchaseId: attempt.id,
        idempotencyKey,
        learner: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
        },
        returnUrl,
      });

      return NextResponse.json(
        {
          data: {
            purchaseId: attempt.id,
            status: "pending",
            checkoutUrl: intention.checkoutUrl,
            holdExpiresAt: null,
          },
        },
        { status: 201 }
      );
      */

      // Directly grant the package subscription credits without external payment routing
      type GenericRpc = (
        fn: string,
        args: Record<string, unknown>,
      ) => Promise<{ data: unknown; error: { message: string } | null }>;
      const rpc = admin.rpc.bind(admin) as unknown as GenericRpc;

      const { error: grantError } = await rpc("grant_private_session_package", {
        p_payment_attempt_id: attempt.id,
        p_provider_order_id: `pkg-order-${Date.now()}`,
        p_provider_transaction_id: `pkg-tx-${Date.now()}`,
      });

      if (grantError) {
        return internalError(grantError.message, correlationId);
      }

      return NextResponse.json(
        {
          data: {
            purchaseId: attempt.id,
            status: "paid",
            checkoutUrl: returnUrl,
            holdExpiresAt: null,
          },
        },
        { status: 201 },
      );
    }
  } catch {
    return internalError("Error creating checkout intention", correlationId);
  }
}
