import { useTranslations } from "next-intl";
import { DEFAULT_TICKER_ITEMS } from "./foundations.constants";

type Props = {
  locale?: string;
};

export default function FoundationsHeroSection({ locale: _locale }: Props) {
  const t = useTranslations("pathwayPages.foundationsLanding.hero");

  const tickerItems =
    (t.raw("ticker") as string[]) || DEFAULT_TICKER_ITEMS;

  return (
    <section className="relative overflow-hidden bg-fd-navy-deep bg-[url('/images/foundations/hero_bg.jpg')] bg-cover bg-center text-white">
      {/* Editorial Gradient Overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-r rtl:bg-gradient-to-l from-[#0a1428]/90 via-[#0a1428]/78 to-[#0a1428]/10 pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-[1120px] mx-auto px-7 py-20 lg:py-28">
        <div className="max-w-[640px]">
          <h1 className="font-serif text-[clamp(40px,5vw,66px)] font-normal leading-[1.08] tracking-[-0.02em] text-white">
            {t.rich("headline", {
              em: (chunks) => (
                <em className="italic font-normal text-fd-gold-soft">{chunks}</em>
              ),
            })}
          </h1>

          <p className="mt-7 text-[20px] leading-[1.6] max-w-[50ch] text-[#e9ecf2]">
            {t("lead")}
          </p>

          {/* Metric Summary Strip */}
          <div className="flex flex-col sm:flex-row mt-7.5 border border-fd-gold-soft/45 rounded-md overflow-hidden bg-fd-navy-deep/55">
            <div className="flex-1 px-4.5 py-3.5 border-b sm:border-b-0 sm:border-r rtl:sm:border-r-0 rtl:sm:border-l border-fd-gold-soft/35 last:border-b-0 sm:last:border-r-0 rtl:sm:last:border-l-0">
              <small className="block text-[12px] text-[#9aa6ba] tracking-[0.06em] mb-1 uppercase">
                {t("deliveryLabel")}
              </small>
              <b className="text-[15px] text-white font-semibold">
                {t("deliveryValue")}
              </b>
            </div>
            <div className="flex-1 px-4.5 py-3.5 border-b sm:border-b-0 sm:border-r rtl:sm:border-r-0 rtl:sm:border-l border-fd-gold-soft/35 last:border-b-0 sm:last:border-r-0 rtl:sm:last:border-l-0">
              <small className="block text-[12px] text-[#9aa6ba] tracking-[0.06em] mb-1 uppercase">
                {t("languagesLabel")}
              </small>
              <b className="text-[15px] text-white font-semibold">
                {t("languagesValue")}
              </b>
            </div>
            <div className="flex-1 px-4.5 py-3.5 border-b sm:border-b-0 sm:border-r rtl:sm:border-r-0 rtl:sm:border-l border-fd-gold-soft/35 last:border-b-0 sm:last:border-r-0 rtl:sm:last:border-l-0">
              <small className="block text-[12px] text-[#9aa6ba] tracking-[0.06em] mb-1 uppercase">
                {t("statusLabel")}
              </small>
              <b className="text-[15px] text-white font-semibold">
                {t("statusValue")}
              </b>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap gap-3.5 mt-9">
            <a
              className="inline-block font-sans font-semibold text-[15px] px-6 py-3.5 rounded border-[1.5px] border-fd-gold bg-fd-gold text-fd-navy-deep hover:brightness-95 transition cursor-pointer text-center"
              href="#waitlist"
            >
              {t("joinWaitlist")}
            </a>
            <a
              className="inline-block font-sans font-semibold text-[15px] px-6 py-3.5 rounded border-[1.5px] border-white bg-transparent text-white hover:bg-white hover:text-fd-navy transition-colors cursor-pointer text-center"
              href="#gift"
            >
              {t("freeGuideBtn")}
            </a>
          </div>
        </div>
      </div>

      {/* Continuous Ticker Marquee */}
      <div
        className="relative bg-fd-navy border-y border-white/12 py-3.5 overflow-hidden select-none"
        aria-hidden="true"
      >
        <ul className="flex whitespace-nowrap w-max m-0 p-0 list-none animate-foundations-ticker">
          {tickerItems.concat(tickerItems).map((item, idx) => (
            <li
              key={idx}
              className="relative text-[12.5px] tracking-[0.14em] text-[#dce1ea] font-medium px-7"
            >
              {item}
              <span
                className="absolute right-[-3px] rtl:right-auto rtl:left-[-3px] top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-fd-gold rotate-45 pointer-events-none"
                aria-hidden="true"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
