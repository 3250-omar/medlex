"use client";

import { useLocale } from "next-intl";
import FeedbackSection from "./FeedbackSection";
import type { PathwayContent, PathwayLabels } from "./pathwayContent";
import {
  FoundationsHeroSection,
  FoundationsAudienceSection,
  FoundationsGiftSection,
  FoundationsPortfolioSection,
  FoundationsCourseSection,
  FoundationsLeadershipSection,
  FoundationsFounderSection,
  FoundationsWaitlistSection,
  FoundationsFaqSection,
} from "./foundations_components";

type Props = { content: PathwayContent; labels: PathwayLabels };

export default function FoundationsLanding(_props: Props) {
  const locale = useLocale();

  return (
    <div id="top" className="w-full bg-fd-paper text-fd-body font-sans antialiased">
      {/* 1. HERO SECTION */}
      <FoundationsHeroSection locale={locale} />

      {/* 2. WHO THIS IS FOR / PURPOSE */}
      <FoundationsAudienceSection />

      {/* 3. FREE GIFT */}
      <FoundationsGiftSection />

      {/* 4. THREE PROGRAMMES PORTFOLIO */}
      <FoundationsPortfolioSection />

      {/* 5. THE CLINICIAN'S EDGE (8 MODULES) */}
      <FoundationsCourseSection locale={locale} />

      {/* 6. CLINICAL LEADERSHIP PROGRAMME */}
      <FoundationsLeadershipSection />

      {/* 7. FOUNDER / TAUGHT BY */}
      <FoundationsFounderSection locale={locale} />

      {/* 8. WAITLIST SECTION */}
      <FoundationsWaitlistSection />

      {/* 9. FEEDBACK SECTION */}
      <FeedbackSection pathway="foundations" />

      {/* 10. QUESTIONS (FAQ) */}
      <FoundationsFaqSection />
    </div>
  );
}
