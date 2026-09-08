"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

export default function FounderHeroSection() {
  const t = useTranslations("founderPage.hero");

  return (
    <section className="relative overflow-hidden bg-navy pt-32 pb-24 md:pt-44 md:pb-32 lg:pt-52 lg:pb-40 border-b border-white/10 on-navy text-lbody">
      {/* Background Portrait & Atmosphere */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {/* Portrait Image */}
        <div className="absolute right-0 top-0 h-full w-full md:w-[65%] lg:w-[58%] rtl:right-auto rtl:left-0">
          <Image
            src="/images/dr-ahmed-abouelghit.webp"
            alt="Dr. Ahmed Abouelghit"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 60vw"
            className="object-cover object-[center_22%] opacity-60 md:opacity-75 scale-105"
          />
          {/* Subtle top-right warm glow */}
          <div className="absolute top-0 right-0 h-96 w-96 bg-gold/10 blur-3xl pointer-events-none" />
        </div>

        {/* Directional Vignettes & Overlays for Text Contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/95 via-45% to-transparent hidden md:block rtl:hidden" />
        <div className="absolute inset-0 bg-gradient-to-l from-navy via-navy/95 via-45% to-transparent hidden rtl:md:block" />
        <div className="absolute inset-0 bg-navy/85 md:hidden" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-navy to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-navy to-transparent" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 w-full px-6 sm:px-10 md:px-14 lg:px-20 xl:px-24 2xl:px-28">
        <div className="max-w-3xl lg:max-w-4xl">
          {/* Eyebrow */}
          <div className="flex items-center gap-3">
            <span className="h-px w-8 shrink-0 bg-gold" aria-hidden="true" />
            <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.24em] text-gold">
              {t("eyebrow")}
            </span>
          </div>

          {/* Main Title */}
          <h1 className="mt-7 font-serif text-4xl sm:text-5xl md:text-6xl lg:text-[64px] font-bold leading-[1.08] tracking-tight text-white whitespace-pre-line">
            {t("title")}
          </h1>

          {/* Intro Description */}
          <p className="mt-6 max-w-2xl font-sans text-base sm:text-lg leading-relaxed text-lbody md:text-[18px] md:leading-8">
            {t("intro")}
          </p>
        </div>
      </div>
    </section>
  );
}
