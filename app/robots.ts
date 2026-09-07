import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo/metadata";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/en", "/ar"],
      disallow: [
        "/api/",
        "/en/academy",
        "/ar/academy",
        "/en/courses",
        "/ar/courses",
        "/en/profile",
        "/ar/profile",
        "/en/auth",
        "/ar/auth",
        "/en/login",
        "/ar/login",
      ],
    },
    sitemap: new URL("/sitemap.xml", siteUrl).toString(),
  };
}
