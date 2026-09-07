import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo/metadata";

const publicPaths = ["", "/founder", "/pathways", "/pathways/medico-legal", "/pathways/casc-academy", "/pathways/foundations", "/institutional", "/contact", "/faq", "/privacy", "/terms", "/refund-policy", "/register"];

export default function sitemap(): MetadataRoute.Sitemap {
  return (["en", "ar"] as const).flatMap((locale) =>
    publicPaths.map((path) => ({
      url: new URL(`/${locale}${path}`, siteUrl).toString(),
      lastModified: new Date(),
      changeFrequency: path === "" ? "weekly" : "monthly",
      priority: path === "" ? 1 : path.startsWith("/pathways") ? 0.9 : 0.7,
      alternates: { languages: { en: new URL(`/en${path}`, siteUrl).toString(), ar: new URL(`/ar${path}`, siteUrl).toString() } },
    })),
  );
}
