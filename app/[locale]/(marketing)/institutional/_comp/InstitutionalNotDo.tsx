"use client";

import { useTranslations } from "next-intl";

interface InstitutionalNotDoProps {
  locale: string;
}

export default function InstitutionalNotDo({ locale }: InstitutionalNotDoProps) {
  const t = useTranslations("institutionalPage.notDo");

  const neverItems = [
    t("boxItems.0"),
    t("boxItems.1"),
    t("boxItems.2"),
    t("boxItems.3"),
    t("boxItems.4"),
  ];

  return (
    <section className="py-24 bg-navy text-lbody">
      <div className="mx-auto max-w-[1120px] px-7">
        <h2 className="font-serif font-medium text-[clamp(30px,3.6vw,42px)] leading-[1.12] tracking-[-0.01em] text-white">
          {t("title")}
        </h2>
        <div className="w-14 h-0.5 bg-gold my-6" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-2 items-start">
          {/* Left Column Description */}
          <div className="space-y-4 font-sans text-base sm:text-[16.5px] leading-relaxed text-lbody">
            <p>{t("para1")}</p>
            <p>{t("para2")}</p>
            <p>{t("para3")}</p>
          </div>

          {/* Right Column "We Never" Box */}
          <div className="rounded-md border border-fd-gold-soft/50 bg-fd-navy-deep/60 p-6 sm:p-7 backdrop-blur-xs">
            <b className="block font-serif text-[19px] font-semibold text-white mb-3.5">
              {t("boxTitle")}
            </b>

            <div className="divide-y divide-white/15">
              {neverItems.map((item, idx) => (
                <div
                  key={idx}
                  className="py-2.5 text-[15px] text-lbody flex items-baseline gap-3"
                >
                  <span className="text-fd-gold-soft font-bold text-base shrink-0 leading-none">
                    ×
                  </span>
                  <span className="leading-snug">{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3.5 border-t border-white/15 text-xs sm:text-[14px] text-mute font-sans">
              {t("boxWhy")}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
