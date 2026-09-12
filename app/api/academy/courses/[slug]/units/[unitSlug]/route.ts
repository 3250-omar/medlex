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
      "id, slug, title, summary, eyebrow, lens_text, unit_code, sequence_number, content_blocks(id, block_type, sort_order, content), assessments(id, source_key, duration_seconds, pass_score, require_all_critical, allow_retry_per_question, feedback_policy, assessment_questions(id, source_key, sort_order, is_critical, critical_label, stem, explanation, answer_options(id, source_key, sort_order, option_text, feedback)))",
    )
    .eq("slug", unitSlug)
    .single();
  if (error || !data)
    return NextResponse.json(
      { error: `Unit ${unitSlug} was not found in ${slug}.` },
      { status: 404 },
    );

  // Attach correct answers from private.question_answer_keys using admin client if available
  try {
    const { createAdminClient } = await import("@/lib/supabase/admin");
    const admin = createAdminClient();

    type Opt = { id: string; is_correct?: boolean };
    type Ques = { id: string; correct_option_id?: string; answer_options?: Opt[] };
    type Assess = { assessment_questions?: Ques[] };
    type KeyRow = { question_id: string; correct_option_id: string };

    const assessments = (data.assessments as Assess[]) ?? [];
    const questionIds: string[] = [];
    assessments.forEach((ass) => {
      (ass.assessment_questions ?? []).forEach((q) => {
        if (q.id) questionIds.push(q.id);
      });
    });

    if (questionIds.length > 0) {
      const { data: keys } = await (admin as unknown as {
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
    // Non-fatal: fallback to source_key / embedded station defaults
  }

  return NextResponse.json({ data });
}
