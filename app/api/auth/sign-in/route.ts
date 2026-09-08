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

  const { response, supabase } = await createRouteClient(request);
  const { data, error } = await supabase.auth.signInWithPassword(payload.data);
  if (error || !data.user) {
    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 401 },
    );
  }

  const res = NextResponse.json({ data: { userId: data.user.id } });
  response.cookies.getAll().forEach((cookie) => {
    res.cookies.set(cookie.name, cookie.value, cookie);
  });
  return res;
}
