import type { EnrolledCourse } from "../../../_apiCalls/academyQueries";
import EnrolOrContinue from "./EnrolOrContinue";
import { useTranslations } from "next-intl";
import { useCascPricing } from "./CascPricingContext";

type Props = {
  locale: string;
  cascEnrolment?: EnrolledCourse;
  continueSlug?: string | null;
  courseData?: { price: number; currency: string } | null;
};

export default function CascPricingSection({
  locale,
  cascEnrolment,
  continueSlug,
  courseData,
}: Props) {
  const t = useTranslations("cascPricing");
  const pricing = useCascPricing();

  const features = [
    t("feat1"),
    t("feat2"),
    t("feat3"),
    t("feat4"),
    t("feat5"),
    t("feat6"),
  ];

  // Dynamic price display (uses context total if available, otherwise base course price)
  const priceDisplay = pricing
    ? pricing.formattedTotal
    : courseData
      ? new Intl.NumberFormat(locale, {
          style: "currency",
          currency: courseData.currency,
          maximumFractionDigits: 0,
        }).format(courseData.price)
      : t("price");

  const ctaLabel = pricing?.mainCtaLabel || t("cta");

  return (
    <section
      id="enrol"
      className="py-20 lg:py-28 border-b border-white/10 bg-navy text-lbody on-navy scroll-mt-16"
    >
      <div className="mx-auto w-full px-6 sm:px-8 lg:max-w-6xl lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div>
          <p className="kicker text-gold">{t("kicker")}</p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-white">
            {t("title")}
          </h2>
          <p className="mt-5 font-serif text-xl leading-relaxed text-lbody">
            {t("desc1")}
          </p>
          <p className="mt-4 font-sans text-base text-lbody/90 leading-relaxed">
            {t("desc2")}
          </p>
        </div>

        <div className="bg-white text-char rounded-2xl p-8 sm:p-10 border-t-8 border-gold shadow-xl">
          <div className="font-serif text-5xl sm:text-6xl font-bold text-navy! leading-none">
            {priceDisplay}
          </div>

          {pricing && pricing.sessionsPrice > 0 ? (
            <div className="mt-2 mb-6 space-y-1">
              <div className="text-sm font-semibold text-navy flex flex-wrap items-center gap-2">
                <span>
                  + {pricing.sessionsLabel} ({pricing.formatPrice(pricing.sessionsPrice)})
                </span>
                {pricing.savingsAmount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-xs">
                    {locale === "ar"
                      ? `وفرت ${pricing.formatPrice(pricing.savingsAmount)}`
                      : `Save ${pricing.formatPrice(pricing.savingsAmount)}`}
                  </span>
                )}
              </div>
              <div className="text-xs text-grey">
                {t("priceSubtitle")}
              </div>
            </div>
          ) : (
            <div className="text-sm text-grey mt-2 mb-6">
              {t("priceSubtitle")}
            </div>
          )}

          <ul className="list-none p-0 m-0 mb-8 divide-y divide-hair">
            {pricing && pricing.sessionsPrice > 0 && (
              <li className="py-2.5 text-sm sm:text-base text-navy font-semibold flex items-center gap-2 bg-[#F5EFE3]/80 px-3 rounded-xl border border-[#DFD5C0] mb-2">
                <span className="text-gold font-bold">✓</span>
                <span>
                  {pricing.sessionsLabel} ({pricing.formatPrice(pricing.sessionsPrice)})
                </span>
              </li>
            )}
            {features.map((item) => (
              <li
                key={item}
                className="py-2.5 text-sm sm:text-base text-char flex items-center gap-2"
              >
                <span className="text-gold font-bold">—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <EnrolOrContinue
            className="btn btn-gold !min-h-12 w-full text-center text-sm font-semibold !rounded-full shadow-sm"
            label={ctaLabel}
            cascEnrolment={cascEnrolment}
            continueSlug={continueSlug}
            locale={locale}
            courseData={courseData}
            overridePrice={pricing?.formattedTotal}
            selectedPackageInfo={pricing?.selectedPackageInfo}
            sessionCount={pricing?.sessionCount}
          />
        </div>
      </div>
    </section>
  );
}
