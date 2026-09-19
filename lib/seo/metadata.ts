import type { Metadata } from "next";

export const CANONICAL_ORIGIN =
  process.env.NEXT_PUBLIC_SITE_URL || "https://medlex-five.vercel.app";

// "https://medlexsolutions.com";
export const siteUrl = new URL(CANONICAL_ORIGIN);

export type Locale = "en" | "ar";

export type SeoRouteKey =
  | "home"
  | "founder"
  | "pathways"
  | "pathwayMedicoLegal"
  | "pathwayCascAcademy"
  | "pathwayFoundations"
  | "institutional"
  | "contact"
  | "faq"
  | "stationPreview"
  | "register"
  | "privacy"
  | "terms"
  | "refundPolicy";

export interface SeoRouteConfig {
  key: SeoRouteKey;
  path: string;
  translationKey: string;
  schemaType:
    | "WebSite"
    | "ProfilePage"
    | "CollectionPage"
    | "WebPage"
    | "Course"
    | "Service"
    | "ContactPage"
    | "FAQPage"
    | "LearningResource";
  lastModified: string;
  parentKey?: SeoRouteKey;
}

export const SEO_ROUTES_REGISTRY: Record<SeoRouteKey, SeoRouteConfig> = {
  home: {
    key: "home",
    path: "",
    translationKey: "home",
    schemaType: "WebSite",
    lastModified: "2026-03-01T00:00:00.000Z",
  },
  founder: {
    key: "founder",
    path: "/founder",
    translationKey: "founder",
    schemaType: "ProfilePage",
    lastModified: "2026-03-01T00:00:00.000Z",
  },
  pathways: {
    key: "pathways",
    path: "/pathways",
    translationKey: "pathways",
    schemaType: "CollectionPage",
    lastModified: "2026-03-01T00:00:00.000Z",
  },
  pathwayMedicoLegal: {
    key: "pathwayMedicoLegal",
    path: "/pathways/medico-legal",
    translationKey: "pathwayMedicoLegal",
    schemaType: "WebPage",
    lastModified: "2026-03-01T00:00:00.000Z",
    parentKey: "pathways",
  },
  pathwayCascAcademy: {
    key: "pathwayCascAcademy",
    path: "/pathways/casc-academy",
    translationKey: "pathwayCascAcademy",
    schemaType: "Course",
    lastModified: "2026-03-01T00:00:00.000Z",
    parentKey: "pathways",
  },
  pathwayFoundations: {
    key: "pathwayFoundations",
    path: "/pathways/foundations",
    translationKey: "pathwayFoundations",
    schemaType: "WebPage",
    lastModified: "2026-03-01T00:00:00.000Z",
    parentKey: "pathways",
  },
  institutional: {
    key: "institutional",
    path: "/institutional",
    translationKey: "institutional",
    schemaType: "Service",
    lastModified: "2026-03-01T00:00:00.000Z",
  },
  contact: {
    key: "contact",
    path: "/contact",
    translationKey: "contact",
    schemaType: "ContactPage",
    lastModified: "2026-03-01T00:00:00.000Z",
  },
  faq: {
    key: "faq",
    path: "/faq",
    translationKey: "faq",
    schemaType: "FAQPage",
    lastModified: "2026-03-01T00:00:00.000Z",
  },
  stationPreview: {
    key: "stationPreview",
    path: "/academy/preview/station-7-2",
    translationKey: "stationPreview",
    schemaType: "LearningResource",
    lastModified: "2026-03-01T00:00:00.000Z",
    parentKey: "pathwayCascAcademy",
  },
  register: {
    key: "register",
    path: "/register",
    translationKey: "register",
    schemaType: "WebPage",
    lastModified: "2026-03-01T00:00:00.000Z",
  },
  privacy: {
    key: "privacy",
    path: "/privacy-policy",
    translationKey: "privacy",
    schemaType: "WebPage",
    lastModified: "2026-03-01T00:00:00.000Z",
  },
  terms: {
    key: "terms",
    path: "/terms",
    translationKey: "terms",
    schemaType: "WebPage",
    lastModified: "2026-03-01T00:00:00.000Z",
  },
  refundPolicy: {
    key: "refundPolicy",
    path: "/refund-policy",
    translationKey: "refundPolicy",
    schemaType: "WebPage",
    lastModified: "2026-03-01T00:00:00.000Z",
  },
};

export function getCanonicalUrl(locale: Locale, path: string = ""): string {
  const normalized = path ? `/${path.replace(/^\/+/, "")}` : "";
  return `${CANONICAL_ORIGIN}/${locale}${normalized}`;
}

export function getAbsoluteOgImageUrl(
  routeKey: SeoRouteKey,
  locale: Locale,
): string {
  return `${CANONICAL_ORIGIN}/api/og?route=${encodeURIComponent(routeKey)}&locale=${locale}`;
}

export async function createLocalizedMetadata(
  locale: Locale,
  routeKey: SeoRouteKey,
): Promise<Metadata> {
  const config = SEO_ROUTES_REGISTRY[routeKey];
  if (!config) {
    throw new Error(`Unknown SeoRouteKey: ${routeKey}`);
  }

  const messages = (await import(`@/lib/i18n/translations/${locale}.json`))
    .default;
  const seoData = messages?.seo?.[config.translationKey] ?? {};

  const title = seoData.title ?? "MedLex";
  const description =
    seoData.description ??
    "Forensic psychiatry education and medicolegal training by MedLex.";
  const imageAlt = seoData.imageAlt ?? title;
  const ogTitle = seoData.ogTitle ?? title;
  const ogDescription = seoData.ogDescription ?? description;

  const canonicalUrl = getCanonicalUrl(locale, config.path);
  const ogImageUrl = getAbsoluteOgImageUrl(routeKey, locale);

  const isHome = routeKey === "home";

  return {
    title: isHome ? { absolute: title } : title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${CANONICAL_ORIGIN}/en${config.path}`,
        ar: `${CANONICAL_ORIGIN}/ar${config.path}`,
        "x-default": `${CANONICAL_ORIGIN}/en${config.path}`,
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "ar" ? "ar_EG" : "en_US",
      url: canonicalUrl,
      siteName: "MedLex",
      title: ogTitle,
      description: ogDescription,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: [ogImageUrl],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export const CASC_PRIVATE_ROBOTS: Metadata["robots"] = {
  index: false,
  follow: false,
  nocache: true,
  noarchive: true,
  nosnippet: true,
  googleBot: {
    index: false,
    follow: false,
    noimageindex: true,
    noarchive: true,
    nosnippet: true,
  },
};

export function createPrivateMetadata(title?: string): Metadata {
  return {
    title: title ? `${title} | MedLex` : undefined,
    robots: CASC_PRIVATE_ROBOTS,
  };
}

/**
 * Backward compatibility helper for dynamic/legacy metadata callers.
 */
export function createPageMetadata({
  locale,
  path = "",
  title,
  description,
  noIndex = false,
}: {
  locale: Locale;
  path?: string;
  title: string;
  description: string;
  noIndex?: boolean;
}): Metadata {
  const normalizedPath = path ? `/${path.replace(/^\/+/, "")}` : "";
  const canonical = `${CANONICAL_ORIGIN}/${locale}${normalizedPath}`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        en: `${CANONICAL_ORIGIN}/en${normalizedPath}`,
        ar: `${CANONICAL_ORIGIN}/ar${normalizedPath}`,
        "x-default": `${CANONICAL_ORIGIN}/en${normalizedPath}`,
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
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}
