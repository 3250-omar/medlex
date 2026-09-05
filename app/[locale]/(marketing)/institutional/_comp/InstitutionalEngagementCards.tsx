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
      className="bg-ink py-20 lg:py-28 border-b border-white/10"
      aria-labelledby="engagements-heading"
    >
      <div
        className="mx-auto w-full px-6 md:px-8 lg:px-12"
        style={{ maxWidth: "var(--content-max)" }}
      >
        {/* Section Header */}
        <div className="max-w-3xl mb-16 lg:mb-20">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-signal" aria-hidden="true" />
            <span className="font-body text-[10px] uppercase tracking-[0.25em] text-muted font-semibold">
              {t("eyebrow")}
            </span>
          </div>
          <h2
            id="engagements-heading"
            className="mt-4 font-display text-3xl md:text-4xl lg:text-5xl text-white font-normal leading-tight"
          >
            {t("title")}
          </h2>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {items.map((item, idx) => (
            <SpotlightCard
              key={idx}
              className="bg-surface/80 border border-white/10 p-7 sm:p-8 flex flex-col justify-between hover:border-signal/50 transition-colors duration-300"
              spotlightColor="rgb(220 164 53 / 0.12)"
            >
              <div>
                <span className="font-mono text-[11px] text-signal font-semibold tracking-wider block mb-4">
                  {item.tag}
                </span>
                <h3 className="font-display text-lg sm:text-xl text-white font-medium mb-3">
                  {item.title}
                </h3>
                <p className="font-body text-xs sm:text-sm text-muted leading-relaxed">
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
