"use client";

import { useLocale } from "next-intl";
import {
  useCurrentUser,
  useEnrolledCourses,
} from "../../_apiCalls/academyQueries";
import FeedbackSection from "./FeedbackSection";
import type { PathwayContent, PathwayLabels } from "./pathwayContent";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
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
import type { BookingMode } from "./casc_components/PrivateSessionDialog";

// Lazy-load private session dialog so it doesn't impact initial page load performance
const PrivateSessionDialog = dynamic(
  () => import("./casc_components/PrivateSessionDialog"),
  { ssr: false },
);

type Props = { content: PathwayContent; labels: PathwayLabels };

export default function CascAcademyLanding(_props: Props) {
  const locale = useLocale();
  const searchParams = useSearchParams();

  const { data: user } = useCurrentUser();
  const { data: enrolledCourses } = useEnrolledCourses(Boolean(user));

  const initialPurchaseId = searchParams.get("purchaseId");
  const initialOpen =
    searchParams.get("oneToOne") === "open" || !!initialPurchaseId;

  // Dialog control state
  const [isDialogOpen, setIsDialogOpen] = useState(initialOpen);
  const [bookingMode, setBookingMode] = useState<BookingMode>("direct");
  const [returnPurchaseId, setReturnPurchaseId] = useState<string | null>(
    initialPurchaseId,
  );

  // Clean up URL query parameters while preserving the hash anchor if returning
  useEffect(() => {
    if (initialOpen) {
      const cleanUrl = `/${locale}/pathways/casc-academy#one-to-one-sessions`;
      window.history.replaceState(null, "", cleanUrl);
    }
  }, [initialOpen, locale]);

  const handleOpenBooking = (mode: BookingMode = "direct") => {
    setBookingMode(mode);
    setReturnPurchaseId(null);
    setIsDialogOpen(true);
  };

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
      <CascCoachingSection locale={locale} onOpenBooking={handleOpenBooking} />
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

      {/* On-demand Private Session Booking Dialog */}
      {isDialogOpen && (
        <PrivateSessionDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          locale={locale}
          courseSlug="casc-academy"
          initialMode={bookingMode}
          initialPurchaseId={returnPurchaseId}
        />
      )}
    </main>
  );
}
