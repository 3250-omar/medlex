import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sessionContextQuerySchema } from "@/lib/private-sessions/schemas";
import {
  getCorrelationId,
  validationError,
  internalError,
} from "@/lib/private-sessions/http";

export async function GET(req: NextRequest) {
  const correlationId = getCorrelationId(req);
  const searchParams = req.nextUrl.searchParams;
  const courseSlugParam = searchParams.get("courseSlug") ?? "casc-academy";

  const validation = sessionContextQuerySchema.safeParse({
    courseSlug: courseSlugParam,
  });
  if (!validation.success) {
    return validationError(
      "Invalid course slug parameter",
      validation.error.flatten().fieldErrors,
      correlationId,
    );
  }

  try {
    const supabase = await createClient();

    // 1. Fetch course ID with explicit column selection
    const { data: course, error: courseError } = await supabase
      .from("courses")
      .select("id, slug")
      .eq("slug", validation.data.courseSlug)
      .maybeSingle();

    if (courseError || !course) {
      return validationError("Course not found", undefined, correlationId);
    }

    // 2. Fetch active offers with explicit column selection
    const { data: offersData, error: offersError } = await supabase
      .from("private_session_offers")
      .select(
        "id, code, kind, session_count, price_minor, currency, title_en, title_ar, is_active",
      )
      .eq("course_id", course.id)
      .eq("is_active", true)
      .order("session_count", { ascending: true });

    if (offersError) {
      return internalError("Failed to fetch session offers", correlationId);
    }

    // 3. Resolve country-specific prices
    const countryCode = (
      req.headers.get("x-user-country") || "EG"
    ).toUpperCase();

    const offerIds = (offersData || []).map((o) => o.id);
    let countryPriceMap = new Map<
      string,
      { price_minor: number; currency: string }
    >();

    if (offerIds.length > 0) {
      // Try exact country match first
      const { data: exactPrices } = await supabase
        .from("offer_country_prices")
        .select("offer_id, price_minor, currency")
        .in("offer_id", offerIds)
        .eq("country_code", countryCode)
        .eq("is_active", true);

      if (exactPrices && exactPrices.length > 0) {
        countryPriceMap = new Map(
          exactPrices.map((p) => [p.offer_id, p]),
        );
      }

      // For offers without an exact match, try __OTHER__ fallback
      const missingOfferIds = offerIds.filter(
        (id) => !countryPriceMap.has(id),
      );
      if (missingOfferIds.length > 0) {
        const { data: otherPrices } = await supabase
          .from("offer_country_prices")
          .select("offer_id, price_minor, currency")
          .in("offer_id", missingOfferIds)
          .eq("country_code", "__OTHER__")
          .eq("is_active", true);

        if (otherPrices) {
          for (const p of otherPrices) {
            if (!countryPriceMap.has(p.offer_id)) {
              countryPriceMap.set(p.offer_id, p);
            }
          }
        }
      }
    }

    // Determine requested locale (from referer or accept-language)
    const referer = req.headers.get("referer") || "";
    const isArabic =
      referer.includes("/ar/") ||
      req.nextUrl.searchParams.get("locale") === "ar";

    const formattedOffers = (offersData || []).map((o) => {
      const countryPrice = countryPriceMap.get(o.id);
      return {
        id: o.id,
        code: o.code,
        kind: o.kind,
        sessionCount: o.session_count,
        priceMinor: countryPrice?.price_minor ?? o.price_minor,
        currency: countryPrice?.currency ?? o.currency,
        title: isArabic ? o.title_ar : o.title_en,
        titleEn: o.title_en,
        titleAr: o.title_ar,
        countryCode,
      };
    });

    // 3. Check authentication and retrieve learner data if signed in
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({
        data: {
          offers: formattedOffers,
          authenticated: false,
          emailVerified: false,
          entitlements: [],
          upcomingBookings: [],
        },
      });
    }

    const emailVerified = Boolean(
      user.email_confirmed_at ||
      user.confirmed_at ||
      user.user_metadata?.email_verified,
    );

    // 4. Fetch learner's active entitlements for this course
    const { data: entitlementsData } = await supabase
      .from("session_entitlements")
      .select(
        "id, purchased_quantity, reserved_quantity, consumed_quantity, remaining_quantity, status",
      )
      .eq("user_id", user.id)
      .eq("course_id", course.id)
      .eq("status", "active")
      .order("created_at", { ascending: true });

    const formattedEntitlements = (entitlementsData || []).map((e) => ({
      id: e.id,
      purchased: e.purchased_quantity,
      reserved: e.reserved_quantity,
      consumed: e.consumed_quantity,
      remaining: e.remaining_quantity,
      status: e.status,
    }));

    // 5. Fetch upcoming bookings for learner
    const nowIso = new Date().toISOString();
    const { data: bookingsData } = await supabase
      .from("sessions_booking")
      .select("id, starts_at, ends_at, status, session_link")
      .eq("user_id", user.id)
      .eq("course_id", course.id)
      .gt("starts_at", nowIso)
      .in("status", [
        "pending_payment",
        "confirmed",
        "fulfillment_pending",
        "ready",
      ])
      .order("starts_at", { ascending: true })
      .limit(10);

    // Fetch meetings info for these bookings
    const bookingIds = (bookingsData || []).map((b) => b.id);
    let meetingsMap = new Map<
      string,
      { meeting_status: string; email_status: string; join_url: string | null }
    >();

    if (bookingIds.length > 0) {
      const { data: meetingsData } = await supabase
        .from("private_session_meetings")
        .select("booking_id, meeting_status, email_status, join_url")
        .in("booking_id", bookingIds);

      if (meetingsData) {
        meetingsMap = new Map(meetingsData.map((m) => [m.booking_id, m]));
      }
    }

    const formattedBookings = (bookingsData || []).map((b) => {
      const meeting = meetingsMap.get(b.id);
      return {
        id: b.id,
        startsAt: b.starts_at,
        endsAt: b.ends_at,
        status: b.status,
        meetingStatus: meeting?.meeting_status || "pending",
        emailStatus: meeting?.email_status || "pending",
        joinUrl: meeting?.join_url || b.session_link || null,
      };
    });

    return NextResponse.json({
      data: {
        offers: formattedOffers,
        authenticated: true,
        emailVerified,
        entitlements: formattedEntitlements,
        upcomingBookings: formattedBookings,
      },
    });
  } catch {
    return internalError("Error loading session context", correlationId);
  }
}
