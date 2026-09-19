import type { Metadata } from "next";
import type { ReactNode } from "react";
import {
  createLocalizedMetadata,
  CANONICAL_ORIGIN,
  type Locale,
} from "@/lib/seo/metadata";
import { JsonLd } from "@/lib/seo/JsonLd";
import { createBreadcrumbSchema } from "@/lib/seo/schema";
import Breadcrumbs from "@/components/seo/Breadcrumbs";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return createLocalizedMetadata(locale as Locale, "pathwayFoundations");
}

export default async function FoundationsLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isAr = locale === "ar";

  const breadcrumbs = [
    { label: isAr ? "الرئيسية" : "Home", href: `/${locale}` },
    { label: isAr ? "المسارات" : "Pathways", href: `/${locale}#pathways` },
    { label: isAr ? "مِدلكس للتأسيس" : "MedLex Foundations" },
  ];

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: isAr ? "الرئيسية" : "Home", url: `${CANONICAL_ORIGIN}/${locale}` },
    {
      name: isAr ? "المسارات" : "Pathways",
      url: `${CANONICAL_ORIGIN}/${locale}/pathways`,
    },
    {
      name: isAr ? "مِدلكس للتأسيس" : "MedLex Foundations",
      url: `${CANONICAL_ORIGIN}/${locale}/pathways/foundations`,
    },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <div className="bg-navy border-b border-white/10 pt-20">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <Breadcrumbs items={breadcrumbs} />
        </div>
      </div>
      {children}
    </>
  );
}
