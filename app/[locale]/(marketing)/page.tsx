import FlagshipCourseSection from "./_comps/FlagshipCourseSection";
import FounderSection from "./_comps/FounderSection";
import HeroSection from "./_comps/HeroSection";
import PathwaysSection from "./_comps/PathwaysSection";
import StandardsSection from "./_comps/StandardsSection";
import WhoWeAreSection from "./_comps/WhoWeAreSection";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;

  return (
    <>
      <HeroSection locale={locale} />
      <WhoWeAreSection />
      <PathwaysSection />
      <FlagshipCourseSection locale={locale} />
      <StandardsSection />
      <FounderSection locale={locale} />
    </>
  );
}
