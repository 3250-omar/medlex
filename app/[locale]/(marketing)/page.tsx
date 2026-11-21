import type { Metadata } from "next";
import { headers } from "next/headers";
import { createLocalizedMetadata, type Locale } from "@/lib/seo/metadata";
import { JsonLd } from "@/lib/seo/JsonLd";
import { createWebSiteSchema } from "@/lib/seo/schema";
import { getPublishedCoursesForCountry } from "@/lib/courses/publicCourses";
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
  const headersList = await headers();
  const countryCode = (
    headersList.get("x-user-country") ||
    headersList.get("x-vercel-ip-country") ||
    headersList.get("cf-ipcountry") ||
    "EG"
  ).toUpperCase();
  const initialCourses = await getPublishedCoursesForCountry(countryCode);

  return (
    <>
      <JsonLd data={createWebSiteSchema()} />
      <HeroSection locale={locale} />
      <WhoWeAreSection />
      <PathwaysSection initialCourses={initialCourses} />
      <FlagshipCourseSection locale={locale} />
      <StandardsSection />
      <GiftsSection />
      <FounderSection locale={locale} />
      <HomeFAQSection />
    </>
  );
}
