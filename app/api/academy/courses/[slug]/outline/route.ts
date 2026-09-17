import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const NOINDEX_ROBOTS_HEADER = {
  "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet, noimageindex",
};

type Row = Record<string, unknown>;
type Query = {
  eq: (column: string, value: string | boolean) => Query;
  order: (column: string, options?: { ascending?: boolean }) => Query;
  single: () => Promise<{
    data: Row | null;
    error: { message: string } | null;
  }>;
};
type Client = {
  from: (table: string) => { select: (columns: string) => Query };
};

export async function GET(
  _: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "authentication_required" },
      {
        status: 401,
        headers: NOINDEX_ROBOTS_HEADER,
      },
    );
  }

  // Verify active course enrolment
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: enrollment } = await (supabase as any)
    .from("enrollments")
    .select("id, status, courses!inner(slug)")
    .eq("user_id", user.id)
    .eq("courses.slug", slug)
    .in("status", ["active", "completed", "paused"])
    .maybeSingle();

  if (!enrollment) {
    return NextResponse.json(
      { error: "enrolment_required" },
      {
        status: 403,
        headers: NOINDEX_ROBOTS_HEADER,
      },
    );
  }

  const db = supabase as unknown as Client;
  const { data, error } = await db
    .from("courses")
    .select(
      "id, slug, title_en, description_en, course_releases!inner(id, status, learning_units(id, parent_unit_id, slug, unit_code, sequence_number, title, is_published, unit_progress(status, progress_percent)))",
    )
    .eq("slug", slug)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "Course not found." },
      {
        status: 404,
        headers: NOINDEX_ROBOTS_HEADER,
      },
    );
  }

  const releases = Array.isArray(data.course_releases) ? data.course_releases : [];
  const release = releases.find((item): item is Row => Boolean(item && typeof item === "object"));
  const rawUnits = release && Array.isArray(release.learning_units) ? release.learning_units : [];
  const units = rawUnits
    .filter((item): item is Row => Boolean(item && typeof item === "object"))
    .filter((unit) => unit.is_published !== false)
    .sort((a, b) => Number(a.sequence_number ?? 0) - Number(b.sequence_number ?? 0))
    .map((unit) => {
      const progress = Array.isArray(unit.unit_progress) ? unit.unit_progress[0] : null;
      return {
        id: String(unit.id),
        slug: String(unit.slug),
        title: String(unit.title),
        unitCode: typeof unit.unit_code === "string" ? unit.unit_code : null,
        sequenceNumber: Number(unit.sequence_number ?? 0),
        progressPercent: Number((progress as Row | undefined)?.progress_percent ?? 0),
        status: typeof (progress as Row | undefined)?.status === "string" ? String((progress as Row).status) : null,
      };
    });

  return NextResponse.json(
    { data: { course: { slug: String(data.slug), title: String(data.title_en) }, units } },
    {
      headers: NOINDEX_ROBOTS_HEADER,
    },
  );
}
