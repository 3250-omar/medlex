import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const NOINDEX_ROBOTS_HEADER = {
  "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet, noimageindex",
};

type UnitCompletionResult = {
  completed: boolean;
  unitId: string;
  unitSlug: string;
  completedUnits: number;
  totalUnits: number;
  progressPercent: number;
  isCourseCompleted: boolean;
  nextUnitSlug: string | null;
};

/**
 * Completion is resolved by the SECURITY DEFINER RPC, which scopes the action to
 * auth.uid() and the learner's active enrollment. The client supplies no score
 * or completion state that could be persisted as authoritative data.
 */
export async function POST(
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
      { status: 401, headers: NOINDEX_ROBOTS_HEADER },
    );
  }

  const { data, error } = await supabase.rpc("mark_unit_completed", {
    target_course_slug: slug,
    target_unit_slug: unitSlug,
  });

  if (error || !data) {
    const status = error?.message.includes("active_enrollment_required") ? 403 : 400;
    return NextResponse.json(
      { error: "Unable to complete this lesson." },
      { status, headers: NOINDEX_ROBOTS_HEADER },
    );
  }

  return NextResponse.json(
    { data: data as unknown as UnitCompletionResult },
    { headers: NOINDEX_ROBOTS_HEADER },
  );
}