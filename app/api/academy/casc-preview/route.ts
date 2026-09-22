import { NextResponse } from "next/server";
import { getPublicPreviewStation } from "@/lib/academy/preview";

export async function GET() {
  const unit = await getPublicPreviewStation();
  if (!unit) {
    return NextResponse.json(
      { error: "Station 7.2 is unavailable." },
      { status: 404 },
    );
  }

  return NextResponse.json({ data: unit });
}

