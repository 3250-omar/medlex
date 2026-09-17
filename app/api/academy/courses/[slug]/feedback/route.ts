import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const NOINDEX_ROBOTS_HEADER = {
  "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet, noimageindex",
};

interface FeedbackRow {
  user_id: string;
  course_id: string;
  feedback: string;
  updated_at: string;
}

interface FeedbackClient {
  from: (table: string) => {
    upsert: (
      values: FeedbackRow,
      options?: { onConflict?: string },
    ) => Promise<{ error: { message: string } | null }>;
  };
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json(
      { error: "authentication_required" },
      { status: 401, headers: NOINDEX_ROBOTS_HEADER },
    );
  const body = (await request.json().catch(() => null)) as {
    feedback?: unknown;
  } | null;
  const feedback =
    typeof body?.feedback === "string" ? body.feedback.trim() : "";
  if (!feedback)
    return NextResponse.json(
      { error: "feedback_required" },
      { status: 400, headers: NOINDEX_ROBOTS_HEADER },
    );
  const { data: course, error: courseError } = await supabase
    .from("courses")
    .select("id")
    .eq("slug", slug)
    .single();
  if (courseError || !course)
    return NextResponse.json(
      { error: "course_not_found" },
      { status: 404, headers: NOINDEX_ROBOTS_HEADER },
    );
  const feedbackDb = supabase as unknown as FeedbackClient;
  const { error } = await feedbackDb.from("feedbacks").upsert(
    {
      user_id: user.id,
      course_id: course.id,
      feedback,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,course_id" },
  );
  if (error)
    return NextResponse.json(
      { error: error.message },
      { status: 500, headers: NOINDEX_ROBOTS_HEADER },
    );
  return NextResponse.json(
    { data: { success: true } },
    { headers: NOINDEX_ROBOTS_HEADER },
  );
}
