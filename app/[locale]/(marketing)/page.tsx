import type { Metadata } from "next";
import { createLocalizedMetadata, type Locale } from "@/lib/seo/metadata";
import { JsonLd } from "@/lib/seo/JsonLd";
import { createWebSiteSchema } from "@/lib/seo/schema";
import FlagshipCourseSection from "./_comps/FlagshipCourseSection";
import FounderSection from "./_comps/FounderSection";
import GiftsSection from "./_comps/GiftsSection";
import HeroSection from "./_comps/HeroSection";
import HomeFAQSection from "./_comps/HomeFAQSection";
import PathwaysSection from "./_comps/PathwaysSection";
import StandardsSection from "./_comps/StandardsSection";
import WhoWeAreSection from "./_comps/WhoWeAreSection";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  return createLocalizedMetadata(locale as Locale, "home");
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;

  return (
    <>
      <JsonLd data={createWebSiteSchema()} />
      <HeroSection locale={locale} />
      <WhoWeAreSection />
      <PathwaysSection />
      <FlagshipCourseSection locale={locale} />
      <StandardsSection />
      <GiftsSection />
      <FounderSection locale={locale} />
      <HomeFAQSection />
    </>
  );
}
