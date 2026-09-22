import { createAdminClient } from "@/lib/supabase/admin";
import type { RawAssessment } from "@/app/[locale]/(marketing)/academy/_comps/cascExamEngine";

export type PreviewUnit = {
  title: string;
  assessments?: RawAssessment[];
  content_blocks: Array<{ sort_order: number; content: { html?: string } }>;
};

type Row = Record<string, unknown>;
type Query = {
  eq: (column: string, value: string) => Query;
  single: () => Promise<{
    data: Row | null;
    error: { message: string } | null;
  }>;
};
type Client = {
  from: (table: string) => { select: (columns: string) => Query };
};

function asRows(value: unknown): Row[] {
  return Array.isArray(value)
    ? value.filter((item): item is Row =>
        Boolean(item && typeof item === "object"),
      )
    : [];
}

export async function getPublicPreviewStation(): Promise<PreviewUnit | null> {
  try {
    const supabase = createAdminClient();
    const db = supabase as unknown as Client;
    const { data, error } = await db
      .from("courses")
      .select(
        "slug, course_releases(learning_units(id, slug, title, unit_code, sequence_number, content_blocks(id, block_type, sort_order, content), assessments(id, source_key, duration_seconds, pass_score, require_all_critical, allow_retry_per_question, feedback_policy, assessment_questions(id, source_key, sort_order, is_critical, critical_label, stem, explanation, answer_options(id, source_key, sort_order, option_text, feedback)))))",
      )
      .eq("slug", "casc-academy")
      .single();

    if (error || !data) return null;

    const units = asRows(data.course_releases).flatMap((release) =>
      asRows(release.learning_units),
    );
    const unit = units.find(
      (item) =>
        item.unit_code === "7.2" ||
        item.slug === "station-7-2" ||
        String(item.title ?? "").includes("7.2"),
    );

    return (unit as unknown as PreviewUnit) ?? null;
  } catch (err) {
    console.error("Error fetching preview station:", err);
    return null;
  }
}
