import { NextResponse, type NextRequest } from "next/server";
import { processOutboxBatch } from "@/lib/private-sessions/fulfillment";

export async function POST(req: NextRequest) {
  // 1. Authorize cron request with Bearer secret
  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();

  const expectedSecret =
    process.env.PRIVATE_SESSION_CRON_SECRET ||
    process.env.CRON_SECRET ||
    "medlex_cron_dev_secret";

  if (!token || token !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 2. Process bounded batch of outbox jobs (up to 10)
    const result = await processOutboxBatch(10);

    return NextResponse.json({
      success: true,
      claimedCount: result.claimedCount,
      successCount: result.successCount,
      failedCount: result.failedCount,
      processedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Outbox batch processing encountered an error",
      },
      { status: 500 },
    );
  }
}
