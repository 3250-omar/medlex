"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

export type FAQItem = { question: string; answer: string };

export interface FAQAccordionProps {
  items: FAQItem[];
  className?: string;
  itemClassName?: string;
  triggerClassName?: string;
  contentClassName?: string;
}

export default function FAQAccordion({
  items,
  className,
  itemClassName,
  triggerClassName,
  contentClassName,
}: FAQAccordionProps) {
  return (
    <Accordion className={cn("flex w-full flex-col border-t border-[#e5e0d8]", className)}>
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          value={`faq-${index}`}
          className={cn("border-b border-[#e5e0d8] transition-colors", itemClassName)}
        >
          <AccordionTrigger
            showChevron={false}
            className={cn(
              "group flex w-full cursor-pointer items-center justify-between gap-6 py-5 sm:py-6 text-start hover:no-underline",
              triggerClassName
            )}
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
          <AccordionContent
            className={cn(
              "pb-6 pt-1 font-sans text-sm sm:text-base leading-relaxed text-[#313538] max-w-3xl",
              contentClassName
            )}
          >
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
