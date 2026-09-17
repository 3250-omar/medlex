"use client";

import { useTranslations } from "next-intl";
import FAQSection, { type FAQSectionProps } from "../../../_comps/FAQSection";
import { type RawFaqItem, DEFAULT_FAQS } from "./foundations.constants";

export default function FoundationsFaqSection(
  props?: Partial<FAQSectionProps>,
) {
  const t = useTranslations("pathwayPages.foundationsLanding.faq");

  let rawFaqs: RawFaqItem[] = DEFAULT_FAQS;
  try {
    const raw = t.raw("items") as RawFaqItem[];
    if (Array.isArray(raw) && raw.length > 0) {
      rawFaqs = raw;
    }
  } catch {
    rawFaqs = DEFAULT_FAQS;
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
