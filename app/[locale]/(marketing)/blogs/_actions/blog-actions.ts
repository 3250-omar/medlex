"use server";

import { createClient } from "@/lib/supabase/server";

export async function getPublishedBlogs() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blogs")
    .select(
      "id, title_en, title_ar, slug, excerpt_en, excerpt_ar, cover_image, published_at, is_published, created_at, seo_title_en, seo_title_ar, seo_description_en, seo_description_ar, seo_tags"
    )
    .or("status.eq.published,is_published.eq.true")
    .order("published_at", { ascending: false, nullsFirst: false });

  if (error) {
    console.error("Error fetching published blogs:", error);
    return [];
  }

  return data || [];
}

export async function getBlogBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("slug", slug)
    .or("status.eq.published,is_published.eq.true")
    .single();

  if (error) {
    console.error(`Error fetching blog with slug ${slug}:`, error);
    return null;
  }

  return data;
}
