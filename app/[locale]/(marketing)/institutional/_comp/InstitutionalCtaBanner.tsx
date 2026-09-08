"use client";

import { useTranslations } from "next-intl";

interface InstitutionalCtaBannerProps {
  locale: string;
}

export default function InstitutionalCtaBanner({
  locale,
}: InstitutionalCtaBannerProps) {
  const t = useTranslations("institutionalPage.ctaBanner");
  const isRtl = locale === "ar";

  return (
    <section className="bg-navy py-16 md:py-24 border-b border-white/10 on-navy text-lbody">
      <div className="w-full px-6 sm:px-10 md:px-14 lg:px-20 xl:px-24 2xl:px-28">
        <div className="relative overflow-hidden rounded-2xl bg-deep/90 border border-white/15 p-8 md:p-12 lg:p-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 shadow-2xl">
          {/* Subtle background glow */}
          <div className="pointer-events-none absolute -right-10 -bottom-10 h-72 w-72 bg-gold/10 blur-3xl" />

          <div className="relative z-10 max-w-2xl">
            <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-gold font-semibold">
              {t("eyebrow")}
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-white mt-2 font-bold leading-snug">
              {t("title")}
            </h3>
            <p className="font-sans text-sm text-lbody mt-3 leading-relaxed">
              {t("desc")}
            </p>
          </div>

          <div className="relative z-10 shrink-0 w-full md:w-auto">
            <a
              href="#institutional-inquiry"
              className="btn btn-gold w-full md:w-auto !py-3.5 !px-8 text-sm font-semibold gap-2 whitespace-nowrap"
            >
              <span>{t("action")}</span>
              <span aria-hidden="true">{isRtl ? "←" : "→"}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
