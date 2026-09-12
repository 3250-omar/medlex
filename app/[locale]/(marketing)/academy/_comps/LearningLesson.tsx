"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import {
  useCourseOutline,
  useLearningUnit,
  type AssessmentQuestion,
} from "../_apiCalls/learningQueries";
import { useCompleteUnit, useOpenUnit } from "../../_apiCalls/academyQueries";
import { openPackPdf } from "./packPdfGenerator";
import {
  initCascInteractiveEngine,
  extractExamQuestions,
} from "./cascExamEngine";
import "./cascEditorial.css";

const STATION_CODE_TO_SLUG: Record<string, string> = {
  // Domain 1: Communication & Rapport
  "1.1": "station-1.1-the-simple-station",
  "1.2": "station-1.2-nothing-is-wrong",
  "1.3": "station-1.3-working-through-an-interpreter",
  "1.4": "station-1.4-medically-unexplained-symptoms",
  // Domain 2: Information Giving
  "2.1": "station-2.1-starting-lithium",
  "2.2": "station-2.2-the-clozapine-conversation",
  "2.3": "station-2.3-explaining-schizophrenia",
  "2.4": "station-2.4-ect-explained",
  "2.5": "station-2.5-antidepressants-in-pregnancy",
  "2.6": "station-2.6-panic-disorder-and-explaining-cbt",
  // Domain 3: Risk Assessment
  "3.1": "station-3.1-after-an-overdose",
  "3.2": "station-3.2-the-violent-inpatient",
  "3.3": "station-3.3-domestic-abuse-enquiry",
  "3.4": "station-3.4-child-at-risk",
  "3.5": "station-3.5-the-vulnerable-adult",
  "3.6": "station-3.6-fire-setting",
  "3.7": "station-3.7-stalking-and-erotomania",
  // Domain 4: Mental State & Phenomenology
  "4.1": "station-4.1-hearing-voices",
  "4.2": "station-4.2-elated-and-spending",
  "4.3": "station-4.3-confused-on-the-ward",
  "4.4": "station-4.4-the-memory-clinic",
  "4.5": "station-4.5-obsessions-and-rituals",
  "4.6": "station-4.6-low-weight",
  "4.7": "station-4.7-adult-adhd-assessment",
  "4.8": "station-4.8-autism-assessment-in-an-adult",
  "4.9": "station-4.9-ptsd-assessment",
  "4.10": "station-4.10-alcohol-dependence-assessment",
  "4.11": "station-4.11-behavioural-change-in-learning-disability",
  // Domain 5: Capacity, Consent & the Law
  "5.1": "station-5.1-refusing-treatment",
  "5.2": "station-5.2-im-leaving",
  "5.3": "station-5.3-the-relative-who-wants-everything",
  "5.4": "station-5.4-sectioned",
  // Domain 6: Management & the Psychiatric Emergency
  "6.1": "station-6.1-the-agitated-patient",
  "6.2": "station-6.2-lithium-toxicity-call",
  "6.3": "station-6.3-postpartum-psychosis",
  "6.4": "station-6.4-the-overdose-handover",
  // Domain 7: Difficult Conversations, Families & the MDT
  "7.1": "station-7.1-the-patient-who-wont-take-no",
  "7.2": "station-7.2-the-angry-father",
  "7.3": "station-7.3-breaking-bad-news",
  "7.4": "station-7.4-the-complaint-and-the-apology",
  // Domain 8: Physical Examination
  "8.1": "station-8.1-epse-examination",
  "8.2": "station-8.2-cardiovascular-baseline",
  "8.3": "station-8.3-cranial-nerve-examination",
};

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
  const [canProceed, setCanProceed] = useState(false);
  const [remainingQuestions, setRemainingQuestions] = useState(0);
  const examResultRef = useRef<{ score: number; total: number } | null>(null);

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
      "footer:not(.casc-experience footer)",
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

    // Tag question sections for distinctive backdrop
    root.querySelectorAll<HTMLElement>("section").forEach((sec) => {
      if (sec.querySelector("[data-q], .q")) {
        sec.classList.add("casc-questions-section");
      }
    });

    // 1. Shuffling Learn Mode quiz options once & tagging alternating sequence
    root.querySelectorAll<HTMLElement>("[data-q]").forEach((q, idx) => {
      q.dataset.qi = String(idx);
      q.classList.add(idx % 2 === 0 ? "q-odd" : "q-even");
      q.dataset.seq = idx % 2 === 0 ? "odd" : "even";
      q.dataset.qnum = String(idx + 1);
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
    const checkUnlockStatus = (
      currentExamScore?: number | null,
      currentExamTotal?: number | null,
    ) => {
      const allQuestions = Array.from(
        root.querySelectorAll<HTMLElement>(
          "[data-q], #learnPanel .q, section .q",
        ),
      ).filter((q) => !q.closest("#examQs"));
      const total = allQuestions.length;
      const done = allQuestions.filter((q) => q.dataset.done === "1").length;
      const remaining = Math.max(0, total - done);
      const isComplete = total === 0 || remaining === 0;

      const examResult =
        currentExamScore !== undefined && currentExamTotal !== undefined
          ? currentExamScore !== null && currentExamTotal !== null
            ? { score: currentExamScore, total: currentExamTotal }
            : null
          : examResultRef.current;

      const passedExam =
        examResult !== null && examResult.total > 0
          ? examResult.score > examResult.total * 0.5
          : false;

      const unlocked = isComplete || passedExam;

      setRemainingQuestions(remaining);
      setAnsweredAllQuestions(isComplete);
      setCanProceed(unlocked);

      const nextSlug = nextUnit?.slug;
      const nextUrl = nextSlug
        ? `/${locale}/academy/courses/${courseSlug}/learn/${nextSlug}`
        : `/${locale}/academy/courses/${courseSlug}/completion`;

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

        if (unlocked) {
          doneBtn.classList.remove("casc-btn-locked");
          doneBtn.classList.add("casc-btn-unlocked");
          doneBtn.removeAttribute("aria-disabled");
          doneBtn.removeAttribute("data-locked-tooltip");
          hintEl.className = "casc-lock-hint unlocked";
          hintEl.textContent = passedExam
            ? `✓ Exam passed with score ${examResult?.score}/${examResult?.total} (> 50%). You can continue to the next lesson.`
            : "✓ All decisions completed. You can continue to the next lesson.";
        } else {
          doneBtn.classList.add("casc-btn-locked");
          doneBtn.classList.remove("casc-btn-unlocked");
          doneBtn.setAttribute("aria-disabled", "true");
          doneBtn.setAttribute(
            "data-locked-tooltip",
            `Please complete the questions (${remaining} remaining) or score > 50% in Exam Mode`,
          );
          hintEl.className = "casc-lock-hint";
          hintEl.textContent = `Answer all ${remaining} decision${
            remaining > 1 ? "s" : ""
          } or score > 50% in Exam Mode to unlock this next step.`;
        }
      }

      const examNextBtn = root.querySelector<HTMLAnchorElement>("#examNextBtn");
      if (examNextBtn) {
        examNextBtn.setAttribute("href", nextUrl);
      }
    };

    checkUnlockStatus();

    // Ensure Practice Pack has casc-packs-section class and printrow exists in all 43 stations
    const packsEl = root.querySelector<HTMLElement>("#packs, .pack");
    if (packsEl) {
      const section = packsEl.closest("section");
      if (section) section.classList.add("casc-packs-section");

      let printRow = section
        ? section.querySelector<HTMLElement>(".printrow")
        : root.querySelector<HTMLElement>(".printrow");

      if (!printRow) {
        printRow = document.createElement("div");
        printRow.className = "printrow";
        printRow.innerHTML = `
          <button type="button" class="btn ghost">Print all cards</button>
          <button type="button" class="btn ghost">Candidate only</button>
          <button type="button" class="btn ghost">Role-player only</button>
          <button type="button" class="btn ghost">Observer only</button>
        `;
        if (packsEl.nextElementSibling) {
          packsEl.parentElement?.insertBefore(
            printRow,
            packsEl.nextElementSibling,
          );
        } else {
          packsEl.parentElement?.appendChild(printRow);
        }
      }
    }

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

      // D. Learn Mode Decision Option (.opt inside [data-q])
      const learnOpt = target.closest<HTMLButtonElement>("[data-q] .opt");
      if (learnOpt && !learnOpt.disabled && !learnOpt.closest("#examQs")) {
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

      // F. Print Pack Cards (.printrow .btn) -> Open PDF with native print mode
      const printBtn = target.closest<HTMLButtonElement>(".printrow .btn");
      if (printBtn) {
        event.preventDefault();
        const text = printBtn.textContent?.toLowerCase() || "";
        let mode: "all" | "cand" | "role" | "obs" = "all";
        if (text.includes("candidate")) mode = "cand";
        else if (text.includes("role")) mode = "role";
        else if (text.includes("obs")) mode = "obs";

        // Open window synchronously on user gesture to avoid popup blockers
        const pdfWin = window.open("", "_blank");
        if (pdfWin) {
          pdfWin.document.write(
            `<!DOCTYPE html><html><head><title>Opening PDF...</title></head><body style="margin:0;height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#071326;color:#ffffff;text-align:center;padding:24px"><div style="width:36px;height:36px;border:3px solid rgba(255,255,255,0.2);border-top-color:#d4af37;border-radius:50%;animation:spin 0.8s linear infinite;margin-bottom:16px"></div><div style="font-size:17px;font-weight:600;margin-bottom:6px">Opening Practice Pack PDF...</div><div style="font-size:13px;color:#94a3b8">Preparing cards for mobile viewing and print mode</div><style>@keyframes spin{to{transform:rotate(360deg)}}</style></body></html>`,
          );
        }

        const originalText = printBtn.textContent;
        printBtn.textContent = "Opening PDF...";
        printBtn.style.pointerEvents = "none";

        openPackPdf(root, mode, unit?.title || "CASC Station")
          .then((blobUrl) => {
            if (pdfWin && !pdfWin.closed) {
              pdfWin.location.href = blobUrl;
            } else {
              const a = document.createElement("a");
              a.href = blobUrl;
              a.target = "_blank";
              a.rel = "noopener noreferrer";
              document.body.appendChild(a);
              a.click();
              a.remove();
            }
          })
          .catch((err) => {
            console.error("Failed to generate PDF:", err);
            if (pdfWin) pdfWin.close();
          })
          .finally(() => {
            printBtn.textContent = originalText;
            printBtn.style.pointerEvents = "";
          });
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

      // H2. Exam Mode Results Next button (#examNextBtn)
      const examNextLink = target.closest<HTMLAnchorElement>("#examNextBtn");
      if (examNextLink) {
        event.preventDefault();
        acts.finish = 1;
        updateProgress();
        completeUnit({ courseSlug, unitSlug });
        const destUrl = examNextLink.getAttribute("href");
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
            .replace(/^(?:\d{2}_|casc_academy_\d+_)/i, "")
            .toLowerCase()
            .replace(/_/g, "-");
          router.push(`/${locale}/academy/courses/${courseSlug}/learn/${slug}`);
          return;
        }
      }
      const srow = target.closest<HTMLElement>(".srow");
      if (srow && !target.closest("a")) {
        event.preventDefault();

        // 1. Check onclick attribute if present (e.g. from static templates)
        const onclickAttr = srow.getAttribute("onclick") || "";
        const match = onclickAttr.match(
          /['"](\d{2}_[^.]+|[a-zA-Z0-9_-]+)\.html['"]/,
        );
        if (match) {
          const slug = match[1]
            .replace(/^(?:\d{2}_|casc_academy_\d+_)/i, "")
            .toLowerCase()
            .replace(/_/g, "-");
          router.push(`/${locale}/academy/courses/${courseSlug}/learn/${slug}`);
          return;
        }

        // 2. Extract station number from .num (e.g. "2.1", "1.1", "3.4")
        const numText = srow.querySelector(".num")?.textContent?.trim();
        if (numText) {
          const matchedUnit =
            outline?.units.find((u) => u.unitCode === numText) ||
            outline?.units.find((u) =>
              u.slug.startsWith(`station-${numText}-`),
            );

          const targetSlug = matchedUnit?.slug || STATION_CODE_TO_SLUG[numText];
          if (targetSlug) {
            router.push(
              `/${locale}/academy/courses/${courseSlug}/learn/${targetSlug}`,
            );
            return;
          }
        }

        // 3. Fallback: match by station title from .t b
        const titleText = srow.querySelector(".t b")?.textContent?.trim();
        if (titleText && outline?.units) {
          const cleanTitle = titleText.toLowerCase().replace(/[^a-z0-9]/g, "");
          const matchedByTitle = outline.units.find((u) => {
            const uTitle = u.title.toLowerCase().replace(/[^a-z0-9]/g, "");
            return uTitle.includes(cleanTitle) || cleanTitle.includes(uTitle);
          });
          if (matchedByTitle) {
            router.push(
              `/${locale}/academy/courses/${courseSlug}/learn/${matchedByTitle.slug}`,
            );
            return;
          }
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

    // Mark station rows in domain hubs as accessible links
    root.querySelectorAll<HTMLElement>(".srow").forEach((srow) => {
      srow.setAttribute("role", "button");
      srow.setAttribute("tabindex", "0");
      const numText = srow.querySelector(".num")?.textContent?.trim();
      const titleText = srow.querySelector(".t b")?.textContent?.trim();
      if (numText) {
        srow.setAttribute(
          "aria-label",
          `Go to Station ${numText}${titleText ? `: ${titleText}` : ""}`,
        );
      }
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") {
        const target = event.target as HTMLElement;
        const srow = target.closest<HTMLElement>(".srow");
        if (srow) {
          event.preventDefault();
          const numText = srow.querySelector(".num")?.textContent?.trim();
          if (numText) {
            const matchedUnit =
              outline?.units.find((u) => u.unitCode === numText) ||
              outline?.units.find((u) =>
                u.slug.startsWith(`station-${numText}-`),
              );
            const targetSlug =
              matchedUnit?.slug || STATION_CODE_TO_SLUG[numText];
            if (targetSlug) {
              router.push(
                `/${locale}/academy/courses/${courseSlug}/learn/${targetSlug}`,
              );
            }
          }
        }
      }
    };

    root.addEventListener("click", handleLessonClicks);
    root.addEventListener("keydown", handleKeyDown);
    root.addEventListener("change", handleCheckboxChange);
    root.addEventListener("change", handleFtScoreChange);

    // Initialise full interactive Exam Engine + Practice Pack PDF generator
    const extractedQuestions = extractExamQuestions(unit.assessments);
    const cleanupExamEngine = initCascInteractiveEngine({
      root,
      questions: extractedQuestions,
      stationTitle: unit.title || "CASC Station",
      onExamComplete: (score: number, total: number) => {
        acts.exam = 1;
        examResultRef.current = { score, total };
        updateProgress();
        checkUnlockStatus(score, total);
        if (total > 0 && score > total * 0.5) {
          completeUnit({ courseSlug, unitSlug });
        }
      },
      onProgress: updateProgress,
    });

    return () => {
      observer.disconnect();
      root.removeEventListener("click", handleLessonClicks);
      root.removeEventListener("keydown", handleKeyDown);
      root.removeEventListener("change", handleCheckboxChange);
      root.removeEventListener("change", handleFtScoreChange);
      cleanupExamEngine();
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      document.body.classList.remove("pr-cand", "pr-role", "pr-obs", "pr-all");
    };
  }, [unit, courseSlug, locale, router, nextUnit, outline]);

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
              background: "var(--navy)",
              border: "1px solid var(--hair)",
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

  const scrollToFirstUnanswered = () => {
    const root = containerRef.current;
    if (!root) return;
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
  };

  return (
    <div className="casc-experience" dir="ltr" lang="en">
      {/* Complete unit HTML mount point (contains the full authentic page from the database) */}
      <div
        ref={containerRef}
        className="casc-content-mount"
        dangerouslySetInnerHTML={{ __html: fullHtml }}
      />

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
            canProceed ? (
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
              <div
                className="casc-locked-tooltip-wrap"
                onClick={scrollToFirstUnanswered}
              >
                <button
                  type="button"
                  disabled
                  className="casc-nav-next-disabled"
                >
                  Next (Locked) <ChevronRight size={16} />
                </button>
                <span className="casc-tooltip-popup" role="tooltip">
                  Please complete the questions
                  {remainingQuestions > 0
                    ? ` (${remainingQuestions} remaining)`
                    : ""}{" "}
                  or score &gt; 50% in Exam Mode
                </span>
              </div>
            )
          ) : canProceed ? (
            <Link
              href={`/${locale}/academy/courses/${courseSlug}/completion`}
              style={{ background: "var(--gold)", color: "var(--navy)" }}
              className="casc-nav-next-active"
              onClick={() => {
                completeUnit({ courseSlug, unitSlug });
              }}
            >
              Complete Course & Continue
            </Link>
          ) : (
            <div
              className="casc-locked-tooltip-wrap"
              onClick={scrollToFirstUnanswered}
            >
              <button type="button" disabled className="casc-nav-next-disabled">
                Complete Course (Locked)
              </button>
              <span className="casc-tooltip-popup" role="tooltip">
                Please complete the questions
                {remainingQuestions > 0
                  ? ` (${remainingQuestions} remaining)`
                  : ""}{" "}
                or score &gt; 50% in Exam Mode
              </span>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}
