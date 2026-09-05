import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return NextResponse.json({
    data: user
      ? {
          id: user.id,
          email: user.email ?? null,
          fullName: user.user_metadata?.full_name ?? null,
          username: user.user_metadata?.username ?? null,
          phone: user.user_metadata?.phone ?? null,
          createdAt: user.created_at ?? null,
        }
      : null,
  });
}
