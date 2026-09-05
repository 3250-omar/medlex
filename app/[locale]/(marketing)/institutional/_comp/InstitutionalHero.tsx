"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

interface InstitutionalHeroProps {
  locale: string;
}

export default function InstitutionalHero({ locale }: InstitutionalHeroProps) {
  const t = useTranslations("institutionalPage.hero");
  const isRtl = locale === "ar";

  const metrics = [
    {
      label: t("metrics.0.label"),
      value: t("metrics.0.value"),
      detail: t("metrics.0.detail"),
    },
    {
      label: t("metrics.1.label"),
      value: t("metrics.1.value"),
      detail: t("metrics.1.detail"),
    },
    {
      label: t("metrics.2.label"),
      value: t("metrics.2.value"),
      detail: t("metrics.2.detail"),
    },
  ];

  return (
    <section className="relative overflow-hidden bg-ink pt-32 pb-20 md:pt-44 md:pb-28 lg:pt-48 lg:pb-32 border-b border-white/10">
      {/* Background Evidence Image & Atmosphere */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute right-0 top-0 h-full w-full md:w-[65%] lg:w-[55%] rtl:right-auto rtl:left-0">
          <Image
            src="/images/medlex-hero-evidence.webp"
            alt="Forensic evidence and medicolegal documentation"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 60vw"
            className="object-cover object-[center_30%] opacity-40 md:opacity-60 scale-105"
          />
          {/* Subtle warm amber/signal atmospheric glow */}
          <div className="absolute top-10 right-10 h-96 w-96 bg-signal/15 blur-3xl pointer-events-none" />
        </div>

        {/* Directional Vignettes & Overlays for Text Contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/95 via-50% to-transparent hidden md:block rtl:hidden" />
        <div className="absolute inset-0 bg-gradient-to-l from-ink via-ink/95 via-50% to-transparent hidden rtl:md:block" />
        <div className="absolute inset-0 bg-ink/85 md:hidden" />

        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ink to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-ink to-transparent" />
      </div>

      {/* Hero Content */}
      <div
        className="relative z-10 mx-auto w-full px-6 md:px-8 lg:px-12"
        style={{ maxWidth: "var(--content-max)" }}
      >
        <div className="max-w-3xl">
          {/* Eyebrow */}
          <div className="flex items-center gap-3">
            <span className="h-px w-8 shrink-0 bg-signal" aria-hidden="true" />
            <span className="font-body text-[10px] sm:text-xs font-semibold uppercase tracking-[0.24em] text-white/70">
              {t("eyebrow")}
            </span>
          </div>

          {/* Main Title */}
          <h1 className="mt-7 font-display text-4xl sm:text-5xl md:text-6xl lg:text-[62px] font-normal leading-[1.08] tracking-tight text-white whitespace-pre-line">
            {t("title")}
          </h1>

          {/* Intro Description */}
          <p className="mt-6 max-w-2xl font-body text-base sm:text-lg leading-relaxed text-white/75 md:text-[17px] md:leading-8">
            {t("intro")}
          </p>

          {/* Quick CTA Anchor */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#institutional-inquiry"
              className="inline-flex items-center justify-center bg-signal hover:bg-signal-light text-ink font-body text-xs uppercase tracking-wider font-semibold px-7 py-3.5 transition-all shadow-sm"
            >
              {isRtl ? "طلب استشارة مؤسسية ←" : "Request Institutional Consultation →"}
            </a>
            <a
              href="#services-overview"
              className="inline-flex items-center justify-center border border-white/20 hover:border-signal/70 bg-surface/50 text-white/90 hover:text-white font-body text-xs uppercase tracking-wider font-medium px-6 py-3.5 transition-all"
            >
              {isRtl ? "استكشف مجالات الممارسة ↓" : "Explore Areas of Practice ↓"}
            </a>
          </div>
        </div>

        {/* 3 Metric / Trust Badges */}
        <div className="mt-16 md:mt-20 pt-10 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8">
          {metrics.map((m, idx) => (
            <div
              key={idx}
              className="border border-white/10 bg-surface/40 backdrop-blur-sm p-5 sm:p-6 transition-all hover:border-signal/40"
            >
              <div className="font-body text-[10px] uppercase tracking-[0.2em] text-signal font-semibold">
                {m.label}
              </div>
              <div className="font-display text-xl sm:text-2xl text-white mt-1.5 font-medium">
                {m.value}
              </div>
              <div className="font-body text-xs text-muted mt-1 leading-relaxed">
                {m.detail}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
