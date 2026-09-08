"use client";

import { useTranslations } from "next-intl";
import SpotlightCard from "@/components/SpotlightCard";

interface InstitutionalEngagementCardsProps {
  locale: string;
}

export default function InstitutionalEngagementCards({
  locale,
}: InstitutionalEngagementCardsProps) {
  const t = useTranslations("institutionalPage.engagements");

  const items = [
    {
      tag: t("items.0.tag"),
      title: t("items.0.title"),
      desc: t("items.0.desc"),
    },
    {
      tag: t("items.1.tag"),
      title: t("items.1.title"),
      desc: t("items.1.desc"),
    },
    {
      tag: t("items.2.tag"),
      title: t("items.2.title"),
      desc: t("items.2.desc"),
    },
    {
      tag: t("items.3.tag"),
      title: t("items.3.title"),
      desc: t("items.3.desc"),
    },
  ];

  return (
    <section
      className="bg-navy py-20 lg:py-28 border-b border-white/10 on-navy text-lbody"
      aria-labelledby="engagements-heading"
    >
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-14 lg:mb-18">
          <div className="flex items-center gap-3">
            <span className="h-0.5 w-7 shrink-0 bg-gold" aria-hidden="true" />
            <span className="font-sans text-[11px] sm:text-xs uppercase tracking-[0.22em] text-gold font-semibold">
              {t("eyebrow")}
            </span>
          </div>
          <h2
            id="engagements-heading"
            className="mt-4 font-serif text-3xl md:text-4xl lg:text-5xl text-white font-bold leading-tight"
          >
            {t("title")}
          </h2>
          <p className="mt-4 font-sans text-base text-slate-300 max-w-2xl leading-relaxed">
            {t("intro")}
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7">
          {items.map((item, idx) => (
            <SpotlightCard
              key={idx}
              className="flex flex-col justify-between rounded-2xl border border-white/12 bg-deep/90 p-8 hover:border-gold/50 transition-all duration-300 shadow-xl"
              spotlightColor="rgba(212, 175, 55, 0.12)"
            >
              <div>
                <span className="font-serif text-base font-bold text-gold">
                  {item.tag}
                </span>
                <h3 className="mt-3 font-serif text-xl font-bold text-white leading-snug">
                  {item.title}
                </h3>
                <p className="mt-3.5 font-sans text-sm text-lbody leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
}
