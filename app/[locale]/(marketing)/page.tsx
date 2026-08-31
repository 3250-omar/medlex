import AcademyPreviewSection from "./_comp/AcademyPreviewSection";
import FlagshipCourseSection from "./_comp/FlagshipCourseSection";
import FounderSection from "./_comp/FounderSection";
import HeroSection from "./_comp/HeroSection";
import InstitutionalSection from "./_comp/InstitutionalSection";
import MarqueeStrip from "./_comp/MarqueeStrip";
import PathwaysSection from "./_comp/PathwaysSection";
import StatsBar from "./_comp/StatsBar";
import WhoWeAreSection from "./_comp/WhoWeAreSection";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;

  return (
    <>
      <HeroSection locale={locale} />
      <MarqueeStrip />
      <StatsBar />
      <WhoWeAreSection />
      <PathwaysSection locale={locale} />
      <FlagshipCourseSection locale={locale} />
      <AcademyPreviewSection locale={locale} />
      <FounderSection locale={locale} />
      <InstitutionalSection locale={locale} />
    </>
  );
}
