export type PathwayKey = "medico-legal" | "casc-academy" | "foundations";

export type PathwayContent = {
  eyebrow: string;
  title: string;
  intro: string;
  delivery: string;
  languages: string;
  status: string;
  audience: {
    eyebrow: string;
    title: string;
    body: string;
    items: { title: string; body: string }[];
  };
  formats?: {
    eyebrow: string;
    title: string;
    body: string;
    items: { eyebrow: string; title: string; body: string }[];
  };
  programmes?: {
    eyebrow: string;
    title: string;
    body: string;
    items: {
      title: string;
      body: string;
      details: string[];
      status: string;
      action: string;
    }[];
  };
  feature?: {
    eyebrow: string;
    title: string;
    body: string;
    quote?: string;
    stages?: { title: string; body: string }[];
  };
  founder: { eyebrow: string; title: string; body: string; action: string };
  faqs?: { question: string; answer: string }[];
};

export type PathwayLabels = {
  delivery: string;
  languages: string;
  status: string;
  register: string;
  programme: string;
  faqEyebrow: string;
  faqTitle: string;
};