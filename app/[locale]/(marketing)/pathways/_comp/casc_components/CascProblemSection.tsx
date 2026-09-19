"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

export default function CascProblemSection() {
  const t = useTranslations("cascProblem");

  return (
    <section className="relative py-20 sm:py-24 lg:py-28 border-b border-hair bg-[#06101E] text-white overflow-hidden">
      {/* Background Image with directional dark gradient overlay */}
      <div className="absolute inset-0 pointer-events-none select-none z-0">
        <Image
          src="/images/sectionImages/reports_section.jpg"
          alt="Law Reports background"
          fill
          className="object-cover object-left md:object-left-top opacity-55"
          sizes="100vw"
        />
        {/* Navy gradient overlay matching the mockup tones */}
        <div className="absolute inset-0! bg-gradient-to-r from-[#060E1B]/5! via-[#071324]/30! to-[#050C17]/35! rtl:bg-gradient-to-l! pointer-events-none" />
      </div>

      <div className="relative z-10 mx-auto w-full px-6 sm:px-8 lg:max-w-6xl lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-12 lg:gap-16 xl:gap-20 items-center">
          {/* Left Column: Heading, accent bar & paragraphs */}
          <div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-bold leading-[1.18] text-white tracking-tight">
              {t("titleLine1")}
              <span className="block mt-1">{t("titleLine2")}</span>
            </h2>

            {/* Gold accent separator bar */}
            <div className="w-10 h-0.5 bg-[#C5A367] mt-5 mb-6" />

            <div className="space-y-4 font-sans text-sm sm:text-[15px] leading-relaxed text-[#D0D7E2]">
              <p>{t("p1")}</p>
              <p>{t("p2")}</p>
              <p>{t("p3")}</p>
            </div>
          </div>

          {/* Right Column: Examiner's Quote with vertical gold line */}
          <div className="border-s-2 border-[#C5A367] ps-6 sm:ps-7 py-1">
            <blockquote className="font-serif text-xl sm:text-2xl lg:text-[25px] leading-[1.4] text-[#DEBF79] font-normal">
              {t("quote")}
            </blockquote>
            <p className="mt-5 font-sans text-[11px] sm:text-xs uppercase tracking-[0.2em] font-semibold text-[#8E9DB2]">
              {t("quoteAuthor")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
