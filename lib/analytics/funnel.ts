import { createAdminClient } from "@/lib/supabase/admin";
import type { PostGiftFunnelStats } from "@/types/analytics";

export async function calculatePostGiftFunnel(): Promise<PostGiftFunnelStats> {
  const supabase = createAdminClient();

  try {
    // 1. Fetch profiles with gift download timestamps
    const { data: downloaders, error: profileErr } = await supabase
      .from("profiles")
      .select("id, gift_1_downloaded_at, gift_2_downloaded_at")
      .or("gift_1_downloaded_at.not.is.null,gift_2_downloaded_at.not.is.null");

    if (profileErr || !downloaders) {
      console.error("[PostGiftFunnel] Profiles query error:", profileErr);
      return {
        total_gift_1_downloads: 0,
        total_gift_2_downloads: 0,
        total_unique_gift_downloaders: 0,
        total_enrolled_downloaders: 0,
        conversion_rate_percentage: 0,
      };
    }

    let gift1Count = 0;
    let gift2Count = 0;
    const downloaderIds: string[] = [];

    for (const p of downloaders) {
      downloaderIds.push(p.id);
      if (p.gift_1_downloaded_at) gift1Count++;
      if (p.gift_2_downloaded_at) gift2Count++;
    }

    const uniqueDownloaders = downloaderIds.length;
    if (uniqueDownloaders === 0) {
      return {
        total_gift_1_downloads: 0,
        total_gift_2_downloads: 0,
        total_unique_gift_downloaders: 0,
        total_enrolled_downloaders: 0,
        conversion_rate_percentage: 0,
      };
    }

    // 2. Fetch active enrollments for these downloaders
    const { data: enrollments, error: enrolErr } = await supabase
      .from("enrollments")
      .select("user_id")
      .eq("status", "active")
      .in("user_id", downloaderIds);

    if (enrolErr) {
      console.error("[PostGiftFunnel] Enrollments query error:", enrolErr);
    }

    const enrolledUserIds = new Set(enrollments?.map((e) => e.user_id) || []);
    const totalEnrolledDownloaders = enrolledUserIds.size;
    const conversionRate = (totalEnrolledDownloaders / uniqueDownloaders) * 100;

    return {
      total_gift_1_downloads: gift1Count,
      total_gift_2_downloads: gift2Count,
      total_unique_gift_downloaders: uniqueDownloaders,
      total_enrolled_downloaders: totalEnrolledDownloaders,
      conversion_rate_percentage: Math.round(conversionRate * 10) / 10,
    };
  } catch (err) {
    console.error("[PostGiftFunnel] Unexpected calculation error:", err);
    return {
      total_gift_1_downloads: 0,
      total_gift_2_downloads: 0,
      total_unique_gift_downloaders: 0,
      total_enrolled_downloaders: 0,
      conversion_rate_percentage: 0,
    };
  }
}
