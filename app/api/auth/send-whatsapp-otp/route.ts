import { NextResponse } from "next/server";

/** Disabled until a server-side WhatsApp provider is implemented. */
export async function POST() {
  return NextResponse.json(
    { error: "WhatsApp password reset is not available." },
    { status: 410 },
  );
}