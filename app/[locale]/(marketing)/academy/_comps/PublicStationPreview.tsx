"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  initCascInteractiveEngine,
  STATION_7_2_EXAM,
  extractExamQuestions,
  type RawAssessment,
} from "./cascExamEngine";
import "./cascEditorial.css";

type PreviewUnit = {
  title: string;
  assessments?: RawAssessment[];
  content_blocks: Array<{ sort_order: number; content: { html?: string } }>;
};
type Props = { locale: string };

export default function PublicStationPreview({ locale }: Props) {
  const [unit, setUnit] = useState<PreviewUnit | null>(null);
  const [error, setError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/academy/casc-preview")
      .then(async (response) => {
        if (!response.ok) throw new Error("Preview unavailable");
        return response.json() as Promise<{ data: PreviewUnit }>;
      })
      .then(({ data }) => setUnit(data))
      .catch(() => setError(true));
  }, []);

  useEffect(() => {
    const root = containerRef.current;
    if (!root || !unit) return;

    const completionLink = root.querySelector<HTMLAnchorElement>(
      ".done a.btn, .done .mark, .done a[href]",
    );
    if (completionLink) {
      completionLink.href = `/${locale}/pathways/casc-academy`;
      completionLink.textContent = "Continue to the CASC Academy";
    }

    const acts = { reveal: 0, quiz: 0, exam: 0, finish: 0 };
    const sections = Array.from(
      root.querySelectorAll<HTMLElement>("section[id]"),
    );
    const seenSections: Record<string, number> = {};
    sections.forEach((section) => {
      seenSections[section.id] = 0;
    });

    const updateProgress = () => {
      const sectionCount = Object.keys(seenSections).length || 1;
      const seenCount = Object.values(seenSections).reduce(
        (sum, value) => sum + value,
        0,
      );
      const sectionScore = (seenCount / sectionCount) * 30;
      const activityScore =
        (Math.min(acts.reveal, 10) / 10) * 25 +
        (Math.min(acts.quiz, 7) / 7) * 25 +
        (acts.exam ? 20 : 0);
      const percentage = Math.min(
        100,
        Math.round(sectionScore + activityScore),
      );
      const bar = root.querySelector<HTMLElement>("#bar");
      const label = root.querySelector<HTMLElement>("#pct");
      if (bar) bar.style.width = `${percentage}%`;
      if (label) label.textContent = `${percentage}%`;
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target.id) {
            seenSections[entry.target.id] = 1;
            updateProgress();
          }
        });
      },
      { threshold: 0.25 },
    );
    sections.forEach((section) => observer.observe(section));

    // Shuffle options in learn mode questions if not already shuffled
    root
      .querySelectorAll<HTMLElement>("[data-q]")
      .forEach((question, index) => {
        question.dataset.qi = String(index);
        const options = Array.from(
          question.querySelectorAll<HTMLButtonElement>(".opt"),
        );
        const feedbackSlot = question.querySelector(".fbs");
        if (feedbackSlot && options.length > 1 && !question.dataset.shuffled) {
          question.dataset.shuffled = "1";
          for (let index = options.length - 1; index > 0; index -= 1) {
            const randomIndex = Math.floor(Math.random() * (index + 1));
            [options[index], options[randomIndex]] = [
              options[randomIndex],
              options[index],
            ];
          }
          options.forEach((option) =>
            question.insertBefore(option, feedbackSlot),
          );
        }
      });

    // Handle interactive reveals and player takes
    const handlePreviewClicks = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const playerButton = target.closest<HTMLButtonElement>(
        ".toggle button[data-t]",
      );
      if (playerButton) {
        event.preventDefault();
        const player = playerButton.closest(".player");
        const take = playerButton.dataset.t;
        if (player && take) {
          player
            .querySelectorAll<HTMLButtonElement>(".toggle button")
            .forEach((button) => {
              button.classList.toggle("active", button === playerButton);
            });
          player.querySelectorAll<HTMLElement>(".script").forEach((script) => {
            script.style.display =
              script.id === `tk-${take}` || script.id === `d-${take}`
                ? "block"
                : "none";
          });
        }
        return;
      }

      const flag = target.closest<HTMLButtonElement>(".flagbtn");
      if (flag) {
        event.preventDefault();
        const line = flag.closest(".line");
        if (line) {
          const open = line.classList.toggle("revealed");
          flag.classList.toggle("open", open);
          if (open && !flag.dataset.counted) {
            flag.dataset.counted = "1";
            acts.reveal += 1;
            updateProgress();
          }
        }
        return;
      }

      const option = target.closest<HTMLButtonElement>(
        "[data-q] .opt, #learnPanel .q .opt, section .q .opt",
      );
      if (!option || option.disabled || option.closest("#examQs")) return;
      const question = option.closest<HTMLElement>(
        "[data-q], #learnPanel .q, section .q",
      );
      if (!question || question.dataset.done) return;
      event.preventDefault();

      const qi = question.dataset.qi || "0";
      const oi = option.dataset.oi || "0";
      const isCorrect = option.hasAttribute("data-ok");

      // Remove any prior feedback in this question
      question.querySelector(".fb")?.remove();
      const feedback = document.createElement("div");

      if (isCorrect) {
        question.dataset.done = "1";
        option.classList.add("correct");
        question
          .querySelectorAll<HTMLButtonElement>(".opt")
          .forEach((button) => {
            button.disabled = true;
          });
        feedback.className = "fb good";
        feedback.innerHTML =
          question.querySelector<HTMLTemplateElement>('template[data-fb="ok"]')
            ?.innerHTML ?? "<b>THE EXAMINER AGREES</b> Correct decision.";
        question.appendChild(feedback);
        acts.quiz += 1;
        updateProgress();
      } else {
        option.disabled = true;
        option.classList.add("wrong");
        const specificTemplate = question.querySelector<HTMLTemplateElement>(
          `template[data-fb="${qi}-${oi}"]`,
        );
        feedback.className = "fb bad";
        feedback.innerHTML =
          specificTemplate?.innerHTML ??
          "<b>THE EXAMINER’S VIEW</b> Not this one — try again.";
        question.appendChild(feedback);
      }
    };

    root.addEventListener("click", handlePreviewClicks);

    // Initialise full interactive Exam Engine + Practice Pack PDF generator
    const extractedQuestions = extractExamQuestions(unit.assessments);
    const questions =
      extractedQuestions.length > 0 ? extractedQuestions : STATION_7_2_EXAM;

    const cleanupExamEngine = initCascInteractiveEngine({
      root,
      questions,
      stationTitle: unit.title || "Station 7.2 · The Angry Father",
      onExamComplete: () => {
        acts.exam = 1;
        updateProgress();
      },
      onProgress: updateProgress,
    });

    updateProgress();

    return () => {
      observer.disconnect();
      root.removeEventListener("click", handlePreviewClicks);
      cleanupExamEngine();
    };
  }, [unit, locale]);
  const html =
    unit?.content_blocks
      .slice()
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((block) => block.content.html ?? "")
      .join("\n") ?? "";
  return (
    <main
      className="casc-experience min-h-screen bg-white pt-16"
      dir="ltr"
      lang="en"
    >
      {!unit && !error ? (
        <div className="wrap py-20">Loading Station 7.2…</div>
      ) : null}
      {error ? (
        <div className="wrap py-20">
          <h1>Station 7.2 is currently unavailable.</h1>
          <Link
            className="btn mt-6 inline-flex"
            href={`/${locale}/pathways/casc-academy#enrol`}
          >
            Back to the CASC Academy
          </Link>
        </div>
      ) : null}
      {unit ? (
        <div
          ref={containerRef}
          className="casc-content-mount"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : null}
    </main>
  );
}
