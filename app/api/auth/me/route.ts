import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import {
  type EnrolledCourse,
  type UserPrivateSessionsSummary,
} from "@/app/[locale]/(marketing)/_apiCalls/academyQueries";

const AVATAR_URL_TTL_SECONDS = 60 * 60 * 24;

type Row = Record<string, unknown>;

type UntypedQuery = {
  eq: (column: string, value: unknown) => UntypedQuery;
  gt: (column: string, value: unknown) => UntypedQuery;
  in: (column: string, values: unknown[]) => UntypedQuery;
  order: (column: string, options?: { ascending?: boolean }) => UntypedQuery;
  then: <TResult1 = unknown, TResult2 = never>(
    onfulfilled?:
      | ((value: {
          data: Row[] | null;
          error: unknown;
        }) => TResult1 | PromiseLike<TResult1>)
      | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ) => Promise<TResult1 | TResult2>;
};

type UntypedClient = {
  from: (table: string) => { select: (columns: string) => UntypedQuery };
  rpc: (
    fn: string,
    args: Record<string, unknown>,
  ) => Promise<{
    data: {
      enrolledCourses: EnrolledCourse[];
      privateSessions: UserPrivateSessionsSummary;
    } | null;
    error: unknown;
  }>;
};

/**
 * Fallback loader in case RPC is temporarily unavailable.
 */
