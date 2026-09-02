import { NextResponse, type NextRequest } from "next/server";
import { signInSchema } from "@/lib/auth/validation";
import { createRouteClient } from "@/lib/supabase/route";

export async function POST(request: NextRequest) {
  const payload = signInSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!payload.success) {
    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 400 },
    );
  }

  const { response, supabase } = createRouteClient(request);
  const { data, error } = await supabase.auth.signInWithPassword(payload.data);
  if (error || !data.user) {
    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 401 },
    );
  }

  return NextResponse.json(
    { data: { userId: data.user.id } },
    { headers: response.headers },
  );
}
