"use client";

import { useTranslations } from "next-intl";

type LevelItem = {
  num: string;
  badge?: string;
  title: string;
  meta: string;
  description: string;
};

export default function MedicoLegalLevelsSection() {
  const t = useTranslations("pathwayPages.medicoLegalLanding.levels");
  const levels = (t.raw("items") as LevelItem[]) || [];

  return (
    <section className="paths" id="levels">
      <div className="wrap">
        <div className="section-head levels-head">
          <div>
            <h2 >{t("title")}</h2>
            <div className="rule"></div>
            <p className="lead">{t("lead")}</p>
          </div>
          <div className="badge">
            <b>{t("badgeNumber")}</b>
            <span>{t("badgeText")}</span>
          </div>
        </div>
        <div className="ladder">
          {levels.map((lvl, index) => (
            <article key={index} className="rung">
              <div className="num">{lvl.num}</div>
              <div>
                <h3>{lvl.title}</h3>
                <div className="meta">{lvl.meta}</div>
                <p>{lvl.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
