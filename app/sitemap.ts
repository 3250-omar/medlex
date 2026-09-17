import type { MetadataRoute } from "next";
import {
  SEO_ROUTES_REGISTRY,
  CANONICAL_ORIGIN,
  type Locale,
} from "@/lib/seo/metadata";

const LOCALES: Locale[] = ["en", "ar"];

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = Object.values(SEO_ROUTES_REGISTRY);

  return LOCALES.flatMap((locale) =>
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
}
