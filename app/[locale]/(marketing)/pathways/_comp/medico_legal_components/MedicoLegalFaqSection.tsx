"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import FAQAccordion, { FAQItem } from "@/app/[locale]/(marketing)/_comps/FAQAccordion";

type RawFaqItem = {
  q: string;
  a: string;
};

export default function MedicoLegalFaqSection() {
  const t = useTranslations("pathwayPages.medicoLegalLanding.faq");
  const rawFaqs = (t.raw("items") as RawFaqItem[]) || [];

  const faqItems: FAQItem[] = rawFaqs.map((faq) => ({
    question: faq.q,
    answer: faq.a,
  }));

  return (
    <section
      id="faq"
      className="relative bg-deep text-lbody on-deep py-24 border-b border-white/10 overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none select-none z-0">
        <Image
          src="/images/medicolegal/bg_2__faq.jpg"
          alt="FAQ background texture"
          fill
          className="object-cover object-center opacity-15 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-deep/95 via-deep/90 to-deep" />
      </div>

      <div className="relative z-10 mx-auto w-full px-6 sm:px-8 lg:max-w-4xl lg:px-10">
        <div className="mb-14 text-center">
          <span className="font-sans font-semibold text-xs uppercase tracking-widest text-goldd block mb-3">
            {t("kicker")}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-bold text-white leading-tight">
            {t("title")}
          </h2>
          <div className="w-14 h-0.5 bg-gold my-5 mx-auto" />
        </div>

        {/* Reusable FAQ Accordion Component */}
        <FAQAccordion
          items={faqItems}
          variant="dark"
        />
      </div>
    </section>
  );
}
