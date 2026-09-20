import { NextResponse, type NextRequest } from "next/server";
import { createRouteClient } from "@/lib/supabase/route";

type SubscriptionResult = {
  enrollmentId: string;
  releaseId: string;
  firstUnitSlug: string | null;
};

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const { response, supabase } = await createRouteClient(request);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json(
      { error: "authentication_required" },
      { status: 401 },
    );

  let body: { waiverAccepted?: boolean; waiverText?: string } = {};
  try {
    body = await request.json();
  } catch {
    // Body is optional for backward compatibility
  }

  const client = supabase as unknown as {
    rpc: (
      name: string,
      args: Record<string, string>,
    ) => Promise<{
      data: SubscriptionResult | null;
      error: { message: string } | null;
    }>;
  };
  const { data, error } = await client.rpc("subscribe_to_free_course", {
    target_course_slug: slug,
  });
  if (error || !data) {
    const isAlreadySubscribed =
      error?.message?.includes("already_subscribed") ||
      error?.message?.includes("23505") ||
      error?.message?.includes("enrollments_user_course_unique");
    const status = error?.message.includes("payment_required")
      ? 402
      : isAlreadySubscribed
        ? 409
        : 400;
    const res = NextResponse.json(
      {
        error: isAlreadySubscribed
          ? "already_subscribed"
          : (error?.message ?? "Unable to subscribe."),
        message: isAlreadySubscribed
          ? "You are already subscribed to this course."
          : undefined,
      },
      { status },
    );
    response.cookies.getAll().forEach((cookie) => {
      res.cookies.set(cookie.name, cookie.value, cookie);
    });
    return res;
  }

  // If cancellation waiver was accepted, record it with audit timestamp and client details
  if (data?.enrollmentId && body.waiverAccepted) {
    const nowIso = new Date().toISOString();
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ipAddress = forwardedFor
      ? forwardedFor.split(",")[0].trim()
      : request.headers.get("x-real-ip") || null;
    const userAgent = request.headers.get("user-agent") || null;
    const effectiveWaiverText =
      body.waiverText ||
      "I want immediate access and understand that I lose my statutory 14-day cancellation right, subject to MedLex's 14-day refund policy.";

    try {
      // 1. Update the enrollment record
      await (supabase as any)
        .from("enrollments")
        .update({
          cancellation_waiver_accepted: true,
          cancellation_waiver_accepted_at: nowIso,
          cancellation_waiver_text: effectiveWaiverText,
          cancellation_waiver_ip: ipAddress,
          cancellation_waiver_user_agent: userAgent,
        })
        .eq("id", data.enrollmentId);

      // 2. Insert into dedicated permanent cancellation_waivers audit log table
      await (supabase as any).from("cancellation_waivers").insert({
        user_id: user.id,
        enrollment_id: data.enrollmentId,
        course_slug: slug,
        waiver_text: effectiveWaiverText,
        accepted: true,
        accepted_at: nowIso,
        ip_address: ipAddress,
        user_agent: userAgent,
        metadata: {
          source: "checkout_dialog",
        },
      });
    } catch (auditErr) {
      console.error(
        "[Subscription] Failed to persist waiver audit log:",
        auditErr,
      );
    }
  }

  const res = NextResponse.json({ data });
  response.cookies.getAll().forEach((cookie) => {
    res.cookies.set(cookie.name, cookie.value, cookie);
  });
  return res;
}
