import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

export async function GET() {
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

  const { data: enrollment, error: enrollmentError } = await supabase
    .from("enrollments")
    .select("id, courses!inner(slug)")
    .eq("user_id", user.id)
    .eq("courses.slug", "casc-academy")
    .in("status", ["active", "paused", "completed"])
    .limit(1)
    .maybeSingle();
  
  if (enrollmentError) {
    return NextResponse.json(
      { error: "Unable to verify gift eligibility." },
      { status: 500 },
    );
  }

  if (!enrollment) {
    return NextResponse.json(
      { error: "CASC Academy enrollment is required to download this gift." },
      { status: 403 },
    );
  }
  const filePath = path.join(
    process.cwd(),
    "public",
    "gifts",
    "Twelve Weeks to the CASC.pdf",
  );

  if (!fs.existsSync(filePath)) {
    return NextResponse.json(
      { error: "Gift file not found on server." },
      { status: 404 },
    );
  }

  const fileBuffer = fs.readFileSync(filePath);

  // Retain the first successful request timestamp for the one-time gift status.
  const { error: updateError } = await supabase
    .from("profiles")
    .update({ gift_downloaded_at: new Date().toISOString() })
    .eq("id", user.id)
    .is("gift_downloaded_at", null);

  if (updateError) {
    return NextResponse.json(
      { error: "Unable to record the gift download." },
      { status: 500 },
    );
  }

  return new NextResponse(fileBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition":
        'attachment; filename="Twelve Weeks to the CASC.pdf"',
      "Content-Length": fileBuffer.length.toString(),
      "Cache-Control": "private, no-cache, no-store, must-revalidate",
    },
  });
}
