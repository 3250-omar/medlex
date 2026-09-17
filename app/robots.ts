import type { MetadataRoute } from "next";
import { CANONICAL_ORIGIN } from "@/lib/seo/metadata";

export default function robots(): MetadataRoute.Robots {
  const isNonProduction =
    process.env.VERCEL_ENV === "preview" ||
    process.env.NEXT_PUBLIC_BLOCK_INDEXING === "true";

  if (isNonProduction) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
      sitemap: `${CANONICAL_ORIGIN}/sitemap.xml`,
      host: CANONICAL_ORIGIN,
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: [
        "/",
        "/en/academy/preview/station-7-2",
        "/ar/academy/preview/station-7-2",
      ],
      disallow: [
        "/api/",
        "/en/academy/",
        "/ar/academy/",
        "/en/courses/",
        "/ar/courses/",
        "/en/profile/",
        "/ar/profile/",
        "/en/auth/",
        "/ar/auth/",
        "/en/login/",
        "/ar/login/",
      ],
    },
    sitemap: `${CANONICAL_ORIGIN}/sitemap.xml`,
    host: CANONICAL_ORIGIN,
  };
}
