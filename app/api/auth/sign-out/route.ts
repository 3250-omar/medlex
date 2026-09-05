import { NextResponse, type NextRequest } from "next/server";
import { createRouteClient } from "@/lib/supabase/route";

export async function POST(request: NextRequest) {
  const { response, supabase } = createRouteClient(request);
  const { error } = await supabase.auth.signOut();

  if (error) {
    return NextResponse.json(
      { error: "Unable to sign out." },
      { status: 500, headers: response.headers },
    );
  }

  return NextResponse.json(
    { data: { signedOut: true } },
    { headers: response.headers },
  );
}
