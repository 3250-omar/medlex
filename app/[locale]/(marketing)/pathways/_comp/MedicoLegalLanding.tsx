"use client";

import { useLocale } from "next-intl";
import FeedbackSection from "./FeedbackSection";
import type { PathwayContent, PathwayLabels } from "./pathwayContent";
import {
  MedicoLegalHeroSection,
  MedicoLegalAudienceSection,
  MedicoLegalLevelsSection,
  MedicoLegalFlagshipSection,
  MedicoLegalTwoAudiencesSection,
  MedicoLegalFounderSection,
  MedicoLegalGiftSection,
  MedicoLegalWaitlistSection,
  MedicoLegalFaqSection,
  MedicoLegalClosingBannerSection,
} from "./medico_legal_components";

type Props = { content: PathwayContent; labels: PathwayLabels };

export default function MedicoLegalLanding(_props: Props) {
  const locale = useLocale() === "ar" ? "ar" : "en";

  return (
    <main id="top" className="bg-white text-char">
      {/* 1. HERO SECTION */}
      <MedicoLegalHeroSection locale={locale} />

      {/* 2. WHO THIS IS FOR / PURPOSE */}
      <MedicoLegalAudienceSection />

      {/* 3. FOUR LEVELS */}
      <MedicoLegalLevelsSection />

      {/* 4. FLAGSHIP PROGRAMME: WRITING PSYCHIATRIC EVIDENCE */}
      <MedicoLegalFlagshipSection locale={locale} />

      {/* 5. TWO AUDIENCES (CLINICIANS & LEGAL PROFESSIONALS) */}
      <MedicoLegalTwoAudiencesSection />

      {/* 6. FOUNDER / HOW WE TEACH */}
      <MedicoLegalFounderSection locale={locale} />

      {/* 7. FREE GIFT */}
      <MedicoLegalGiftSection />

      {/* 8. WAITLIST SECTION */}
      <MedicoLegalWaitlistSection />

      {/* 9. FEEDBACK SECTION */}
      <FeedbackSection pathway="medico-legal" />

      {/* 10. QUESTIONS (FAQ) */}
      <MedicoLegalFaqSection />

      {/* 11. CLOSING BANNER */}
      <MedicoLegalClosingBannerSection locale={locale} />
    </main>
  );
}
