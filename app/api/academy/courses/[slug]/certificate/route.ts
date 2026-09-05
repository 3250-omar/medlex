import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(request: Request, context: RouteParams) {
  const { slug } = await context.params;
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

  const { data, error } = await supabase.rpc("get_course_certificate_status", {
    target_course_slug: slug,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function POST(request: Request, context: RouteParams) {
  const { slug } = await context.params;
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

  let recipientName: string | null = null;
  try {
    const body = (await request.json()) as { recipient_name?: string };
    if (body?.recipient_name && typeof body.recipient_name === "string") {
      recipientName = body.recipient_name.trim();
    }
  } catch {
    // Body is optional
  }

  const { data, error } = await supabase.rpc("issue_course_certificate", {
    target_course_slug: slug,
    recipient_name_override: recipientName,
  });

  if (error) {
    const isThresholdError = error.message?.includes("progress_threshold_not_met");
    return NextResponse.json(
      {
        error: isThresholdError
          ? "Course progress must be at least 50% to claim a certificate."
          : error.message,
      },
      { status: isThresholdError ? 403 : 500 },
    );
  }

  return NextResponse.json({ data });
}
