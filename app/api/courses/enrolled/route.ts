import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type Row = Record<string, unknown>;
type Query = {
  in: (column: string, values: string[]) => Query;
  order: (column: string, options?: { ascending?: boolean }) => Query;
  then: (
    resolve: (value: {
      data: Row[] | null;
      error: { message: string } | null;
    }) => unknown,
  ) => Promise<unknown>;
};
type Client = {
  from: (table: string) => { select: (columns: string) => Query };
};

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json(
      { error: "authentication_required" },
      { status: 401 },
    );

  const db = supabase as unknown as Client;
  const result = (await db
    .from("enrollments")
    .select(
      "id, status, enrolled_at, expires_at, last_accessed_unit_id, courses!inner(slug, title_en, title_ar, description_en, description_ar), course_releases!inner(learning_units(slug, sequence_number, is_published))",
    )
    .in("status", ["active", "paused", "completed"])
    .order("enrolled_at", { ascending: false })) as {
    data: Row[] | null;
    error: { message: string } | null;
  };
  if (result.error)
    return NextResponse.json(
      { error: "Unable to load your courses." },
      { status: 500 },
    );

  const courses = (result.data ?? []).map((enrollment) => {
    const course = enrollment.courses as Row;
    const releases = Array.isArray(enrollment.course_releases)
      ? enrollment.course_releases
      : enrollment.course_releases &&
          typeof enrollment.course_releases === "object"
        ? [enrollment.course_releases]
        : [];
    const release = releases[0] as Row | undefined;
    const units = Array.isArray(release?.learning_units)
      ? release.learning_units
      : [];
    const firstUnit = [...units]
      .filter((unit): unit is Row =>
        Boolean(
          unit && typeof unit === "object" && unit.is_published !== false,
        ),
      )
      .sort(
        (a, b) =>
          Number(a.sequence_number ?? 0) - Number(b.sequence_number ?? 0),
      )[0];
    return {
      enrollmentId: String(enrollment.id),
      status: String(enrollment.status),
      expiresAt:
        typeof enrollment.expires_at === "string"
          ? enrollment.expires_at
          : null,
      slug: String(course.slug),
      titleEn: String(course.title_en),
      titleAr: typeof course.title_ar === "string" ? course.title_ar : null,
      descriptionEn:
        typeof course.description_en === "string"
          ? course.description_en
          : null,
      descriptionAr:
        typeof course.description_ar === "string"
          ? course.description_ar
          : null,
      firstUnitSlug:
        typeof firstUnit?.slug === "string" ? firstUnit.slug : null,
    };
  });
  return NextResponse.json({ data: courses });
}
