import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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
  if (!user)
    return NextResponse.json(
      { error: "authentication_required" },
      { status: 401 },
    );

  const db = supabase as unknown as Client;
  const { data, error } = await db
    .from("learning_units")
    .select(
      "id, slug, title, summary, eyebrow, lens_text, unit_code, sequence_number, content_blocks(id, block_type, sort_order, content), assessments(id, source_key, duration_seconds, pass_score, require_all_critical, allow_retry_per_question, feedback_policy)",
    )
    .eq("slug", unitSlug)
    .single();
  if (error || !data)
    return NextResponse.json(
      { error: `Unit ${unitSlug} was not found in ${slug}.` },
      { status: 404 },
    );
  return NextResponse.json({ data });
}
