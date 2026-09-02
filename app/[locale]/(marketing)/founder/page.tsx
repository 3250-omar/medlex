import FounderHeroSection from "./_comp/FounderHeroSection";
import FounderMandateSection from "./_comp/FounderMandateSection";
import FounderNextStepSection from "./_comp/FounderNextStepSection";
import FounderProfileSection from "./_comp/FounderProfileSection";

interface FounderPageProps {
  params: Promise<{ locale: string }>;
}

export default async function FounderPage({ params }: FounderPageProps) {
  const { locale } = await params;

  return (
    <main className="min-h-screen bg-ink text-text">
      {/* 01. Hero Section */}
      <FounderHeroSection />

      {/* 02. Founder Profile & Bio Section */}
      <FounderProfileSection locale={locale} />

      {/* 03. Mandate & Pillars Section */}
      <FounderMandateSection locale={locale} />

      {/* 04. Next Step / Register Interest CTA */}
      <FounderNextStepSection locale={locale} />
    </main>
  );
}
