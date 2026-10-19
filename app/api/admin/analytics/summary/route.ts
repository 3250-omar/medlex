import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { calculatePostGiftFunnel } from "@/lib/analytics/funnel";
import { extractReferrerDomain } from "@/lib/analytics/entrypoint";
import type {
  AnalyticsSummaryResponse,
  TopArticleMetric,
  ReferrerMetric,
} from "@/types/analytics";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const userClient = await createClient();
    const {
      data: { user },
    } = await userClient.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createAdminClient();
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden: Admin privileges required" },
        { status: 403 },
      );
    }

    const now = new Date();
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    ).toISOString();
    const sevenDaysAgo = new Date(
      now.getTime() - 7 * 24 * 60 * 60 * 1000,
    ).toISOString();
    const thirtyDaysAgo = new Date(
      now.getTime() - 30 * 24 * 60 * 60 * 1000,
    ).toISOString();

    // 1. Fetch visits for the last 30 days
    const { data: visits, error: visitsErr } = await supabase
      .from("site_visits")
      .select("path, referrer, utm_source, visitor_hash, visited_at")
      .gte("visited_at", thirtyDaysAgo)
      .order("visited_at", { ascending: false });

    if (visitsErr) {
      console.warn(
        "[Analytics Summary] site_visits query note:",
        visitsErr.message,
      );
    }

    const allVisits = visits || [];

    // Aggregations
    let todayPageviews = 0;
    const todayVisitors = new Set<string>();

    let sevenDaysPageviews = 0;
    const sevenDaysVisitors = new Set<string>();

    let thirtyDaysPageviews = 0;
    const thirtyDaysVisitors = new Set<string>();

    const pathViews: Record<string, { views: number; visitors: Set<string> }> =
      {};
    const sourceCounts: Record<string, number> = {};

    for (const v of allVisits) {
      const vTime = v.visited_at || "";
      const vHash = v.visitor_hash;
      const vPath = v.path || "/";

      // 30 days
      thirtyDaysPageviews++;
      thirtyDaysVisitors.add(vHash);

      // 7 days
      if (vTime && vTime >= sevenDaysAgo) {
        sevenDaysPageviews++;
        sevenDaysVisitors.add(vHash);
      }

      // Today
      if (vTime && vTime >= todayStart) {
        todayPageviews++;
        todayVisitors.add(vHash);
      }

      // Paths (focusing on articles and key pathways)
      if (!pathViews[vPath]) {
        pathViews[vPath] = { views: 0, visitors: new Set() };
      }
      pathViews[vPath].views++;
      pathViews[vPath].visitors.add(vHash);

      // Sources (UTM or Referrer)
      const source = v.utm_source
        ? `Campaign: ${v.utm_source}`
        : extractReferrerDomain(v.referrer);
      sourceCounts[source] = (sourceCounts[source] || 0) + 1;
    }

    // Top articles sorted by views
    const topArticles: TopArticleMetric[] = Object.entries(pathViews)
      .map(([path, data]) => ({
        path,
        views: data.views,
        unique_visitors: data.visitors.size,
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);

    // Top traffic sources
    const topSources: ReferrerMetric[] = Object.entries(sourceCounts)
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    // 2. Fetch Post-Gift Funnel
    const funnel = await calculatePostGiftFunnel();

    const response: AnalyticsSummaryResponse = {
      traffic: {
        today: {
          total_pageviews: todayPageviews,
          unique_visitors: todayVisitors.size,
        },
        last_7_days: {
          total_pageviews: sevenDaysPageviews,
          unique_visitors: sevenDaysVisitors.size,
        },
        last_30_days: {
          total_pageviews: thirtyDaysPageviews,
          unique_visitors: thirtyDaysVisitors.size,
        },
      },
      top_articles: topArticles,
      top_sources: topSources,
      funnel,
      generated_at: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (err) {
    console.error("[Analytics Summary API Error]:", err);
    return NextResponse.json(
      { error: "Failed to generate analytics summary" },
      { status: 500 },
    );
  }
}
