import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

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

export async function GET() {
  // The preview is public, while standard course content remains protected by
  // learner-access RLS. This endpoint returns only the public sample station.
  const supabase = createAdminClient();
  const db = supabase as unknown as Client;
  const { data, error } = await db
    .from("courses")
    .select(
      "slug, course_releases(learning_units(id, slug, title, unit_code, sequence_number, content_blocks(id, block_type, sort_order, content), assessments(id, source_key, duration_seconds, pass_score, require_all_critical, allow_retry_per_question, feedback_policy, assessment_questions(id, source_key, sort_order, is_critical, critical_label, stem, explanation, answer_options(id, source_key, sort_order, option_text, feedback)))))",
    )
    .eq("slug", "casc-academy")
    .single();
  if (error || !data)
    return NextResponse.json(
      { error: "Preview is unavailable." },
      { status: 404 },
    );

  const units = asRows(data.course_releases).flatMap((release) =>
    asRows(release.learning_units),
  );
  const unit = units.find(
    (item) =>
      item.unit_code === "7.2" ||
      item.slug === "station-7-2" ||
      String(item.title ?? "").includes("7.2"),
  );
  if (!unit)
    return NextResponse.json(
      { error: "Station 7.2 is unavailable." },
      { status: 404 },
    );

  // Attach correct answers from private.question_answer_keys using admin client
  try {
    type Opt = { id: string; is_correct?: boolean };
    type Ques = { id: string; correct_option_id?: string; answer_options?: Opt[] };
    type Assess = { assessment_questions?: Ques[] };
    type KeyRow = { question_id: string; correct_option_id: string };

    const assessments = (unit.assessments as Assess[]) ?? [];
    const questionIds: string[] = [];
    assessments.forEach((ass) => {
      (ass.assessment_questions ?? []).forEach((q) => {
        if (q.id) questionIds.push(q.id);
      });
    });

    if (questionIds.length > 0) {
      const { data: keys } = await (supabase as unknown as {
        from: (t: string) => {
          select: (c: string) => {
            in: (col: string, ids: string[]) => Promise<{ data: KeyRow[] | null }>;
          };
        };
      })
        .from("question_answer_keys")
        .select("question_id, correct_option_id")
        .in("question_id", questionIds);

      if (keys && Array.isArray(keys)) {
        const keyMap = new Map<string, string>(
          keys.map((k) => [k.question_id, k.correct_option_id]),
        );
        assessments.forEach((ass) => {
          (ass.assessment_questions ?? []).forEach((q) => {
            const correctOptId = keyMap.get(q.id);
            if (correctOptId) {
              q.correct_option_id = correctOptId;
              (q.answer_options ?? []).forEach((opt) => {
                opt.is_correct = opt.id === correctOptId;
              });
            }
          });
        });
      }
    }
  } catch {
    // Non-fatal
  }

  return NextResponse.json({ data: unit });
}
