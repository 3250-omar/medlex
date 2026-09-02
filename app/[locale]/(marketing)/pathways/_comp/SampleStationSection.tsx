"use client";

import { useState } from "react";
import { InterestDialogTrigger } from "@/components/marketing/InterestDialog";
import { cn } from "@/lib/utils";

type StationOption = {
  id: "A" | "B" | "C";
  text: string;
  examinerTitle: string;
  scoringMove?: string;
  examinerFeedback: string;
};

const OPTIONS: StationOption[] = [
  {
    id: "A",
    text: "Reassure her by sharing the likely diagnosis - she is his mother, and she clearly cares about him",
    examinerTitle: "THE EXAMINER'S VIEW",
    examinerFeedback:
      "The instinct to comfort is human - and it is exactly where marks leak in this station. Daniel has explicitly declined to share, and disclosing the likely diagnosis breaches that. Strong candidates hold the boundary without abandoning warmth; this option abandons the boundary to keep the warmth.",
  },
  {
    id: "B",
    text: "Explain warmly that you cannot share Daniel's clinical information without his agreement - then explore her concerns, and offer what you can: general information, support for her, and a way forward",
    examinerTitle: "THE EXAMINER'S VIEW",
    scoringMove: "THE SCORING MOVE",
    examinerFeedback:
      "This is what the station is built to reward: the boundary is held, and the relationship is kept. You have declined to disclose, stayed with her distress, and opened a path forward - general information, support, and the possibility of Daniel choosing to involve her. The station rewards doing both at once, not choosing between them.",
  },
  {
    id: "C",
    text: "Tell her that confidentiality rules prevent you discussing anything, and suggest she raises her questions with Daniel himself",
    examinerTitle: "THE EXAMINER'S VIEW",
    examinerFeedback:
      "Technically defensible - and it stalls in the communication domain. The task was to manage this conversation, not to end it. Citing the rule and stepping back reads as dismissive, and the marks for engaging with her distress go uncollected.",
  },
];

export default function SampleStationSection() {
  const [selectedId, setSelectedId] = useState<"A" | "B" | "C">("A");

  return (
    <section className="border-b border-white/10 bg-[#071525] py-20 lg:py-28">
      <div className="mx-auto w-full px-6 sm:px-8 lg:max-w-6xl lg:px-10">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center justify-center gap-3">
            <h2 className="font-display text-3xl text-white sm:text-4xl lg:text-5xl">
              A station, in miniature
            </h2>
            <span className="self-start font-body text-[9px] font-semibold uppercase tracking-[0.25em] text-signal/80">
              TRY IT
            </span>
          </div>
          <p className="mt-4 font-body text-sm leading-relaxed text-white/60 sm:text-base">
            A shortened taster of how Academy stations work. Full stations
            unfold over several decision points - this one gives you a single
            moment, and the examiner&apos;s view of it
          </p>
        </div>

        {/* Interactive Station Card */}
        <div className="mx-auto mt-12 max-w-5xl border border-white/10 bg-[#0a1b2d] p-6 sm:p-8 lg:p-10">
          {/* Station Metadata Header */}
          <div className="mb-6 text-right">
            <span className="font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
            SAMPLE STATION - SPEAKING WITH A RELATIVE - COMMUNICATION &amp;
              CONFIDENTIALITY
            </span>
          </div>

          {/* Scenario & Task */}
          <div className="mb-8 space-y-4">
            <p className="font-body text-sm leading-relaxed text-white/80 sm:text-[15px]">
              <strong className="font-semibold text-white">Your task.</strong>{" "}
              Daniel, 24, has been admitted with a first episode of psychosis.
              He has told the team clearly that he does not want clinical
              information shared with his family. His mother, distressed, has
              asked to speak with you. Speak with her.
            </p>
            <p className="font-body text-sm leading-relaxed text-white/90 sm:text-[15px]">
              She asks you directly: &ldquo;Just tell me - is it
              schizophrenia?&rdquo; What do you do first?
            </p>
          </div>

          {/* Options / Accordion */}
          <div className="space-y-4">
            {OPTIONS.map((option) => {
              const isSelected = selectedId === option.id;

              return (
                <div key={option.id} className="space-y-2">
                  {/* Option Button */}
                  <button
                    type="button"
                    onClick={() => setSelectedId(option.id)}
                    className={cn(
                      "flex w-full items-center justify-between gap-4 border p-4 text-left transition-all duration-200 sm:p-5",
                      isSelected
                        ? "border-signal bg-[#12283e] text-white shadow-sm"
                        : "border-white/15 bg-white/[0.02] text-white/80 hover:border-white/30 hover:bg-white/[0.04]",
                    )}
                  >
                    <span className="font-body text-sm leading-relaxed sm:text-[15px]">
                      {option.text}
                    </span>
                    <span
                      className={cn(
                        "flex size-7 shrink-0 items-center justify-center border font-body text-xs font-semibold uppercase transition-colors",
                        isSelected
                          ? "border-signal text-signal"
                          : "border-white/20 text-white/60",
                      )}
                    >
                      {option.id}
                    </span>
                  </button>

                  {/* The Examiner's View (revealed right beneath selected option) */}
                  {isSelected && (
                    <div className="border border-white/10 bg-[#071525] p-5 sm:p-6">
                      <div className="mb-3 text-start">
                        <span className="font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">
                          {option.examinerTitle}
                        </span>
                        {option.scoringMove && (
                          <span className="font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-signal">
                            {" - "}
                            {option.scoringMove}
                          </span>
                        )}
                      </div>
                      <p className="font-body text-sm leading-relaxed text-white/70 sm:text-[15px]">
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
            <div className="mb-3 text-right">
              <span className="font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">
                WHAT THIS STATION IS REALLY TESTING
              </span>
            </div>
            <p className="text-center font-body text-sm leading-relaxed text-white/70 sm:text-[15px]">
              Not your knowledge of confidentiality - every candidate knows the
              rule. It is testing whether you can hold a boundary and a
              relationship at the same time, under time pressure.
            </p>
            <p className="mt-6 text-center font-body text-xs leading-relaxed text-white/45">
              This sample uses an original teaching scenario built on the
              examination&apos;s publicly defined competency domains. Select the
              other options to compare the examiner&apos;s view of each.
            </p>

            {/* CTA Button */}
            <div className="mt-8 flex justify-center">
              <InterestDialogTrigger
                pathway="casc-academy"
                className="inline-flex min-h-12 items-center justify-center bg-signal px-7 font-body text-sm font-medium text-ink transition-colors hover:bg-signal-light focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal"
              >
                Register your interest - get the free guide
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
