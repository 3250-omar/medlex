import { NextResponse, type NextRequest } from "next/server";
import { createRouteClient } from "@/lib/supabase/route";

type SubscriptionResult = {
  enrollmentId: string;
  releaseId: string;
  firstUnitSlug: string | null;
};

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const { response, supabase } = createRouteClient(request);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json(
      { error: "authentication_required" },
      { status: 401 },
    );

  const client = supabase as unknown as {
    rpc: (
      name: string,
      args: Record<string, string>,
    ) => Promise<{
      data: SubscriptionResult | null;
      error: { message: string } | null;
    }>;
  };
  const { data, error } = await client.rpc("subscribe_to_free_course", {
    target_course_slug: slug,
  });
  if (error || !data) {
    const status = error?.message.includes("payment_required") ? 402 : 400;
    return NextResponse.json(
      { error: error?.message ?? "Unable to subscribe." },
      { status },
    );
  }
  return NextResponse.json({ data }, { headers: response.headers });
}
