"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import "./cascEditorial.css";

type PreviewUnit = {
  title: string;
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

    const completionLink = root.querySelector<HTMLAnchorElement>(".done a.btn, .done .mark, .done a[href]");
    if (completionLink) {
      completionLink.href = `/${locale}/pathways/casc-academy`;
      completionLink.textContent = "Continue to the CASC Academy";
    }

    const acts = { reveal: 0, quiz: 0, exam: 0, finish: 0 };
    const sections = Array.from(root.querySelectorAll<HTMLElement>("section[id]"));
    const seenSections: Record<string, number> = {};
    sections.forEach((section) => {
      seenSections[section.id] = 0;
    });

    const updateProgress = () => {
      const sectionCount = Object.keys(seenSections).length || 1;
      const seenCount = Object.values(seenSections).reduce((sum, value) => sum + value, 0);
      const sectionScore = (seenCount / sectionCount) * 35;
      const activityScore =
        Math.min(acts.reveal, 6) * 4 +
        Math.min(acts.quiz, 7) * 4 +
        (acts.exam ? 20 : 0) +
        (acts.finish ? 10 : 0);
      const percentage = Math.min(100, Math.round(sectionScore + activityScore));
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

    root.querySelectorAll<HTMLElement>("[data-q]").forEach((question, index) => {
      question.dataset.qi = String(index);
      const options = Array.from(question.querySelectorAll<HTMLButtonElement>(".opt"));
      const feedbackSlot = question.querySelector(".fbs");
      if (feedbackSlot && options.length > 1 && !question.dataset.shuffled) {
        question.dataset.shuffled = "1";
        for (let index = options.length - 1; index > 0; index -= 1) {
          const randomIndex = Math.floor(Math.random() * (index + 1));
          [options[index], options[randomIndex]] = [options[randomIndex], options[index]];
        }
        options.forEach((option) => question.insertBefore(option, feedbackSlot));
      }
    });

    const switchMode = (mode: "learn" | "exam") => {
      const learnPanel = root.querySelector<HTMLElement>("#learnPanel");
      const examPanel = root.querySelector<HTMLElement>("#examPanel");
      if (learnPanel) learnPanel.style.display = mode === "learn" ? "block" : "none";
      if (examPanel) examPanel.style.display = mode === "exam" ? "block" : "none";
      root.querySelectorAll<HTMLButtonElement>("#mLearn, #mExam, .mtoggle button").forEach((button) => {
        const isLearn = button.id === "mLearn" || button.textContent?.includes("Learn");
        button.classList.toggle("active", mode === (isLearn ? "learn" : "exam"));
      });
      const timer = root.querySelector<HTMLElement>("#timer");
      if (timer) timer.style.display = mode === "exam" ? "inline" : "none";
    };

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const playerButton = target.closest<HTMLButtonElement>(".toggle button[data-t]");
      if (playerButton) {
        event.preventDefault();
        const player = playerButton.closest(".player");
        const take = playerButton.dataset.t;
        if (player && take) {
          player.querySelectorAll<HTMLButtonElement>(".toggle button").forEach((button) => {
            button.classList.toggle("active", button === playerButton);
          });
          player.querySelectorAll<HTMLElement>(".script").forEach((script) => {
            script.style.display = script.id === `tk-${take}` || script.id === `d-${take}` ? "block" : "none";
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

      const modeButton = target.closest<HTMLButtonElement>("#mLearn, #mExam, .mtoggle button");
      if (modeButton) {
        event.preventDefault();
        switchMode(modeButton.id === "mExam" || modeButton.textContent?.includes("Exam") ? "exam" : "learn");
        return;
      }

      const option = target.closest<HTMLButtonElement>("[data-q] .opt, #learnPanel .q .opt, section .q .opt");
      if (!option || option.disabled || option.closest("#examQs")) return;
      const question = option.closest<HTMLElement>("[data-q], #learnPanel .q, section .q");
      if (!question || question.dataset.done) return;
      event.preventDefault();
      if (!option.hasAttribute("data-ok")) {
        option.disabled = true;
        option.classList.add("wrong");
        return;
      }
      question.dataset.done = "1";
      option.classList.add("correct");
      question.querySelectorAll<HTMLButtonElement>(".opt").forEach((button) => {
        button.disabled = true;
      });
      const feedback = document.createElement("div");
      feedback.className = "fb good";
      feedback.innerHTML = question.querySelector<HTMLTemplateElement>('template[data-fb="ok"]')?.innerHTML ?? "<b>THE EXAMINER AGREES</b> Correct decision.";
      question.appendChild(feedback);
      acts.quiz += 1;
      updateProgress();
    };

    root.addEventListener("click", handleClick);
    switchMode("learn");
    updateProgress();
    return () => {
      observer.disconnect();
      root.removeEventListener("click", handleClick);
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
      <div ref={containerRef} className="casc-content-mount">
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
        {unit ? <div dangerouslySetInnerHTML={{ __html: html }} /> : null}
      </div>

    </main>
  );
}
