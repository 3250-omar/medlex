"use client";

import { Fragment } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import {
  ArrowRight,
  Download,
  Sparkles,
  Check,
  Plus,
  Minus,
} from "lucide-react";
import type { EnrolledCourse } from "../../../_apiCalls/academyQueries";
import { useCascPricing } from "./CascPricingContext";
import EnrolOrContinue from "./EnrolOrContinue";

type Props = {
  cascEnrolment?: EnrolledCourse;
  continueSlug?: string | null;
  courseData?: { price: number; currency: string } | null;
};

export default function CascHeroSection({
  cascEnrolment,
  continueSlug,
  courseData,
}: Props) {
  const locale = useLocale();
  const t = useTranslations("cascHero");
  const isAr = locale === "ar";

  const pricing = useCascPricing();

  const selectedOption = pricing?.selectedOption ?? "none";
  const setSelectedOption = pricing?.setSelectedOption ?? (() => {});
  const customCount = pricing?.customCount ?? 3;
  const setCustomCount = pricing?.setCustomCount ?? (() => {});
  const singlePrice = pricing?.singlePrice ?? 120;
  const pkg5Price = pricing?.pkg5Price ?? 540;
  const pkg10Price = pricing?.pkg10Price ?? 960;
  const coursePrice = pricing?.coursePrice ?? courseData?.price ?? 147;
  const sessionsPrice = pricing?.sessionsPrice ?? 0;
  const savingsAmount = pricing?.savingsAmount ?? 0;
  const formattedTotal = pricing?.formattedTotal ?? `£${coursePrice}`;
  const selectedPackageInfo = pricing?.selectedPackageInfo ?? "";
  const sessionCount = pricing?.sessionCount ?? 0;
  const mainCtaLabel =
    pricing?.mainCtaLabel ??
    (isAr
      ? `الانضمام إلى قائمة الانتظار — ${formattedTotal}`
      : `Join Waitlist — ${formattedTotal}`);
  const formatPrice =
    pricing?.formatPrice ??
    ((amount: number) =>
      new Intl.NumberFormat(isAr ? "ar-EG" : "en-GB", {
        style: "currency",
        currency: courseData?.currency || "GBP",
        maximumFractionDigits: 0,
      }).format(amount));

  return (
    <section className="relative text-char flex flex-col justify-between min-h-[calc(100vh-125px)] min-h-[calc(100dvh-125px)] pt-12 sm:pt-16 lg:pt-20 pb-0 border-b border-hair overflow-hidden">
      {/* Background image with opacity & directional gradient */}
      <div className="absolute inset-0 pointer-events-none select-none z-0">
        <Image
          src="/images/sectionImages/casc_hero_section.jpg"
          alt="CASC examination background"
          fill
          priority
          className="object-cover object-right md:object-center opacity-80"
        />
        {/* Direction-aware gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/95 via-45% to-white/40 lg:to-transparent rtl:bg-gradient-to-l rtl:from-white rtl:via-white/95 rtl:via-45% rtl:to-white/40 rtl:lg:to-transparent " />
      </div>

      <div className="relative z-10 mx-auto w-full px-6 sm:px-8 lg:max-w-6xl lg:px-10 pb-8 sm:pb-12">
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

        {!cascEnrolment && (
          <>
        {/* Customise Your Bundle Widget */}
        <div className="mt-8 rounded-2xl border border-[#DFD5C0] bg-[#FAF7F2]/95 backdrop-blur-sm p-5 sm:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/15 border border-gold/40 text-xs font-semibold text-navy mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-goldd shrink-0" />
                <span>{t("bundleSelectorEyebrow")}</span>
              </div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-navy!">
                {t("bundleSelectorTitle")}
              </h3>
              <p className="text-xs sm:text-[13px] text-char/75 mt-1 max-w-2xl leading-relaxed">
                {t("bundleSelectorDesc")}
              </p>
            </div>
          </div>

          {/* Option Selector Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-2.5 mt-3">
            {/* 1. None */}
            <button
              type="button"
              onClick={() => setSelectedOption("none")}
              className={`p-3 rounded-xl border text-start transition-all cursor-pointer flex flex-col justify-between ${
                selectedOption === "none"
                  ? "border-navy bg-navy text-white shadow-sm ring-1 ring-navy"
                  : "border-[#DFD5C0] bg-white hover:border-goldd/60 text-char"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-serif font-bold text-xs sm:text-sm">
                  {t("optNone")}
                </span>
                {selectedOption === "none" && (
                  <Check className="w-3.5 h-3.5 text-gold" />
                )}
              </div>
              <div
                className={`text-[11px] font-medium ${
                  selectedOption === "none" ? "text-slate-300" : "text-grey"
                }`}
              >
                +£0
              </div>
            </button>

            {/* 2. Single Session */}
            <button
              type="button"
              onClick={() => setSelectedOption("1")}
              className={`p-3 rounded-xl border text-start transition-all cursor-pointer flex flex-col justify-between ${
                selectedOption === "1"
                  ? "border-navy bg-navy text-white shadow-sm ring-1 ring-navy"
                  : "border-[#DFD5C0] bg-white hover:border-goldd/60 text-char"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-serif font-bold text-xs sm:text-sm">
                  {t("optSingle")}
                </span>
                {selectedOption === "1" && (
                  <Check className="w-3.5 h-3.5 text-gold" />
                )}
              </div>
              <div
                className={`text-[11px] font-medium ${
                  selectedOption === "1" ? "text-slate-300" : "text-grey"
                }`}
              >
                +{formatPrice(singlePrice)}
              </div>
            </button>

            {/* 3. 5 Sessions (Save 10%) */}
            <button
              type="button"
              onClick={() => setSelectedOption("5")}
              className={`relative p-3 rounded-xl border text-start transition-all cursor-pointer flex flex-col justify-between ${
                selectedOption === "5"
                  ? "border-navy bg-navy text-white shadow-sm ring-1 ring-navy"
                  : "border-[#DFD5C0] bg-white hover:border-goldd/60 text-char"
              }`}
            >
              <span className="absolute -top-2.5 end-2 px-1.5 py-0.5 rounded-full text-[9.5px] font-bold bg-emerald-600 text-white shadow-xs">
                {t("savePercent", { percent: 10 })}
              </span>
              <div className="flex items-center justify-between mb-1">
                <span className="font-serif font-bold text-xs sm:text-sm">
                  {t("opt5")}
                </span>
                {selectedOption === "5" && (
                  <Check className="w-3.5 h-3.5 text-gold" />
                )}
              </div>
              <div
                className={`text-[11px] font-medium ${
                  selectedOption === "5" ? "text-slate-300" : "text-grey"
                }`}
              >
                +{formatPrice(pkg5Price)}
              </div>
            </button>

            {/* 4. 10 Sessions (Save 20%) */}
            <button
              type="button"
              onClick={() => setSelectedOption("10")}
              className={`relative p-3 rounded-xl border text-start transition-all cursor-pointer flex flex-col justify-between ${
                selectedOption === "10"
                  ? "border-navy bg-navy text-white shadow-sm ring-1 ring-navy"
                  : "border-[#DFD5C0] bg-white hover:border-goldd/60 text-char"
              }`}
            >
              <span className="absolute -top-2.5 end-2 px-1.5 py-0.5 rounded-full text-[9.5px] font-bold bg-emerald-600 text-white shadow-xs">
                {t("savePercent", { percent: 20 })}
              </span>
              <div className="flex items-center justify-between mb-1">
                <span className="font-serif font-bold text-xs sm:text-sm">
                  {t("opt10")}
                </span>
                {selectedOption === "10" && (
                  <Check className="w-3.5 h-3.5 text-gold" />
                )}
              </div>
              <div
                className={`text-[11px] font-medium ${
                  selectedOption === "10" ? "text-slate-300" : "text-grey"
                }`}
              >
                +{formatPrice(pkg10Price)}
              </div>
            </button>

            {/* 5. Custom */}
            <button
              type="button"
              onClick={() => setSelectedOption("custom")}
              className={`p-3 rounded-xl border text-start transition-all cursor-pointer flex flex-col justify-between col-span-2 sm:col-span-1 ${
                selectedOption === "custom"
                  ? "border-navy bg-navy text-white shadow-sm ring-1 ring-navy"
                  : "border-[#DFD5C0] bg-white hover:border-goldd/60 text-char"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-serif font-bold text-xs sm:text-sm">
                  {t("optCustom")}
                </span>
                {selectedOption === "custom" && (
                  <Check className="w-3.5 h-3.5 text-gold" />
                )}
              </div>
              <div
                className={`text-[11px] font-medium ${
                  selectedOption === "custom" ? "text-slate-300" : "text-grey"
                }`}
              >
                {selectedOption === "custom"
                  ? `+${formatPrice(sessionsPrice)}`
                  : isAr
                    ? "اختر العدد"
                    : "Choose qty"}
              </div>
            </button>
          </div>

          {/* Stepper if Custom is chosen */}
          {selectedOption === "custom" && (
            <div className="mt-4 p-3.5 rounded-xl bg-white border border-[#DFD5C0] flex flex-wrap items-center justify-between gap-3 animate-in fade-in duration-200">
              <span className="text-xs sm:text-sm font-medium text-navy">
                {t("customSessionsLabel")}
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setCustomCount((c) => Math.max(1, c - 1))}
                  disabled={customCount <= 1}
                  className="w-8 h-8 rounded-lg border border-navy/20 bg-tint/30 hover:bg-tint/70 disabled:opacity-40 flex items-center justify-center cursor-pointer text-navy"
                  aria-label="Decrease session count"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-serif font-bold text-base text-navy min-w-[5rem] text-center">
                  {t("sessionsCount", { count: customCount })}
                </span>
                <button
                  type="button"
                  onClick={() => setCustomCount((c) => Math.min(20, c + 1))}
                  disabled={customCount >= 20}
                  className="w-8 h-8 rounded-lg border border-navy/20 bg-tint/30 hover:bg-tint/70 disabled:opacity-40 flex items-center justify-center cursor-pointer text-navy"
                  aria-label="Increase session count"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Pricing Breakdown & Savings Line */}
          <div className="mt-5 pt-4 border-t border-[#DFD5C0]/70 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
            <div className="flex flex-wrap items-center gap-3 text-char/80">
              <span>
                {t("courseBasePrice")}:{" "}
                <strong className="text-navy font-bold">
                  {formatPrice(coursePrice)}
                </strong>
              </span>
              <span>•</span>
              <span>
                {t("privateSessionsAddon")}:{" "}
                <strong className="text-navy font-bold">
                  {sessionsPrice > 0
                    ? `+${formatPrice(sessionsPrice)}`
                    : t("noSessionsSelected")}
                </strong>
              </span>
              {savingsAmount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-[11px]">
                  {isAr
                    ? `وفرت ${formatPrice(savingsAmount)}`
                    : `You save ${formatPrice(savingsAmount)}`}
                </span>
              )}
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-grey font-medium">{t("totalDue")}:</span>
              <span className="font-serif text-xl sm:text-2xl font-bold text-navy">
                {formattedTotal}
              </span>
            </div>
          </div>
        </div>

          </>
        )}

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <EnrolOrContinue
            className="btn bg-navy! hover:bg-[#0E1D38]! text-white! !min-h-12 !px-7 font-semibold text-sm !rounded-lg transition-transform hover:-translate-y-0.5 shadow-sm"
            label={mainCtaLabel}
            cascEnrolment={cascEnrolment}
            continueSlug={continueSlug}
            locale={locale}
            courseData={courseData}
            overridePrice={formattedTotal}
            selectedPackageInfo={selectedPackageInfo}
            sessionCount={sessionCount}
          />
          <Link
            className="btn bg-white/90! hover:bg-white! border border-navy/30! hover:border-navy! text-navy! !min-h-12 !px-7 font-semibold text-sm !rounded-lg transition-transform hover:-translate-y-0.5 shadow-sm"
            href={`/${locale}/academy/preview/station-7-2`}
          >
            {t("tryStationCta")}
          </Link>
          <a
            href="/gifts/MedLex_CASC_Academy_Course_Guide.pdf"
            download="MedLex_CASC_Academy_Course_Guide.pdf"
            className="btn bg-white/90! hover:bg-white! border border-navy/30! hover:border-navy! text-navy! !min-h-12 !px-7 font-semibold text-sm !rounded-lg transition-transform hover:-translate-y-0.5 shadow-sm inline-flex items-center gap-2"
          >
            <Download className="w-4 h-4 shrink-0" />
            <span>{t("downloadProspectus")}</span>
          </a>
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
      <div className="relative z-10 mt-auto border-t border-hair bg-white/95 backdrop-blur-md">
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
