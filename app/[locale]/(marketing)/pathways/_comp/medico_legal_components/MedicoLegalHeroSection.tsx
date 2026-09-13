"use client";

import Image from "next/image";
import { useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import LogoLoop from "@/components/LogoLoop";

type Props = {
  locale: string;
};

export default function MedicoLegalHeroSection({ locale }: Props) {
  const t = useTranslations("pathwayPages.medicoLegalLanding.hero");
  const currentLocale = useLocale();
  const isRtl = currentLocale === "ar";
  const tickerItems = useMemo(() => (t.raw("ticker") as string[]) || [], [t]);

  const tickerLogos = useMemo(
    () =>
      tickerItems.map((item) => ({
        ariaLabel: item,
        node: (
          <span className="inline-flex h-12 items-center text-[11.5px] font-sans font-semibold uppercase tracking-[0.18em] text-white/90 px-8 whitespace-nowrap">
            {item}
            <span className="inline-block w-1.5 h-1.5 bg-gold rotate-45 ms-8 opacity-90 shadow-sm" />
          </span>
        ),
      })),
    [tickerItems],
  );

  return (
    <section className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-navy on-navy text-lbody">
      {/* Authentic Background Image Layer (Caduceus & Scales of Justice) */}
      <div className="absolute inset-0 pointer-events-none select-none z-0">
        <Image
          src={
            isRtl
              ? "/images/medicolegal/medico_legal_hero_bg_rtl.jpg"
              : "/images/medicolegal/medico_legal_hero_bg.jpg"
          }
          alt="Where Medicine Meets Justice"
          fill
          priority
          quality={95}
          style={{
            objectFit: "cover",
            objectPosition: isRtl ? "22% center" : "78% center",
          }}
          className="object-cover"
        />

        {/* Directional contrast gradient overlay for typography readability */}
        <div
          className="absolute inset-0 transition-all duration-700"
          style={{
            background: isRtl
              ? "linear-gradient(270deg, rgba(14,29,56,0.92) 0%, rgba(14,29,56,0.80) 42%, rgba(14,29,56,0.35) 72%, rgba(14,29,56,0.08) 100%)"
              : "linear-gradient(90deg, rgba(14,29,56,0.92) 0%, rgba(14,29,56,0.80) 42%, rgba(14,29,56,0.35) 72%, rgba(14,29,56,0.08) 100%)",
          }}
        />

        {/* Top and bottom subtle vignettes */}
        <div className="absolute inset-0 bg-linear-to-b from-navy/60 via-transparent to-deep/90" />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 mx-auto w-full px-6 sm:px-8 lg:max-w-6xl lg:px-10 pt-28 sm:pt-32 lg:pt-36 pb-12 sm:pb-16 flex-1 flex flex-col justify-center">
        <div className="max-w-170">
          {/* MedLex Signature Eyebrow Kicker */}
          <div className="mb-6 flex items-center justify-start gap-3">
            <span className="block h-px w-10 bg-gold/70" />
            <span className="font-sans text-[11.5px] uppercase tracking-[0.22em] text-gold font-semibold">
              {t("eyebrow")}
            </span>
          </div>

          {/* Main Display Headline */}
          <h1 className="font-serif text-[clamp(42px,5.5vw,76px)] font-normal leading-[1.04] tracking-[-0.02em] text-white">
            {t.rich("headline", {
              em: (chunks) => (
                <em className="font-serif italic font-normal text-[#D9C08A]">
                  {chunks}
                </em>
              ),
            })}
          </h1>

          {/* Lead Editorial Paragraph */}
          <p className="mt-6 font-sans text-base sm:text-lg lg:text-[19px] leading-[1.7] text-lbody max-w-2xl">
            {t("lead")}
          </p>

          {/* Frosted Metadata Strip Container */}
          <dl className="mt-8 max-w-2xl rounded-2xl border border-white/15 bg-deep/75 backdrop-blur-md p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x rtl:sm:divide-x-reverse divide-white/10 shadow-2xl">
            {/* Delivery */}
            <div className="sm:pe-4">
              <dt className="text-[10.5px] font-sans font-bold uppercase tracking-[0.2em] text-gold">
                {t("deliveryLabel")}
              </dt>
              <dd className="mt-1 font-sans text-sm sm:text-[15px] font-semibold text-white">
                {t("deliveryValue")}
              </dd>
            </div>

            {/* Languages */}
            <div className="pt-3 sm:pt-0 sm:px-4">
              <dt className="text-[10.5px] font-sans font-bold uppercase tracking-[0.2em] text-gold">
                {t("languagesLabel")}
              </dt>
              <dd className="mt-1 font-sans text-sm sm:text-[15px] font-semibold text-white">
                {t("languagesValue")}
              </dd>
            </div>

            {/* Status */}
            <div className="pt-3 sm:pt-0 sm:ps-4">
              <dt className="text-[10.5px] font-sans font-bold uppercase tracking-[0.2em] text-gold">
                {t("statusLabel")}
              </dt>
              <dd className="mt-1 font-sans text-sm sm:text-[15px] font-semibold text-white">
                {t("statusValue")}
              </dd>
            </div>
          </dl>

          {/* Call-to-Action Buttons in Signature Pill Style */}
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#waitlist"
              className="inline-flex items-center justify-center font-sans font-bold text-sm sm:text-[15px] px-8 py-4 rounded-full bg-gold text-navy shadow-lg shadow-gold/15 hover:bg-[#A8842F] hover:shadow-gold/25 hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              {t("joinWaitlist")}
            </a>
            <a
              href="#flagship"
              className="inline-flex items-center justify-center font-sans font-semibold text-sm sm:text-[15px] px-8 py-4 rounded-full border border-white/30 bg-white/5 backdrop-blur-sm text-white hover:bg-white/15 hover:border-white/60 transition-all cursor-pointer"
            >
              {t("flagshipBtn")}
            </a>
          </div>
        </div>
      </div>

      {/* Signature Infinite Marquee Ticker at Viewport Base */}
      <div
        className="relative z-10 mt-auto border-t border-white/10 bg-deep/95 backdrop-blur overflow-hidden select-none"
        aria-hidden="true"
      >
        <LogoLoop
          logos={tickerLogos}
          speed={42}
          direction={isRtl ? "right" : "left"}
          gap={0}
          fadeOut
          fadeOutColor="#142A49"
          ariaLabel="Medico-Legal topics"
        />
      </div>
    </section>
  );
}
