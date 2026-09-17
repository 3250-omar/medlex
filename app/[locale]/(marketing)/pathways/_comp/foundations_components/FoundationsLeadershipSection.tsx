"use client";

import { useTranslations } from "next-intl";

export default function FoundationsLeadershipSection() {
  const t = useTranslations("pathwayPages.foundationsLanding.leadership");

  return (
    <section className="two" id="leadership">
      <div className="wrap">
        <div className="clp-head">
          <div className="section-head">
            <div className="eyebrow">{t("eyebrow")}</div>
            <h2>{t("title")}</h2>
            <div className="rule"></div>
            <p className="lead">{t("lead")}</p>
          </div>
          <figure className="clp-img">
            <img
              src="/images/foundations/leadership_workshop.jpg"
              alt="Clinicians in a leadership workshop"
            />
          </figure>
        </div>
        <div className="two-grid">
          <article>
            <h3>{t("learn.title")}</h3>
            <p>{t("learn.description")}</p>
            <div className="where">{t("learn.tag")}</div>
          </article>
          <article>
            <h3>{t("runs.title")}</h3>
            <p>{t("runs.description")}</p>
            <div className="where">{t("runs.tag")}</div>
          </article>
        </div>
      </div>
    </section>
  );
}
