"use client";

import { useTranslations } from "next-intl";

type ProgrammeItem = {
  status: string;
  live?: boolean;
  for: string;
  title: string;
  description: string;
  bullets: string[];
  action: string;
  href: string;
};

export default function FoundationsPortfolioSection() {
  const t = useTranslations("pathwayPages.foundationsLanding.portfolio");

  const defaultProgrammes: ProgrammeItem[] = [
    {
      status: "Coming soon",
      live: true,
      for: "Online, self-paced · English",
      title: "The Clinician's Edge",
      description:
        "8 modules on the non-clinical skills every doctor is expected to have — from how the system works to preparing for an internal investigation. Short video lessons, interactive pages and a workbook for every module.",
      bullets: [
        "8 modules, 8 skills you will use",
        "Video, interactive pages and workbook",
        "Study at your own pace",
      ],
      action: "See the 8 modules",
      href: "#course",
    },
    {
      status: "Coming soon",
      live: false,
      for: "Live, face to face · Arabic or English",
      title: "Clinical Leadership Programme",
      description:
        "6 modules for clinicians leading a team, a unit or a service: the decisions, the documents and the conversations that clinical training never covered.",
      bullets: [
        "6 modules, delivered in person",
        "Your own workbook and exercises",
        "Small cohorts, by city",
      ],
      action: "About the programme",
      href: "#leadership",
    },
    {
      status: "Coming soon",
      live: false,
      for: "Next in the portfolio",
      title: "AI for Clinicians",
      description:
        "What AI can and cannot do in clinical and professional work, how to use it safely and well, and where the professional and medico-legal lines sit.",
      bullets: [
        "Practical, not technical",
        "Built for clinical settings",
        "Dates to the waitlist first",
      ],
      action: "Hear when it opens",
      href: "#waitlist",
    },
  ];

  let programmes: ProgrammeItem[] = defaultProgrammes;
  try {
    const raw = t.raw("programmes") as ProgrammeItem[];
    if (Array.isArray(raw) && raw.length > 0) {
      programmes = raw;
    }
  } catch {
    programmes = defaultProgrammes;
  }

  return (
    <section className="paths" id="portfolio">
      <div className="wrap">
        <div className="section-head">
          <h2 className="text-navy!">{t("title")}</h2>
          <div className="rule"></div>
          <p className="lead">{t("lead")}</p>
        </div>
        <div className="path-grid">
          {programmes.map((p, idx) => (
            <article key={idx} className="path">
              <span className={`status ${p.live ? "live" : ""}`}>
                {p.status}
              </span>
              <div className="for">{p.for}</div>
              <h3>{p.title}</h3>
              <p>{p.description}</p>
              <ul>
                {p.bullets.map((b, bIdx) => (
                  <li key={bIdx}>{b}</li>
                ))}
              </ul>
              <a className="link" href={p.href}>
                {p.action}
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
