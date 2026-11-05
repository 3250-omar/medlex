import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getPaddleClient } from "@/lib/payments/paddle/server";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ purchaseId: string }> },
) {
  const { purchaseId } = await params;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(purchaseId)) {
    return NextResponse.json({ error: "Invalid purchase ID" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createAdminClient();
  // course_payment_attempts has not yet been added to the generated database types.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = admin as any;
  const { data: course, error: courseError } = await admin
    .from("courses")
    .select("id")
    .eq("slug", "casc-academy")
    .maybeSingle();
  if (courseError || !course) {
    return NextResponse.json({ error: "Course unavailable" }, { status: 503 });
  }

  const { data: attempt, error: attemptError } = await db
    .from("course_payment_attempts")
    .select("status, provider_transaction_id")
    .eq("id", purchaseId)
    .eq("user_id", user.id)
    .eq("course_id", course.id)
    .maybeSingle();
  if (attemptError) return NextResponse.json({ error: "Purchase unavailable" }, { status: 503 });
  if (!attempt) return NextResponse.json({ error: "Purchase not found" }, { status: 404 });
  if (attempt.status !== "paid" || !attempt.provider_transaction_id) {
    return NextResponse.json({ status: attempt.status }, { headers: { "Cache-Control": "no-store" } });
  }

  try {
    const transaction = await getPaddleClient().transactions.get(attempt.provider_transaction_id);
    const totals = transaction.details?.totals;
    const amountMinor = Number(totals?.grandTotal);
    const currency = String(transaction.currencyCode);
    if (!totals || !Number.isSafeInteger(amountMinor) || amountMinor <= 0 || !/^[A-Z]{3}$/.test(currency)) {
      throw new Error("Paddle transaction total unavailable");
    }
    return NextResponse.json({
      status: "paid",
      transaction_id: transaction.id,
      value: amountMinor / 100,
      currency,
      item_id: "casc-academy",
      item_name: "The CASC Academy",
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("[Purchase conversion] Failed to load Paddle total", error);
    return NextResponse.json({ error: "Purchase details unavailable" }, { status: 503 });
  }
}
