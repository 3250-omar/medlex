"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

type Props = {
  locale: string;
};

type PrincipleItem = {
  title: string;
  description: string;
  tag: string;
};

export default function MedicoLegalFounderSection({ locale }: Props) {
  const t = useTranslations("pathwayPages.medicoLegalLanding.founder");
  const principles = (t.raw("principles") as PrincipleItem[]) || [];

  const svgIcons = [
    // Scales
    <svg key="0" viewBox="0 0 24 24">
      <path d="M12 3v18M5 7l7-2 7 2M5 7l-3 7a3 3 0 0 0 6 0L5 7zM19 7l-3 7a3 3 0 0 0 6 0l-3-7zM8 21h8" />
    </svg>,
    // Globe
    <svg key="1" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" />
    </svg>,
    // Document
    <svg key="2" viewBox="0 0 24 24">
      <path d="M6 3h9l4 4v14H6z" />
      <path d="M15 3v4h4M9 12h6M9 16h6" />
    </svg>,
    // Recognition / Award
    <svg key="3" viewBox="0 0 24 24">
      <path d="M4 19V5h16v14z" />
      <path d="M8 9h8M8 13h5" />
      <circle cx="16" cy="16" r="1.5" />
    </svg>,
  ];

  return (
    <section className="how">
      <div className="wrap">
        <h2>{t("title")}</h2>
        <div className="rule"></div>
        <p className="lead">{t("lead")}</p>

        <div className="credit">
          <img
            src="/images/medicolegal/img_3_dr_ahmed_abouelghit.jpg"
            alt={t("name")}
          />
          <div>
            <b>{t("name")}</b>
            <span>{t("role")}</span>
            <Link className="link" href={`/${locale}/founder`}>
              {t("profileLink")}
            </Link>
          </div>
        </div>

        <div className="how-grid">
          {principles.map((p, idx) => (
            <article key={idx}>
              <div className="ico">{svgIcons[idx % svgIcons.length]}</div>
              <h3>{p.title}</h3>
              <p>{p.description}</p>
              <div className="where">{p.tag}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
