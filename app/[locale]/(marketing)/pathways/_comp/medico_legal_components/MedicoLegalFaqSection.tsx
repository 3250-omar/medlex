"use client";

import { useTranslations } from "next-intl";

type RawFaqItem = {
  q: string;
  a: string;
};

export default function MedicoLegalFaqSection() {
  const t = useTranslations("pathwayPages.medicoLegalLanding.faq");
  const rawFaqs = (t.raw("items") as RawFaqItem[]) || [];

  return (
    <section className="faq" id="faq">
      <div className="wrap">
        <h2>{t("title")}</h2>
        <div className="rule"></div>
        <div className="faq-list">
          {rawFaqs.map((faq, idx) => (
            <details key={idx}>
              <summary>{faq.q}</summary>
              <p>{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
