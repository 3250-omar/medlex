import { ApiError } from "@paddle/paddle-node-sdk";
import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { isPaddlePaymentsEnabled } from "@/lib/payments/config";
import {
  createPrivateSessionPaddleTransaction,
  getPaddleCheckoutUrl,
} from "@/lib/payments/paddle/transactions";
import { toPaddleCurrency } from "@/lib/payments/paddle/currencies";
import {
  PrivateSessionPricingError,
  resolvePrivateSessionPrice,
} from "@/lib/private-sessions/pricing";
import { checkoutRequestSchema } from "@/lib/private-sessions/schemas";
import {
  authenticateAndRequireVerifiedUser,
  conflictError,
  errorResponse,
  getCorrelationId,
  getIdempotencyKey,
  internalError,
  validationError,
} from "@/lib/private-sessions/http";

export const dynamic = "force-dynamic";

type PaymentSnapshot = {
  payment_attempt_id: string;
  amount_minor: number;
  currency: string;
  hold_expires_at: string | null;
};

function getTrustedCountryCode(req: NextRequest): string {
  const countryCode =
    req.headers.get("x-vercel-ip-country") ?? req.headers.get("cf-ipcountry");
  return countryCode && /^[A-Za-z]{2}$/.test(countryCode)
    ? countryCode.toUpperCase()
    : "EG";
}

function mapCheckoutRpcError(message: string, correlationId: string) {
  const normalized = message.toLowerCase();

  if (normalized.includes("unsupported paddle currency")) {
    return errorResponse({
      status: 422,
      code: "PADDLE_UNSUPPORTED_CURRENCY",
      message: "This offer currency is not available for Paddle checkout.",
      correlationId,
    });
  }

  if (
    normalized.includes("cutoff") ||
    normalized.includes("unavailable") ||
    normalized.includes("not eligible")
  ) {
    return conflictError(
      "This slot is no longer eligible or has been reserved by another learner.",
      "SLOT_NOT_AVAILABLE",
      correlationId,
    );
  }

  if (normalized.includes("idempotency key")) {
    return conflictError(
      "This checkout request conflicts with an existing request.",
      "IDEMPOTENCY_CONFLICT",
      correlationId,
    );
  }

  return internalError(
    "Could not prepare the payment checkout.",
    correlationId,
  );
}

