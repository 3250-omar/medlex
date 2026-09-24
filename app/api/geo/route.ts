import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/geo
 * Debug endpoint: returns the detected country code from Vercel's edge headers.
 * Safe to remove after verifying country detection works in production.
 */
export async function GET(req: NextRequest) {
  const vercelCountry = req.headers.get("x-vercel-ip-country");
  const cfCountry = req.headers.get("cf-ipcountry");
  const middlewareCountry = req.headers.get("x-user-country");

  return NextResponse.json({
    detectedCountry: middlewareCountry || vercelCountry || cfCountry || "EG",
    sources: {
      "x-vercel-ip-country": vercelCountry,
      "cf-ipcountry": cfCountry,
      "x-user-country (from middleware)": middlewareCountry,
    },
  });
}
