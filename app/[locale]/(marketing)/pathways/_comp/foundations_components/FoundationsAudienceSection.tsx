"use client";

import { useTranslations } from "next-intl";

type AudienceItem = {
  role: string;
  description: string;
};

export default function FoundationsAudienceSection() {
  const t = useTranslations("pathwayPages.foundationsLanding.audience");
  const audiences =
    (t.raw("items") as AudienceItem[]) || [
      {
        role: "Doctors in the UK, the Gulf and other advanced systems",
        description:
          "Working in, or training within, a system whose unwritten rules were never explained.",
      },
      {
        role: "Early- and mid-career doctors",
        description:
          "Confident with patients, less sure in audit, teaching or management — and starting to think about appraisal.",
      },
      {
        role: "Senior clinicians in management roles",
        description:
          "Leading a service or a team, and wanting a clear method rather than instinct.",
      },
      {
        role: "Anyone who would rather arrive prepared",
        description:
          "The doctor who wants solid footing before walking into the room.",
      },
    ];

  return (
    <section className="what who on-tint">
      <div className="wrap">
        <h2>{t("title")}</h2>
        <p className="kicker">{t("kicker")}</p>
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
