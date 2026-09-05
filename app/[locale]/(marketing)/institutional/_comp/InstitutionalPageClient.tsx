"use client";

import { useState } from "react";
import InstitutionalHero from "./InstitutionalHero";
import InstitutionalServicesGrid from "./InstitutionalServicesGrid";
import InstitutionalStandards from "./InstitutionalStandards";
import InstitutionalDetailRows from "./InstitutionalDetailRows";
import InstitutionalEngagementCards from "./InstitutionalEngagementCards";
import InstitutionalCtaBanner from "./InstitutionalCtaBanner";

interface InstitutionalPageClientProps {
  locale: string;
}

export default function InstitutionalPageClient({
  locale,
}: InstitutionalPageClientProps) {
  const [selectedServiceIndex, setSelectedServiceIndex] = useState(0);

  const handleSelectService = (index: number) => {
    setSelectedServiceIndex(index);
  };

  return (
    <main className="min-h-screen bg-ink text-text">
      {/* 01. Hero Section with 3 Badges */}
      <InstitutionalHero locale={locale} />

      {/* 02. Core Practice Areas Grid with Image Headers */}
      <InstitutionalServicesGrid locale={locale} />

      {/* 03. Institutional Standards & 4 Pillars */}
      <InstitutionalStandards locale={locale} />

      {/* 04. Detailed Service Deep-Dive Blocks & Spec Cards */}
      <InstitutionalDetailRows
        locale={locale}
        onSelectService={handleSelectService}
      />

      {/* 05. Engagement Models & Frameworks */}
      <InstitutionalEngagementCards locale={locale} />

      {/* 06. Formal Institutional Consultation Inquiry Form */}
      {/* <InstitutionalInquiryForm
        locale={locale}
        selectedServiceIndex={selectedServiceIndex}
      /> */}

      {/* 07. Bespoke Engagement Bottom Banner */}
      <InstitutionalCtaBanner locale={locale} />
    </main>
  );
}
