import type { Metadata } from "next";
import { createLocalizedMetadata, CANONICAL_ORIGIN, type Locale } from "@/lib/seo/metadata";
import { JsonLd } from "@/lib/seo/JsonLd";
import { createLearningResourceSchema, createBreadcrumbSchema } from "@/lib/seo/schema";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import PublicStationPreview from "../../_comps/PublicStationPreview";

interface StationPreviewPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: StationPreviewPageProps): Promise<Metadata> {
  const { locale } = await params;
  return createLocalizedMetadata(locale as Locale, "stationPreview");
}

export default async function StationPreviewPage({
  params,
}: StationPreviewPageProps) {
  const { locale } = await params;
  const isAr = locale === "ar";

  const breadcrumbs = [
    { label: isAr ? "الرئيسية" : "Home", href: `/${locale}` },
    { label: isAr ? "أكاديمية CASC" : "CASC Academy", href: `/${locale}/pathways/casc-academy` },
    { label: isAr ? "معاينة المحطة 7.2" : "Station 7.2 Preview" },
  ];

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: isAr ? "الرئيسية" : "Home", url: `${CANONICAL_ORIGIN}/${locale}` },
    {
      name: isAr ? "أكاديمية CASC" : "CASC Academy",
      url: `${CANONICAL_ORIGIN}/${locale}/pathways/casc-academy`,
    },
    {
      name: isAr ? "معاينة المحطة 7.2" : "Station 7.2 Preview",
      url: `${CANONICAL_ORIGIN}/${locale}/academy/preview/station-7-2`,
    },
  ]);

  return (
    <>
      <JsonLd data={createLearningResourceSchema(locale)} />
      <JsonLd data={breadcrumbSchema} />
      <div className="bg-navy border-b border-white/10 pt-20">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <Breadcrumbs items={breadcrumbs} />
        </div>
      </div>
      <PublicStationPreview locale={locale} />
    </>
  );
}
