"use client";

import { useLocale, useTranslations } from "next-intl";

export default function InstitutionalHero() {
  const t = useTranslations("institutionalPage.hero");
  const locale = useLocale();
  const isAr = locale === "ar";
  const tickerItems = [
    t("tickerItems.0"),
    t("tickerItems.1"),
    t("tickerItems.2"),
    t("tickerItems.3"),
    t("tickerItems.4"),
    t("tickerItems.5"),
    t("tickerItems.6"),
    t("tickerItems.7"),
  ];

  return (
    <section className="relative overflow-hidden bg-fd-navy-deep text-white">
      {/* Background Image with Gradient Overlay */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-no-repeat bg-[center_40%]"
        style={{
          backgroundImage:
            "url('/images/institutional/institutional-hero-bg.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-fd-navy-deep/95 via-fd-navy-deep/85 to-fd-navy-deep/40" />
      </div>

      {/* Main Content Grid */}
      <div className="relative z-10 mx-auto max-w-[1120px] px-7 pt-28 pb-20 md:pt-36 md:pb-24">
        <div className="max-w-[720px]">
          <h1 className="font-serif font-normal text-[clamp(38px,4.4vw,56px)] leading-[1.08] tracking-[-0.01em] text-white">
            {locale === "ar" ? (
              <>
                نحن نبني القدرات والمؤسسة تحتفظ{" "}
                <em className="font-normal italic text-fd-gold-soft">بالعمل</em>
              </>
            ) : (
              <>
                We build the capacity. Your institution keeps the{" "}
                <em className="font-normal italic text-fd-gold-soft">work</em>
              </>
            )}
          </h1>

          <p className="mt-7 font-sans text-lg sm:text-[20px] leading-[1.6] text-lbody max-w-[50ch]">
            {t("lead")}
          </p>

          {/* Quick Info Strip */}
          <div className="mt-8 flex flex-col sm:flex-row border border-fd-stone/40 rounded-md overflow-hidden bg-fd-navy-deep/70 backdrop-blur-xs">
            <div className="flex-1 py-3.5 px-4.5 border-b sm:border-b-0 sm:border-r rtl:sm:border-r-0 rtl:sm:border-l border-fd-stone/30">
              <small className="block font-sans text-xs text-mute tracking-wide mb-1">
                {t("stripWhatLabel")}
              </small>
              <b className="font-sans text-[15px] text-white font-semibold">
                {t("stripWhatValue")}
              </b>
            </div>
            <div className="flex-1 py-3.5 px-4.5 border-b sm:border-b-0 sm:border-r rtl:sm:border-r-0 rtl:sm:border-l border-fd-stone/30">
              <small className="block font-sans text-xs text-mute tracking-wide mb-1">
                {t("stripLangLabel")}
              </small>
              <b className="font-sans text-[15px] text-white font-semibold">
                {t("stripLangValue")}
              </b>
            </div>
            <div className="flex-1 py-3.5 px-4.5">
              <small className="block font-sans text-xs text-mute tracking-wide mb-1">
                {t("stripLocLabel")}
              </small>
              <b className="font-sans text-[15px] text-white font-semibold">
                {t("stripLocValue")}
              </b>
            </div>
          </div>

          {/* CTAs */}
          <div className="mt-9 flex flex-wrap items-center gap-3.5">
            <a
              href="#enquiry"
              className="inline-flex items-center justify-center font-sans font-semibold text-[15px] px-6 py-3.5 rounded bg-gold text-fd-navy-deep hover:bg-goldd transition-colors shadow-sm"
            >
              {t("ctaEnquiry")}
            </a>
            <a
              href="#services"
              className="inline-flex items-center justify-center font-sans font-semibold text-[15px] px-6 py-3.5 rounded border border-white text-white hover:bg-white hover:text-navy transition-colors"
            >
              {t("ctaServices")}
            </a>
            <a
              href={
                isAr
                  ? "/gifts/ar/institutional_prospectus.pdf"
                  : "/gifts/MedLex_Institutional_Guide.pdf"
              }
              download={
                isAr
                  ? "MedLex_Institutional_Guide_AR.pdf"
                  : "MedLex_Institutional_Guide.pdf"
              }
              className="inline-flex items-center justify-center font-sans font-semibold text-[15px] px-6 py-3.5 rounded border border-white text-white hover:bg-white hover:text-navy transition-colors"
            >
              {isAr ? "تحميل الدليل التعريفي" : "Download Prospectus"}
            </a>
          </div>
        </div>
      </div>

      {/* Marquee Ticker */}
      <div
        className="relative border-y border-white/12 bg-navy py-3.5 overflow-hidden select-none"
        aria-hidden="true"
      >
        <div
          className={`flex w-max whitespace-nowrap ${locale === "ar" ? "animate-foundations-ticker-rtl" : "animate-foundations-ticker"}`}
        >
          <ul className="flex items-center gap-0 list-none">
            {tickerItems.concat(tickerItems).map((item, idx) => (
              <li
                key={idx}
                className="relative font-sans text-[12.5px] font-medium tracking-[0.14em] text-lbody px-7 flex items-center"
              >
                <span>{item}</span>
                <span className="inline-block size-1.5 bg-gold rotate-45 ms-7 shrink-0" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
