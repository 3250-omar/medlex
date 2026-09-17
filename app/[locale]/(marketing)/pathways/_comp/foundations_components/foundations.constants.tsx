import React from "react";

export type AudienceItem = {
  role: string;
  description: string;
};

export type ProgrammeItem = {
  status: string;
  live?: boolean;
  for: string;
  title: string;
  description: string;
  bullets: string[];
  action: string;
  href: string;
};

export type ModuleItem = {
  num: string;
  title: string;
  description: string;
  small: string;
};

export type GetItem = {
  title: string;
  description: string;
};

export type PrincipleItem = {
  title: string;
  description: string;
  tag: string;
};

export type RawFaqItem = {
  q: string;
  a: string;
};

export const DEFAULT_TICKER_ITEMS: string[] = [
  "HOW THE SYSTEM WORKS",
  "COMMUNICATION AT WORK",
  "AUDIT AND QUALITY IMPROVEMENT",
  "RESEARCH",
  "TEACHING AND SUPERVISION",
  "MANAGEMENT AND LEADERSHIP",
  "PORTFOLIO, APPRAISAL AND REVALIDATION",
  "INTERNAL INVESTIGATIONS",
];

export const DEFAULT_AUDIENCES: AudienceItem[] = [
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

export const DEFAULT_PROGRAMMES: ProgrammeItem[] = [
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

export const DEFAULT_MODULES: ModuleItem[] = [
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
    small: "Hold a conversation about a paper and find a route onto a project.",
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
    small: "Understand how investigations work and protect yourself sensibly.",
  },
];

export const DEFAULT_WHAT_YOU_GET: GetItem[] = [
  {
    title: "8 modules",
    description: "Short video lessons and interactive pages, at your own pace.",
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

export const DEFAULT_FOUNDER_PRINCIPLES: PrincipleItem[] = [
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

export const FOUNDER_ICONS: React.ReactNode[] = [
  // Scales
  <svg
    key="scales"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 3v18M5 7l7-2 7 2M5 7l-3 7a3 3 0 0 0 6 0L5 7zM19 7l-3 7a3 3 0 0 0 6 0l-3-7zM8 21h8" />
  </svg>,
  // Globe
  <svg
    key="globe"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" />
  </svg>,
  // Document
  <svg
    key="doc"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 3h9l4 4v14H6z" />
    <path d="M15 3v4h4M9 12h6M9 16h6" />
  </svg>,
  // Clock / Check
  <svg
    key="clock"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>,
];

export const DEFAULT_ROLE_OPTIONS: string[] = [
  "Doctor in training",
  "Consultant / specialist",
  "Clinician in a management role",
  "Other clinician",
];

export const DEFAULT_FAQS: RawFaqItem[] = [
  {
    q: "Who is this pathway for?",
    a: "Doctors working in or training within the UK, the Gulf or another advanced health system; early- and mid-career doctors who were never taught the non-clinical side of the job; and senior clinicians in management roles who want a clear method. It is not for the general public.",
  },
  {
    q: "What is available now?",
    a: "The Clinician's Edge opens first, at founding-cohort pricing announced to the waitlist. The Clinical Leadership Programme and AI for Clinicians follow — dates go to the waitlist first.",
  },
  {
    q: "How is The Clinician's Edge delivered?",
    a: "Fully online and self-paced: short video lessons, interactive pages in each module, and a workbook and toolkit you keep.",
  },
  {
    q: "How is the Clinical Leadership Programme delivered?",
    a: "Live and face to face, in small cohorts hosted by city. The language — Arabic or English — follows the location.",
  },
  {
    q: "Is it in English or Arabic?",
    a: "The Clinician's Edge is in English. The Clinical Leadership Programme runs in Arabic or English depending on where the cohort is held. Each programme states its language on its own page.",
  },
  {
    q: "Is the pathway accredited or CPD-certified?",
    a: "Programmes are independent and not currently accredited by any college or regulator. You receive a certificate of completion. CPD recognition will be shown on each programme page once it is in place.",
  },
  {
    q: "Is this clinical training?",
    a: "No. Foundations covers the professional, non-clinical skills of a medical career. It does not teach clinical medicine and does not replace specialty training or local induction.",
  },
];
