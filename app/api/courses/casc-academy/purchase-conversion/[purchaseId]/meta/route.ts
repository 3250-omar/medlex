import { NextRequest, NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { createClient } from "@/lib/supabase/server";
import { GET as getPurchase } from "../route";

export const runtime = "nodejs";

type Context = { params: Promise<{ purchaseId: string }> };

export async function POST(request: NextRequest, context: Context) {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const token = process.env.META_CAPI_ACCESS_TOKEN;
  if (!pixelId || !/^\d+$/.test(pixelId) || !token) {
    return NextResponse.json(
      { error: "Meta tracking unavailable" },
      { status: 503 },
    );
  }
  const body = (await request.json().catch(() => null)) as {
    consent?: boolean;
    fbp?: string;
    fbc?: string;
  } | null;
  if (body?.consent !== true)
    return NextResponse.json({ error: "Consent required" }, { status: 403 });

  // Reuse the authenticated, Paddle-verified purchase response.
  const verified = await getPurchase(request, context);
  if (!verified.ok) return verified;
  const purchase = (await verified.json()) as {
    status: string;
    transaction_id?: string;
    value?: number;
    currency?: string;
  };
  if (
    purchase.status !== "paid" ||
    !purchase.transaction_id ||
    typeof purchase.value !== "number" ||
    !purchase.currency
  ) {
    return NextResponse.json({ error: "Purchase not paid" }, { status: 409 });
  }
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const email = user?.email?.trim().toLowerCase();
  const userData: Record<string, string> = {};
  if (email) userData.em = createHash("sha256").update(email).digest("hex");
  if (body.fbp && /^fb\.1\.\d+\.[A-Za-z0-9]+$/.test(body.fbp))
    userData.fbp = body.fbp;
  if (body.fbc && /^fb\.1\.\d+\.[A-Za-z0-9_-]+$/.test(body.fbc))
    userData.fbc = body.fbc;
  const agent = request.headers.get("user-agent");
  if (agent) userData.client_user_agent = agent;

  const { purchaseId } = await context.params;
  const payload = {
    data: [
      {
        event_name: "Purchase",
        event_time: Math.floor(Date.now() / 1000),
        event_id: `casc-${purchaseId}`,
        action_source: "website",
        event_source_url: new URL("/en/pathways/casc-academy", process.env.APP_ORIGIN || "https://medlexsolutions.com").toString(),
        user_data: userData,
        custom_data: {
          value: purchase.value,
          currency: purchase.currency,
          content_ids: ["casc-academy"],
          content_type: "product",
        },
      },
    ],
    ...(process.env.META_TEST_EVENT_CODE
      ? { test_event_code: process.env.META_TEST_EVENT_CODE }
      : {}),
    access_token: token,
  };
  try {
    const response = await fetch(
      `https://graph.facebook.com/v27.0/${pixelId}/events`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        cache: "no-store",
        signal: AbortSignal.timeout(5000),
      },
    );
    if (!response.ok) {
      console.error("Meta CAPI rejected Purchase", { status: response.status });
      return NextResponse.json(
        { error: "Meta delivery failed" },
        { status: 502 },
      );
    }
    return NextResponse.json({ sent: true });
  } catch {
    return NextResponse.json(
      { error: "Meta delivery failed" },
      { status: 502 },
    );
  }
}
