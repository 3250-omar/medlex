"use client";

import Link from "next/link";
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
};

export default function EnrolOrContinue({
  className,
  label = "Enrol — £147 for the founding hundred",
  cascEnrolment,
  continueSlug,
  locale,
}: EnrolOrContinueProps) {
  return cascEnrolment && continueSlug ? (
    <Link
      href={`/${locale}/academy/courses/casc-academy/learn/${continueSlug}`}
      className={className}
    >
      Continue course
    </Link>
  ) : (
    <SubscribeButton className={className} showArrow={false}>
      {label}
    </SubscribeButton>
  );
}
