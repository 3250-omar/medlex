"use client";

import { useTranslations } from "next-intl";

export default function MedicoLegalAudienceSection() {
  const t = useTranslations("pathwayPages.medicoLegalLanding.audience");
  const audiences =
    (t.raw("items") as { role: string; description: string }[]) || [];

  return (
    <section className="what who">
      <div className="wrap">
        <h2>{t("title")}</h2>
        <p className="kicker">{t("lead")}</p>
        <div className="grid">
          <div>
            <p>{t("p1")}</p>
            <p style={{ marginTop: "18px" }}>{t("p2")}</p>
            <blockquote>
              {t("quote")}
              <cite>{t("quoteCite")}</cite>
            </blockquote>
          </div>
          <div className="aud">
            <h3>{t("cardTitle")}</h3>
            {audiences.map((item, idx) => (
              <div key={idx} className="aud-item">
                <b>{item.role}</b>
                <span>{item.description}</span>
              </div>
            ))}
            <p className="aud-note">{t("note")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
