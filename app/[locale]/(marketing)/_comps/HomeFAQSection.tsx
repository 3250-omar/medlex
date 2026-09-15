"use client";

import { useTranslations } from "next-intl";
import FAQSection from "./FAQSection";

export default function HomeFAQSection() {
  const t = useTranslations();

  const items = (
    t.raw("faq.items") as { question: string; answer: string }[]
  ).map((item) => ({
    question: item.question,
    answer: item.answer,
  }));

  return (
    <FAQSection
      id="faq"
      headingId="home-faq-heading"
      title={t("home.faq.title")}
      items={items}
    />
  );
}
