import Link from "next/link";
import { useTranslations } from "next-intl";
import type { EnrolledCourse } from "../../../_apiCalls/academyQueries";
import EnrolOrContinue, { btnGold } from "./EnrolOrContinue";
import { useCascPricing } from "./CascPricingContext";

type Props = {
  locale: string;
  cascEnrolment?: EnrolledCourse;
  continueSlug?: string | null;
  courseData?: { price: number; currency: string } | null;
};

export default function CascClosingBannerSection({
  locale,
  cascEnrolment,
  continueSlug,
  courseData,
}: Props) {
  const t = useTranslations("cascClosingBanner");
  const pricing = useCascPricing();

  return (
    <section className="relative py-20 lg:py-28 bg-tint text-center border-t border-hair overflow-hidden">
      <div className="relative z-10 mx-auto max-w-3xl px-6 sm:px-8">
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-bold leading-tight text-navy! max-w-2xl mx-auto">
          {t("title")}
        </h2>
        <p className="mt-5 font-serif text-lg sm:text-xl text-char leading-relaxed max-w-xl mx-auto">
          {t("subtitle")}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <EnrolOrContinue
            className={btnGold}
            label={pricing?.mainCtaLabel}
            cascEnrolment={cascEnrolment}
            continueSlug={continueSlug}
            locale={locale}
            courseData={courseData}
            overridePrice={pricing?.formattedTotal}
            selectedPackageInfo={pricing?.selectedPackageInfo}
          />
          <Link
            className="btn btn-ghost !min-h-12 !px-7 font-semibold !text-navy !border-navy/30 hover:!bg-navy hover:!text-white text-sm !rounded-full transition-all hover:-translate-y-0.5"
            href={`/${locale}/academy/preview/station-7-2`}
          >
            {t("tryStation")}
          </Link>
        </div>
      </div>
    </section>
  );
}
