import { createAdminClient } from "@/lib/supabase/admin";
import type { PostGiftFunnelStats } from "@/types/analytics";

export async function calculatePostGiftFunnel(): Promise<PostGiftFunnelStats> {
  const supabase = createAdminClient();

  try {
    // 1. Fetch registered downloaders from profiles
    const { data: profileDownloaders } = await supabase
      .from("profiles")
      .select("id, gift_1_downloaded_at, gift_2_downloaded_at")
      .or("gift_1_downloaded_at.not.is.null,gift_2_downloaded_at.not.is.null");

    // 2. Fetch guest downloaders from contacts_requests
    const { data: contactLeads } = await supabase
      .from("contacts_requests")
      .select("gmail, notes")
      .ilike("notes", "%Free guide download%");

    let gift1Count = 0;
    let gift2Count = 0;
    const downloaderIds: string[] = [];
    const uniqueLeadKeys = new Set<string>();

    if (profileDownloaders) {
      for (const p of profileDownloaders) {
        downloaderIds.push(p.id);
        uniqueLeadKeys.add(p.id);
        if (p.gift_1_downloaded_at) gift1Count++;
        if (p.gift_2_downloaded_at) gift2Count++;
      }
    }

    if (contactLeads) {
      for (const c of contactLeads) {
        const email = c.gmail?.trim().toLowerCase();
        if (email) uniqueLeadKeys.add(email);
        const notes = (c.notes || "").toLowerCase();
        if (notes.includes("briefing")) gift1Count++;
        if (notes.includes("error")) gift2Count++;
      }
    }

    const uniqueDownloaders = uniqueLeadKeys.size;
    if (uniqueDownloaders === 0) {
      return {
        total_gift_1_downloads: 0,
        total_gift_2_downloads: 0,
        total_unique_gift_downloaders: 0,
        total_enrolled_downloaders: 0,
        conversion_rate_percentage: 0,
      };
    }

    // 3. Fetch active enrollments for profile downloaders
    let totalEnrolledDownloaders = 0;
    if (downloaderIds.length > 0) {
      const { data: enrollments } = await supabase
        .from("enrollments")
        .select("user_id")
        .eq("status", "active")
        .in("user_id", downloaderIds);

      const enrolledUserIds = new Set(enrollments?.map((e) => e.user_id) || []);
      totalEnrolledDownloaders = enrolledUserIds.size;
    }

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
