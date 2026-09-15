import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatCairoDateTime } from "@/lib/private-sessions/time";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ purchaseId: string }> },
) {
  try {
    const { purchaseId } = await params;

    // 1. Authenticate learner using the shared server client (uses correct env vars)
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Fetch purchase attempt owned by learner
    const adminClient = createAdminClient();
    const { data: attempt, error: attemptErr } = await adminClient
      .from("session_payment_attempts")
      .select(
        "id, purpose, status, quantity_snapshot, amount_minor, currency, failure_code, failure_detail, paid_at, created_at, slot_id",
      )
      .eq("id", purchaseId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (attemptErr || !attempt) {
      return NextResponse.json(
        { error: "Purchase not found" },
        { status: 404 },
      );
    }

    // 3. If direct session, check booking and fulfillment
    let bookingData = null;
    if (attempt.purpose === "direct") {
      const { data: booking } = await adminClient
        .from("sessions_booking")
        .select(
          `id, status, session_link, starts_at, ends_at,
           host:private_session_hosts ( display_name ),
           meeting:private_session_meetings ( meeting_status, email_status, join_url )`,
        )
        .eq("payment_attempt_id", attempt.id)
        .maybeSingle();

      if (booking) {
        const timeFormatted = formatCairoDateTime(booking.starts_at);
        const m = Array.isArray(booking.meeting)
          ? booking.meeting[0]
          : booking.meeting;
        const h = Array.isArray(booking.host) ? booking.host[0] : booking.host;

        bookingData = {
          id: booking.id,
          status: booking.status,
          sessionLink: booking.session_link || m?.join_url || null,
          meetingStatus: m?.meeting_status || "pending",
          emailStatus: m?.email_status || "pending",
          cairoDate: timeFormatted,
          cairoTime: timeFormatted,
          hostDisplayName:
            (h as { display_name?: string } | null)?.display_name ||
            "Instructor",
        };
      }
    }

    // 4. If package, check entitlement
    let entitlementData = null;
    if (attempt.purpose === "package") {
      const { data: entitlement } = await adminClient
        .from("session_entitlements")
        .select(
          "id, purchased_quantity, reserved_quantity, consumed_quantity, remaining_quantity, status",
        )
        .eq("payment_attempt_id", attempt.id)
        .maybeSingle();

      if (entitlement) {
        entitlementData = {
          id: entitlement.id,
          purchasedQuantity: entitlement.purchased_quantity,
          reservedQuantity: entitlement.reserved_quantity,
          consumedQuantity: entitlement.consumed_quantity,
          remainingQuantity: entitlement.remaining_quantity,
          status: entitlement.status,
        };
      }
    }

    // Derive fulfillment status from booking / entitlement state
    let fulfillmentStatus: "not_applicable" | "pending" | "ready" | "failed" = "not_applicable";
    if (attempt.status === "paid") {
      if (bookingData) {
        fulfillmentStatus =
          bookingData.meetingStatus === "created" ? "ready" :
          bookingData.meetingStatus === "failed" ? "failed" : "pending";
      } else if (entitlementData) {
        fulfillmentStatus = "ready";
      } else {
        fulfillmentStatus = "pending";
      }
    }

    return NextResponse.json(
      {
        data: {
          purchaseId: attempt.id,
          purpose: attempt.purpose,
          status: attempt.status,
          fulfillmentStatus,
          amountMinor: attempt.amount_minor,
          currency: attempt.currency,
          failureCode: attempt.failure_code,
          paidAt: attempt.paid_at,
          booking: bookingData,
          entitlement: entitlementData,
        },
      },
      {
        status: 200,
        headers: { "Cache-Control": "no-store, must-revalidate" },
      },
    );
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
