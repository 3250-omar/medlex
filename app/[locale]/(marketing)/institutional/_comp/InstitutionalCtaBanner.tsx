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
    <section className="bg-ink py-16 md:py-24 border-b border-white/10">
      <div
        className="mx-auto w-full px-6 md:px-8 lg:px-12"
        style={{ maxWidth: "var(--content-max)" }}
      >
        <div className="relative overflow-hidden bg-surface border border-white/15 p-8 md:p-12 lg:p-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          {/* Subtle background glow */}
          <div className="pointer-events-none absolute -right-10 -bottom-10 h-72 w-72 bg-signal/10 blur-3xl" />

          <div className="relative z-10 max-w-2xl">
            <span className="font-body text-[10px] uppercase tracking-[0.25em] text-signal font-semibold">
              {t("eyebrow")}
            </span>
            <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl text-white mt-2 leading-snug">
              {t("title")}
            </h3>
            <p className="font-body text-xs sm:text-sm text-muted mt-3 leading-relaxed">
              {t("desc")}
            </p>
          </div>

          <div className="relative z-10 shrink-0 w-full md:w-auto">
            <a
              href="#institutional-inquiry"
              className="w-full md:w-auto inline-flex items-center justify-center bg-signal hover:bg-signal-light text-ink font-body text-xs uppercase tracking-wider font-semibold px-8 py-4 transition-colors whitespace-nowrap gap-2"
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
