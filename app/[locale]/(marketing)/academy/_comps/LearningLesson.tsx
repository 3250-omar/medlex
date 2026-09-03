"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { type MouseEvent, useState } from "react";
import { ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import {
  useCourseOutline,
  useLearningUnit,
} from "../_apiCalls/learningQueries";
import "./cascLesson.css";
import "./cascLessonOverrides.css";
import "./cascLessonProgress.css";

type Props = { locale: string; courseSlug: string; unitSlug: string };

function LegacyContent({
  html,
  blockId,
  onQuestionCorrect,
}: {
  html: string;
  blockId: string;
  onQuestionCorrect: (questionKey: string) => void;
}) {
  function handleClick(event: MouseEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement;
    const takeButton = target.closest<HTMLButtonElement>(
      ".toggle button[data-t]",
    );
    if (takeButton) {
      const player = takeButton.closest(".player");
      const take = takeButton.dataset.t;
      player
        ?.querySelectorAll<HTMLButtonElement>(".toggle button")
        .forEach((button) =>
          button.classList.toggle("active", button === takeButton),
        );
      player?.querySelectorAll<HTMLElement>(".script").forEach((script) => {
        script.style.display = script.id === `tk-${take}` ? "block" : "none";
      });
      return;
    }
    const flag = target.closest<HTMLButtonElement>(".flagbtn");
    if (flag) {
      flag.closest(".line")?.classList.toggle("revealed");
      flag.classList.toggle("open");
      return;
    }
    const option = target.closest<HTMLButtonElement>(".q .opt");
    if (!option || option.disabled) return;
    const question = option.closest<HTMLElement>(".q");
    if (!question) return;
    question.querySelectorAll<HTMLButtonElement>(".opt").forEach((button) => {
      button.classList.remove("picked", "wrong");
      button.setAttribute("aria-pressed", String(button === option));
    });
    question.querySelector(".legacy-feedback")?.remove();
    const correct = option.hasAttribute("data-ok");
    option.classList.add("picked", correct ? "correct" : "wrong");
    const optionIndex = option.dataset.oi;
    const questionIndex = [
      ...question.parentElement!.querySelectorAll(":scope > .q"),
    ].indexOf(question);
    const questionKey = `${blockId}:${questionIndex}`;
    const feedbackKey = correct ? "ok" : `${questionIndex}-${optionIndex}`;
    const feedbackTemplate = question.querySelector<HTMLTemplateElement>(
      `template[data-fb="${feedbackKey}"]`,
    );
    if (feedbackTemplate) {
      const feedback = document.createElement("div");
      feedback.className = `fb legacy-feedback ${correct ? "good" : "bad"}`;
      feedback.innerHTML = feedbackTemplate.innerHTML;
      question.append(feedback);
    }
    if (correct) {
      onQuestionCorrect(questionKey);
      question.querySelectorAll<HTMLButtonElement>(".opt").forEach((button) => {
        button.disabled = true;
      });
    }
  }

  return (
    <div
      className="casc-rich-content"
      onClick={handleClick}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export default function LearningLesson({
  locale,
  courseSlug,
  unitSlug,
}: Props) {
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<"learn" | "exam">(
    searchParams.get("mode") === "exam" ? "exam" : "learn",
  );
  const [correctQuestions, setCorrectQuestions] = useState<Set<string>>(
    new Set(),
  );
  const {
    data: unit,
    isLoading,
    error,
    refetch,
  } = useLearningUnit(courseSlug, unitSlug);
  const { data: outline } = useCourseOutline(courseSlug);
  if (isLoading)
    return (
      <div className="casc-shell">
        <div className="casc-skeleton" />
        <div className="casc-skeleton casc-skeleton-short" />
      </div>
    );
  if (error || !unit)
    return (
      <section className="casc-shell">
        <h1>Unable to load this lesson</h1>
        <p>{error?.message}</p>
        <button type="button" onClick={() => void refetch()}>
          <RefreshCw aria-hidden="true" /> Try again
        </button>
      </section>
    );
  const blocks = [...unit.content_blocks].sort(
    (a, b) => a.sort_order - b.sort_order,
  );
  const exam = unit.assessments.find(
    (assessment) => assessment.source_key === "exam",
  );
  const currentIndex =
    outline?.units.findIndex((outlineUnit) => outlineUnit.slug === unitSlug) ??
    -1;
  const previousUnit =
    currentIndex > 0 ? outline?.units[currentIndex - 1] : undefined;
  const nextUnit =
    currentIndex >= 0 ? outline?.units[currentIndex + 1] : undefined;
  const totalQuestions = blocks.reduce(
    (total, block) =>
      total +
      (block.content.html?.match(/class=["'][^"']*\\bq\\b[^"']*["']/g)
        ?.length ?? 0),
    0,
  );
  const answeredAllQuestions =
    totalQuestions === 0 || correctQuestions.size >= totalQuestions;
  const lessonProgress =
    totalQuestions === 0
      ? 40
      : Math.round(
          10 +
            (Math.min(correctQuestions.size, totalQuestions) / totalQuestions) *
              30,
        );
  const completeQuestion = (questionKey: string) =>
    setCorrectQuestions((current) =>
      current.has(questionKey) ? current : new Set(current).add(questionKey),
    );

  return (
    <div className="casc-shell" data-mode={mode}>
      <header className="casc-lesson-header" lang="en" dir="ltr">
        <div className="casc-wrap">
          {/* <div className="casc-topline">
            <span>The CASC Academy · by MedLex Foundations</span>
            <Link href={`/${locale}/academy`}>
              <Menu aria-hidden="true" /> Course outline
            </Link>
          </div> */}
          <div className="casc-tags">
            <span className="casc-tag casc-tag-primary">
              {unit.unit_code ? `Station ${unit.unit_code}` : "Start here"}
            </span>
            <span className="casc-tag">Self-paced learning</span>
          </div>
          <h1>{unit.title}</h1>
          {unit.summary ? (
            <p className="casc-subtitle">{unit.summary}</p>
          ) : null}
          {unit.lens_text ? (
            <aside className="casc-lens">{unit.lens_text}</aside>
          ) : null}
        </div>
      </header>
      <nav className="casc-modebar" aria-label="Lesson mode">
        <div className="casc-wrap">
          <span className="casc-mode-label">MODE</span>
          <div className="casc-toggle" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={mode === "learn"}
              onClick={() => setMode("learn")}
            >
              Learn Mode
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === "exam"}
              onClick={() => setMode("exam")}
            >
              Exam Mode
            </button>
          </div>
          <span className="casc-progress" aria-live="polite">
            {lessonProgress}% complete
          </span>
        </div>
      </nav>
      <main className="casc-canvas" lang="en" dir="ltr">
        <div className="casc-wrap">
          {mode === "learn" ? (
            blocks.map((block) =>
              block.content.html ? (
                <LegacyContent
                  key={block.id}
                  html={block.content.html}
                  blockId={block.id}
                  onQuestionCorrect={completeQuestion}
                />
              ) : null,
            )
          ) : (
            <section className="casc-exam-card">
              <p className="casc-eyebrow">Exam Mode</p>
              <h2>A new patient. The same skill.</h2>
              <p>
                {exam
                  ? `You have ${Math.round((exam.duration_seconds ?? 420) / 60)} minutes. Your result and examiner review unlock after submission.`
                  : "Exam mode is not available for this unit."}
              </p>
              <button type="button" disabled={!exam}>
                Start Exam Mode
              </button>
            </section>
          )}
          <nav className="casc-pagination" aria-label="Lesson navigation">
            {previousUnit ? (
              <Link
                href={`/${locale}/academy/courses/${courseSlug}/learn/${previousUnit.slug}`}
              >
                <ChevronLeft aria-hidden="true" /> Previous
              </Link>
            ) : (
              <span className="casc-pagination-disabled">
                <ChevronLeft aria-hidden="true" /> Previous
              </span>
            )}
            <span className="casc-unit-position">
              {currentIndex >= 0 && outline
                ? `${currentIndex + 1} of ${outline.units.length}`
                : "Course lesson"}
            </span>
            {nextUnit && answeredAllQuestions ? (
              <Link
                href={`/${locale}/academy/courses/${courseSlug}/learn/${nextUnit.slug}`}
              >
                Next <ChevronRight aria-hidden="true" />
              </Link>
            ) : (
              <button
                type="button"
                className="casc-pagination-disabled"
                disabled
                title="Answer every question correctly to continue."
              >
                Next <ChevronRight aria-hidden="true" />
              </button>
            )}
          </nav>
          {nextUnit && !answeredAllQuestions ? (
            <p className="casc-next-hint" aria-live="polite">
              Answer all {totalQuestions} question
              {totalQuestions === 1 ? "" : "s"} correctly to unlock the next
              lesson.
            </p>
          ) : null}
        </div>
      </main>
    </div>
  );
}
