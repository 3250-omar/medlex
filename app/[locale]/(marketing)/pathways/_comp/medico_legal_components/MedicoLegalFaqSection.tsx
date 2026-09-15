"use client";

import { useTranslations } from "next-intl";
import FAQSection from "../../../_comps/FAQSection";

type RawFaqItem = {
  q: string;
  a: string;
};

export default function MedicoLegalFaqSection() {
  const t = useTranslations("pathwayPages.medicoLegalLanding.faq");
  const rawFaqs = (t.raw("items") as RawFaqItem[]) || [];

  const items = rawFaqs.map((faq) => ({
    question: faq.q,
    answer: faq.a,
  }));

  return (
    <FAQSection
      id="faq"
      headingId="medico-legal-faq-heading"
      title={t("title")}
      items={items}
    />
  );
}
