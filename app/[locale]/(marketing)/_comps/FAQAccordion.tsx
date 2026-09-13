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
  variant?: "light" | "dark";
  showNumber?: boolean;
  className?: string;
  itemClassName?: string;
  triggerClassName?: string;
  contentClassName?: string;
  numberClassName?: string;
}

export default function FAQAccordion({
  items,
  variant = "light",
  showNumber = true,
  className,
  itemClassName,
  triggerClassName,
  contentClassName,
  numberClassName,
}: FAQAccordionProps) {
  const isDark = variant === "dark";

  return (
    <Accordion className={cn("flex w-full flex-col space-y-4!", className)}>
      {items.map((item, index) => {
        const itemNumber = String(index + 1).padStart(2, "0");
        return (
          <AccordionItem
            key={item.question}
            value={item.question}
            className={cn(
              "group/item rounded-2xl transition-all duration-300 overflow-hidden",
              isDark
                ? "border border-white/10 !bg-navy/60 backdrop-blur-sm shadow-lg hover:border-gold/40 hover:!bg-navy/80 "
                : "border border-slate-200/90 bg-white shadow-[0_2px_12px_-3px_rgba(20,42,73,0.06)] hover:border-gold/60 hover:shadow-[0_6px_20px_-4px_rgba(212,175,55,0.15)]",
              itemClassName,
            )}
          >
            <AccordionTrigger
              showChevron={false}
              className={cn(
                "group flex w-full cursor-pointer items-center justify-between gap-4 rounded-none px-6 py-5 text-start hover:no-underline md:gap-6 md:px-7 md:py-6",
                triggerClassName,
              )}
            >
              <div className="flex flex-1 items-center gap-4 md:gap-5">
                {showNumber && (
                  <span
                    className={cn(
                      "flex size-9 sm:size-10 shrink-0 items-center justify-center rounded-xl border border-gold/30 bg-gold/10 font-serif text-sm sm:text-base font-bold text-gold transition-colors duration-200 group-hover:bg-gold group-hover:!text-navy",
                      numberClassName,
                    )}
                  >
                    {itemNumber}
                  </span>
                )}
                <span
                  className={cn(
                    "font-serif text-base sm:text-lg md:text-xl font-bold leading-snug transition-colors duration-200 group-hover:text-gold",
                    isDark ? "text-white" : "text-navy",
                  )}
                >
                  {item.question}
                </span>
              </div>
              <span
                className={cn(
                  "flex size-8 sm:size-9 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gold/5 text-gold transition-all duration-300 group-hover:border-gold group-hover:bg-gold group-hover:text-navy group-aria-expanded/accordion-trigger:rotate-45",
                  isDark
                    ? "group-aria-expanded/accordion-trigger:bg-deep group-aria-expanded/accordion-trigger:text-gold group-aria-expanded/accordion-trigger:border-gold/40"
                    : "group-aria-expanded/accordion-trigger:bg-navy group-aria-expanded/accordion-trigger:text-gold group-aria-expanded/accordion-trigger:border-navy",
                )}
                aria-hidden="true"
              >
                <span className="relative flex size-3 items-center justify-center">
                  <span className="absolute h-0.5 w-3 bg-current rounded-full" />
                  <span className="absolute h-3 w-0.5 bg-current rounded-full" />
                </span>
              </span>
            </AccordionTrigger>
            <AccordionContent
              className={cn(
                "border-t px-6 py-5 font-sans text-sm sm:text-[15px] leading-relaxed md:px-8 md:ps-20",
                isDark
                  ? "border-white/10 bg-deep/50 text-lbody"
                  : "border-slate-100 bg-slate-50/50 text-slate-600",
                contentClassName,
              )}
            >
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
