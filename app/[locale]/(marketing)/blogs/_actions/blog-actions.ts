"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/types/database";

export type BlogRow = Database["public"]["Tables"]["blogs"]["Row"];

export type PublishedBlogItem = Pick<
  BlogRow,
  | "id"
  | "title_en"
  | "title_ar"
  | "slug"
  | "excerpt_en"
  | "excerpt_ar"
  | "cover_image"
  | "published_at"
  | "is_published"
  | "created_at"
  | "seo_title_en"
  | "seo_title_ar"
  | "seo_description_en"
  | "seo_description_ar"
  | "seo_tags"
  | "likes_count"
  | "shares_count"
>;

export interface ActionResponse<T = number> {
  success: boolean;
  count?: T;
  error?: string;
}

export async function getPublishedBlogs(): Promise<PublishedBlogItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blogs")
    .select(
      "id, title_en, title_ar, slug, excerpt_en, excerpt_ar, cover_image, published_at, is_published, created_at, seo_title_en, seo_title_ar, seo_description_en, seo_description_ar, seo_tags, likes_count, shares_count",
    )
    .or("status.eq.published,is_published.eq.true")
    .order("published_at", { ascending: false, nullsFirst: false });

  if (error) {
    console.error("Error fetching published blogs:", error);
    return [];
  }

  return data ?? [];
}

export async function getBlogBySlug(slug: string): Promise<BlogRow | null> {
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

export async function toggleBlogLike(
  blogId: string,
  increment: boolean,
): Promise<ActionResponse<number>> {
  try {
    const supabase = createAdminClient();
    const step = increment ? 1 : -1;

    // Execute atomic RPC function
    const { data, error } = await supabase.rpc("increment_blog_likes", {
      p_blog_id: blogId,
      p_increment: step,
    });

    if (error) {
      console.error("Error executing increment_blog_likes RPC:", error);

      // Fallback direct table update
      const { data: blog, error: fetchError } = await supabase
        .from("blogs")
        .select("likes_count")
        .eq("id", blogId)
        .single();

      if (fetchError || !blog) {
        return {
          success: false,
          error: fetchError?.message || "Blog not found",
        };
      }

      const current = blog.likes_count ?? 0;
      const nextCount = Math.max(0, current + step);

      const { error: updateError } = await supabase
        .from("blogs")
        .update({ likes_count: nextCount })
        .eq("id", blogId);

      if (updateError) {
        return { success: false, error: updateError.message };
      }

      return { success: true, count: nextCount };
    }

    return { success: true, count: Number(data) };
  } catch (err) {
    console.error("Error toggling blog like:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

export async function incrementBlogShares(
  blogId: string,
): Promise<ActionResponse<number>> {
  try {
    const supabase = createAdminClient();

    // Execute atomic RPC function
    const { data, error } = await supabase.rpc("increment_blog_shares", {
      p_blog_id: blogId,
    });

    if (error) {
      console.error("Error executing increment_blog_shares RPC:", error);

      // Fallback direct table update
      const { data: blog, error: fetchError } = await supabase
        .from("blogs")
        .select("shares_count")
        .eq("id", blogId)
        .single();

      if (fetchError || !blog) {
        return {
          success: false,
          error: fetchError?.message || "Blog not found",
        };
      }

      const current = blog.shares_count ?? 0;
      const nextCount = current + 1;

      const { error: updateError } = await supabase
        .from("blogs")
        .update({ shares_count: nextCount })
        .eq("id", blogId);

      if (updateError) {
        return { success: false, error: updateError.message };
      }

      return { success: true, count: nextCount };
    }

    return { success: true, count: Number(data) };
  } catch (err) {
    console.error("Error incrementing blog shares:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
