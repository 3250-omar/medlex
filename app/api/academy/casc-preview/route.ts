import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

type Row = Record<string, unknown>;
type Query = {
  eq: (column: string, value: string) => Query;
  single: () => Promise<{
    data: Row | null;
    error: { message: string } | null;
  }>;
};
type Client = {
  from: (table: string) => { select: (columns: string) => Query };
};

function asRows(value: unknown): Row[] {
  return Array.isArray(value)
    ? value.filter((item): item is Row =>
        Boolean(item && typeof item === "object"),
      )
    : [];
}

export async function GET() {
  // The preview is public, while standard course content remains protected by
  // learner-access RLS. This endpoint returns only the public sample station.
  const supabase = createAdminClient();
  const db = supabase as unknown as Client;
  const { data, error } = await db
    .from("courses")
    .select(
      "slug, course_releases(learning_units(id, slug, title, unit_code, sequence_number, content_blocks(id, block_type, sort_order, content)))",
    )
    .eq("slug", "casc-academy")
    .single();
  if (error || !data)
    return NextResponse.json(
      { error: "Preview is unavailable." },
      { status: 404 },
    );

  const units = asRows(data.course_releases).flatMap((release) =>
    asRows(release.learning_units),
  );
  const unit = units.find(
    (item) =>
      item.unit_code === "7.2" ||
      item.slug === "station-7-2" ||
      String(item.title ?? "").includes("7.2"),
  );
  if (!unit)
    return NextResponse.json(
      { error: "Station 7.2 is unavailable." },
      { status: 404 },
    );

  return NextResponse.json({ data: unit });
}