async function fetchFallbackSummary(
  admin: ReturnType<typeof createAdminClient>,
  userId: string,
): Promise<{
  enrolledCourses: EnrolledCourse[];
  privateSessions: UserPrivateSessionsSummary;
}> {
  const db = admin as unknown as UntypedClient;
  const nowIso = new Date().toISOString();

  const [enrollmentsResult, bookingsResult, entitlementsResult] =
    await Promise.all([
      db
        .from("enrollments")
        .select(
          "id, status, enrolled_at, expires_at, last_accessed_unit_id, courses!inner(slug, title_en, title_ar, description_en, description_ar), course_releases!inner(learning_units(id, slug, sequence_number, is_published)), unit_progress(unit_id, status, progress_percent)",
        )
        .eq("user_id", userId)
        .in("status", ["active", "paused", "completed"])
        .order("enrolled_at", { ascending: false }),

      db
        .from("sessions_booking")
        .select(
          `id, starts_at, ends_at, status, session_link, funding_type,
         course:courses(slug),
         meeting:private_session_meetings(join_url, meeting_status, email_status)`,
        )
        .eq("user_id", userId)
        .gt("starts_at", nowIso)
        .in("status", [
          "pending_payment",
          "confirmed",
          "fulfillment_pending",
          "ready",
        ])
        .order("starts_at", { ascending: true }),

      db
        .from("session_entitlements")
        .select(
          `id, purchased_quantity, remaining_quantity, status,
         course:courses(slug),
         offer:private_session_offers(code)`,
        )
        .eq("user_id", userId)
        .eq("status", "active")
        .order("created_at", { ascending: true }),
    ]);

  const upcomingBookings = (bookingsResult.data ?? []).map((b) => {
    const m = (Array.isArray(b.meeting) ? b.meeting[0] : b.meeting) as
      | Row
      | undefined;
    const c = (Array.isArray(b.course) ? b.course[0] : b.course) as
      | Row
      | undefined;
    return {
      id: String(b.id),
      courseSlug: String(c?.slug ?? "casc-academy"),
      startsAt: String(b.starts_at),
      endsAt: String(b.ends_at),
      status: String(b.status),
      fundingType: String(b.funding_type),
      joinUrl: (m?.join_url as string) || (b.session_link as string) || null,
      sessionLink:
        (b.session_link as string) || (m?.join_url as string) || null,
      meetingStatus: (m?.meeting_status as string) || "pending",
      emailStatus: (m?.email_status as string) || "pending",
    };
  });

  const enrolledCourses: EnrolledCourse[] = (enrollmentsResult.data ?? []).map(
    (enrollment) => {
      const course = (enrollment.courses ?? {}) as unknown as Row;
      const courseSlug = String(course.slug ?? "");
      const coursePrivateSessions = upcomingBookings.filter(
        (b) => b.courseSlug === courseSlug,
      );
      const releases = Array.isArray(enrollment.course_releases)
        ? enrollment.course_releases
        : enrollment.course_releases &&
            typeof enrollment.course_releases === "object"
          ? [enrollment.course_releases]
          : [];
      const release = releases[0] as Row | undefined;
      const rawUnits = Array.isArray(release?.learning_units)
        ? release.learning_units
        : [];

      const units = [...rawUnits]
        .filter((unit): unit is Row =>
          Boolean(
            unit && typeof unit === "object" && unit.is_published !== false,
          ),
        )
        .sort(
          (a, b) =>
            Number(a.sequence_number ?? 0) - Number(b.sequence_number ?? 0),
        );

      const firstUnit = units[0];
      const totalUnits = units.length;

      const progressRecords = Array.isArray(enrollment.unit_progress)
        ? (enrollment.unit_progress as Row[])
        : [];

      const completedUnitIds = new Set(
        progressRecords
          .filter((p) => p.status === "completed")
          .map((p) => String(p.unit_id)),
      );

      const completedUnits = units.filter((u) =>
        completedUnitIds.has(String(u.id)),
      ).length;

      const progressPercent =
        totalUnits > 0 ? Math.round((completedUnits / totalUnits) * 100) : 0;

      let currentUnitSlug: string | null = null;
      const lastAccessedId = enrollment.last_accessed_unit_id
        ? String(enrollment.last_accessed_unit_id)
        : null;

      if (lastAccessedId) {
        const lastIndex = units.findIndex(
          (u) => String(u.id) === lastAccessedId,
        );
        if (lastIndex !== -1) {
          if (
            completedUnitIds.has(lastAccessedId) &&
            lastIndex + 1 < units.length
          ) {
            currentUnitSlug = String(units[lastIndex + 1].slug);
          } else {
            currentUnitSlug = String(units[lastIndex].slug);
          }
        }
      }

      if (!currentUnitSlug) {
        const firstIncomplete = units.find(
          (u) => !completedUnitIds.has(String(u.id)),
        );
        currentUnitSlug = firstIncomplete
          ? String(firstIncomplete.slug)
          : firstUnit
            ? String(firstUnit.slug)
            : null;
      }

      return {
        enrollmentId: String(enrollment.id),
        status: String(enrollment.status),
        expiresAt: enrollment.expires_at ? String(enrollment.expires_at) : null,
        slug: courseSlug,
        titleEn: String(course.title_en ?? ""),
        titleAr: course.title_ar ? String(course.title_ar) : null,
        descriptionEn: course.description_en
          ? String(course.description_en)
          : null,
        descriptionAr: course.description_ar
          ? String(course.description_ar)
          : null,
        firstUnitSlug: firstUnit ? String(firstUnit.slug) : null,
        currentUnitSlug,
        completedUnits,
        totalUnits,
        progressPercent,
        privateSessions: coursePrivateSessions,
      };
    },
  );

  const packages = (entitlementsResult.data ?? []).map((e) => {
    const c = (Array.isArray(e.course) ? e.course[0] : e.course) as
      | Row
      | undefined;
    const o = (Array.isArray(e.offer) ? e.offer[0] : e.offer) as
      | Row
      | undefined;
    return {
      id: String(e.id),
      courseSlug: String(c?.slug ?? "casc-academy"),
      packageCode: (o?.code as string) || null,
      purchased: Number(e.purchased_quantity ?? 0),
      remaining: Number(e.remaining_quantity ?? 0),
      status: String(e.status),
    };
  });

  const totalRemainingCredits = packages.reduce(
    (sum: number, p: { remaining: number }) => sum + p.remaining,
    0,
  );
  const hasUpcomingBooking = upcomingBookings.length > 0;
  const hasPackage = totalRemainingCredits > 0 || packages.length > 0;

  let sessionType: "none" | "direct" | "package" | "both" = "none";
  const hasDirectBooking = upcomingBookings.some(
    (b: { fundingType: string }) => b.fundingType === "direct_payment",
  );
  const hasPackageCreditBooking = upcomingBookings.some(
    (b: { fundingType: string }) => b.fundingType === "package_credit",
  );
  if ((hasPackage || hasPackageCreditBooking) && hasDirectBooking) {
    sessionType = "both";
  } else if (hasPackage || hasPackageCreditBooking) {
    sessionType = "package";
  } else if (hasDirectBooking) {
    sessionType = "direct";
  }

  const privateSessions: UserPrivateSessionsSummary = {
    hasActiveSession: hasUpcomingBooking || hasPackage,
    sessionType,
    hasUpcomingBooking,
    nextBooking: upcomingBookings[0] || null,
    upcomingBookings,
    hasPackage,
    totalRemainingCredits,
    packages,
  };

  return { enrolledCourses, privateSessions };
}

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ data: null });
    }

    const admin = createAdminClient();

    const avatarPath =
      typeof user.user_metadata?.avatar_path === "string"
        ? user.user_metadata.avatar_path
        : null;

    const db = admin as unknown as UntypedClient;

    // 1. Fetch avatar and fast aggregated summary via RPC concurrently
    const [avatarResult, rpcResult] = await Promise.all([
      avatarPath
        ? admin.storage
            .from("profile-images")
            .createSignedUrl(avatarPath, AVATAR_URL_TTL_SECONDS)
            .catch(() => null)
        : Promise.resolve(null),

      Promise.resolve(
        db.rpc("get_user_me_summary", { p_user_id: user.id }),
      ).catch((err: unknown) => {
        console.error("RPC call error:", err);
        return { data: null, error: err };
      }),
    ]);

    const avatarUrl = avatarResult?.data?.signedUrl ?? null;

    const emailVerified = Boolean(
      user.email_confirmed_at ||
      user.confirmed_at ||
      user.user_metadata?.email_verified,
    );

    // 2. Resolve summary from RPC, with transparent fallback if unavailable
    let enrolledCourses: EnrolledCourse[];
    let privateSessions: UserPrivateSessionsSummary;

    if (
      rpcResult.data &&
      Array.isArray(rpcResult.data.enrolledCourses) &&
      rpcResult.data.privateSessions
    ) {
      enrolledCourses = rpcResult.data.enrolledCourses;
      privateSessions = rpcResult.data.privateSessions;
    } else {
      console.warn(
        "Falling back to fetchFallbackSummary, rpcResult was:",
        rpcResult,
      );
      const fallback = await fetchFallbackSummary(admin, user.id);
      enrolledCourses = fallback.enrolledCourses;
      privateSessions = fallback.privateSessions;
    }

    return NextResponse.json({
      data: {
        id: user.id,
        email: user.email ?? null,
        fullName: user.user_metadata?.full_name ?? null,
        username: user.user_metadata?.username ?? null,
        phone: user.user_metadata?.phone ?? null,
        examDate: user.user_metadata?.exam_date ?? null,
        emailVerified,
        avatarPath,
        avatarUrl,
        createdAt: user.created_at ?? null,
        enrolledCourses,
        privateSessions,
      },
    });
  } catch (error) {
    console.error("GET /api/auth/me crashed:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}
