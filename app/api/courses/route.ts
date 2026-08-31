import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("courses")
    .select("id, slug, title_en, title_ar, description_en, description_ar, price, access_duration_days, points_on_completion, is_published, created_at")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "Unable to load courses" }, { status: 500 });
  }

  return NextResponse.json({ data });
}
