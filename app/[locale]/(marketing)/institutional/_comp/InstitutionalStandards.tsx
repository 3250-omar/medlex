"use client";

import { useTranslations } from "next-intl";

interface InstitutionalStandardsProps {
  locale: string;
}

export default function InstitutionalStandards({
  locale,
}: InstitutionalStandardsProps) {
  const t = useTranslations("institutionalPage.standards");

  const pillars = [
    {
      title: t("pillars.0.title"),
      desc: t("pillars.0.desc"),
    },
    {
      title: t("pillars.1.title"),
      desc: t("pillars.1.desc"),
    },
    {
      title: t("pillars.2.title"),
      desc: t("pillars.2.desc"),
    },
    {
      title: t("pillars.3.title"),
      desc: t("pillars.3.desc"),
    },
  ];

  return (
    <section
      className="bg-ink py-20 lg:py-28 border-b border-white/10"
      aria-labelledby="institutional-standards-heading"
    >
      <div
        className="mx-auto w-full px-6 md:px-8 lg:px-12"
        style={{ maxWidth: "var(--content-max)" }}
      >
        {/* Header */}
        <div className="max-w-3xl mb-16 lg:mb-20">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-signal" aria-hidden="true" />
            <span className="font-body text-[10px] uppercase tracking-[0.25em] text-muted font-semibold">
              {t("eyebrow")}
            </span>
          </div>
          <h2
            id="institutional-standards-heading"
            className="mt-4 font-display text-3xl md:text-4xl lg:text-5xl text-white font-normal leading-tight"
          >
            {t("title")}
          </h2>
          <p className="mt-4 font-body text-base text-muted max-w-2xl leading-relaxed">
            {t("intro")}
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {pillars.map((pillar, idx) => (
            <div
              key={idx}
              className="relative border-t border-white/15 pt-6 flex flex-col justify-between group hover:border-signal transition-colors duration-300"
            >
              <div>
                <span className="font-mono text-xs text-signal font-semibold tracking-wider">
                  0{idx + 1}
                </span>
                <h3 className="mt-3 font-display text-lg sm:text-xl text-white font-medium group-hover:text-signal transition-colors">
                  {pillar.title}
                </h3>
                <p className="mt-3 font-body text-xs sm:text-sm text-muted leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
