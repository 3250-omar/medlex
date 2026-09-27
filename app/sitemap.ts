import type { MetadataRoute } from "next";
import {
  SEO_ROUTES_REGISTRY,
  CANONICAL_ORIGIN,
  type Locale,
} from "@/lib/seo/metadata";

import { createClient } from "@/lib/supabase/server";

const LOCALES: Locale[] = ["en", "ar"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = Object.values(SEO_ROUTES_REGISTRY);
  const supabase = await createClient();

  const { data: blogs } = await supabase
    .from("blogs")
    .select("slug, updated_at, published_at")
    .eq("status", "published");

  const staticRoutes = LOCALES.flatMap((locale) =>
    routes.map((config) => {
      const canonicalUrl = `${CANONICAL_ORIGIN}/${locale}${config.path}`;
      const enUrl = `${CANONICAL_ORIGIN}/en${config.path}`;
      const arUrl = `${CANONICAL_ORIGIN}/ar${config.path}`;

      return {
        url: canonicalUrl,
        lastModified: config.lastModified,
        alternates: {
          languages: {
            en: enUrl,
            ar: arUrl,
            "x-default": enUrl,
          },
        },
      };
    }),
  );

  const blogRoutes = (blogs || []).flatMap((blog) =>
    LOCALES.map((locale) => {
      const canonicalUrl = `${CANONICAL_ORIGIN}/${locale}/blogs/${blog.slug}`;
      const enUrl = `${CANONICAL_ORIGIN}/en/blogs/${blog.slug}`;
      const arUrl = `${CANONICAL_ORIGIN}/ar/blogs/${blog.slug}`;

      return {
        url: canonicalUrl,
        lastModified:
          blog.updated_at || blog.published_at || undefined,
        alternates: {
          languages: {
            en: enUrl,
            ar: arUrl,
            "x-default": enUrl,
          },
        },
      };
    }),
  );

  return [...staticRoutes, ...blogRoutes];
}
