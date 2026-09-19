"use client";

import InstitutionalHero from "./InstitutionalHero";
import InstitutionalServices from "./InstitutionalServices";
import InstitutionalNotDo from "./InstitutionalNotDo";
import InstitutionalTrackRecord from "./InstitutionalTrackRecord";
import InstitutionalHowWeWork from "./InstitutionalHowWeWork";
import InstitutionalEnquiry from "./InstitutionalEnquiry";

interface InstitutionalPageClientProps {
  locale: string;
}

export default function InstitutionalPageClient({
  locale,
}: InstitutionalPageClientProps) {
  return (
    <main className="min-h-screen bg-fd-paper text-char selection:bg-gold/20 selection:text-navy">
      <InstitutionalHero locale={locale} />
      <InstitutionalServices locale={locale} />
      <InstitutionalNotDo locale={locale} />
      <InstitutionalTrackRecord locale={locale} />
      <InstitutionalHowWeWork locale={locale} />
      <InstitutionalEnquiry locale={locale} />
    </main>
  );
}