export async function POST(req: NextRequest) {
  const correlationId = getCorrelationId(req);

  if (!isPaddlePaymentsEnabled()) {
    return errorResponse({
      status: 503,
      code: "PAYMENTS_TEMPORARILY_DISABLED",
      message:
        "Paid checkout is temporarily unavailable while secure Paddle processing is being configured.",
      correlationId,
    });
  }

  const idempotencyKey = getIdempotencyKey(req);
  if (!idempotencyKey) {
    return validationError(
      "Missing or invalid Idempotency-Key header (must be 16-128 characters)",
      undefined,
      correlationId,
    );
  }

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
    const authResult = await authenticateAndRequireVerifiedUser(
      supabase,
      correlationId,
    );
    if (!authResult.success) {
      return authResult.response;
    }

    const countryCode = getTrustedCountryCode(req);
    const currentPrice = await resolvePrivateSessionPrice({
      supabase,
      courseSlug: payload.courseSlug,
      offerId: payload.offerId,
      mode: payload.mode,
      countryCode,
    });

    let snapshot: PaymentSnapshot;
    if (payload.mode === "direct") {
      const { data, error } = await supabase.rpc(
        "create_paddle_direct_session_hold",
        {
          p_slot_id: payload.slotId,
          p_course_slug: payload.courseSlug,
          p_idempotency_key: idempotencyKey,
          p_country_code: countryCode,
        },
      );

      if (error) {
        return mapCheckoutRpcError(error.message, correlationId);
      }

      const hold = Array.isArray(data) ? data[0] : data;
      if (!hold?.payment_attempt_id) {
        return conflictError(
          "Could not reserve this slot. Please choose another time.",
          "HOLD_FAILED",
          correlationId,
        );
      }

      snapshot = {
        payment_attempt_id: hold.payment_attempt_id,
        amount_minor: hold.amount_minor,
        currency: hold.currency,
        hold_expires_at: hold.hold_expires_at,
      };
    } else {
      const { data, error } = await supabase.rpc(
        "create_paddle_package_payment_attempt",
        {
          p_course_slug: payload.courseSlug,
          p_offer_id: payload.offerId,
          p_idempotency_key: idempotencyKey,
          p_country_code: countryCode,
        },
      );

      if (error) {
        return mapCheckoutRpcError(error.message, correlationId);
      }

      const attempt = Array.isArray(data) ? data[0] : data;
      if (!attempt?.payment_attempt_id) {
        return internalError(
          "Could not create a payment attempt.",
          correlationId,
        );
      }

      snapshot = {
        payment_attempt_id: attempt.payment_attempt_id,
        amount_minor: attempt.amount_minor,
        currency: attempt.currency,
        hold_expires_at: null,
      };
    }

    let snapshotCurrency;
    try {
      snapshotCurrency = toPaddleCurrency(snapshot.currency);
    } catch {
      return errorResponse({
        status: 422,
        code: "PADDLE_UNSUPPORTED_CURRENCY",
        message: "This offer currency is not available for Paddle checkout.",
        correlationId,
      });
    }

    const snapshotPrice = {
      ...currentPrice,
      amountMinor: snapshot.amount_minor,
      currency: snapshotCurrency,
    };

    const admin = createAdminClient();
    const claimId = crypto.randomUUID();
    const { data: claimedAttempt, error: claimError } = await admin
      .from("session_payment_attempts")
      .update({
        provider_creation_claim_id: claimId,
        provider_creation_claimed_at: new Date().toISOString(),
        status: "pending",
      })
      .eq("id", snapshot.payment_attempt_id)
      .eq("user_id", authResult.user.id)
      .eq("provider", "paddle")
      .is("provider_transaction_id", null)
      .is("provider_creation_claim_id", null)
      .in("status", ["created", "pending"])
      .select("id")
      .maybeSingle();

    if (claimError) {
      return internalError(
        "Could not initialize Paddle checkout.",
        correlationId,
      );
    }

    if (!claimedAttempt) {
      const { data: existingAttempt, error: existingAttemptError } = await admin
        .from("session_payment_attempts")
        .select(
          "provider_transaction_id, provider_creation_claim_id, status, hold_expires_at",
        )
        .eq("id", snapshot.payment_attempt_id)
        .eq("user_id", authResult.user.id)
        .maybeSingle();

      if (existingAttemptError || !existingAttempt) {
        return internalError(
          "Could not recover the payment attempt.",
          correlationId,
        );
      }

      if (existingAttempt.provider_transaction_id) {
        try {
          const checkoutUrl = await getPaddleCheckoutUrl(
            existingAttempt.provider_transaction_id,
          );
          return NextResponse.json(
            {
              data: {
                purchaseId: snapshot.payment_attempt_id,
                transactionId: existingAttempt.provider_transaction_id,
                status: "pending",
                checkoutUrl,
                holdExpiresAt: existingAttempt.hold_expires_at,
              },
            },
            { status: 200 },
          );
        } catch {
          return errorResponse({
            status: 503,
            code: "PADDLE_CHECKOUT_UNAVAILABLE",
            message:
              "Your payment checkout is being prepared. Please try again shortly.",
            correlationId,
          });
        }
      }

      if (existingAttempt.status === "failed") {
        return errorResponse({
          status: 422,
          code: "PADDLE_TRANSACTION_REJECTED",
          message:
            "Paddle could not create this checkout. Please start a new payment attempt.",
          correlationId,
        });
      }

      return errorResponse({
        status: 409,
        code: "CHECKOUT_INITIALIZING",
        message:
          "Your payment checkout is being prepared. Please try again shortly.",
        correlationId,
      });
    }

    try {
      const paddleTransaction = await createPrivateSessionPaddleTransaction({
        price: snapshotPrice,
        paymentAttemptId: snapshot.payment_attempt_id,
      });

      const { error: persistError } = await admin
        .from("session_payment_attempts")
        .update({ provider_transaction_id: paddleTransaction.transactionId })
        .eq("id", snapshot.payment_attempt_id)
        .eq("user_id", authResult.user.id)
        .eq("provider_creation_claim_id", claimId);

      if (persistError) {
        return errorResponse({
          status: 503,
          code: "PADDLE_TRANSACTION_PENDING_RECONCILIATION",
          message:
            "Your payment checkout is being reconciled. Please try again shortly.",
          correlationId,
        });
      }

      return NextResponse.json(
        {
          data: {
            purchaseId: snapshot.payment_attempt_id,
            transactionId: paddleTransaction.transactionId,
            status: "pending",
            checkoutUrl: paddleTransaction.checkoutUrl,
            holdExpiresAt: snapshot.hold_expires_at,
          },
        },
        { status: 201 },
      );
    } catch (error) {
      if (error instanceof ApiError) {
        await admin
          .from("session_payment_attempts")
          .update({
            status: "failed",
            failure_code: "PADDLE_TRANSACTION_CREATE_FAILED",
            failure_detail: error.code.slice(0, 250),
          })
          .eq("id", snapshot.payment_attempt_id)
          .eq("user_id", authResult.user.id)
          .eq("provider_creation_claim_id", claimId);

        return errorResponse({
          status: 422,
          code: "PADDLE_TRANSACTION_REJECTED",
          message:
            "Paddle could not create this checkout. Please review the selected offer.",
          correlationId,
        });
      }

      return errorResponse({
        status: 503,
        code: "PADDLE_TRANSACTION_PENDING_RECONCILIATION",
        message:
          "Your payment checkout is being reconciled. Please try again shortly.",
        correlationId,
      });
    }
  } catch (error) {
    if (error instanceof PrivateSessionPricingError) {
      return errorResponse({
        status: error.code === "UNSUPPORTED_CURRENCY" ? 422 : 409,
        code: error.code,
        message: error.message,
        correlationId,
      });
    }

    return internalError("Error creating Paddle checkout.", correlationId);
  }
}
