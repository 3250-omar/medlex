import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({
      data: {
        gift1Downloaded: false,
        gift1DownloadedAt: null,
        gift2Downloaded: false,
        gift2DownloadedAt: null,
      },
    });
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("gift_1_downloaded_at, gift_2_downloaded_at")
    .eq("id", user.id)
    .single();

  if (error && error.code !== "PGRST116") {
    return NextResponse.json(
      { error: "Unable to retrieve gift status." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    data: {
      gift1Downloaded: data?.gift_1_downloaded_at != null,
      gift1DownloadedAt: data?.gift_1_downloaded_at ?? null,
      gift2Downloaded: data?.gift_2_downloaded_at != null,
      gift2DownloadedAt: data?.gift_2_downloaded_at ?? null,
    },
  });
}