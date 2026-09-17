"use client";

import { useTranslations } from "next-intl";

type Props = {
  locale: string;
};

export default function FoundationsHeroSection({ locale: _locale }: Props) {
  const t = useTranslations("pathwayPages.foundationsLanding.hero");

  const tickerItems = (t.raw("ticker") as string[]) || [
    "HOW THE SYSTEM WORKS",
    "COMMUNICATION AT WORK",
    "AUDIT AND QUALITY IMPROVEMENT",
    "RESEARCH",
    "TEACHING AND SUPERVISION",
    "MANAGEMENT AND LEADERSHIP",
    "PORTFOLIO, APPRAISAL AND REVALIDATION",
    "INTERNAL INVESTIGATIONS",
  ];

  return (
    <section className="hero">
      <div className="wrap">
        <div className="grid">
          <div>
            <h1>
              {t.rich("headline", {
                em: (chunks) => <em>{chunks}</em>,
              })}
            </h1>
            <p className="lead">{t("lead")}</p>
            <div className="strip">
              <div>
                <small>{t("deliveryLabel")}</small>
                <b>{t("deliveryValue")}</b>
              </div>
              <div>
                <small>{t("languagesLabel")}</small>
                <b>{t("languagesValue")}</b>
              </div>
              <div>
                <small>{t("statusLabel")}</small>
                <b>{t("statusValue")}</b>
              </div>
            </div>
            <div className="ctas">
              <a className="btn" href="#waitlist">
                {t("joinWaitlist")}
              </a>
              <a className="btn ghost" href="#gift">
                {t("freeGuideBtn")}
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="ticker" aria-hidden="true">
        <ul>
          {tickerItems.concat(tickerItems).map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
