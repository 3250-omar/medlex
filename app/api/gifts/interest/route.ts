import { NextResponse } from "next/server";

// Gift interest collection is not yet wired to a backend.
// The endpoint accepts the request and returns success so the UI
// shows the confirmation state without errors.
export async function POST() {
  return NextResponse.json({ success: true });
}
