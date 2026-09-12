"use client";

import { useLocale } from "next-intl";
import {
  useCurrentUser,
  useEnrolledCourses,
} from "../../_apiCalls/academyQueries";
import FeedbackSection from "./FeedbackSection";
import type { PathwayContent, PathwayLabels } from "./pathwayContent";
import {
  CascHeroSection,
  CascProblemSection,
  CascHowStationWorksSection,
  CascFreeStationPreviewSection,
  CascDomainsSection,
  CascWhatYouGetSection,
  CascWhoItIsForSection,
  CascExaminerSection,
  CascGiftsSection,
  CascCoachingSection,
  CascPricingSection,
  CascFaqSection,
  CascClosingBannerSection,
} from "./casc_components";

type Props = { content: PathwayContent; labels: PathwayLabels };

export default function CascAcademyLanding(_props: Props) {
  const locale = useLocale() === "ar" ? "ar" : "en";
  const { data: user } = useCurrentUser();
  const { data: enrolledCourses } = useEnrolledCourses(Boolean(user));

  // Detect active casc-academy enrolment
  const cascEnrolment = enrolledCourses?.find(
    (c) => c.slug === "casc-academy" && c.status === "active",
  );
  const continueSlug =
    cascEnrolment?.currentUnitSlug ?? cascEnrolment?.firstUnitSlug;

  return (
    <main id="top" className="bg-white text-char">
      {/* 1. HERO SECTION */}
      <CascHeroSection
        locale={locale}
        cascEnrolment={cascEnrolment}
        continueSlug={continueSlug}
      />
      {/* 9. BEFORE YOU ENROL (GIFTS) */}
      <CascGiftsSection />
      {/* 2. PROBLEM SECTION */}
      <CascProblemSection />

      {/* 3. HOW A STATION WORKS (ANATOMY) */}
      <CascHowStationWorksSection />
      {/* 11. COACHING */}
      <CascCoachingSection locale={locale} />
      {/* 4. FREE STATION PREVIEW CALLOUT */}
      <CascFreeStationPreviewSection locale={locale} />

      {/* 5. DOMAINS SECTION */}
      <CascDomainsSection />

      {/* 6. INCLUDED SECTION (WHAT YOU GET) */}
      <CascWhatYouGetSection />

      {/* 7. WHO IT IS FOR */}
      <CascWhoItIsForSection />

      {/* 8. THE EXAMINER (ABOUT) */}
      <CascExaminerSection />

      {/* 10. FEEDBACK SECTION */}
      <FeedbackSection pathway="casc-academy" />

      {/* 12. PRICING & ENROL */}
      <CascPricingSection
        locale={locale}
        cascEnrolment={cascEnrolment}
        continueSlug={continueSlug}
      />

      {/* 13. QUESTIONS (FAQ) */}
      <CascFaqSection />

      {/* 14. CLOSING BANNER */}
      <CascClosingBannerSection
        locale={locale}
        cascEnrolment={cascEnrolment}
        continueSlug={continueSlug}
      />
    </main>
  );
}
