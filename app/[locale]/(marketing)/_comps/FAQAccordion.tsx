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
    <Accordion className="flex w-full flex-col -space-y-px">
      {items.map((item, index) => {
        const itemNumber = String(index + 1).padStart(2, "0");
        return (
          <AccordionItem
            key={item.question}
            value={item.question}
            className="border border-white/15 bg-white/[0.025] transition-colors duration-200 hover:border-white/30 not-last:border-b"
          >
            <AccordionTrigger
              showChevron={false}
              className="group flex w-full cursor-pointer items-center justify-between gap-6 rounded-none px-6 py-6 text-start hover:no-underline md:gap-10 md:px-8 md:py-7"
            >
              <div className="flex flex-1 items-center gap-6 md:gap-10">
                <span className="shrink-0 select-none font-display text-2xl font-normal text-signal md:text-3xl">
                  {itemNumber}
                </span>
                <span className="font-display text-base font-normal leading-snug text-white transition-colors duration-200 group-hover:text-signal/80 md:text-lg lg:text-xl">
                  {item.question}
                </span>
              </div>
              <span
                className="relative flex size-5 shrink-0 items-center justify-center text-signal transition-transform duration-300 group-aria-expanded/accordion-trigger:rotate-45"
                aria-hidden="true"
              >
                <span className="absolute h-px w-4 bg-current" />
                <span className="absolute h-4 w-px bg-current" />
              </span>
            </AccordionTrigger>
            <AccordionContent className="border-t border-white/10 px-6 py-6 font-body text-sm leading-relaxed text-white/65 md:px-8 md:ps-24 md:text-base lg:ps-28">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
