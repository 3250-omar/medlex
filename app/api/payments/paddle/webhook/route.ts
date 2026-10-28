import { NextRequest, NextResponse } from "next/server";
import { getPaddleWebhookSecret } from "@/lib/payments/config";
import { getPaddleClient } from "@/lib/payments/paddle/server";
import { toPrivateSessionPaddleWebhook } from "@/lib/payments/paddle/webhooks";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email/transport";
import {
  generateAdminNewSubscriptionEmail,
  generateUserCourseWelcomeEmail,
  type CourseSubscriptionEmailParams,
} from "@/lib/email/course-subscription-notification";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type WebhookProcessResult = {
  outcome: "processed" | "duplicate" | "rejected";
};

type PaddleWebhookRpcClient = {
  rpc: (
    name: string,
    args: Record<string, unknown>,
  ) => Promise<{
    data: WebhookProcessResult[] | null;
    error: { message: string } | null;
  }>;
};

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "paddle-webhook",
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request: NextRequest) {
  const signature = request.headers.get("paddle-signature");
  if (!signature) {
    return NextResponse.json(
      { error: "Missing Paddle signature" },
      { status: 400 },
    );
  }

  const rawBody = await request.text();
  if (!rawBody) {
    return NextResponse.json({ error: "Empty request body" }, { status: 400 });
  }

  try {
    const event = await getPaddleClient().webhooks.unmarshal(
      rawBody,
      getPaddleWebhookSecret(),
      signature,
    );
    const webhook = toPrivateSessionPaddleWebhook(event, rawBody);

    // A verified event outside Medlex payment flows is deliberately
    // acknowledged without changing local access.
    if (
      !webhook ||
      (webhook.source !== "medlex_private_sessions" &&
        webhook.source !== "medlex_course")
    ) {
      return NextResponse.json({ received: true, ignored: true });
    }

    const admin = createAdminClient();
    const rpcName =
      webhook.source === "medlex_course"
        ? "process_paddle_course_webhook"
        : "process_paddle_private_session_webhook";
    const { data, error } = await (
      admin as unknown as PaddleWebhookRpcClient
    ).rpc(rpcName, {
      p_provider_event_id: webhook.eventId,
      p_provider_transaction_id: webhook.transactionId,
      p_event_type: webhook.eventType,
      p_payload_hash: webhook.payloadHash,
      p_custom_payment_attempt_id: webhook.paymentAttemptId,
      p_is_success: webhook.isSuccess,
      p_failure_code: webhook.failureCode,
    });

    if (error) {
      console.error("Paddle webhook persistence failed", {
        eventId: webhook.eventId,
        transactionId: webhook.transactionId,
        message: error.message,
      });
      return NextResponse.json(
        {
          error: "Webhook processing failed",
          detail: error.message,
        },
        { status: 500 },
      );
    }

    // ---------------------------------------------------------------
    // Fire-and-forget: send subscription notification emails
    // after a successful *course* payment.  We never block the 200
    // response to Paddle — email failures are logged, not re-thrown.
    // ---------------------------------------------------------------
    const result = (data as WebhookProcessResult[] | null)?.[0];

    if (
      webhook.source === "medlex_course" &&
      webhook.isSuccess &&
      webhook.paymentAttemptId &&
      result?.outcome === "processed"
    ) {
      sendCourseSubscriptionEmails(admin, webhook.paymentAttemptId).catch(
        (err) => {
          console.error(
            "[Webhook Email] Failed to send subscription emails",
            err instanceof Error ? err.message : err,
          );
        },
      );
    }

    return NextResponse.json({
      received: true,
      outcome: result?.outcome ?? "processed",
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Webhook verification failed";
    console.warn("Rejected Paddle webhook", { message });
    return NextResponse.json(
      { error: "Invalid Paddle webhook" },
      { status: 400 },
    );
  }
}

// ---------------------------------------------------------------------------
// Send admin + user emails for a newly-completed course subscription.
// Called fire-and-forget so it never blocks the webhook response.
// ---------------------------------------------------------------------------
async function sendCourseSubscriptionEmails(
  admin: ReturnType<typeof createAdminClient>,
  paymentAttemptId: string,
) {
  // Type alias — course_payment_attempts is not in the generated Supabase
  // schema types, so we cast to any (same pattern as the checkout route).
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = admin as any;

  // 1. Load the payment attempt → course + user info
  const { data: attempt, error: attemptErr } = await db
    .from("course_payment_attempts")
    .select("user_id, course_id, amount_minor, currency")
    .eq("id", paymentAttemptId)
    .maybeSingle();

  if (attemptErr || !attempt) {
    console.warn(
      `[Webhook Email] Could not load payment attempt ${paymentAttemptId}`,
    );
    return;
  }

  // 2. Fetch course title + slug
  const { data: course } = await db
    .from("courses")
    .select("title_en, slug")
    .eq("id", attempt.course_id)
    .maybeSingle();

  // 3. Fetch user profile + auth email
  const { data: profile } = await db
    .from("profiles")
    .select("full_name")
    .eq("id", attempt.user_id)
    .maybeSingle();

  const { data: authData } = await admin.auth.admin.getUserById(
    attempt.user_id,
  );
  const userEmail = authData?.user?.email;

  if (!userEmail) {
    console.warn(`[Webhook Email] No email found for user ${attempt.user_id}`);
    return;
  }

  const userName = profile?.full_name || "Colleague";
  const courseTitle = course?.title_en || "CASC Academy Course";
  const courseSlug = course?.slug || "casc-academy";
  const amountMajor = (Number(attempt.amount_minor) / 100).toFixed(2);
  const currencySymbol =
    String(attempt.currency).toUpperCase() === "GBP"
      ? "£"
      : String(attempt.currency).toUpperCase() === "EUR"
        ? "€"
        : String(attempt.currency).toUpperCase() === "EGP"
          ? "EGP "
          : `${String(attempt.currency).toUpperCase()} `;
  const amountFormatted = `${currencySymbol}${amountMajor}`;
  const enrolledAt = new Date();

  const emailParams: CourseSubscriptionEmailParams = {
    userName,
    userEmail,
    courseTitle,
    courseSlug,
    amountFormatted,
    enrolledAt,
  };

  // 4. Build email content
  const adminEmail = generateAdminNewSubscriptionEmail(emailParams);
  const userWelcome = generateUserCourseWelcomeEmail(emailParams);

  const adminRecipient =
    process.env.CONTACT_RECIPIENT_EMAIL || "info@medlexsolutions.com";

  // 5. Send both emails in parallel — log failures individually
  const [adminResult, userResult] = await Promise.allSettled([
    sendEmail({
      to: adminRecipient,
      subject: adminEmail.subject,
      html: adminEmail.html,
      text: adminEmail.text,
    }),
    sendEmail({
      to: userEmail,
      subject: userWelcome.subject,
      html: userWelcome.html,
      text: userWelcome.text,
    }),
  ]);

  if (
    adminResult.status === "rejected" ||
    (adminResult.status === "fulfilled" && !adminResult.value.success)
  ) {
    console.error(
      `[Webhook Email] Admin notification failed`,
      adminResult.status === "rejected"
        ? adminResult.reason
        : adminResult.value.error,
    );
  }

  if (
    userResult.status === "rejected" ||
    (userResult.status === "fulfilled" && !userResult.value.success)
  ) {
    console.error(
      `[Webhook Email] User welcome email failed for ${userEmail}`,
      userResult.status === "rejected"
        ? userResult.reason
        : userResult.value.error,
    );
  }

  console.log(
    `[Webhook Email] Subscription emails dispatched for ${userName} (${userEmail}) — course: ${courseTitle}`,
  );
}
