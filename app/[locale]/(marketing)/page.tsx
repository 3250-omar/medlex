import FlagshipCourseSection from "./_comp/FlagshipCourseSection";
import FounderSection from "./_comp/FounderSection";
import HeroSection from "./_comp/HeroSection";
import PathwaysSection from "./_comp/PathwaysSection";
import StandardsSection from "./_comp/StandardsSection";
import WhoWeAreSection from "./_comp/WhoWeAreSection";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;

  return (
    <>
      <HeroSection locale={locale} />
      <WhoWeAreSection />
      <PathwaysSection locale={locale} />
      <FlagshipCourseSection locale={locale} />
      <StandardsSection />
      <FounderSection locale={locale} />
    </>
  );
}