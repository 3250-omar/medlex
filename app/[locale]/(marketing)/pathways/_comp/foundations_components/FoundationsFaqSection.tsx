"use client";

import { useTranslations } from "next-intl";
import FAQSection, { type FAQSectionProps } from "../../../_comps/FAQSection";

type RawFaqItem = {
  q: string;
  a: string;
};

export default function FoundationsFaqSection(
  props?: Partial<FAQSectionProps>,
) {
  const t = useTranslations("pathwayPages.foundationsLanding.faq");

  const defaultFaqs: RawFaqItem[] = [
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

  let rawFaqs = defaultFaqs;
  try {
    const raw = t.raw("items") as RawFaqItem[];
    if (Array.isArray(raw) && raw.length > 0) {
      rawFaqs = raw;
    }
  } catch {
    rawFaqs = defaultFaqs;
  }

  const items = rawFaqs.map((faq) => ({
    question: faq.q,
    answer: faq.a,
  }));

  return (
    <FAQSection
      id="faq"
      headingId="foundations-faq-heading"
      title={t("title")}
      items={items}
      {...props}
    />
  );
}
