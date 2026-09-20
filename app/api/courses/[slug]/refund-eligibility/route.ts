import { NextResponse, type NextRequest } from "next/server";
import { createRouteClient } from "@/lib/supabase/route";

const NOINDEX_ROBOTS_HEADER = {
  "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet, noimageindex",
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const { response, supabase } = await createRouteClient(request);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "authentication_required" },
      { status: 401, headers: NOINDEX_ROBOTS_HEADER },
    );
  }

  // 1. Try RPC get_course_refund_eligibility
  try {
    const { data: rpcData, error: rpcError } = await (supabase as any).rpc(
      "get_course_refund_eligibility",
      {
        p_user_id: user.id,
        p_course_slug: slug,
      },
    );

    if (!rpcError && rpcData) {
      const res = NextResponse.json({ data: rpcData }, { headers: NOINDEX_ROBOTS_HEADER });
      response.cookies.getAll().forEach((c) => res.cookies.set(c.name, c.value, c));
      return res;
    }
  } catch (rpcEx) {
    console.warn("[Refund Eligibility] RPC fallback to direct query:", rpcEx);
  }

  // 2. Direct fallback query
  try {
    const { data: course } = await (supabase as any)
      .from("courses")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (!course) {
      return NextResponse.json(
        { error: "course_not_found" },
        { status: 404, headers: NOINDEX_ROBOTS_HEADER },
      );
    }

    const { data: enrollment } = await (supabase as any)
      .from("enrollments")
      .select(`
        id,
        enrolled_at,
        status,
        cancellation_waiver_accepted,
        cancellation_waiver_accepted_at,
        cancellation_waiver_text
      `)
      .eq("user_id", user.id)
      .eq("course_id", course.id)
      .order("enrolled_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!enrollment) {
      return NextResponse.json(
        {
          data: {
            enrolled: false,
            isRefundEligible: false,
            reason: "No enrollment record found for this account.",
          },
        },
        { headers: NOINDEX_ROBOTS_HEADER },
      );
    }

    const enrolledAt = new Date(enrollment.enrolled_at);
    const now = new Date();
    const daysElapsed = Math.floor(
      (now.getTime() - enrolledAt.getTime()) / (1000 * 60 * 60 * 24),
    );
    const isWithin14Days = daysElapsed <= 14;

    // Count Exam Mode completions
    const { data: examProgress } = await (supabase as any)
      .from("unit_progress")
      .select("unit_id")
      .eq("enrollment_id", enrollment.id)
      .eq("exam_completed", true);

    const examModeCompletions = examProgress?.length || 0;

    const { data: totalProgress } = await (supabase as any)
      .from("unit_progress")
      .select("unit_id")
      .eq("enrollment_id", enrollment.id)
      .eq("status", "completed");

    const completedStationsCount = totalProgress?.length || 0;

    let isRefundEligible = false;
    let reason = "";

    if (!enrollment.cancellation_waiver_accepted) {
      isRefundEligible = isWithin14Days;
      reason = isWithin14Days
        ? "Statutory 14-day cancellation applies."
        : "Statutory 14-day cancellation window has expired.";
    } else {
      if (!isWithin14Days) {
        isRefundEligible = false;
        reason = `Refund window expired (${daysElapsed} days since purchase, max allowed: 14 days).`;
      } else if (examModeCompletions > 3) {
        isRefundEligible = false;
        reason = `Completed ${examModeCompletions} stations in Exam Mode (maximum allowed for refund is 3 stations).`;
      } else {
        isRefundEligible = true;
        reason = `Eligible for refund: ${daysElapsed} days since purchase, ${examModeCompletions} Exam Mode completions (limit is 3).`;
      }
    }

    const res = NextResponse.json(
      {
        data: {
          enrolled: true,
          enrollmentId: enrollment.id,
          enrolledAt: enrollment.enrolled_at,
          daysElapsed,
          isWithin14Days,
          examModeCompletions,
          maxAllowedExamCompletions: 3,
          completedStationsCount,
          cancellationWaiverAccepted: !!enrollment.cancellation_waiver_accepted,
          cancellationWaiverAcceptedAt: enrollment.cancellation_waiver_accepted_at,
          cancellationWaiverText: enrollment.cancellation_waiver_text,
          isRefundEligible,
          reason,
        },
      },
      { headers: NOINDEX_ROBOTS_HEADER },
    );

    response.cookies.getAll().forEach((c) => res.cookies.set(c.name, c.value, c));
    return res;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "server_error";
    return NextResponse.json(
      { error: message },
      { status: 500, headers: NOINDEX_ROBOTS_HEADER },
    );
  }
}
