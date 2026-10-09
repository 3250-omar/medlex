import { NextResponse, type NextRequest } from "next/server";
import { ApiError } from "@paddle/paddle-node-sdk";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isPaddlePaymentsEnabled } from "@/lib/payments/config";
import { toPaddleCurrency } from "@/lib/payments/paddle/currencies";
import { getPaddleCheckoutUrl } from "@/lib/payments/paddle/transactions";
import { createCoursePaddleTransaction } from "@/lib/courses/paddle";
import { resolvePrivateSessionPrice } from "@/lib/private-sessions/pricing";
import {
  authenticateAndRequireVerifiedUser,
  conflictError,
  errorResponse,
  getCorrelationId,
  getIdempotencyKey,
  internalError,
  notFoundError,
  validationError,
} from "@/lib/private-sessions/http";

export const dynamic = "force-dynamic";

type CoursePriceRow = {
  resolved_price: number | string;
  resolved_currency: string;
};
type CheckoutBody = { sessionCount?: unknown };

function countryCode(req: NextRequest) {
  const value =
    req.headers.get("x-vercel-ip-country") ?? req.headers.get("cf-ipcountry");
  return value && /^[A-Za-z]{2}$/.test(value) ? value.toUpperCase() : "EG";
}

function sessionCountFrom(body: CheckoutBody): number | null {
  const value = body.sessionCount ?? 0;
  return typeof value === "number" &&
    Number.isInteger(value) &&
    value >= 0 &&
    value <= 20
    ? value
    : null;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const correlationId = getCorrelationId(req);
  if (!isPaddlePaymentsEnabled()) {
    return errorResponse({
      status: 503,
      code: "PAYMENTS_TEMPORARILY_DISABLED",
      message: "Paid checkout is temporarily unavailable.",
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

  const body = (await req.json().catch(() => ({}))) as CheckoutBody;
  const sessionCount = sessionCountFrom(body);
  if (sessionCount === null) {
    return validationError(
      "sessionCount must be a whole number between 0 and 20.",
      undefined,
      correlationId,
    );
  }

  const { slug } = await params;
  const supabase = await createClient();
  const auth = await authenticateAndRequireVerifiedUser(
    supabase,
    correlationId,
  );
  if (!auth.success) return auth.response;

  // Course releases are intentionally hidden from unenrolled learners by RLS.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const admin: any = createAdminClient();
  const { data: course, error: courseError } = await supabase
    .from("courses")
    .select(
      "id, slug, title_en, price, currency, access_duration_days, is_published",
    )
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  if (courseError)
    return internalError(
      "Could not load course checkout details.",
      correlationId,
    );
  if (!course) return notFoundError("Course not found.", correlationId);

  const { data: release } = await admin
    .from("course_releases")
    .select("id")
    .eq("course_id", course.id)
    .eq("status", "published")
    .order("version_number", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!release)
    return conflictError(
      "This course is not ready for enrolment.",
      "COURSE_UNAVAILABLE",
      correlationId,
    );

  const coursePricing = supabase as unknown as {
    rpc: (
      name: string,
      args: Record<string, unknown>,
    ) => Promise<{ data: CoursePriceRow[] | null }>;
  };
  const { data: resolved } = await coursePricing.rpc(
    "resolve_course_country_price",
    {
      p_course_id: course.id,
      p_country_code: countryCode(req),
    },
  );
  const priceRow = Array.isArray(resolved) ? resolved[0] : resolved;
  const courseAmountMinor = Math.round(
    Number(priceRow?.resolved_price ?? course.price) * 100,
  );
  if (!Number.isSafeInteger(courseAmountMinor) || courseAmountMinor <= 0) {
    return conflictError(
      "This course does not currently have a paid checkout price.",
      "COURSE_PRICE_UNAVAILABLE",
      correlationId,
    );
  }

  let currency;
  try {
    currency = toPaddleCurrency(
      String(priceRow?.resolved_currency ?? course.currency).toUpperCase(),
    );
  } catch {
    return errorResponse({
      status: 422,
      code: "PADDLE_UNSUPPORTED_CURRENCY",
      message: "This course currency is not available for Paddle checkout.",
      correlationId,
    });
  }

  let sessionOfferId: string | null = null;
  let sessionAmountMinor = 0;
  let sessionTitle: string | null = null;
  if (sessionCount > 0) {
    const offerCode =
      sessionCount === 5
        ? "package_5"
        : sessionCount === 10
          ? "package_10"
          : "direct";
    const { data: offer } = await admin
      .from("private_session_offers")
      .select("id")
      .eq("course_id", course.id)
      .eq("code", offerCode)
      .eq("is_active", true)
      .maybeSingle();
    if (!offer)
      return conflictError(
        "The selected private coaching option is unavailable.",
        "SESSION_OFFER_UNAVAILABLE",
        correlationId,
      );

    try {
      const sessionPrice = await resolvePrivateSessionPrice({
        supabase,
        courseSlug: course.slug,
        offerId: offer.id,
        mode: offerCode === "direct" ? "direct" : "package",
        countryCode: countryCode(req),
      });
      if (sessionPrice.currency !== currency) {
        return conflictError(
          "Course and private coaching must use the same currency for a combined checkout.",
          "SESSION_CURRENCY_MISMATCH",
          correlationId,
        );
      }
      sessionOfferId = sessionPrice.offerId;
      sessionAmountMinor =
        sessionPrice.amountMinor * (offerCode === "direct" ? sessionCount : 1);
      sessionTitle = `${sessionCount} private coaching ${sessionCount === 1 ? "session" : "sessions"}`;
    } catch {
      return conflictError(
        "The selected private coaching option is unavailable.",
        "SESSION_OFFER_UNAVAILABLE",
        correlationId,
      );
    }
  }

  const amountMinor = courseAmountMinor + sessionAmountMinor;
  let { data: attempt } = await admin
    .from("course_payment_attempts")
    .select("id, provider_transaction_id, provider_creation_claim_id, status")
    .eq("user_id", auth.user.id)
    .eq("idempotency_key", idempotencyKey)
    .maybeSingle();
  if (!attempt) {
    const { data, error } = await admin
      .from("course_payment_attempts")
      .insert({
        idempotency_key: idempotencyKey,
        user_id: auth.user.id,
        course_id: course.id,
        release_id: release.id,
        amount_minor: amountMinor,
        currency,
        access_duration_days: course.access_duration_days,
        session_offer_id: sessionOfferId,
        session_quantity: sessionCount,
        session_amount_minor: sessionAmountMinor,
        provider: "paddle",
        status: "created",
      })
      .select("id, provider_transaction_id, provider_creation_claim_id, status")
      .single();
    if (error || !data)
      return internalError("Could not prepare course payment.", correlationId);
    attempt = data;
  }

  if (attempt.provider_transaction_id) {
    const checkoutUrl = await getPaddleCheckoutUrl(
      attempt.provider_transaction_id,
    );
    return NextResponse.json({
      data: {
        purchaseId: attempt.id,
        transactionId: attempt.provider_transaction_id,
        checkoutUrl,
        status: attempt.status,
      },
    });
  }

  const claimId = crypto.randomUUID();
  const { data: claimed } = await admin
    .from("course_payment_attempts")
    .update({
      provider_creation_claim_id: claimId,
      provider_creation_claimed_at: new Date().toISOString(),
      status: "pending",
    })
    .eq("id", attempt.id)
    .is("provider_transaction_id", null)
    .is("provider_creation_claim_id", null)
    .select("id")
    .maybeSingle();
  if (!claimed)
    return errorResponse({
      status: 409,
      code: "CHECKOUT_INITIALIZING",
      message: "Your checkout is being prepared. Please try again shortly.",
      correlationId,
    });

  try {
    const paddle = await createCoursePaddleTransaction({
      attemptId: attempt.id,
      courseId: course.id,
      courseSlug: course.slug,
      title: course.title_en,
      amountMinor: courseAmountMinor,
      currency,
      session: sessionOfferId
        ? {
            title: sessionTitle || "Private coaching",
            amountMinor: sessionAmountMinor,
          }
        : null,
    });
    const { error } = await admin
      .from("course_payment_attempts")
      .update({ provider_transaction_id: paddle.transactionId })
      .eq("id", attempt.id)
      .eq("provider_creation_claim_id", claimId);
    if (error)
      return errorResponse({
        status: 503,
        code: "PADDLE_TRANSACTION_PENDING_RECONCILIATION",
        message: "Your checkout is being reconciled. Please try again shortly.",
        correlationId,
      });
    return NextResponse.json(
      {
        data: {
          purchaseId: attempt.id,
          transactionId: paddle.transactionId,
          checkoutUrl: paddle.checkoutUrl,
          status: "pending",
        },
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof ApiError) {
      console.error("Paddle transaction creation rejected", {
        correlationId,
        message: error.message,
        error,
      });
      await admin
        .from("course_payment_attempts")
        .update({
          status: "failed",
          failure_code: "PADDLE_TRANSACTION_CREATE_FAILED",
        })
        .eq("id", attempt.id)
        .eq("provider_creation_claim_id", claimId);
      return errorResponse({
        status: 422,
        code: "PADDLE_TRANSACTION_REJECTED",
        message: "Paddle could not create this checkout. Please try again.",
        correlationId,
      });
    }
    return internalError(
      "Could not initialize Paddle checkout.",
      correlationId,
    );
  }
}
