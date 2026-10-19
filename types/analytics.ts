export interface SiteVisitRecord {
  id?: string;
  visitor_hash: string;
  path: string;
  referrer?: string | null;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  ip_hash: string;
  visited_at?: string;
}

export interface VisitorStatsSummary {
  today: {
    total_pageviews: number;
    unique_visitors: number;
  };
  last_7_days: {
    total_pageviews: number;
    unique_visitors: number;
  };
  last_30_days: {
    total_pageviews: number;
    unique_visitors: number;
  };
}

export interface TopArticleMetric {
  path: string;
  views: number;
  unique_visitors: number;
}

export interface ReferrerMetric {
  source: string;
  count: number;
}

export interface PostGiftFunnelStats {
  total_gift_1_downloads: number;
  total_gift_2_downloads: number;
  total_unique_gift_downloaders: number;
  total_enrolled_downloaders: number;
  conversion_rate_percentage: number;
}

export interface AnalyticsSummaryResponse {
  traffic: VisitorStatsSummary;
  top_articles: TopArticleMetric[];
  top_sources: ReferrerMetric[];
  funnel: PostGiftFunnelStats;
  generated_at: string;
}
