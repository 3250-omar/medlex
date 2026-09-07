import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const AVATAR_URL_TTL_SECONDS = 60 * 60 * 24;

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const avatarPath =
    typeof user?.user_metadata?.avatar_path === "string"
      ? user.user_metadata.avatar_path
      : null;
  let avatarUrl: string | null = null;

  if (avatarPath) {
    try {
      const admin = createAdminClient();
      const { data } = await admin.storage
        .from("profile-images")
        .createSignedUrl(avatarPath, AVATAR_URL_TTL_SECONDS);
      avatarUrl = data?.signedUrl ?? null;
    } catch {
      avatarUrl = null;
    }
  }

  return NextResponse.json({
    data: user
      ? {
          id: user.id,
          email: user.email ?? null,
          fullName: user.user_metadata?.full_name ?? null,
          username: user.user_metadata?.username ?? null,
          phone: user.user_metadata?.phone ?? null,
          examDate: user.user_metadata?.exam_date ?? null,
          avatarPath,
          avatarUrl,
          createdAt: user.created_at ?? null,
        }
      : null,
  });
}