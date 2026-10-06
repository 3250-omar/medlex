import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("courses")
    .select(
      "id, slug, title_en, title_ar, description_en, description_ar, features_en, features_ar, course_status, currency, price, access_duration_days, points_on_completion, is_published, created_at",
    )
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: "Unable to load courses" },
      { status: 500 },
    );
  }

  // Get country code from headers (Vercel provides x-vercel-ip-country, Cloudflare provides cf-ipcountry)
  const countryCode = (
    req.headers.get("x-user-country") ||
    req.headers.get("x-vercel-ip-country") ||
    req.headers.get("cf-ipcountry") ||
    "EG"
  ).toUpperCase();

  // Load country specific prices
  const courseIds = (data || []).map((c) => c.id);
  let countryPriceMap = new Map<string, { price: number; currency: string }>();

  if (courseIds.length > 0) {
    // Exact match
    const { data: exactPrices } = await supabase
      .from("course_country_prices")
      .select("course_id, price, currency")
      .in("course_id", courseIds)
      .eq("country_code", countryCode)
      .eq("is_active", true);

    if (exactPrices && exactPrices.length > 0) {
      countryPriceMap = new Map(exactPrices.map((p) => [p.course_id, p]));
    }

    // Fallback to __OTHER__
    const missingCourseIds = courseIds.filter((id) => !countryPriceMap.has(id));
    if (missingCourseIds.length > 0) {
      const { data: otherPrices } = await supabase
        .from("course_country_prices")
        .select("course_id, price, currency")
        .in("course_id", missingCourseIds)
        .eq("country_code", "__OTHER__")
        .eq("is_active", true);

      if (otherPrices) {
        for (const p of otherPrices) {
          if (!countryPriceMap.has(p.course_id)) {
            countryPriceMap.set(p.course_id, p);
          }
        }
      }
    }
  }

  // Check if user is authenticated to attach their booked private sessions
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const bookingsByCourseId: Record<
    string,
    Array<{
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
    }>
  > = {};

  if (user) {
    const nowIso = new Date().toISOString();
    const { data: bookingsData } = await supabase
      .from("sessions_booking")
      .select(
        "id, course_id, starts_at, ends_at, status, session_link, funding_type",
      )
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

    // Apply country specific price if available
    const countryPrice = countryPriceMap.get(course.id);
    const finalPrice = countryPrice?.price ?? course.price;
    const finalCurrency = countryPrice?.currency ?? course.currency;

    return {
      ...course,
      price: finalPrice,
      currency: finalCurrency,
      privateSessions: courseBookings,
    };
  });

  return NextResponse.json({ data: courses });
}
