import { NextRequest, NextResponse } from "next/server";
import { getPaddleWebhookSecret } from "@/lib/payments/config";
import { getPaddleClient } from "@/lib/payments/paddle/server";
import { toPrivateSessionPaddleWebhook } from "@/lib/payments/paddle/webhooks";
import { createAdminClient } from "@/lib/supabase/admin";

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
    const { data, error } = await (admin as unknown as PaddleWebhookRpcClient).rpc(
      rpcName,
      {
        p_provider_event_id: webhook.eventId,
        p_provider_transaction_id: webhook.transactionId,
        p_event_type: webhook.eventType,
        p_payload_hash: webhook.payloadHash,
        p_custom_payment_attempt_id: webhook.paymentAttemptId,
        p_is_success: webhook.isSuccess,
        p_failure_code: webhook.failureCode,
      },
    );

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

    const result = (data as WebhookProcessResult[] | null)?.[0];
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
