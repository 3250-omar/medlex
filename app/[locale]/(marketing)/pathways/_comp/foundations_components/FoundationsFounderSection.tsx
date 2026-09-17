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

export default function FoundationsFounderSection({ locale }: Props) {
  const t = useTranslations("pathwayPages.foundationsLanding.founder");

  const defaultPrinciples: PrincipleItem[] = [
    {
      title: "Real situations, not theory",
      description:
        "The audits, investigations, appraisals and service meetings in these programmes are ones the founder has sat through — on both sides of the table.",
      tag: "Clinician · Service lead · Programme director",
    },
    {
      title: "Built for the systems you work in",
      description:
        "The UK system as the worked example, with the principles that carry to the Gulf and other advanced health systems — and the differences named where they matter.",
      tag: "United Kingdom · Gulf · Egypt",
    },
    {
      title: "Ready to use on Monday",
      description:
        "Every module ends with what you will be able to do, and a workbook that turns it into something done: a teaching session planned, a portfolio started, a meeting run.",
      tag: "Workbook · Toolkit · Applied",
    },
    {
      title: "Clear about what you get",
      description:
        "Independent professional development with a certificate of completion. CPD recognition will be shown on each programme page once it is in place.",
      tag: "Independent · Certificate of completion",
    },
  ];

  const principles =
    (t.raw("principles") as PrincipleItem[]) || defaultPrinciples;

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
    // Clock / Check
    <svg key="3" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>,
  ];

  return (
    <section className="how" id="founder">
      <div className="wrap">
        <h2>{t("title")}</h2>
        <div className="rule"></div>
        <p className="lead">{t("lead")}</p>

        <div className="credit">
          <img
            src="/images/foundations/dr_ahmed_abouelghit.jpg"
            alt={t("name")}
            width={64}
            height={64}
          />
          <div>
            <b>{t("name")}</b>
            <span>{t("role")}</span>
            <Link className="link" href={`/${locale}/founder`}>
              {t("profileLink")}
            </Link>
          </div>
        </div>

        <blockquote className="hq">
          {t("quote")}
          <cite>{t("quoteCite")}</cite>
        </blockquote>

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
