"use client";

import { useTranslations } from "next-intl";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export default function HomeFAQSection() {
  const t = useTranslations();

  const items = (
    t.raw("faq.items") as { question: string; answer: string }[]
  ).map((item) => ({
    question: item.question,
    answer: item.answer,
  }));

  return (
    <section
      className="relative overflow-hidden bg-[#fbfaf6] py-20 lg:py-28 border-b border-[#e6e6e0]"
      aria-labelledby="home-faq-heading"
    >
      {/* Background image with fountain pen nib from the HTML prototype */}
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-no-repeat bg-right"
        style={{ backgroundImage: "url('/images/medicolegal/bg_2__faq.jpg')" }}
        aria-hidden="true"
      />

      {/* Warm paper gradient overlay to ensure text is always 100% crisp and legible */}
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(251,250,246,0.97)_0%,rgba(251,250,246,0.92)_55%,rgba(251,250,246,0.45)_100%)] rtl:bg-[linear-gradient(270deg,rgba(251,250,246,0.97)_0%,rgba(251,250,246,0.92)_55%,rgba(251,250,246,0.45)_100%)]"
        aria-hidden="true"
      />

      <div className="relative px-6 sm:px-10 md:px-14 lg:px-20 xl:px-24">
        <div className="mx-auto max-w-4xl">
          {/* Section header */}
          <div className="mb-12 text-center">
            <h2
              id="home-faq-heading"
              className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-navy!"
            >
              {t("home.faq.title")}
            </h2>
            <div className="mt-4 mx-auto h-0.5 w-14 bg-gold" />
          </div>

          {/* FAQ Accordion list */}
          <Accordion className="flex w-full flex-col border-t border-[#e5e0d8]">
            {items.map((item, index) => (
              <AccordionItem
                key={index}
                value={`faq-${index}`}
                className="border-b border-[#e5e0d8] transition-colors"
              >
                <AccordionTrigger
                  showChevron={false}
                  className="group flex w-full cursor-pointer items-center justify-between gap-6 py-5 sm:py-6 text-start hover:no-underline"
                >
                  <span className="font-serif text-lg sm:text-xl font-medium leading-snug text-[#1a365d] transition-colors duration-200 group-hover:text-gold">
                    {item.question}
                  </span>
                  <span
                    className="relative flex size-6 shrink-0 items-center justify-center text-gold transition-transform duration-300 group-aria-expanded/accordion-trigger:rotate-45"
                    aria-hidden="true"
                  >
                    <span className="absolute h-0.5 w-4 bg-current rounded-full" />
                    <span className="absolute h-4 w-0.5 bg-current rounded-full" />
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-6 pt-1 font-sans text-sm sm:text-base leading-relaxed text-[#313538] max-w-3xl">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
