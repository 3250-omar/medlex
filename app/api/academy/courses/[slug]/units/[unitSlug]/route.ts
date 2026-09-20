import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const NOINDEX_ROBOTS_HEADER = {
  "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet, noimageindex",
};

type Row = Record<string, unknown>;
type Query = {
  eq: (column: string, value: string | boolean) => Query;
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
  { params }: { params: Promise<{ slug: string; unitSlug: string }> },
) {
  const { slug, unitSlug } = await params;
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
    .from("learning_units")
    .select(
      "id, slug, title, summary, eyebrow, lens_text, unit_code, sequence_number, content_blocks(id, block_type, sort_order, content), assessments(id, source_key, duration_seconds, pass_score, require_all_critical, allow_retry_per_question, feedback_policy, assessment_questions(id, source_key, sort_order, is_critical, critical_label, stem, explanation, answer_options(id, source_key, sort_order, option_text, feedback)))",
    )
    .eq("slug", unitSlug)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: `Unit ${unitSlug} was not found in ${slug}.` },
      {
        status: 404,
        headers: NOINDEX_ROBOTS_HEADER,
      },
    );
  }

  return NextResponse.json(
    { data },
    {
      headers: NOINDEX_ROBOTS_HEADER,
    },
  );
}
