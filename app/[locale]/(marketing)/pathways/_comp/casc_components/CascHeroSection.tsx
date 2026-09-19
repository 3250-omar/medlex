"use client";

import { Fragment } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import type { EnrolledCourse } from "../../../_apiCalls/academyQueries";
import EnrolOrContinue from "./EnrolOrContinue";

type Props = {
  locale: string;
  cascEnrolment?: EnrolledCourse;
  continueSlug?: string | null;
};

export default function CascHeroSection({
  locale,
  cascEnrolment,
  continueSlug,
}: Props) {
  const t = useTranslations("cascHero");

  return (
    <section className="relative  text-char pt-16 sm:pt-20 pb-0 border-b border-hair overflow-hidden ">
      {/* Background image with opacity & directional gradient */}
      <div className="absolute inset-0 pointer-events-none select-none z-0">
        <Image
          src="/images/sectionImages/casc_hero_section.jpg"
          alt="CASC examination background"
          fill
          priority
          className="object-cover object-right md:object-center opacity-80"
        />
        {/* Direction-aware gradient overlay: solid light background on content side fading gently towards the consultation */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/95 via-45% to-white/40 lg:to-transparent rtl:bg-gradient-to-l rtl:from-white rtl:via-white/95 rtl:via-45% rtl:to-white/40 rtl:lg:to-transparent " />
      </div>

      <div className="relative z-10 mx-auto w-full px-6 sm:px-8 lg:max-w-6xl lg:px-10">
        {/* Kicker Tagline */}
        <p className="font-serif text-sm sm:text-base font-semibold text-navy! mb-3">
          {t("kicker")}
        </p>

        {/* Main Heading */}
        <h1 className="max-w-4xl font-serif text-3xl sm:text-5xl lg:text-[54px] font-bold leading-[1.14] text-navy!">
          {t("titlePrefix")}
          <span className="italic font-serif text-goldd font-normal">
            {t("titleHighlight")}
          </span>
          {t("titleSuffix")}
        </h1>

        {/* Subtitle */}
        <p className="mt-5 max-w-2xl font-serif text-base sm:text-lg lg:text-[19px] leading-relaxed text-char/85">
          {t("subtitle")}
        </p>

        {/* 3 Step Cards */}
        <div className="mt-9 grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_1fr] items-stretch gap-4 lg:gap-5">
          {[
            {
              num: t("step1Number"),
              title: t("step1Title"),
              desc: t("step1Desc"),
            },
            {
              num: t("step2Number"),
              title: t("step2Title"),
              desc: t("step2Desc"),
            },
            {
              num: t("step3Number"),
              title: t("step3Title"),
              desc: t("step3Desc"),
            },
          ].map((step, idx) => (
            <Fragment key={idx}>
              <div className="h-full rounded-xl border border-[#DFD5C0] bg-[#F5EFE3]/95 backdrop-blur-sm p-5 sm:p-6 shadow-sm transition-all hover:border-goldd/60 hover:shadow-md flex flex-col justify-start">
                <h3 className="font-serif text-base sm:text-lg font-bold text-navy! mb-2 flex items-baseline gap-2">
                  <span className="text-goldd font-serif font-bold text-lg sm:text-xl">
                    {step.num}
                  </span>
                  <span>{step.title}</span>
                </h3>
                <p className="font-sans text-xs sm:text-[13.5px] leading-relaxed text-char/80">
                  {step.desc}
                </p>
              </div>

              {idx < 2 && (
                <div
                  className="hidden md:flex items-center justify-center text-goldd font-bold text-lg shrink-0"
                  aria-hidden="true"
                >
                  <ArrowRight className="w-5 h-5 rtl:rotate-180" />
                </div>
              )}
            </Fragment>
          ))}
        </div>

        {/* Workbook callout banner */}
        <div className="mt-6 border-s-[3px] border-goldd ps-3.5 py-0.5 text-xs sm:text-[13.5px] text-char/85 max-w-2xl">
          <strong className="font-bold text-navy">{t("workbookTitle")}</strong>{" "}
          <span>{t("workbookDesc")}</span>
        </div>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <EnrolOrContinue
            className="btn bg-navy! hover:bg-[#0E1D38]! text-white! !min-h-12 !px-7 font-semibold text-sm !rounded-lg transition-transform hover:-translate-y-0.5 shadow-sm"
            label={t("enrolCta")}
            cascEnrolment={cascEnrolment}
            continueSlug={continueSlug}
            locale={locale}
          />
          <Link
            className="btn bg-white/90! hover:bg-white! border border-navy/30! hover:border-navy! text-navy! !min-h-12 !px-7 font-semibold text-sm !rounded-lg transition-transform hover:-translate-y-0.5 shadow-sm"
            href={`/${locale}/academy/preview/station-7-2`}
          >
            {t("tryStationCta")}
          </Link>
        </div>

        {/* Coaching link below CTA buttons */}
        <p className="mt-4 text-xs sm:text-[13.5px] text-grey">
          {t("coachingPrefix")}
          <Link
            href={`/${locale}/pathways/casc-academy#one-to-one-sessions`}
            className="text-navy underline hover:text-goldd transition-colors font-medium"
          >
            {t("coachingLink")}
          </Link>
        </p>
      </div>

      {/* In-page Sub-navigation Bar */}
      <div className="relative z-10 mt-14 sm:mt-16 border-t border-hair bg-white/95 backdrop-blur-md">
        <div className="mx-auto w-full px-6 sm:px-8 lg:max-w-6xl lg:px-10 py-3 sm:py-3.5 flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-5 sm:gap-7">
            <div
              className="hidden md:block h-4 w-[1.5px] bg-char/25 shrink-0"
              aria-hidden="true"
            />
            <nav className="flex items-center gap-5 sm:gap-7 text-xs sm:text-[13.5px] font-semibold text-navy">
              <a
                href="#included"
                className="hover:text-goldd transition-colors whitespace-nowrap"
              >
                {t("navWhatYouGet")}
              </a>
              <a
                href="#station"
                className="hover:text-goldd transition-colors whitespace-nowrap"
              >
                {t("navHowItWorks")}
              </a>
              <a
                href="#gifts"
                className="hover:text-goldd transition-colors whitespace-nowrap"
              >
                {t("navFreeGuides")}
              </a>
              <a
                href="#library"
                className="hover:text-goldd transition-colors whitespace-nowrap"
              >
                {t("navTheLibrary")}
              </a>
              <a
                href="#one-to-one-sessions"
                className="hover:text-goldd transition-colors whitespace-nowrap"
              >
                {t("navCoaching")}
              </a>
              <a
                href="#faq"
                className="hover:text-goldd transition-colors whitespace-nowrap"
              >
                {t("navQuestions")}
              </a>
            </nav>
          </div>

          <a
            href="#enrol"
            className="bg-navy hover:bg-[#0E1D38] border border-navy/20 text-white px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold tracking-wide shadow-sm hover:shadow-md transition-all shrink-0 whitespace-nowrap"
          >
            {t("navEnrol")}
          </a>
        </div>
      </div>
    </section>
  );
}
