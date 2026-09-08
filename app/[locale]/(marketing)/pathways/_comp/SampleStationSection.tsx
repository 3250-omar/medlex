"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { InterestDialogTrigger } from "@/components/marketing/InterestDialog";
import { cn } from "@/lib/utils";

interface StationOption {
  id: "A" | "B" | "C";
  text: string;
  examinerTitle: string;
  examinerFeedback: string;
  scoringMove?: string;
}

export default function SampleStationSection() {
  const t = useTranslations("pathwayPages.casc-academy.sampleStation");
  const options = (t.raw("options") as StationOption[]) || [];
  const [selectedId, setSelectedId] = useState<"A" | "B" | "C">("A");

  return (
    <section className="border-b border-white/10 bg-navy on-navy py-20 text-lbody lg:py-28">
      <div className="mx-auto w-full px-6 sm:px-8 lg:max-w-6xl lg:px-10">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center justify-center gap-3">
            <h2 className="font-serif text-3xl font-normal text-white sm:text-4xl lg:text-5xl">
              {t("title")}
            </h2>
            <span className="self-start font-body text-[10px] font-semibold uppercase tracking-[0.25em] text-gold">
              {t("badge")}
            </span>
          </div>
          <p className="mt-4 font-sans text-sm leading-relaxed text-lbody sm:text-base">
            {t("subtitle")}
          </p>
        </div>

        {/* Interactive Station Card */}
        <div className="mx-auto mt-12 max-w-3xl rounded-2xl border border-white/10 bg-deep p-6 shadow-sm sm:p-8 lg:p-10">
          {/* Station Metadata Header */}
          <div className="mb-6 text-end">
            <span className="font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">
              {t("meta")}
            </span>
          </div>

          {/* Scenario & Task */}
          <div className="mb-8 space-y-4">
            <p className="font-sans text-sm leading-relaxed text-white/85 sm:text-[15px]">
              <strong className="font-semibold text-white">
                {t("taskLabel")}
              </strong>{" "}
              {t("scenario")}
            </p>
            <p className="font-sans text-sm leading-relaxed text-white/95 sm:text-[15px]">
              {t("question")}
            </p>
          </div>

          {/* Options / Accordion */}
          <div className="space-y-4">
            {options.map((option) => {
              const isSelected = selectedId === option.id;

              return (
                <div key={option.id} className="space-y-2">
                  {/* Option Button */}
                  <button
                    type="button"
                    onClick={() => setSelectedId(option.id)}
                    className={cn(
                      "flex w-full items-center justify-between gap-4 rounded-xl border p-4 text-start transition-all duration-200 sm:p-5",
                      isSelected
                        ? "border-gold/60 bg-gold/10 text-white shadow-sm"
                        : "border-white/10 bg-white/[0.02] text-white/80 hover:border-white/25 hover:bg-white/[0.04]",
                    )}
                  >
                    <span className="font-sans text-sm leading-relaxed sm:text-[15px]">
                      {option.text}
                    </span>
                    <span
                      className={cn(
                        "flex size-7 shrink-0 items-center justify-center rounded-full border font-body text-xs font-semibold uppercase transition-colors",
                        isSelected
                          ? "border-gold text-gold bg-gold/20"
                          : "border-white/20 text-white/60",
                      )}
                    >
                      {option.id}
                    </span>
                  </button>

                  {/* The Examiner's View (revealed right beneath selected option) */}
                  {isSelected && (
                    <div className="rounded-xl border border-white/10 bg-navy p-5 sm:p-6">
                      <div className="mb-3 text-end">
                        <span className="font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-mute">
                          {option.examinerTitle}
                        </span>
                        {option.scoringMove && (
                          <span className="font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">
                            {" - "}
                            {option.scoringMove}
                          </span>
                        )}
                      </div>
                      <p className="font-sans text-sm leading-relaxed text-lbody sm:text-[15px]">
                        {option.examinerFeedback}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom Testing Analysis & CTA */}
          <div className="mt-12 border-t border-white/10 pt-8">
            <div className="mb-3 text-end">
              <span className="font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-mute">
                {t("testingTitle")}
              </span>
            </div>
            <p className="text-center font-sans text-sm leading-relaxed text-lbody sm:text-[15px]">
              {t("testingBody")}
            </p>
            <p className="mt-6 text-center font-sans text-xs leading-relaxed text-mute">
              {t("disclaimer")}
            </p>

            {/* CTA Button */}
            <div className="mt-8 flex justify-center">
              <InterestDialogTrigger
                pathway="casc-academy"
                className="btn btn-gold !rounded-full !min-h-12 !px-8 font-body text-sm font-semibold text-navy inline-flex items-center justify-center"
              >
                {t("cta")}
                <span
                  className="ms-3 inline-block rtl:rotate-180"
                  aria-hidden="true"
                >
                  →
                </span>
              </InterestDialogTrigger>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
