import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("courses")
    .select("id, slug, title_en, title_ar, description_en, description_ar, price, access_duration_days, points_on_completion, is_published, created_at")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "Unable to load courses" }, { status: 500 });
  }

  // Check if user is authenticated to attach their booked private sessions
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const bookingsByCourseId: Record<string, Array<{
    id: string;
    courseSlug: string;
    startsAt: string;
    endsAt: string;
    status: string;
    fundingType: string;
    joinUrl: string | null;
    sessionLink: string | null;
    meetingStatus: string;
    emailStatus: string;
  }>> = {};

  if (user) {
    const nowIso = new Date().toISOString();
    const { data: bookingsData } = await supabase
      .from("sessions_booking")
      .select("id, course_id, starts_at, ends_at, status, session_link, funding_type")
      .eq("user_id", user.id)
      .gt("starts_at", nowIso)
      .in("status", [
        "pending_payment",
        "confirmed",
        "fulfillment_pending",
        "ready",
      ])
      .order("starts_at", { ascending: true });

    if (bookingsData && bookingsData.length > 0) {
      const bookingIds = bookingsData.map((b) => b.id);
      const { data: meetingsData } = await supabase
        .from("private_session_meetings")
        .select("booking_id, meeting_status, email_status, join_url")
        .in("booking_id", bookingIds);

      const meetingsMap = new Map(
        (meetingsData || []).map((m) => [m.booking_id, m]),
      );

      for (const b of bookingsData) {
        const cid = b.course_id;
        if (!cid) continue;
        if (!bookingsByCourseId[cid]) {
          bookingsByCourseId[cid] = [];
        }
        const m = meetingsMap.get(b.id);
        bookingsByCourseId[cid].push({
          id: b.id,
          courseSlug: "", // Will be filled below
          startsAt: b.starts_at,
          endsAt: b.ends_at,
          status: b.status,
          fundingType: b.funding_type,
          joinUrl: m?.join_url || b.session_link || null,
          sessionLink: b.session_link || m?.join_url || null,
          meetingStatus: m?.meeting_status || "pending",
          emailStatus: m?.email_status || "pending",
        });
      }
    }
  }

  const courses = (data || []).map((course) => {
    const courseBookings = (bookingsByCourseId[course.id] || []).map((b) => ({
      ...b,
      courseSlug: course.slug,
    }));
    return {
      ...course,
      privateSessions: courseBookings,
    };
  });

  return NextResponse.json({ data: courses });
}
