import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo/metadata";
import FlagshipCourseSection from "./_comps/FlagshipCourseSection";
import FounderSection from "./_comps/FounderSection";
import GiftsSection from "./_comps/GiftsSection";
import HeroSection from "./_comps/HeroSection";
import HomeFAQSection from "./_comps/HomeFAQSection";
import PathwaysSection from "./_comps/PathwaysSection";
import StandardsSection from "./_comps/StandardsSection";
import WhoWeAreSection from "./_comps/WhoWeAreSection";
import FeedbackSection from "./pathways/_comp/FeedbackSection";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  const isArabic = locale === "ar";

  return createPageMetadata({
    locale: isArabic ? "ar" : "en",
    path: "",
    title: isArabic
      ? "مِدلكس — حيث يلتقي الطب بالعدالة"
      : "MedLex — Where Medicine Meets Justice",
    description: isArabic
      ? "مِدلكس منصة تعليم مهني تخصصية يقودها مؤسسها للأطباء النفسيين والأخصائيين النفسيين والقيادات السريرية — التعليم الطبي القانوني، وأكاديمية CASC، ومِدلكس للتأسيس."
      : "MedLex is a founder-led professional education platform for psychiatrists, psychologists and clinical leaders — medico-legal education, The CASC Academy, and MedLex Foundations.",
  });
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;

  return (
    <>
      <HeroSection locale={locale} />
      <WhoWeAreSection />
      <PathwaysSection />
      <FlagshipCourseSection locale={locale} />
      <FeedbackSection pathway="all" />
      <StandardsSection />
      <GiftsSection />
      <HomeFAQSection />
      <FounderSection locale={locale} />
    </>
  );
}
