import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";

const BOT_PATTERNS = [
  /bot/i,
  /crawl/i,
  /spider/i,
  /slurp/i,
  /headless/i,
  /lighthouse/i,
  /google-inspectiontool/i,
];

function isBot(userAgent?: string | null): boolean {
  if (!userAgent) return false;
  return BOT_PATTERNS.some((pattern) => pattern.test(userAgent));
}

const VisitPayloadSchema = z.object({
  visitor_hash: z.string().min(1).max(255),
  path: z.string().max(500).default("/"),
  referrer: z.string().max(500).nullable().optional(),
  utm_source: z.string().max(100).nullable().optional(),
  utm_medium: z.string().max(100).nullable().optional(),
  utm_campaign: z.string().max(100).nullable().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const userAgent = req.headers.get("user-agent") || "";
    if (isBot(userAgent)) {
      return NextResponse.json({ skipped: true, reason: "bot" });
    }

    const body = await req.json().catch(() => null);
    const parsed = VisitPayloadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parsed.error.issues },
        { status: 400 },
      );
    }

    const {
      visitor_hash,
      path: rawPath,
      referrer: cleanReferrer,
      utm_source: cleanSource,
      utm_medium: cleanMedium,
      utm_campaign: cleanCampaign,
    } = parsed.data;

    // Normalize path by stripping query strings and hash anchors for clean aggregation and deduplication
    const cleanPath = (rawPath.split("?")[0].split("#")[0] || "/").slice(
      0,
      500,
    );

    // Hash client IP with secret salt for GDPR compliance
    const forwardedFor = req.headers.get("x-forwarded-for");
    const rawIp = forwardedFor
      ? forwardedFor.split(",")[0].trim()
      : req.headers.get("x-real-ip") || "127.0.0.1";
    const salt =
      process.env.AUTH_OTP_HASH_SECRET ||
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      "medlex-salt";
    const ip_hash = crypto
      .createHash("sha256")
      .update(`${rawIp}:${salt}`)
      .digest("hex");

    const supabase = createAdminClient();

    // Deduplication check: check if same visitor visited same path within the last 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const { data: recentVisits } = await supabase
      .from("site_visits")
      .select("id")
      .eq("visitor_hash", visitor_hash)
      .eq("path", cleanPath)
      .gte("visited_at", fiveMinutesAgo)
      .limit(1);

    if (recentVisits && recentVisits.length > 0) {
      return NextResponse.json({ success: true, deduplicated: true });
    }

    await supabase.from("site_visits").insert({
      visitor_hash,
      path: cleanPath,
      referrer: cleanReferrer,
      utm_source: cleanSource,
      utm_medium: cleanMedium,
      utm_campaign: cleanCampaign,
      ip_hash,
      visited_at: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Visitor Ingestion Error]:", err);
    // Return 200 with error logged so client is never disrupted
    return NextResponse.json({ success: false }, { status: 200 });
  }
}
