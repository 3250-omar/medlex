"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export type FAQItem = { question: string; answer: string };

export default function FAQAccordion({ items }: { items: FAQItem[] }) {
  return (
    <Accordion className="flex w-full flex-col space-y-4!">
      {items.map((item, index) => {
        const itemNumber = String(index + 1).padStart(2, "0");
        return (
          <AccordionItem
            key={item.question}
            value={item.question}
            className="group/item rounded-2xl border border-slate-200/90 bg-white shadow-[0_2px_12px_-3px_rgba(20,42,73,0.06)] transition-all duration-300 hover:border-gold/60 hover:shadow-[0_6px_20px_-4px_rgba(212,175,55,0.15)] overflow-hidden"
          >
            <AccordionTrigger
              showChevron={false}
              className="group flex w-full cursor-pointer items-center justify-between gap-4 rounded-none px-6 py-5 text-start hover:no-underline md:gap-6 md:px-7 md:py-6"
            >
              <div className="flex flex-1 items-center gap-4 md:gap-5">
                <span className="flex size-9 sm:size-10 shrink-0 items-center justify-center rounded-xl border border-gold/30 bg-gold/10 font-serif text-sm sm:text-base font-bold text-gold transition-colors duration-200 group-hover:bg-gold group-hover:text-navy">
                  {itemNumber}
                </span>
                <span className="font-serif text-base sm:text-lg md:text-xl font-bold leading-snug text-navy transition-colors duration-200 group-hover:text-gold">
                  {item.question}
                </span>
              </div>
              <span
                className="flex size-8 sm:size-9 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gold/5 text-gold transition-all duration-300 group-hover:border-gold group-hover:bg-gold group-hover:text-navy group-aria-expanded/accordion-trigger:rotate-45 group-aria-expanded/accordion-trigger:bg-navy group-aria-expanded/accordion-trigger:text-gold group-aria-expanded/accordion-trigger:border-navy"
                aria-hidden="true"
              >
                <span className="relative flex size-3 items-center justify-center">
                  <span className="absolute h-0.5 w-3 bg-current rounded-full" />
                  <span className="absolute h-3 w-0.5 bg-current rounded-full" />
                </span>
              </span>
            </AccordionTrigger>
            <AccordionContent className="border-t border-slate-100 bg-slate-50/50 px-6 py-5 font-sans text-sm sm:text-[15px] leading-relaxed text-slate-600 md:px-8 md:ps-20">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
