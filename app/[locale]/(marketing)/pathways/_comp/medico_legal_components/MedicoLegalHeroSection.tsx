"use client";

import { useTranslations } from "next-intl";

type Props = {
  locale: string;
};

export default function MedicoLegalHeroSection({ locale: _locale }: Props) {
  const t = useTranslations("pathwayPages.medicoLegalLanding.hero");

  const tickerItems = (t.raw("ticker") as string[]) || [
    "WRITING PSYCHIATRIC EVIDENCE",
    "COURT-READY REPORTING STANDARDS",
    "CAPACITY ASSESSMENT",
    "CRIMINAL RESPONSIBILITY",
    "EXPERT WITNESS TESTIMONY",
    "RISK FORMULATION FOR THE COURT",
    "CROSS-EXAMINATION",
    "FOURTEEN FOUNDATION MASTERCLASSES",
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
              <a className="btn ghost" href="#flagship">
                {t("flagshipBtn")}
              </a>
              <a
                className="btn ghost"
                href="/gifts/MedLex_Medico-Legal_Pathway_Guide.pdf"
                download="MedLex_Medico-Legal_Pathway_Guide.pdf"
              >
                {_locale === "ar"
                  ? "تحميل الدليل التعريفي"
                  : "Download Prospectus"}
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
