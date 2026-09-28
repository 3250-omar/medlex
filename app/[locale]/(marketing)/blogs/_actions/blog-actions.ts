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
  | "views_count"
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
      "id, title_en, title_ar, slug, excerpt_en, excerpt_ar, cover_image, published_at, is_published, created_at, seo_title_en, seo_title_ar, seo_description_en, seo_description_ar, seo_tags, likes_count, shares_count, views_count",
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

export async function getAdjacentBlogs(
  currentPublishedAt: string | null,
  currentId: string,
): Promise<{ prev: PublishedBlogItem | null; next: PublishedBlogItem | null }> {
  try {
    const supabase = await createClient();
    const selectFields =
      "id, title_en, title_ar, slug, excerpt_en, excerpt_ar, cover_image, published_at, is_published, created_at, seo_title_en, seo_title_ar, seo_description_en, seo_description_ar, seo_tags, likes_count, shares_count, views_count";

    const dateToCompare = currentPublishedAt || new Date().toISOString();

    // Previous (older article)
    const { data: prevData } = await supabase
      .from("blogs")
      .select(selectFields)
      .or("status.eq.published,is_published.eq.true")
      .lt("published_at", dateToCompare)
      .neq("id", currentId)
      .order("published_at", { ascending: false })
      .limit(1);

    // Next (newer article)
    const { data: nextData } = await supabase
      .from("blogs")
      .select(selectFields)
      .or("status.eq.published,is_published.eq.true")
      .gt("published_at", dateToCompare)
      .neq("id", currentId)
      .order("published_at", { ascending: true })
      .limit(1);

    return {
      prev: (prevData?.[0] as PublishedBlogItem) ?? null,
      next: (nextData?.[0] as PublishedBlogItem) ?? null,
    };
  } catch (err) {
    console.error("Error fetching adjacent blogs:", err);
    return { prev: null, next: null };
  }
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

export async function incrementBlogViews(
  blogId: string,
): Promise<ActionResponse<number>> {
  try {
    const supabase = createAdminClient();

    // Execute atomic RPC function
    const { data, error } = await supabase.rpc("increment_blog_views", {
      p_blog_id: blogId,
    });

    if (error) {
      console.warn(
        "RPC increment_blog_views unavailable, attempting fallback:",
        error.message,
      );

      // Fallback direct table update
      const { data: blog, error: fetchError } = await supabase
        .from("blogs")
        .select("views_count")
        .eq("id", blogId)
        .single();

      if (fetchError || !blog) {
        return {
          success: false,
          error: fetchError?.message || "Blog not found",
        };
      }

      const current = blog.views_count ?? 0;
      const nextCount = current + 1;

      const { error: updateError } = await supabase
        .from("blogs")
        .update({ views_count: nextCount })
        .eq("id", blogId);

      if (updateError) {
        return { success: false, error: updateError.message };
      }

      return { success: true, count: nextCount };
    }

    return { success: true, count: Number(data) };
  } catch (err) {
    console.error("Error incrementing blog views:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
