import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { availabilityQuerySchema } from "@/lib/private-sessions/schemas";
import {
  getCorrelationId,
  validationError,
  unauthorizedError,
  internalError,
} from "@/lib/private-sessions/http";
import type { SlotDTO } from "@/lib/private-sessions/types";

export async function GET(req: NextRequest) {
  const correlationId = getCorrelationId(req);
  const searchParams = req.nextUrl.searchParams;

  const queryParams = {
    courseSlug: searchParams.get("courseSlug") ?? "casc-academy",
    from: searchParams.get("from") ?? "",
    to: searchParams.get("to") ?? "",
  };

  const validation = availabilityQuerySchema.safeParse(queryParams);
  if (!validation.success) {
    return validationError(
      "Invalid availability parameters",
      validation.error.flatten().fieldErrors,
      correlationId,
    );
  }

  try {
    const supabase = await createClient();

    // 1. Authenticate user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return unauthorizedError(
        "Sign in to view session availability",
        correlationId,
      );
    }

    // Convert date bounds (YYYY-MM-DD) to ISO UTC bounds
    const fromUtc = new Date(`${validation.data.from}T00:00:00Z`).toISOString();
    const toUtc = new Date(`${validation.data.to}T23:59:59Z`).toISOString();

    // 2. Call security-definer RPC list_eligible_private_session_slots
    const { data: slotsData, error: rpcError } = await supabase.rpc(
      "list_eligible_private_session_slots",
      {
        p_course_slug: validation.data.courseSlug,
        p_from: fromUtc,
        p_to: toUtc,
      },
    );

    if (rpcError) {
      // Fallback query if RPC is compiling or initializing
      const { data: fallbackSlots, error: queryError } = await supabase
        .from("private_session_slots")
        .select(
          `
          id,
          starts_at,
          ends_at,
          source_timezone,
          private_session_hosts!inner (
            display_name,
            is_active
          )
        `,
        )
        .eq("status", "available")
        .gt(
          "starts_at",
          new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        )
        .gte("starts_at", fromUtc)
        .lte("starts_at", toUtc)
        .order("starts_at", { ascending: true });

      if (queryError) {
        return internalError(
          "Failed to query slot availability",
          correlationId,
        );
      }

      const formattedFallback: SlotDTO[] = (
        (fallbackSlots as unknown as Array<{
          id: string;
          starts_at: string;
          ends_at: string;
          private_session_hosts?: { display_name?: string } | null;
        }>) || []
      ).map((s) => ({
        id: s.id,
        startsAt: s.starts_at,
        endsAt: s.ends_at,
        cairoTimezone: "Africa/Cairo",
        hostDisplayName: s.private_session_hosts?.display_name || "Instructor",
      }));

      return NextResponse.json({ data: formattedFallback });
    }

    const formattedSlots: SlotDTO[] = (
      (slotsData as unknown as Array<{
        id: string;
        starts_at: string;
        ends_at: string;
        host_display_name?: string;
      }>) || []
    ).map((s) => ({
      id: s.id,
      startsAt: s.starts_at,
      endsAt: s.ends_at,
      cairoTimezone: "Africa/Cairo",
      hostDisplayName: s.host_display_name || "Instructor",
    }));

    return NextResponse.json({ data: formattedSlots });
  } catch {
    return internalError("Error loading session availability", correlationId);
  }
}
