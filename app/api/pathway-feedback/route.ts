import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

type FeedbackScope = "all" | string;

type PublicFeedbackRow = {
  feedback: string;
  updated_at: string;
  course_slug: string;
  course_name: string | null;
  course_name_ar: string | null;
  certificate_date: string | null;
  full_name: string | null;
  exam_date: string | null;
  avatar_url: string | null;
};

function isFeedbackScope(value: string): value is FeedbackScope {
  return value === "all" || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

export async function GET(request: NextRequest) {
  const scope = request.nextUrl.searchParams.get("pathway") ?? "all";

  if (!isFeedbackScope(scope)) {
    return NextResponse.json({ error: "invalid_pathway" }, { status: 400 });
  }

  const admin = createAdminClient();

  // Execute get_pathway_feedback RPC to fetch feedback, course name, certificate date, and user details in one single query
  const { data: rpcRows, error: rpcError } = await admin.rpc(
    "get_pathway_feedback",
    {
      target_scope: scope,
      feedback_limit: 6,
    },
  );

  if (rpcError) {
    return NextResponse.json({ error: rpcError.message }, { status: 500 });
  }

  const feedback = await Promise.all(
    (rpcRows ?? []).map(async (row) => {
      let avatarUrl: string | null = null;
      if (row.avatar_path) {
        try {
          const { data: signedAvatar } = await admin.storage
            .from("profile-images")
            .createSignedUrl(row.avatar_path, 60 * 60 * 24);
          avatarUrl = signedAvatar?.signedUrl ?? null;
        } catch {
          avatarUrl = null;
        }
      }

      return {
        feedback: row.feedback,
        updated_at: row.updated_at,
        course_slug: row.course_slug,
        course_name: row.course_name,
        course_name_ar: row.course_name_ar,
        certificate_date: row.certificate_date,
        full_name: row.full_name,
        exam_date: row.exam_date,
        avatar_url: avatarUrl,
      } satisfies PublicFeedbackRow;
    }),
  );

  return NextResponse.json({ data: feedback });
}
