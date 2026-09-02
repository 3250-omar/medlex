import { NextResponse, type NextRequest } from "next/server";
import { signUpSchema } from "@/lib/auth/validation";
import { createRouteClient } from "@/lib/supabase/route";

export async function POST(request: NextRequest) {
  const payload = signUpSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!payload.success) {
    return NextResponse.json(
      { error: "Please check the required fields." },
      { status: 400 },
    );
  }

  const { fullName, username, phone, email, password } = payload.data;
  const { response, supabase } = createRouteClient(request);
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        username,
        phone,
      },
    },
  });

  if (error || !data.user) {
    return NextResponse.json(
      { error: error?.message ?? "Unable to create your account." },
      { status: 400 },
    );
  }

  return NextResponse.json(
    {
      data: {
        userId: data.user.id,
        requiresEmailConfirmation: !data.session,
      },
    },
    { headers: response.headers },
  );
}
