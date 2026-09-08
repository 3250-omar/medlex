import { NextResponse, type NextRequest } from "next/server";
import { createRouteClient } from "@/lib/supabase/route";

export async function POST(request: NextRequest) {
  const { response, supabase } = await createRouteClient(request);
  const { error } = await supabase.auth.signOut();

  if (error) {
    const res = NextResponse.json(
      { error: "Unable to sign out." },
      { status: 500 },
    );
    response.cookies.getAll().forEach((cookie) => {
      res.cookies.set(cookie.name, cookie.value, cookie);
    });
    return res;
  }

  const res = NextResponse.json({ data: { signedOut: true } });
  response.cookies.getAll().forEach((cookie) => {
    res.cookies.set(cookie.name, cookie.value, cookie);
  });
  return res;
}
