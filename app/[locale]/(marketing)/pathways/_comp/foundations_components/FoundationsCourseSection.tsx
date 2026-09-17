"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

type Props = {
  locale: string;
};

type ModuleItem = {
  num: string;
  title: string;
  description: string;
  small: string;
};

type GetItem = {
  title: string;
  description: string;
};

export default function FoundationsCourseSection({ locale }: Props) {
  const t = useTranslations("pathwayPages.foundationsLanding.course");

  const defaultModules: ModuleItem[] = [
    {
      num: "01",
      title: "Understanding How the System Works",
      description:
        "Roles, hierarchy, rotas, on-call, escalation, and where you sit within it — the UK system as the worked example, with the principles that carry to the Gulf.",
      small: "Walk into any department and understand how it runs.",
    },
    {
      num: "02",
      title: "Communication at Work",
      description:
        "The referral, the email to a consultant, the notes, the handover, the moment you speak up in a meeting — clear, concise, and escalated the right way.",
      small: "Communicate with the clarity colleagues expect of you.",
    },
    {
      num: "03",
      title: "Audit & Quality Improvement",
      description:
        "What audit and QI actually are, how the cycle works from standard to re-audit, the difference between the two, and what you will be asked to do.",
      small: "Take part in audit and QI with real understanding.",
    },
    {
      num: "04",
      title: "Research",
      description:
        "The main types of study and what they are for, what being involved means early on, how to get onto a project, and how to read a paper well enough to discuss it.",
      small:
        "Hold a conversation about a paper and find a route onto a project.",
    },
    {
      num: "05",
      title: "Teaching, Supervision & Feedback",
      description:
        "Planning and delivering a clear teaching session, supervising juniors, giving feedback that helps — and receiving it well.",
      small: "Teach and supervise in a way that strengthens how you are seen.",
    },
    {
      num: "06",
      title: "Management & Leadership Basics",
      description:
        "How a service is organised, who the key people are, how to work within a team, and the real difference between management and leadership at your level.",
      small: "Step into team and leadership situations with confidence.",
    },
    {
      num: "07",
      title: "Portfolio, Appraisal & Revalidation",
      description:
        "What a portfolio is, what to collect and why, how appraisal works, and how revalidation fits into the longer arc of a career.",
      small: "Know exactly what to collect, from the first day.",
    },
    {
      num: "08",
      title: "Preparing for an Internal Investigation",
      description:
        "The subject no one prepares you for. What an investigation involves, your rights, what to do and avoid early on, and where to find proper support.",
      small:
        "Understand how investigations work and protect yourself sensibly.",
    },
  ];

  const defaultGetItems: GetItem[] = [
    {
      title: "8 modules",
      description:
        "Short video lessons and interactive pages, at your own pace.",
    },
    {
      title: "Workbook & toolkit",
      description: "A practical workbook with every module, yours to keep.",
    },
    {
      title: "The Foundations group",
      description:
        "A WhatsApp network of doctors across the UK, the Gulf and Egypt, sharing how their systems actually work.",
    },
    {
      title: "Weekly insight emails",
      description:
        "One topic a week from the founder — interviews, appraisal, audit, leadership — through your course.",
    },
    {
      title: "Certificate of completion",
      description: "Issued in your name when you finish the 8 modules.",
    },
  ];

  let modules: ModuleItem[] = defaultModules;
  try {
    const raw = t.raw("modules") as ModuleItem[];
    if (Array.isArray(raw) && raw.length > 0) {
      modules = raw;
    }
  } catch {
    modules = defaultModules;
  }

  let getItems: GetItem[] = defaultGetItems;
  try {
    const raw = t.raw("whatYouGetItems") as GetItem[];
    if (Array.isArray(raw) && raw.length > 0) {
      getItems = raw;
    }
  } catch {
    getItems = defaultGetItems;
  }

  return (
    <section className="flag" id="course">
      <div className="wrap">
        <div className="section-head head-img">
          <div>
            <div className="eyebrow">{t("eyebrow")}</div>
            <h2 className="text-navy!">{t("title")}</h2>
            <div className="rule"></div>
            <p className="lead">{t("lead")}</p>
          </div>
          <figure className="side-img">
            <img
              src="/images/foundations/clinicians_edge_desk.jpg"
              alt="Research, audit and quality improvement at a clinician's desk"
            />
          </figure>
        </div>

        <div className="mod-grid">
          {modules.map((m, idx) => (
            <article key={idx} className="mod">
              <span>{m.num}</span>
              <div>
                <h3>{m.title}</h3>
                <p>{m.description}</p>
                <small>{m.small}</small>
              </div>
            </article>
          ))}
        </div>

        <h3 className="get-head">{t("whatYouGetTitle")}</h3>
        <div className="format five">
          {getItems.map((item, idx) => (
            <div key={idx}>
              <b>{item.title}</b>
              <span>{item.description}</span>
            </div>
          ))}
        </div>

        <div className="ctas">
          <a className="btn" href="#waitlist">
            {t("joinWaitlist")}
          </a>
          <Link
            className="btn ghost"
            href={`/${locale}/programmes/clinicians-edge`}
          >
            {t("brochure")}
          </Link>
        </div>
      </div>
    </section>
  );
}
