"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

export default function FounderHeroSection() {
  const t = useTranslations("founderPage.hero");

  return (
    <section className="relative overflow-hidden bg-ink pt-32 pb-24 md:pt-44 md:pb-32 lg:pt-52 lg:pb-40 border-b border-white/10">
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
          <div className="absolute top-0 right-0 h-96 w-96 bg-signal/10 blur-3xl pointer-events-none" />
        </div>

        {/* Directional Vignettes & Overlays for Text Contrast */}
        {/* Desktop Left-to-Right Ink Blend (In LTR: Solid ink on left, blends smoothly to image) */}
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/95 via-45% to-transparent hidden md:block rtl:hidden" />

        {/* Desktop Right-to-Left Ink Blend for RTL (Arabic) */}
        <div className="absolute inset-0 bg-gradient-to-l from-ink via-ink/95 via-45% to-transparent hidden rtl:md:block" />

        {/* Mobile solid/gradient overlay */}
        <div className="absolute inset-0 bg-ink/85 md:hidden" />

        {/* Top and bottom subtle fade to solid ink */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ink to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-ink to-transparent" />
      </div>

      {/* Hero Content */}
      <div
        className="relative z-10 mx-auto w-full px-6 md:px-8 lg:px-12"
        style={{ maxWidth: "var(--content-max)" }}
      >
        <div className="max-w-2xl lg:max-w-3xl">
          {/* Eyebrow */}
          <div className="flex items-center gap-3">
            <span className="h-px w-7 shrink-0 bg-signal" aria-hidden="true" />
            <span className="font-body text-[10px] sm:text-xs font-semibold uppercase tracking-[0.24em] text-white/70">
              {t("eyebrow")}
            </span>
          </div>

          {/* Main Title */}
          <h1 className="mt-8 font-display text-4xl sm:text-5xl md:text-6xl lg:text-[64px] font-normal leading-[1.08] tracking-tight text-white whitespace-pre-line">
            {t("title")}
          </h1>

          {/* Intro Description */}
          <p className="mt-7 max-w-xl font-body text-base sm:text-lg leading-relaxed text-white/75 md:text-[17px] md:leading-8">
            {t("intro")}
          </p>
        </div>
      </div>
    </section>
  );
}
