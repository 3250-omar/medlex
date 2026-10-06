"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import type { EnrolledCourse } from "../../../_apiCalls/academyQueries";
import SubscribeButton from "../SubscribeButton";

export const btnGold =
  "btn btn-gold !min-h-12 !px-7 font-semibold text-navy! text-sm !rounded-full transition-transform hover:-translate-y-0.5";
export const btnGhost =
  "btn btn-ghost !min-h-12 !px-7 font-semibold text-white text-sm !rounded-full transition-transform hover:-translate-y-0.5";
export const btnNavy =
  "btn btn-navy !min-h-12 !px-7 font-semibold text-white text-sm !rounded-full transition-transform hover:-translate-y-0.5 w-full!";

export type EnrolOrContinueProps = {
  className: string;
  label?: string;
  cascEnrolment?: EnrolledCourse;
  continueSlug?: string | null;
  locale: string;
  courseData?: { price: number; currency: string } | null;
  overridePrice?: string;
  selectedPackageInfo?: string;
  sessionCount?: number;
};

export default function EnrolOrContinue({
  className,
  label,
  cascEnrolment,
  continueSlug,
  locale,
  courseData,
  overridePrice,
  selectedPackageInfo,
  sessionCount,
}: EnrolOrContinueProps) {
  const t = useTranslations("enrolOrContinue");
  const buttonLabel = label || t("defaultLabel");

  const formattedPrice = courseData
    ? new Intl.NumberFormat(locale, {
        style: "currency",
        currency: courseData.currency,
        maximumFractionDigits: 0,
      }).format(courseData.price)
    : undefined;

  return cascEnrolment && continueSlug ? (
    <Link
      href={`/${locale}/academy/courses/casc-academy/learn/${continueSlug}`}
      className={className}
    >
      {t("continueCourse")}
    </Link>
  ) : (
    <SubscribeButton
      className={className}
      showArrow={false}
      itemPrice={overridePrice || formattedPrice}
      selectedPackageInfo={selectedPackageInfo}
      sessionCount={sessionCount}
    >
      {buttonLabel}
    </SubscribeButton>
  );
}
