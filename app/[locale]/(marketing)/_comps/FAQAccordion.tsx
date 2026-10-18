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
  theme?: "light" | "dark";
}

export default function FAQAccordion({
  items,
  className,
  itemClassName,
  triggerClassName,
  contentClassName,
  theme = "light",
}: FAQAccordionProps) {
  const isDark = theme === "dark";

  return (
    <Accordion
      className={cn(
        "flex w-full flex-col",
        isDark ? "border-t border-[#d6b03f]/25" : "border-t border-[#e5e0d8]",
        className
      )}
    >
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          value={`faq-${index}`}
          className={cn(
            "transition-colors",
            isDark ? "border-b border-[#d6b03f]/20" : "border-b border-[#e5e0d8]",
            itemClassName
          )}
        >
          <AccordionTrigger
            showChevron={false}
            className={cn(
              "group flex w-full cursor-pointer items-center justify-between gap-6 py-5 sm:py-6 text-start hover:no-underline",
              triggerClassName
            )}
          >
            <span
              className={cn(
                "font-serif text-lg sm:text-xl font-medium leading-snug transition-colors duration-200 group-hover:text-gold",
                isDark ? "text-[#f3efe4]" : "text-[#1a365d]"
              )}
            >
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
              "pb-6 pt-1 font-sans text-sm sm:text-base leading-relaxed max-w-3xl",
              isDark ? "text-[#c9d3e3]" : "text-[#313538]",
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
