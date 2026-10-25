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
    .select("slug, updated_at, published_at, category, is_english_only")
    .or("status.eq.published,is_published.eq.true");

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

  const blogRoutes = (blogs || []).flatMap((blog) => {
    const isEnglishOnly =
      blog.category === "casc" || blog.is_english_only === true;
    const lastModified = blog.updated_at || blog.published_at || undefined;

    if (isEnglishOnly) {
      // CASC / English-only articles: produce exactly 1 URL, NO Arabic alternate
      return [
        {
          url: `${CANONICAL_ORIGIN}/en/blogs/${blog.slug}`,
          lastModified,
          alternates: {
            languages: {
              en: `${CANONICAL_ORIGIN}/en/blogs/${blog.slug}`,
              "x-default": `${CANONICAL_ORIGIN}/en/blogs/${blog.slug}`,
            },
          },
        },
      ];
    }

    // Bilingual articles (e.g. Medico-Legal): English and Arabic alternates
    return LOCALES.map((locale) => {
      const canonicalUrl = `${CANONICAL_ORIGIN}/${locale}/blogs/${blog.slug}`;
      const enUrl = `${CANONICAL_ORIGIN}/en/blogs/${blog.slug}`;
      const arUrl = `${CANONICAL_ORIGIN}/ar/blogs/${blog.slug}`;

      return {
        url: canonicalUrl,
        lastModified,
        alternates: {
          languages: {
            en: enUrl,
            ar: arUrl,
            "x-default": enUrl,
          },
        },
      };
    });
  });

  return [...staticRoutes, ...blogRoutes];
}
