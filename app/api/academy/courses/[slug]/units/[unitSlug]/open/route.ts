import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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

  // 1. Try calling the record_unit_opened RPC first
  const { data: rpcData, error: rpcError } = await supabase.rpc(
    "record_unit_opened",
    {
      target_course_slug: slug,
      target_unit_slug: unitSlug,
    },
  );

  if (!rpcError && rpcData) {
    return NextResponse.json({ data: rpcData });
  }

  // 2. Fallback direct execution
  try {
    const courseRes = await supabase
      .from("courses")
      .select("id")
      .eq("slug", slug)
      .single();

    if (courseRes.error || !courseRes.data) {
      return NextResponse.json({ error: "course_not_found" }, { status: 404 });
    }

    const enrollmentRes = await supabase
      .from("enrollments")
      .select("id, release_id")
      .eq("user_id", user.id)
      .eq("course_id", courseRes.data.id)
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

    const unitRes = await supabase
      .from("learning_units")
      .select("id")
      .eq("release_id", releaseId)
      .eq("slug", unitSlug)
      .single();

    if (unitRes.error || !unitRes.data) {
      return NextResponse.json({ error: "unit_not_found" }, { status: 404 });
    }

    const unitId = unitRes.data.id;

    // Record last accessed unit
    await supabase
      .from("enrollments")
      .update({
        last_accessed_unit_id: unitId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", enrollmentId);

    // If unit progress doesn't exist yet, insert with status 'in_progress' and 10%
    const existingProgress = await supabase
      .from("unit_progress")
      .select("status, progress_percent")
      .eq("enrollment_id", enrollmentId)
      .eq("unit_id", unitId)
      .maybeSingle();

    if (!existingProgress.data) {
      await supabase.from("unit_progress").insert({
        enrollment_id: enrollmentId,
        unit_id: unitId,
        status: "in_progress",
        progress_percent: 10,
        started_at: new Date().toISOString(),
        last_accessed_at: new Date().toISOString(),
      });
    } else {
      await supabase
        .from("unit_progress")
        .update({
          last_accessed_at: new Date().toISOString(),
        })
        .eq("enrollment_id", enrollmentId)
        .eq("unit_id", unitId);
    }

    return NextResponse.json({
      data: {
        success: true,
        unitId,
        unitSlug,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "server_error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
