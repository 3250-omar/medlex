import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

type FeedbackScope = "all" | string;

type FeedbackRow = {
  user_id: string;
  feedback: string;
  updated_at: string;
  courses: { slug: string; is_published: boolean } | null;
};

type ProfileRow = {
  id: string;
  full_name: string | null;
  avatar_path: string | null;
  exam_date: string | null;
};

type PublicFeedbackRow = {
  feedback: string;
  updated_at: string;
  course_slug: string;
  full_name: string | null;
  exam_date: string | null;
  avatar_url: string | null;
};

type QueryError = { message: string } | null;

type FeedbackQuery = {
  eq: (column: string, value: string | boolean) => FeedbackQuery;
  order: (
    column: string,
    options: { ascending: boolean },
  ) => FeedbackQuery;
  limit: (
    count: number,
  ) => Promise<{ data: FeedbackRow[] | null; error: QueryError }>;
};

type ProfileQuery = {
  in: (
    column: string,
    values: string[],
  ) => Promise<{ data: ProfileRow[] | null; error: QueryError }>;
};

type FeedbackAdminClient = {
  from: (table: "feedbacks") => {
    select: (columns: string) => FeedbackQuery;
  };
  storage: {
    from: (bucket: string) => {
      createSignedUrl: (
        path: string,
        expiresIn: number,
      ) => Promise<{ data: { signedUrl: string } | null }>;
    };
  };
};

type ProfileAdminClient = {
  from: (table: "profiles") => {
    select: (columns: string) => ProfileQuery;
  };
};

function isFeedbackScope(value: string): value is FeedbackScope {
  return value === "all" || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

function hasCourse(row: FeedbackRow): row is FeedbackRow & {
  courses: { slug: string; is_published: boolean };
} {
  return row.courses !== null;
}

export async function GET(request: NextRequest) {
  const scope = request.nextUrl.searchParams.get("pathway") ?? "all";

  if (!isFeedbackScope(scope)) {
    return NextResponse.json({ error: "invalid_pathway" }, { status: 400 });
  }

  const admin = createAdminClient();
  const feedbackDb = admin as unknown as FeedbackAdminClient;
  const profileDb = admin as unknown as ProfileAdminClient;
  const query = feedbackDb
    .from("feedbacks")
    .select("user_id, feedback, updated_at, courses!inner(slug, is_published)")
    .eq("courses.is_published", true);
  const filteredQuery =
    scope === "all" ? query : query.eq("courses.slug", scope);
  const { data: feedbackRows, error: feedbackError } = await filteredQuery
    .order("updated_at", { ascending: false })
    .limit(6);

  if (feedbackError) {
    return NextResponse.json({ error: feedbackError.message }, { status: 500 });
  }

  const userIds = (feedbackRows ?? []).map((row) => row.user_id);
  const { data: profileRows, error: profileError } = userIds.length
    ? await profileDb
        .from("profiles")
        .select("id, full_name, avatar_path, exam_date")
        .in("id", userIds)
    : { data: [], error: null };

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  const profilesById = new Map(
    (profileRows ?? []).map((profile) => [profile.id, profile]),
  );
  const feedback = await Promise.all(
    (feedbackRows ?? []).filter(hasCourse).map((row) => ({
      row,
      profile: profilesById.get(row.user_id),
    })).map(async ({ row, profile }) => {
      let avatarUrl: string | null = null;

      if (profile?.avatar_path) {
        try {
          const { data: signedAvatar } = await feedbackDb.storage
            .from("profile-images")
            .createSignedUrl(profile.avatar_path, 60 * 60 * 24);
          avatarUrl = signedAvatar?.signedUrl ?? null;
        } catch {
          avatarUrl = null;
        }
      }

      return {
        feedback: row.feedback,
        updated_at: row.updated_at,
        course_slug: row.courses.slug,
        full_name: profile?.full_name ?? null,
        exam_date: profile?.exam_date ?? null,
        avatar_url: avatarUrl,
      } satisfies PublicFeedbackRow;
    }),
  );

  return NextResponse.json({ data: feedback });
}