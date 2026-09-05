import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type Row = Record<string, unknown>;

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
      { status: 401 },
    );
  }

  // 1. Try calling the mark_unit_completed RPC function first
  const { data: rpcData, error: rpcError } = await supabase.rpc(
    "mark_unit_completed",
    {
      target_course_slug: slug,
      target_unit_slug: unitSlug,
    },
  );

  if (!rpcError && rpcData) {
    return NextResponse.json({ data: rpcData });
  }

  // 2. Fallback: execute directly in case the new RPC migration hasn't been applied to remote yet
  try {
    // A. Find course and active enrollment
    const courseRes = await supabase
      .from("courses")
      .select("id")
      .eq("slug", slug)
      .single();

    if (courseRes.error || !courseRes.data) {
      return NextResponse.json({ error: "course_not_found" }, { status: 404 });
    }
    const courseId = courseRes.data.id;

    const enrollmentRes = await supabase
      .from("enrollments")
      .select("id, release_id")
      .eq("user_id", user.id)
      .eq("course_id", courseId)
      .in("status", ["active", "paused", "completed"])
      .order("enrolled_at", { ascending: false })
      .limit(1)
      .single();

    if (enrollmentRes.error || !enrollmentRes.data) {
      return NextResponse.json(
        { error: "active_enrollment_required" },
        { status: 403 },
      );
    }
    const { id: enrollmentId, release_id: releaseId } = enrollmentRes.data;

    // B. Find unit
    const unitRes = await supabase
      .from("learning_units")
      .select("id, sequence_number")
      .eq("release_id", releaseId)
      .eq("slug", unitSlug)
      .single();

    if (unitRes.error || !unitRes.data) {
      return NextResponse.json({ error: "unit_not_found" }, { status: 404 });
    }
    const { id: unitId, sequence_number: unitSeq } = unitRes.data;

    // C. Upsert unit_progress as completed (100%)
    await supabase.from("unit_progress").upsert({
      enrollment_id: enrollmentId,
      unit_id: unitId,
      status: "completed",
      progress_percent: 100,
      completed_at: new Date().toISOString(),
      last_accessed_at: new Date().toISOString(),
    });

    // D. Update enrollment last_accessed_unit_id
    await supabase
      .from("enrollments")
      .update({
        last_accessed_unit_id: unitId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", enrollmentId);

    // E. Calculate stats
    const allUnitsRes = await supabase
      .from("learning_units")
      .select("id, slug, sequence_number")
      .eq("release_id", releaseId)
      .eq("is_published", true)
      .order("sequence_number", { ascending: true });

    const totalUnits = allUnitsRes.data?.length ?? 0;

    const completedProgressRes = await supabase
      .from("unit_progress")
      .select("unit_id")
      .eq("enrollment_id", enrollmentId)
      .eq("status", "completed");

    const completedUnits = completedProgressRes.data?.length ?? 0;
    const progressPercent =
      totalUnits > 0 ? Math.round((completedUnits / totalUnits) * 100) : 0;
    const isCourseCompleted = totalUnits > 0 && completedUnits >= totalUnits;

    if (isCourseCompleted) {
      await supabase
        .from("enrollments")
        .update({
          status: "completed",
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", enrollmentId);
    }

    const nextUnit = allUnitsRes.data?.find(
      (u: Row) => Number(u.sequence_number) > Number(unitSeq),
    );

    return NextResponse.json({
      data: {
        completed: true,
        unitId,
        unitSlug,
        completedUnits,
        totalUnits,
        progressPercent,
        isCourseCompleted,
        nextUnitSlug: nextUnit?.slug ? String(nextUnit.slug) : null,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "server_error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
