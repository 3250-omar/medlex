"use client";

import { useTranslations } from "next-intl";

export default function MedicoLegalTwoAudiencesSection() {
  const t = useTranslations("pathwayPages.medicoLegalLanding.twoAudiences");

  return (
    <section className="two">
      <div className="wrap">
        <div className="section-head">
          <h2 className="text-navy!">{t("title")}</h2>
          <div className="rule"></div>
          <p className="lead">{t("lead")}</p>
        </div>
        <div className="two-grid">
          <article>
            <h3>{t("clinicians.title")}</h3>
            <p>{t("clinicians.description")}</p>
            <div className="where">{t("clinicians.tag")}</div>
          </article>
          <article>
            <h3>{t("legal.title")}</h3>
            <p>{t("legal.description")}</p>
            <div className="where">{t("legal.tag")}</div>
          </article>
        </div>
      </div>
    </section>
  );
}
