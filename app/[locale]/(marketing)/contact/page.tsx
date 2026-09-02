import ContactHeroSection from "./_comp/ContactHeroSection";
import ContactFormSection from "./_comp/ContactFormSection";

interface ContactPageProps {
  params: Promise<{ locale: string }>;
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;

  return (
    <main className="min-h-screen bg-ink text-text">
      {/* 01. Hero / Header Section */}
      <ContactHeroSection locale={locale} />

      {/* 02. Register Interest Form Section */}
      <ContactFormSection locale={locale} />
    </main>
  );
}
