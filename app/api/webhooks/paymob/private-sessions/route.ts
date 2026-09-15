import { NextResponse, type NextRequest } from "next/server";
import crypto from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { paymentAdapter } from "@/lib/private-sessions/payment";

export async function POST(req: NextRequest) {
  // 1. Read unmodified raw body text
  const rawBody = await req.text();
  const hmacHeader =
    req.headers.get("hmac") || req.nextUrl.searchParams.get("hmac") || "";

  // 2. Compute payload sha256 hash for durable record
  const payloadHash = crypto.createHash("sha256").update(rawBody).digest("hex");

  // 3. Verify HMAC signature: reject invalid HMAC with 401
  const isVerified = paymentAdapter.verifyWebhookHmac(rawBody, hmacHeader);
  if (!isVerified) {
    return NextResponse.json(
      { error: "HMAC verification failed" },
      { status: 401 },
    );
  }

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const obj = ((payload.obj as Record<string, unknown>) || payload) as Record<
    string,
    unknown
  >;
  const providerTransactionId = String(obj.id || "");
  const orderObj = obj.order as Record<string, unknown> | undefined;
  const providerOrderId = String(orderObj?.id || obj.order_id || "");
  const providerEventId = String(
    payload.type
      ? `${payload.type}-${providerTransactionId}`
      : providerTransactionId || payloadHash,
  );

  const purchaseId = String(
    obj.special_reference ||
      obj.merchant_order_id ||
      orderObj?.merchant_order_id ||
      "",
  );

  const isSuccess = Boolean(obj.success === true || obj.success === "true");

  const admin = createAdminClient();

  // 4. Durably record webhook event before dispatch
  const { data: existingEvent } = await admin
    .from("session_payment_webhook_events")
    .select("id, processing_status")
    .eq("provider_event_id", providerEventId)
    .maybeSingle();

  if (existingEvent && existingEvent.processing_status === "processed") {
    // Return idempotent 200 success for duplicates
    return NextResponse.json({ status: "already_processed" }, { status: 200 });
  }

  // Persist receipt event
  await admin.from("session_payment_webhook_events").upsert(
    {
      provider_event_id: providerEventId,
      provider_transaction_id: providerTransactionId || null,
      payload_hash: payloadHash,
      verified: isVerified,
      processing_status: "received",
      error_detail: null,
    },
    { onConflict: "provider_event_id" },
  );

  if (!purchaseId) {
    return NextResponse.json(
      { status: "ignored_no_reference" },
      { status: 200 },
    );
  }

  try {
    // 5. Transactional reconciliation with forward-only state machine & paid_unfulfilled mapping
    const objData = obj.data as Record<string, unknown> | undefined;
    const failureCode = isSuccess
      ? null
      : String(objData?.message || "TRANSACTION_FAILED");
    const failureDetail = isSuccess ? null : JSON.stringify(obj.data || {});

    type RpcFn = (
      name: string,
      args: Record<string, unknown>,
    ) => Promise<{ data: string | null; error: { message: string } | null }>;
    const { data: reconcileResult, error: rpcErr } = await (
      admin.rpc as unknown as RpcFn
    )("reconcile_payment_attempt", {
      p_attempt_id: purchaseId,
      p_provider_transaction_id: providerTransactionId || null,
      p_provider_order_id: providerOrderId || null,
      p_is_success: isSuccess,
      p_failure_code: failureCode,
      p_failure_detail: failureDetail,
    });

    if (rpcErr) {
      await admin
        .from("session_payment_webhook_events")
        .update({
          processing_status: "failed",
          error_detail: rpcErr.message,
          attempt_id: purchaseId,
        })
        .eq("provider_event_id", providerEventId);

      return NextResponse.json(
        { status: "error", message: rpcErr.message },
        { status: 200 },
      );
    }

    // Mark webhook processed
    await admin
      .from("session_payment_webhook_events")
      .update({
        processing_status: "processed",
        processed_at: new Date().toISOString(),
        attempt_id: purchaseId,
      })
      .eq("provider_event_id", providerEventId);

    return NextResponse.json(
      {
        status: "processed",
        result: reconcileResult,
      },
      { status: 200 },
    );
  } catch (err: unknown) {
    const errorMsg =
      err instanceof Error ? err.message : "Webhook processing failure";
    await admin
      .from("session_payment_webhook_events")
      .update({
        processing_status: "failed",
        error_detail: errorMsg,
      })
      .eq("provider_event_id", providerEventId);

    return NextResponse.json(
      { status: "error", error: errorMsg },
      { status: 200 },
    );
  }
}
