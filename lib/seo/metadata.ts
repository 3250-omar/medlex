import type { Metadata } from "next";

export const siteUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://medlex.academy",
);

type Locale = "en" | "ar";

interface PageMetadataInput {
  locale: Locale;
  path?: string;
  title: string;
  description: string;
  noIndex?: boolean;
}

export function createPageMetadata({
  locale,
  path = "",
  title,
  description,
  noIndex = false,
}: PageMetadataInput): Metadata { 
  const normalizedPath = path ? `/${path.replace(/^\//, "")}` : "";
  const canonical = `/${locale}${normalizedPath}`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        en: `/en${normalizedPath}`,
        ar: `/ar${normalizedPath}`,
        "x-default": `/en${normalizedPath}`,
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "ar" ? "ar_EG" : "en_US",
      url: canonical,
      siteName: "MedLex",
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: noIndex ? { index: false, follow: false } : undefined,
  };
}
