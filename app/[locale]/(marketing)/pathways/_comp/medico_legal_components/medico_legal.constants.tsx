import React from "react";

export type MedicoAudienceItem = {
  role: string;
  description: string;
};

export type LevelItem = {
  num: string;
  badge?: string;
  title: string;
  meta: string;
  description: string;
};

export type FactItem = {
  title: string;
  body: string;
};

export type PrincipleItem = {
  title: string;
  description: string;
  tag: string;
};

export const DEFAULT_MEDICO_TICKER_ITEMS: string[] = [
  "WRITING PSYCHIATRIC EVIDENCE",
  "COURT-READY REPORTING STANDARDS",
  "CAPACITY ASSESSMENT",
  "CRIMINAL RESPONSIBILITY",
  "EXPERT WITNESS TESTIMONY",
  "RISK FORMULATION FOR THE COURT",
  "CROSS-EXAMINATION",
  "FOURTEEN FOUNDATION MASTERCLASSES",
];

export const DEFAULT_MEDICO_AUDIENCES: MedicoAudienceItem[] = [
  {
    role: "Consultant psychiatrists in NHS or independent practice",
    description:
      "Writing reports, attending hearings or starting to take on instructions.",
  },
  {
    role: "Senior trainees (ST4–ST6)",
    description:
      "Looking ahead to consultant practice and the medicolegal casework it brings.",
  },
  {
    role: "Clinical and forensic psychologists",
    description:
      "Preparing psychological evidence and wanting the medical perspective.",
  },
  {
    role: "Solicitors, barristers and legal teams",
    description:
      "Instructing psychiatric experts, reading their reports, and cross-examining them.",
  },
];

export const DEFAULT_MEDICO_LEVELS: LevelItem[] = [
  {
    num: "01",
    badge: "Foundation",
    title: "Civil, Family & Criminal Basics",
    meta: "Online · Self-paced · 6 Modules",
    description:
      "The legal framework, instructions, CPR Part 35, and what the court expects from an expert witness.",
  },
  {
    num: "02",
    badge: "Core",
    title: "Writing Psychiatric Evidence",
    meta: "Flagship Programme · 8 Modules & Workbook",
    description:
      "Structure, methodology, formulation, and drafting reports that stand up under cross-examination.",
  },
  {
    num: "03",
    badge: "Advanced",
    title: "The Courtroom & Testimony",
    meta: "Live Simulation & Masterclass Cohorts",
    description:
      "Giving evidence, dealing with cross-examination, hot-tubbing, and joint statements with opposing experts.",
  },
  {
    num: "04",
    badge: "Specialist",
    title: "Complex Cases & Sub-specialties",
    meta: "Masterclasses & Case Reviews",
    description:
      "Fitness to plead, loss of control, secondary victims, testamentary capacity, and high-stakes criminal defenses.",
  },
];

export const DEFAULT_MEDICO_FACTS: FactItem[] = [
  {
    title: "Real case files",
    body: "Work from redacted, real-world case files across civil, criminal and family jurisdictions.",
  },
  {
    title: "Model reports & templates",
    body: "Every module includes full model reports, section-by-section drafting rubrics, and phrasing libraries.",
  },
  {
    title: "Independent certificate",
    body: "Certificate of completion issued in your name upon finishing all 8 modules and workbook assignments.",
  },
];

export const DEFAULT_MEDICO_PRINCIPLES: PrincipleItem[] = [
  {
    title: "Real casework, not theory",
    description:
      "The reports, joint statements and cross-examinations in this pathway reflect real instructions Dr. Ahmed has handled across UK courts.",
    tag: "Expert Witness · Section 12 · Court of Protection",
  },
  {
    title: "Both sides of the table",
    description:
      "Designed with input from senior clinical practitioners and instructing solicitors to ensure reports meet legal requirements exactly.",
    tag: "Clinical Rigour · Legal Precision",
  },
  {
    title: "Ready to use on your next report",
    description:
      "Every module ends with concrete drafting rubrics, phrase guides, and standard compliance checklists you can implement immediately.",
    tag: "Templates · Checklists · Applied",
  },
  {
    title: "Independent & rigorous",
    description:
      "Independent professional development with full certificates of completion issued in your name.",
    tag: "Independent · Certificate of completion",
  },
];

export const MEDICO_FOUNDER_ICONS: React.ReactNode[] = [
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
  // Recognition / Award
  <svg
    key="award"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 19V5h16v14z" />
    <path d="M8 9h8M8 13h5" />
    <circle cx="16" cy="16" r="1.5" />
  </svg>,
];

export type RawFaqItem = {
  q: string;
  a: string;
};

export const DEFAULT_MEDICO_ROLE_OPTIONS: string[] = [
  "Psychiatrist",
  "Psychologist",
  "Psychiatry trainee",
  "Legal professional",
  "Other",
];

export const DEFAULT_MEDICO_FAQS: RawFaqItem[] = [
  {
    q: "Who is this pathway for?",
    a: "Psychiatrists and psychologists who write, or expect to write, for courts and tribunals; psychiatry trainees building forensic competence; and legal professionals who instruct, read and test psychiatric evidence. It is not designed for the general public.",
  },
  {
    q: "What is available now?",
    a: "The pathway is taking a waitlist. The first cohort of Writing Psychiatric Evidence and the opening Foundation Masterclasses will be announced to the waitlist before anywhere else.",
  },
  {
    q: "How are programmes delivered?",
    a: "Live and interactive, online. Masterclasses run as single sessions of three to six hours; skills programmes run across several sessions with assignments in between; the three-month programme blends live teaching with supervised work.",
  },
  {
    q: "Is it in English or Arabic?",
    a: "Both. Each programme is delivered in English and in Arabic as separate, natively written versions — not a translation of one into the other.",
  },
  {
    q: "Do I need to be in the UK, Egypt or Qatar?",
    a: "No. Online delivery is open worldwide. Where a face-to-face element is offered, its location and dates are stated on the programme page.",
  },
  {
    q: "Is the pathway accredited or CPD-certified?",
    a: "Programmes are independent and not currently accredited by any college or regulator. Certificates of completion are issued. Formal CPD recognition and accreditation are being developed in sequence and will be stated clearly on each programme page once in place.",
  },
  {
    q: "Does MedLex provide expert reports or legal advice?",
    a: "This pathway is education. MedLex does not provide legal advice and does not act for individuals in their own legal matters. Institutional training and advisory work is described on the Institutional page.",
  },
];
