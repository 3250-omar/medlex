"use client";

import { useTranslations } from "next-intl";

type LevelItem = {
  num: string;
  badge: string;
  title: string;
  meta: string;
  description: string;
};

export default function MedicoLegalLevelsSection() {
  const t = useTranslations("pathwayPages.medicoLegalLanding.levels");
  const levels = (t.raw("items") as LevelItem[]) || [];

  return (
    <section
      id="levels"
      className="bg-white text-char py-24 border-b border-hair"
    >
      <div className="mx-auto w-full px-6 sm:px-8 lg:max-w-6xl lg:px-10">
        {/* Section Header with Badge */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-14 border-b border-hair">
          <div className="max-w-2xl">
            <span className="font-sans font-semibold text-xs uppercase tracking-widest text-goldd block mb-3">
              {t("kicker")}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-[40px] font-bold text-ink! leading-tight">
              {t("title")}
            </h2>
            <div className="w-14 h-0.5 bg-gold my-5" />
            <p className="font-serif text-lg sm:text-xl text-char/85 leading-relaxed">
              {t("lead")}
            </p>
          </div>

          <div className="flex items-center gap-4 bg-tint border border-gold/30 rounded-2xl p-5 max-w-sm shrink-0 shadow-sm">
            <span className="font-serif text-4xl sm:text-5xl font-bold text-goldd leading-none">
              {t("badgeNumber")}
            </span>
            <span className="text-xs sm:text-[13.5px] font-sans font-medium text-ink leading-snug">
              {t("badgeText")}
            </span>
          </div>
        </div>

        {/* The 4-Level Ladder */}
        <div className="mt-12 space-y-6">
          {levels.map((lvl, index) => {
            const isHighlight = index === 1; // Level 2 is the primary offering
            return (
              <div
                key={index}
                className={`rounded-2xl border transition-all duration-200 p-6 sm:p-8 ${
                  isHighlight
                    ? "bg-tint/80 border-gold/40 shadow-md ring-1 ring-gold/30"
                    : "bg-white border-hair hover:border-gold/30 hover:shadow-sm"
                }`}
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-baseline">
                  {/* Level Number & Badge */}
                  <div className="md:col-span-3 flex md:flex-col items-center md:items-start justify-between gap-2">
                    <span className="font-serif text-2xl sm:text-3xl font-bold text-navy">
                      {lvl.num}
                    </span>
                    <span
                      className={`text-[11.5px] font-sans font-semibold px-2.5 py-1 rounded uppercase tracking-wider ${
                        isHighlight
                          ? "bg-gold text-navy font-bold"
                          : "bg-hair/70 text-grey"
                      }`}
                    >
                      {lvl.badge}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="md:col-span-9">
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-ink! mb-1">
                      {lvl.title}
                    </h3>
                    <div className="text-xs sm:text-[13px] font-sans font-semibold text-goldd mb-3 tracking-wide">
                      {lvl.meta}
                    </div>
                    <p className="text-base leading-relaxed text-char/90 font-sans">
                      {lvl.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
