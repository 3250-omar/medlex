"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Plus, Minus } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

export default function CascHowStationWorksSection() {
  const locale = useLocale();
  const t = useTranslations("cascHowStationWorks");

  // Step cards data array
  const stepCards = [
    {
      num: t("step1Num"),
      title: t("step1Title"),
      desc: t("step1Desc"),
    },
    {
      num: t("step2Num"),
      title: t("step2Title"),
      desc: t("step2Desc"),
    },
    {
      num: t("step3Num"),
      title: t("step3Title"),
      desc: t("step3Desc"),
    },
    {
      num: t("step4Num"),
      title: t("step4Title"),
      desc: t("step4Desc"),
    },
    {
      num: t("step5Num"),
      title: t("step5Title"),
      desc: t("step5Desc"),
    },
  ];

  // Accordion comparison cards data array
  const comparisonCards = [
    {
      id: "fail-1",
      tag: t("comparisonFail1Tag"),
      quote: t("comparisonFail1Quote"),
      examinerTitle: t("comparisonExaminerTitle"),
      examinerNote: t("comparisonFail1ExaminerNote"),
      status: "fail" as const,
    },
    {
      id: "fail-2",
      tag: t("comparisonFail2Tag"),
      quote: t("comparisonFail2Quote"),
      examinerTitle: t("comparisonExaminerTitle"),
      examinerNote: t("comparisonFail2ExaminerNote"),
      status: "fail" as const,
    },
    {
      id: "pass",
      tag: t("comparisonPassTag"),
      quote: t("comparisonPassQuote"),
      examinerTitle: t("comparisonExaminerTitle"),
      examinerNote: t("comparisonPassExaminerNote"),
      status: "pass" as const,
    },
  ];

  return (
    <section
      id="station"
      className="py-16 sm:py-20 lg:py-24 border-b border-hair! bg-white! scroll-mt-16 text-char!"
    >
      <div className="mx-auto w-full px-6 sm:px-8 lg:max-w-6xl lg:px-10">
        {/* Section Header */}
        <div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-bold leading-tight text-navy! tracking-tight">
            {t("title")}
          </h2>
          <div className="w-10 h-[3px] bg-[#C5A367]! mt-3 mb-5" />
          <p className="max-w-3xl font-serif text-base sm:text-lg leading-relaxed text-char!">
            {t("description")}
          </p>
        </div>

        {/* 5 Step Cards */}
        <div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {stepCards.map((step, idx) => (
            <div
              key={idx}
              className="bg-[#FBF9F5]! border border-[#EFECE6]! rounded-xl! p-5 sm:p-6 flex flex-col justify-start transition-shadow hover:shadow-xs"
            >
              <span className="font-serif text-3xl sm:text-4xl font-normal text-[#C5A367]! leading-none">
                {step.num}
              </span>
              <h3 className="font-serif text-base sm:text-[17px] font-bold text-navy! mt-4 mb-2 leading-snug">
                {step.title}
              </h3>
              <p className="font-sans text-xs sm:text-[13px] text-char/80! leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Dark Callout Banner */}
        <div className="mt-6 sm:mt-8 bg-[#0B1E36]! rounded-xl! p-6 sm:p-8 lg:px-9 lg:py-7 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
          <div className="max-w-2xl">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-white! leading-snug">
              {t("ctaTitle")}
            </h3>
            <p className="mt-1.5 font-sans text-xs sm:text-sm text-white/80! leading-relaxed">
              {t("ctaDesc")}
            </p>
          </div>
          <Link
            href={`/${locale}/academy/preview/station-7-2`}
            className="inline-flex items-center justify-center whitespace-nowrap bg-[#C5A367]! hover:bg-[#b89548]! text-[#0B1E36]! font-semibold text-sm sm:text-base px-6 py-3 rounded-lg! transition-colors duration-150 shrink-0"
          >
            {t("ctaButton")}
          </Link>
        </div>

        {/* Accordion Component */}
        <Accordion className="mt-5 w-full">
          <AccordionItem
            value="station-preview"
            className="border border-[#EFECE6]! bg-[#FBF9F5]! rounded-xl! overflow-hidden not-last:border-b-0"
          >
            <AccordionTrigger
              showChevron={false}
              className="group flex w-full cursor-pointer items-center justify-between gap-4 px-6 sm:px-8 py-5 sm:py-6 text-start hover:no-underline"
            >
              <span className="font-serif text-base sm:text-lg font-medium text-navy! leading-snug">
                {t("accordionTrigger")}
              </span>
              <span
                className="flex size-6 shrink-0 items-center justify-center text-[#C5A367]!"
                aria-hidden="true"
              >
                <Plus className="size-5 text-[#C5A367]! group-aria-expanded/accordion-trigger:hidden transition-transform" />
                <Minus className="size-5 text-[#C5A367]! hidden group-aria-expanded/accordion-trigger:inline transition-transform" />
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-6 sm:px-8 pb-6 sm:pb-8 pt-0">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch pt-2">
                {comparisonCards.map((card) => {
                  const isPass = card.status === "pass";
                  return (
                    <div
                      key={card.id}
                      className={cn(
                        "bg-white! rounded-xl! p-6 sm:p-7 shadow-xs! border border-[#EBE6DD]! flex flex-col justify-between",
                        isPass
                          ? "border-t-4! border-t-[#C5A367]!"
                          : "border-t-4! border-t-[#C85A5A]!"
                      )}
                    >
                      <div>
                        <p
                          className={cn(
                            "text-xs font-semibold uppercase tracking-wider mb-4 font-sans",
                            isPass ? "text-[#C5A367]!" : "text-[#9E4A4A]!"
                          )}
                        >
                          {card.tag}
                        </p>
                        <blockquote className="font-serif text-sm sm:text-[15px] text-char! leading-relaxed mb-6 not-italic">
                          {card.quote}
                        </blockquote>
                      </div>
                      <div className="border-t border-[#F0ECE1]! pt-4 mt-auto">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-[#C5A367]! mb-1.5 font-sans">
                          {card.examinerTitle}
                        </p>
                        <p className="font-serif text-xs sm:text-[13px] text-char/80! leading-relaxed">
                          {card.examinerNote}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
}
