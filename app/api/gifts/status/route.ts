import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({
      data: { giftDownloaded: false, giftDownloadedAt: null },
    });
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("gift_downloaded_at")
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
      giftDownloaded: data?.gift_downloaded_at != null,
      giftDownloadedAt: data?.gift_downloaded_at ?? null,
    },
  });
}
