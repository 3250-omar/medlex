"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { AuthDownloadButton } from "@/components/ui/auth-download-button";

interface FlagshipCourseSectionProps {
  locale: string;
}

const SITUATION_CARDS = [
  { href: "/pathways/medico-legal" },
  { href: "/pathways/casc-academy" },
  { href: "/pathways/foundations" },
] as const;

export default function FlagshipCourseSection({
  locale,
}: FlagshipCourseSectionProps) {
  const t = useTranslations("home.flagship");

  return (
    <section
      className="relative overflow-hidden bg-white py-20 lg:py-28 text-char border-b border-hair"
      aria-labelledby="situations-heading"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        {/* Header: Title + Gold Bar + Subtitle */}
        <div className="max-w-3xl">
          <h2
            id="situations-heading"
            className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[46px] font-bold !text-navy leading-[1.14] tracking-tight whitespace-pre-line"
          >
            {t("title")}
          </h2>

          <div className="mt-4 sm:mt-5 h-[2px] w-12 bg-gold" />

          <p className="mt-5 font-sans text-base sm:text-lg text-char/80 leading-relaxed max-w-2xl">
            {t("subtitle")}
          </p>
        </div>

        {/* Three Situation Cards */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {SITUATION_CARDS.map((card, idx) => (
            <article
              key={card.href}
              className="flex flex-col justify-between rounded-lg border border-[#E7E1D4] border-t-[3px] border-t-[#C5A880] bg-[#FAF7F2] p-7 sm:p-8 shadow-sm transition-all duration-300 hover:shadow-md hover:border-[#DDD4C4]"
            >
              <div>
                <blockquote className="font-serif text-lg sm:text-xl md:text-[21px] font-semibold !text-navy leading-snug">
                  {t(`cards.${idx}.quote`)}
                </blockquote>
              </div>

              <div className="mt-12 sm:mt-16 pt-2">
                <h3 className="font-sans text-sm sm:text-[15px] font-bold !text-navy tracking-tight">
                  {t(`cards.${idx}.title`)}
                </h3>
                <p className="mt-2 font-sans text-xs sm:text-sm text-char/75 leading-relaxed">
                  {t(`cards.${idx}.description`)}
                </p>
                <Link
                  href={`/${locale}${card.href}`}
                  className="mt-5 inline-block font-sans text-xs sm:text-sm font-semibold !text-navy underline underline-offset-4 decoration-navy/40 hover:text-goldd hover:decoration-goldd transition-colors"
                >
                  {t(`cards.${idx}.linkText`)}
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Prospectus Banner */}
        <div className="mt-10 sm:mt-14 rounded-xl sm:rounded-2xl bg-navy p-6 sm:p-8 md:p-10 text-white shadow-xl border border-white/10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            {/* Left: Book Cover Graphic + Information */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8">
              {/* Embedded Prospectus Book Cover */}
              <div
                className="relative shrink-0 w-[105px] sm:w-[120px] aspect-[1/1.37] rounded-md sm:rounded-lg overflow-hidden flex bg-[#142C4E] shadow-xl border border-white/10 select-none"
                aria-hidden="true"
              >
                {/* Gold spine stripe */}
                <div className="w-2 sm:w-2.5 h-full bg-[#C69D48] shrink-0" />

                {/* Cover text */}
                <div className="flex-1 flex flex-col justify-between p-3 sm:p-3.5 pl-2.5 sm:pl-3">
                  {/* MEDLEX Header */}
                  <div className="font-serif text-[13px] sm:text-[15px] font-bold tracking-[0.14em] text-[#E8C882] uppercase">
                    {t("prospectus.bookHeader")}
                  </div>

                  {/* Prospectus & Year Footer */}
                  <div className="font-sans text-[10px] sm:text-[11.5px] text-[#BAC8DB] leading-tight font-normal">
                    <div>{t("prospectus.bookTitle")}</div>
                    <div className="mt-0.5">{t("prospectus.bookYear")}</div>
                  </div>
                </div>
              </div>

              {/* Prospectus Description */}
              <div className="max-w-md">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {t("prospectus.title")}
                </h3>
                <p className="mt-2 font-sans text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {t("prospectus.description")}
                </p>
              </div>
            </div>

            {/* Right: Email capture field */}
            <div className="w-full lg:w-auto shrink-0">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("prospectus.placeholder")}
                  className="w-full sm:w-72 rounded-md bg-white px-4 py-3 font-sans text-sm text-navy placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-gold/60 transition-all"
                /> */}
                <AuthDownloadButton
                  fileUrl={
                    locale === "ar"
                      ? "/gifts/ar/homePage_prospectus.pdf"
                      : "/gifts/MedLex_homePage_Prospectus_2026-27.pdf"
                  }
                  resourceName={{
                    en: "Prospectus",
                    ar: "دليل البرامج",
                  }}
                  className="rounded-md bg-[#C5A880] hover:bg-[#BFA06C] active:bg-[#B3935D] text-[#0B1B33] px-6 py-3 font-sans text-sm font-semibold whitespace-nowrap transition-colors shadow-sm cursor-pointer inline-flex items-center justify-center text-center"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
