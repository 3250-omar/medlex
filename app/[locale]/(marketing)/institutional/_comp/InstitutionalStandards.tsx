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
      className="bg-navy py-20 lg:py-28 border-b border-white/10 on-navy text-lbody"
      aria-labelledby="institutional-standards-heading"
    >
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-10">
        {/* Header */}
        <div className="max-w-3xl mb-14 lg:mb-18">
          <div className="flex items-center gap-3">
            <span className="h-0.5 w-7 shrink-0 bg-gold" aria-hidden="true" />
            <span className="font-sans text-[11px] sm:text-xs uppercase tracking-[0.22em] text-gold font-semibold">
              {t("eyebrow")}
            </span>
          </div>
          <h2
            id="institutional-standards-heading"
            className="mt-4 font-serif text-3xl md:text-4xl lg:text-5xl text-white font-bold leading-tight"
          >
            {t("title")}
          </h2>
          <p className="mt-4 font-sans text-base text-slate-300 max-w-2xl leading-relaxed">
            {t("intro")}
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {pillars.map((pillar, idx) => (
            <div
              key={idx}
              className="relative border-t-2 border-gold pt-6 flex flex-col justify-between group"
            >
              <div>
                <span className="font-serif text-2xl text-gold font-bold">
                  0{idx + 1}
                </span>
                <h3 className="mt-3 font-serif text-xl text-white font-bold group-hover:text-gold transition-colors">
                  {pillar.title}
                </h3>
                <p className="mt-3 font-sans text-sm text-slate-300 leading-relaxed">
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
