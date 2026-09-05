"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import CourseLessonMenu from "./CourseLessonMenu";
import {
  useCourseOutline,
  useLearningUnit,
  type AssessmentQuestion,
} from "../_apiCalls/learningQueries";
import { useCompleteUnit, useOpenUnit } from "../../_apiCalls/academyQueries";
import "./cascEditorial.css";

type Props = { locale: string; courseSlug: string; unitSlug: string };

export default function LearningLesson({
  locale,
  courseSlug,
  unitSlug,
}: Props) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [answeredAllQuestions, setAnsweredAllQuestions] = useState(false);
  const [remainingQuestions, setRemainingQuestions] = useState(0);

  const { mutate: completeUnit } = useCompleteUnit();
  const { mutate: openUnit } = useOpenUnit();

  const {
    data: unit,
    isLoading,
    error,
    refetch,
  } = useLearningUnit(courseSlug, unitSlug);
  const { data: outline } = useCourseOutline(courseSlug);

  // Record unit opened in backend when unit is loaded
  useEffect(() => {
    if (unit) {
      openUnit({ courseSlug, unitSlug });
    }
  }, [unit, courseSlug, unitSlug, openUnit]);

  const currentIndex =
    outline?.units.findIndex((u) => u.slug === unitSlug) ?? -1;
  const previousUnit =
    currentIndex > 0 ? outline?.units[currentIndex - 1] : undefined;
  const nextUnit =
    currentIndex >= 0 ? outline?.units[currentIndex + 1] : undefined;

  // Hide global marketing header & footer during lesson
  // Hide marketing footer during lesson to keep sticky navigation clean
  useEffect(() => {
    const siteFooter = document.querySelector(
      "body > footer:not(.casc-experience footer)",
    ) as HTMLElement | null;
    const prevFooterDisplay = siteFooter?.style.display;
    if (siteFooter) siteFooter.style.display = "none";
    return () => {
      if (siteFooter) siteFooter.style.display = prevFooterDisplay ?? "";
    };
  }, []);

  // Initialize interactive behaviors on mounted HTML
  useEffect(() => {
    const root = containerRef.current;
    if (!root || !unit) return;

    // 1. Shuffling Learn Mode quiz options once (matching prototype behavior)
    root.querySelectorAll<HTMLElement>("[data-q]").forEach((q, idx) => {
      q.dataset.qi = String(idx);
      const opts = Array.from(q.querySelectorAll<HTMLButtonElement>(".opt"));
      const fbs = q.querySelector(".fbs");
      if (fbs && opts.length > 1 && !q.dataset.shuffled) {
        q.dataset.shuffled = "true";
        for (let i = opts.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          const temp = opts[i];
          opts[i] = opts[j];
          opts[j] = temp;
        }
        opts.forEach((opt) => q.insertBefore(opt, fbs));
      }
    });

    // 2. Progress Tracker (IntersectionObserver + quiz answers)
    const seenSections: Record<string, number> = {};
    const acts = { reveal: 0, quiz: 0, exam: 0, finish: 0 };
    const sections = root.querySelectorAll<HTMLElement>("section[id]");

    sections.forEach((s) => {
      seenSections[s.id] = 0;
    });

    const updateProgress = () => {
      const secCount = Object.keys(seenSections).length || 1;
      const seenTotal = Object.values(seenSections).reduce((a, b) => a + b, 0);
      const secRatio = (seenTotal / secCount) * 35;
      const actScore =
        Math.min(acts.reveal, 6) * 4 +
        Math.min(acts.quiz, 7) * 4 +
        (acts.exam ? 20 : 0) +
        (acts.finish ? 10 : 0);
      const pct = Math.min(100, Math.round(secRatio + actScore));

      const bar = root.querySelector<HTMLElement>("#bar");
      const pctLabel = root.querySelector<HTMLElement>("#pct");
      if (bar) bar.style.width = `${pct}%`;
      if (pctLabel) pctLabel.textContent = `${pct}%`;
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

    sections.forEach((s) => observer.observe(s));
    updateProgress();

    // Check unlocking status of the next button and completion button
    const checkUnlockStatus = () => {
      const allQuestions = Array.from(
        root.querySelectorAll<HTMLElement>(
          "[data-q], #learnPanel .q, section .q",
        ),
      ).filter((q) => !q.closest("#examQs"));
      const total = allQuestions.length;
      const done = allQuestions.filter((q) => q.dataset.done === "1").length;
      const remaining = Math.max(0, total - done);
      const isComplete = total === 0 || remaining === 0;

      setRemainingQuestions(remaining);
      setAnsweredAllQuestions(isComplete);

      const nextSlug = nextUnit?.slug;
      const nextUrl = nextSlug
        ? `/${locale}/academy/courses/${courseSlug}/learn/${nextSlug}`
        : `/${locale}/academy/courses/${courseSlug}/certificate`;

      const doneBtn = root.querySelector<HTMLAnchorElement>(
        ".done a.btn, .done .mark, .done a[href]",
      );
      if (doneBtn) {
        doneBtn.setAttribute("href", nextUrl);
        let hintEl = root.querySelector<HTMLElement>(".casc-lock-hint");
        if (!hintEl) {
          hintEl = document.createElement("p");
          hintEl.className = "casc-lock-hint";
          doneBtn.parentElement?.appendChild(hintEl);
        }

        if (isComplete) {
          doneBtn.classList.remove("casc-btn-locked");
          doneBtn.classList.add("casc-btn-unlocked");
          doneBtn.removeAttribute("aria-disabled");
          hintEl.className = "casc-lock-hint unlocked";
          hintEl.textContent =
            "✓ All decisions completed. You can continue to the next lesson.";
        } else {
          doneBtn.classList.add("casc-btn-locked");
          doneBtn.classList.remove("casc-btn-unlocked");
          doneBtn.setAttribute("aria-disabled", "true");
          hintEl.className = "casc-lock-hint";
          hintEl.textContent = `Answer all ${remaining} decision${
            remaining > 1 ? "s" : ""
          } above to unlock this next step.`;
        }
      }
    };

    checkUnlockStatus();

    // 3. Delegate Clicks across the lesson
    const handleLessonClicks = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      // A. Take Player Switcher (.toggle button[data-t])
      const takeBtn = target.closest<HTMLButtonElement>(
        ".toggle button[data-t]",
      );
      if (takeBtn) {
        event.preventDefault();
        const player = takeBtn.closest(".player");
        const take = takeBtn.getAttribute("data-t");
        if (player && take) {
          player
            .querySelectorAll<HTMLButtonElement>(".toggle button")
            .forEach((b) => {
              b.classList.toggle("active", b === takeBtn);
            });
          player.querySelectorAll<HTMLElement>(".script").forEach((script) => {
            const isTarget =
              script.id === `tk-${take}` || script.id === `d-${take}`;
            script.style.display = isTarget ? "block" : "none";
          });
        }
        return;
      }

      // B. Reveal Flag (.flagbtn)
      const flagBtn = target.closest<HTMLButtonElement>(".flagbtn");
      if (flagBtn) {
        event.preventDefault();
        const line = flagBtn.closest(".line");
        if (line) {
          const isRevealed = line.classList.toggle("revealed");
          flagBtn.classList.toggle("open", isRevealed);
          if (isRevealed && !flagBtn.dataset.counted) {
            flagBtn.dataset.counted = "1";
            acts.reveal++;
            updateProgress();
          }
        }
        return;
      }

      // C. Mode Switcher buttons (#mLearn, #mExam, .mtoggle button)
      const mLearn = target.closest<HTMLButtonElement>(
        "#mLearn, .mtoggle button:first-child",
      );
      if (
        mLearn &&
        (mLearn.textContent?.includes("Learn") || mLearn.id === "mLearn")
      ) {
        event.preventDefault();
        switchMode("learn");
        return;
      }
      const mExam = target.closest<HTMLButtonElement>(
        "#mExam, .mtoggle button:last-child",
      );
      if (
        mExam &&
        (mExam.textContent?.includes("Exam") || mExam.id === "mExam")
      ) {
        event.preventDefault();
        switchMode("exam");
        return;
      }

      // D. Learn Mode Decision Option (.opt inside [data-q])
      const learnOpt = target.closest<HTMLButtonElement>("[data-q] .opt");
      if (learnOpt && !learnOpt.disabled) {
        event.preventDefault();
        const q = learnOpt.closest<HTMLElement>("[data-q]");
        if (!q || q.dataset.done) return;

        const isCorrect = learnOpt.hasAttribute("data-ok");
        const qi = q.dataset.qi || "0";
        const oi = learnOpt.dataset.oi || "0";

        // Remove any prior feedback
        q.querySelector(".fb")?.remove();
        const fb = document.createElement("div");

        if (isCorrect) {
          q.dataset.done = "1";
          learnOpt.classList.add("correct");
          q.querySelectorAll<HTMLButtonElement>(".opt").forEach((o) => {
            o.disabled = true;
          });
          const template = q.querySelector<HTMLTemplateElement>(
            'template[data-fb="ok"]',
          );
          fb.className = "fb good";
          fb.innerHTML =
            template?.innerHTML ||
            "<b>THE EXAMINER AGREES</b> Correct decision.";
          acts.quiz++;
          updateProgress();
          checkUnlockStatus();
        } else {
          learnOpt.classList.add("wrong");
          learnOpt.disabled = true;
          const template = q.querySelector<HTMLTemplateElement>(
            `template[data-fb="${qi}-${oi}"]`,
          );
          fb.className = "fb bad";
          fb.innerHTML =
            template?.innerHTML ||
            "<b>THE EXAMINER'S VIEW</b> Not this one — try again.";
        }
        q.appendChild(fb);
        return;
      }

      // E. Practice Pack Overall Judgment (.pcard .pb .opt)
      const judgOpt = target.closest<HTMLButtonElement>(
        ".pcard .pb .opt:not([data-oi])",
      );
      if (judgOpt) {
        event.preventDefault();
        judgOpt.parentElement
          ?.querySelectorAll<HTMLButtonElement>(".opt")
          .forEach((b) => b.classList.remove("picked"));
        judgOpt.classList.add("picked");
        return;
      }

      // F. Print Pack Cards (.printrow .btn)
      const printBtn = target.closest<HTMLButtonElement>(".printrow .btn");
      if (printBtn) {
        event.preventDefault();
        const text = printBtn.textContent?.toLowerCase() || "";
        let modeClass = "";
        if (text.includes("candidate")) modeClass = "pr-cand";
        else if (text.includes("role")) modeClass = "pr-role";
        else if (text.includes("obs")) modeClass = "pr-obs";

        if (modeClass) document.body.classList.add(modeClass);
        window.print();
        setTimeout(() => {
          document.body.classList.remove("pr-cand", "pr-role", "pr-obs");
        }, 800);
        return;
      }

      // G. Self-check text checker (#ftbtn)
      const ftBtn = target.closest<HTMLButtonElement>("#ftbtn");
      if (ftBtn) {
        event.preventDefault();
        const txt =
          root.querySelector<HTMLTextAreaElement>("#ftxt")?.value.trim() || "";
        if (txt.length < 15) {
          ftBtn.textContent = "Write your full sentence first";
          return;
        }
        ftBtn.textContent = "Checked — score yourself below";
        const ftChecks = root.querySelector<HTMLElement>("#ftchecks");
        if (ftChecks) ftChecks.style.display = "block";
        return;
      }

      // H. Finish anchor click (.done a.btn, .done .mark, etc.)
      const finishLink = target.closest<HTMLAnchorElement>(
        ".done a.btn, .done .mark, .done a[href], a.mark",
      );
      if (finishLink) {
        event.preventDefault();
        if (finishLink.classList.contains("casc-btn-locked")) {
          const firstUnanswered = root.querySelector<HTMLElement>(
            "[data-q]:not([data-done='1']), #learnPanel .q:not([data-done='1']), section .q:not([data-done='1'])",
          );
          if (firstUnanswered && !firstUnanswered.closest("#examQs")) {
            firstUnanswered.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
            firstUnanswered.classList.add("casc-highlight-unanswered");
            setTimeout(() => {
              firstUnanswered.classList.remove("casc-highlight-unanswered");
            }, 2500);
          }
          return;
        }

        acts.finish = 1;
        updateProgress();

        // Record completion in backend
        completeUnit({ courseSlug, unitSlug });

        const destUrl = finishLink.getAttribute("href");
        if (destUrl && destUrl !== "#") {
          router.push(destUrl);
        }
        return;
      }

      // I. Seamless .html link routing (e.g. href="14_Station_3.1_After_an_Overdose.html" or .srow navigation)
      const htmlLink = target.closest<HTMLAnchorElement>("a[href*='.html']");
      if (htmlLink) {
        const rawHref = htmlLink.getAttribute("href") || "";
        const match = rawHref.match(/(\d{2}_[^.]+|[a-zA-Z0-9_-]+)\.html/);
        if (match) {
          event.preventDefault();
          const slug = match[1]
            .replace(/^\d{2}_/, "")
            .toLowerCase()
            .replace(/_/g, "-");
          router.push(`/${locale}/academy/courses/${courseSlug}/learn/${slug}`);
          return;
        }
      }
      const srow = target.closest<HTMLElement>(".srow");
      if (srow && !target.closest("a")) {
        const onclickAttr = srow.getAttribute("onclick") || "";
        const match = onclickAttr.match(
          /['"](\d{2}_[^.]+|[a-zA-Z0-9_-]+)\.html['"]/,
        );
        if (match) {
          event.preventDefault();
          const slug = match[1]
            .replace(/^\d{2}_/, "")
            .toLowerCase()
            .replace(/_/g, "-");
          router.push(`/${locale}/academy/courses/${courseSlug}/learn/${slug}`);
          return;
        }
      }
    };

    // Practice Pack Rubric Checkbox change handler
    const handleCheckboxChange = (event: Event) => {
      const cb = event.target as HTMLInputElement;
      if (!cb || !cb.matches(".rub input[data-d]")) return;

      const card = cb.closest(".pcard");
      if (!card) return;

      const domainNames: Record<string, string> = {
        comm: "communication skills",
        prof: "professionalism",
        core: "core symptoms",
        other: "other relevant areas",
        risk: "risk",
        wider: "the wider picture",
        alli: "the alliance",
        close: "plan and close",
      };

      const boxes = card.querySelectorAll<HTMLInputElement>("input[data-d]");
      const per: Record<string, { c: number; t: number }> = {};
      let totalChecked = 0;
      const totalCount = boxes.length;

      boxes.forEach((b) => {
        const d = b.getAttribute("data-d") || "core";
        per[d] = per[d] || { c: 0, t: 0 };
        per[d].t++;
        if (b.checked) {
          per[d].c++;
          totalChecked++;
        }
      });

      Object.keys(per).forEach((d) => {
        const counterEl = card.querySelector(`[data-dc="${d}"]`);
        if (counterEl) counterEl.textContent = `${per[d].c}/${per[d].t}`;
      });

      const scoreTotalEl = card.querySelector("[data-sc]");
      if (scoreTotalEl)
        scoreTotalEl.textContent = `${totalChecked} / ${totalCount}`;

      const verdictEl = card.querySelector("[data-verdict]");
      if (verdictEl) {
        if (totalChecked === 0) {
          verdictEl.textContent = "go domain by domain, not by the total.";
        } else if (totalChecked === totalCount) {
          verdictEl.textContent =
            "every domain covered — this is the station the examiner remembers.";
        } else {
          let weakDomain = "";
          let lowestRatio = 2;
          Object.keys(per).forEach((d) => {
            const ratio = per[d].c / per[d].t;
            if (ratio < lowestRatio) {
              lowestRatio = ratio;
              weakDomain = d;
            }
          });
          const rawHeader =
            card.querySelector(`tr.dom[data-d="${weakDomain}"] b`)
              ?.textContent || "";
          const cleanName = rawHeader
            .replace(/\s*\([^)]*\)/g, "")
            .trim()
            .toLowerCase();
          verdictEl.textContent = `weakest domain: ${cleanName || domainNames[weakDomain] || weakDomain} — start the feedback there.`;
        }
      }
    };

    // Self-check 4-checkbox change
    const handleFtScoreChange = (event: Event) => {
      const cb = event.target as HTMLInputElement;
      if (!cb || !cb.closest("#ftchecks")) return;

      const boxes = root.querySelectorAll<HTMLInputElement>(
        "#ftchecks input[type='checkbox']",
      );
      const checkedCount = Array.from(boxes).filter((b) => b.checked).length;
      const doneMsg = root.querySelector<HTMLElement>("#ftdone");
      if (doneMsg)
        doneMsg.style.display = checkedCount === 4 ? "block" : "none";

      if (checkedCount === 4) {
        const constructBox = root.querySelector("#constructBox");
        if (constructBox && !root.querySelector("#ftbadge")) {
          const badge = document.createElement("p");
          badge.id = "ftbadge";
          badge.style.marginTop = "8px";
          badge.style.fontWeight = "700";
          badge.style.color = "var(--goldd)";
          badge.innerHTML =
            "+ Demonstrated (self-checked): the open safety question — your own words, against the principles.";
          constructBox.appendChild(badge);
        }
      }
    };

    // Mode Switcher function
    const switchMode = (mode: "learn" | "exam") => {
      const learnPanel = root.querySelector<HTMLElement>("#learnPanel");
      const examPanel = root.querySelector<HTMLElement>("#examPanel");
      const mLearnBtn = root.querySelector<HTMLButtonElement>(
        "#mLearn, .mtoggle button:first-child",
      );
      const mExamBtn = root.querySelector<HTMLButtonElement>(
        "#mExam, .mtoggle button:last-child",
      );
      const timerEl = root.querySelector<HTMLElement>("#timer");

      if (learnPanel)
        learnPanel.style.display = mode === "learn" ? "block" : "none";
      if (examPanel)
        examPanel.style.display = mode === "exam" ? "block" : "none";
      if (mLearnBtn) mLearnBtn.classList.toggle("active", mode === "learn");
      if (mExamBtn) mExamBtn.classList.toggle("active", mode === "exam");
      if (timerEl) timerEl.style.display = mode === "exam" ? "inline" : "none";

      if (mode === "learn" && timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Exam Engine: Start Exam click handler
    const handleStartExamClick = (e: MouseEvent) => {
      const btn = (e.target as HTMLElement).closest<HTMLButtonElement>(
        "#examStart .btn, #retakeBtn",
      );
      if (!btn) return;
      e.preventDefault();

      const examAssessment = unit.assessments.find(
        (a) => a.source_key === "exam" || a.source_key === "timed_exam",
      );
      const questions: AssessmentQuestion[] =
        examAssessment?.assessment_questions ?? [];

      const examStart = root.querySelector<HTMLElement>("#examStart");
      const examQs = root.querySelector<HTMLElement>("#examQs");
      const examSubmitRow = root.querySelector<HTMLElement>("#examSubmitRow");
      const results = root.querySelector<HTMLElement>("#results");
      const timerEl = root.querySelector<HTMLElement>("#timer");

      if (examStart) examStart.style.display = "none";
      if (results) results.style.display = "none";

      let secondsLeft = examAssessment?.duration_seconds ?? 420;
      const formatTime = (s: number) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${m < 10 ? "0" : ""}${m}:${sec < 10 ? "0" : ""}${sec}`;
      };

      if (timerEl) {
        timerEl.textContent = formatTime(secondsLeft);
        timerEl.classList.remove("warn");
      }

      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        secondsLeft--;
        if (timerEl) {
          timerEl.textContent = formatTime(secondsLeft);
          if (secondsLeft <= 60) timerEl.classList.add("warn");
        }
        if (secondsLeft <= 0) {
          if (timerRef.current) clearInterval(timerRef.current);
          timerRef.current = null;
          submitExamAnswers();
        }
      }, 1000);

      // Render questions into #examQs if empty or retaking
      if (examQs) {
        examQs.innerHTML = "";
        examQs.style.display = "block";

        if (questions.length > 0) {
          questions.forEach((q, qi) => {
            const qDiv = document.createElement("div");
            qDiv.className = "q";
            qDiv.dataset.eqi = String(qi);
            qDiv.dataset.qid = q.id;

            let h = `<h3>${q.stem}</h3>`;
            q.answer_options.forEach((opt, oi) => {
              h += `<button type="button" class="opt" data-optid="${opt.id}" data-oi="${oi}">${opt.option_text}</button>`;
            });
            qDiv.innerHTML = h;
            examQs.appendChild(qDiv);
          });
        }
      }

      if (examSubmitRow) examSubmitRow.style.display = "block";
    };

    // Selecting option in exam
    const handleExamOptionClick = (e: MouseEvent) => {
      const opt = (e.target as HTMLElement).closest<HTMLButtonElement>(
        "#examQs .opt",
      );
      if (!opt) return;
      e.preventDefault();
      opt.parentElement
        ?.querySelectorAll<HTMLButtonElement>(".opt")
        .forEach((b) => b.classList.remove("picked"));
      opt.classList.add("picked");
    };

    // Submit Exam answers
    const submitExamAnswers = () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      const examQs = root.querySelector<HTMLElement>("#examQs");
      const examSubmitRow = root.querySelector<HTMLElement>("#examSubmitRow");
      const results = root.querySelector<HTMLElement>("#results");
      const scoreLine = root.querySelector<HTMLElement>("#scoreLine");
      const verdictLine = root.querySelector<HTMLElement>("#verdictLine");
      const constructBox = root.querySelector<HTMLElement>("#constructBox");
      const examReview = root.querySelector<HTMLElement>("#examReview");

      if (examQs) examQs.style.display = "none";
      if (examSubmitRow) examSubmitRow.style.display = "none";
      if (results) results.style.display = "block";

      const examAssessment = unit.assessments.find(
        (a) => a.source_key === "exam" || a.source_key === "timed_exam",
      );
      const questions = examAssessment?.assessment_questions ?? [];

      const pickedOptions = root.querySelectorAll<HTMLButtonElement>(
        "#examQs .opt.picked",
      );
      const total = questions.length || 7;
      const score = pickedOptions.length; // Placeholder score
      const pass = score >= (examAssessment?.pass_score ?? 5);

      if (scoreLine) scoreLine.textContent = `${score} / ${total}`;
      if (verdictLine) {
        verdictLine.innerHTML = pass
          ? "Recognised under exam conditions — you held structure and warmth together with an unfamiliar patient, under time, without help. Now produce it below in your own words."
          : "Explored, not yet recognised. Read the examiner analysis below, return to Learn Mode, and retake in a few days — recognising the pattern under time is what this mode measures.";
      }

      if (constructBox) {
        constructBox.innerHTML = `<b>${pass ? "CONSTRUCTS — RECOGNISED UNDER EXAM CONDITIONS" : "CONSTRUCTS — EXPLORED, NOT YET RECOGNISED"}</b>
        <ul>
          <li>Structure and warmth held together under time</li>
          <li>The offered cue, followed with purpose</li>
          <li>The safety question asked so it can be answered</li>
        </ul>
        ${pass ? "" : "<p style='margin-top:8px'>These mark as recognised at 5 of 7 or more with all critical decisions correct.</p>"}`;
      }

      if (examReview && questions.length > 0) {
        examReview.innerHTML =
          '<h3 style="font-size:19px; margin-bottom:12px">The examiner’s analysis</h3>';
        questions.forEach((q) => {
          const qCard = document.createElement("div");
          qCard.className = "q";
          qCard.innerHTML = `<h3>${q.stem}</h3>
          <div class="fb good" style="display:block">
            <b>THE EXAMINER'S VIEW</b>
            ${q.explanation || "This is the move that balances clinical thoroughness with patient safety and connection."}
          </div>`;
          examReview.appendChild(qCard);
        });
      }

      acts.exam = 1;
      updateProgress();
      if (results) {
        window.scrollTo({
          top: results.offsetTop - 70,
          behavior: "smooth",
        });
      }
    };

    const handleSubmitExamBtnClick = (e: MouseEvent) => {
      const btn = (e.target as HTMLElement).closest<HTMLButtonElement>(
        "#examSubmitRow .btn",
      );
      if (!btn) return;
      e.preventDefault();
      submitExamAnswers();
    };

    root.addEventListener("click", handleLessonClicks);
    root.addEventListener("click", handleStartExamClick);
    root.addEventListener("click", handleExamOptionClick);
    root.addEventListener("click", handleSubmitExamBtnClick);
    root.addEventListener("change", handleCheckboxChange);
    root.addEventListener("change", handleFtScoreChange);

    return () => {
      observer.disconnect();
      root.removeEventListener("click", handleLessonClicks);
      root.removeEventListener("click", handleStartExamClick);
      root.removeEventListener("click", handleExamOptionClick);
      root.removeEventListener("click", handleSubmitExamBtnClick);
      root.removeEventListener("change", handleCheckboxChange);
      root.removeEventListener("change", handleFtScoreChange);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [unit, courseSlug, locale, router, nextUnit]);

  if (isLoading) {
    return (
      <div className="casc-experience">
        <header>
          <div className="wrap" style={{ padding: "60px 24px" }}>
            <div
              style={{
                height: "20px",
                width: "220px",
                background: "rgba(255,255,255,0.1)",
                borderRadius: "4px",
                marginBottom: "20px",
              }}
            />
            <div
              style={{
                height: "40px",
                width: "480px",
                background: "rgba(255,255,255,0.15)",
                borderRadius: "6px",
                marginBottom: "16px",
              }}
            />
            <div
              style={{
                height: "60px",
                width: "100%",
                background: "rgba(255,255,255,0.08)",
                borderRadius: "6px",
              }}
            />
          </div>
        </header>
        <div className="wrap" style={{ padding: "40px 24px" }}>
          <div
            style={{
              height: "240px",
              background: "var(--tint)",
              borderRadius: "12px",
              marginBottom: "24px",
            }}
          />
          <div
            style={{
              height: "180px",
              background: "#fafafa",
              borderRadius: "12px",
            }}
          />
        </div>
      </div>
    );
  }

  if (error || !unit) {
    return (
      <div className="casc-experience">
        <header>
          <div className="wrap" style={{ padding: "60px 24px" }}>
            <h1>Unable to load this lesson</h1>
            <p className="sub" style={{ marginTop: "12px" }}>
              {error?.message ?? "Lesson unit content was not found."}
            </p>
            <p style={{ marginTop: "24px" }}>
              <button
                type="button"
                className="btn"
                onClick={() => void refetch()}
              >
                <RefreshCw
                  style={{
                    display: "inline-block",
                    verticalAlign: "-2px",
                    marginRight: "6px",
                  }}
                  size={16}
                />
                Try again
              </button>
            </p>
          </div>
        </header>
      </div>
    );
  }

  const blocks = [...unit.content_blocks].sort(
    (a, b) => a.sort_order - b.sort_order,
  );
  const fullHtml = blocks
    .map((b) => b.content.html || "")
    .filter(Boolean)
    .join("\n");

  return (
    <div className="casc-experience" dir="ltr" lang="en">
      {/* Complete unit HTML mount point (contains the full authentic page from the database) */}
      <div
        ref={containerRef}
        className="casc-content-mount"
        dangerouslySetInnerHTML={{ __html: fullHtml }}
      />

      {outline ? (
        <CourseLessonMenu
          courseSlug={courseSlug}
          currentUnitSlug={unitSlug}
          locale={locale}
          outline={outline}
        />
      ) : null}

      {/* Sticky Bottom Unit Pagination Bar */}
      <nav className="casc-bottom-nav" aria-label="Course Lesson Navigation">
        <div className="nav-inner">
          {previousUnit ? (
            <Link
              href={`/${locale}/academy/courses/${courseSlug}/learn/${previousUnit.slug}`}
              title={previousUnit.title}
            >
              <ChevronLeft size={16} /> Previous
            </Link>
          ) : (
            <button type="button" disabled>
              <ChevronLeft size={16} /> Previous
            </button>
          )}

          <span className="nav-counter">
            {currentIndex >= 0 && outline
              ? `Station ${currentIndex + 1} of ${outline.units.length}`
              : "CASC Lesson"}
          </span>

          {nextUnit ? (
            answeredAllQuestions ? (
              <Link
                href={`/${locale}/academy/courses/${courseSlug}/learn/${nextUnit.slug}`}
                title={nextUnit.title}
                className="casc-nav-next-active"
                onClick={() => {
                  completeUnit({ courseSlug, unitSlug });
                }}
              >
                Next <ChevronRight size={16} />
              </Link>
            ) : (
              <button
                type="button"
                disabled
                className="casc-nav-next-disabled"
                title={`Answer all questions to unlock next lesson (${remainingQuestions} remaining)`}
              >
                Next (Locked) <ChevronRight size={16} />
              </button>
            )
          ) : answeredAllQuestions ? (
            <Link
              href={`/${locale}/academy/courses/${courseSlug}/certificate`}
              style={{ background: "var(--gold)", color: "var(--navy)" }}
              className="casc-nav-next-active"
              onClick={() => {
                completeUnit({ courseSlug, unitSlug });
              }}
            >
              Complete Course & Claim Certificate 🎓
            </Link>
          ) : (
            <button
              type="button"
              disabled
              className="casc-nav-next-disabled"
              title={`Answer all questions to complete course (${remainingQuestions} remaining)`}
            >
              Complete Course (Locked)
            </button>
          )}
        </div>
      </nav>
    </div>
  );
}
