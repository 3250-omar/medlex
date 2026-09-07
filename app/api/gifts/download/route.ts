import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

type GiftId = "1" | "2";

const gifts: Record<GiftId, { fileName: string; profileColumn: string }> = {
  "1": {
    fileName: "The Examiner's Briefing.pdf",
    profileColumn: "gift_1_downloaded_at",
  },
  "2": {
    fileName: "The Examiner's Error Log.pdf",
    profileColumn: "gift_2_downloaded_at",
  },
};

function isGiftId(value: string | null): value is GiftId {
  return value === "1" || value === "2";
}

export async function GET(request: Request) {
  const giftId = new URL(request.url).searchParams.get("gift");
  if (!isGiftId(giftId)) {
    return NextResponse.json({ error: "Invalid gift." }, { status: 400 });
  }

  const gift = gifts[giftId];
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

  const filePath = path.join(process.cwd(), "public", "gifts", gift.fileName);
  if (!fs.existsSync(filePath)) {
    return NextResponse.json(
      { error: "Gift file not found on server." },
      { status: 404 },
    );
  }

  const downloadedAt = new Date().toISOString();
  const downloadUpdate =
    giftId === "1"
      ? { gift_1_downloaded_at: downloadedAt }
      : { gift_2_downloaded_at: downloadedAt };

  const { data: updatedProfile, error: updateError } = await supabase
    .from("profiles")
    .update(downloadUpdate)
    .eq("id", user.id)
    .is(gift.profileColumn, null)
    .select(gift.profileColumn)
    .maybeSingle();

  if (updateError) {
    return NextResponse.json(
      { error: "Unable to record the gift download." },
      { status: 500 },
    );
  }

  if (!updatedProfile) {
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select(gift.profileColumn)
      .eq("id", user.id)
      .maybeSingle();

    if (profileError && profileError.code !== "PGRST116") {
      return NextResponse.json(
        { error: "Unable to record the gift download." },
        { status: 500 },
      );
    }

    if (!profile) {
      const profileInsert = {
        id: user.id,
        full_name: null,
        phone: null,
        role: "learner" as const,
        gift_1_downloaded_at: giftId === "1" ? downloadedAt : null,
        gift_2_downloaded_at: giftId === "2" ? downloadedAt : null,
      };
      const { error: insertError } = await supabase
        .from("profiles")
        .insert(profileInsert);

      if (insertError) {
        return NextResponse.json(
          { error: "Unable to record the gift download." },
          { status: 500 },
        );
      }
    }
  }

  const fileBuffer = fs.readFileSync(filePath);
  return new NextResponse(fileBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${gift.fileName}"`,
      "Content-Length": fileBuffer.length.toString(),
      "Cache-Control": "private, no-cache, no-store, must-revalidate",
    },
  });
}
