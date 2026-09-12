import { openPackPdf } from "./packPdfGenerator";

export interface ExamQuestion {
  stem: string;
  opts: string[];
  ok: number;
  why: string;
  crit?: boolean;
  critName?: string;
}

export const STATION_7_2_EXAM: ExamQuestion[] = [
  {
    stem: "1 · “Which of you geniuses signed this?” The letter is shaking in his hand. What does your first minute do?",
    opts: [
      "Receive him — the readmission and the silent phone named back accurately, his fear legitimised, and the worry invited before anything else.",
      "Answer the question — he asked who signed it: own it or find out, because dodging the direct question reads as the ward closing ranks.",
      "Reframe the room — the priority this morning is Noreen’s treatment, not the discharge post-mortem; steer to her plan and revisit the rest.",
    ],
    ok: 0,
    why: "The receiving, unchanged from Darren’s room: his story named back accurately — his wife home ten days, back overnight, and a promised call that never came — the fear legitimised, and the question asked: what’s worrying you most? The signature hunt is a trap in both directions: naming a colleague feeds the search for a culprit, and ‘I’ll find out who’ makes the station about the ward’s org chart. And the reframe to Noreen’s treatment, though it sounds clinical, tells a terrified husband his ten days of watching her sink don’t merit a minute. The plan will land later — on a man who was heard first.",
  },
  {
    stem: "2 · “Shipped her out to free up a bed.” Untrue — the discharge was planned and she agreed to it. When does that get corrected?",
    crit: true,
    critName: "the fear, heard before the facts",
    opts: [
      "After he is heard — the person first; then the record corrected gently, once, as information he deserves rather than a point scored.",
      "Now, softly — the bed-pressure claim is the poison in the well: named as untrue immediately, kindly, before it hardens into his story.",
      "Effectively never — he needs an ally, not an editor; the bed claim changes nothing today, so let it stand and work on what matters.",
    ],
    ok: 0,
    why: "The fear, heard before the facts — the critical sequencing, transferred whole. The correction is identical either way; fired now it is a rebuttal from the institution that didn’t ring, and he re-arms. Offered after he’s been heard — after the true fault has been owned — it arrives as honesty from a doctor who has already proved they’re not defending anything. And letting it stand is not kindness: a man who goes on believing his wife was ejected for a bed will fight every future discharge this ward ever proposes. Person first; facts after; both, always.",
  },
  {
    stem: "3 · Quieter, suddenly: “I sat opposite her every night. Every night — and I didn’t see it coming back. What kind of husband misses that?” What does the next minute do?",
    opts: [
      "Receive it and answer it honestly — relapse can be invisible from the sofa; his watching was love, not failure — and connect it to today’s fury.",
      "Reassure it away — he mustn’t blame himself, nobody could have known, these things happen: absolution given quickly so the guilt can’t settle.",
      "Note it and refocus — his guilt is understandable and worth naming, but the clinical priority now is Noreen’s readmission plan, not his feelings.",
    ],
    ok: 0,
    why: "The fear underneath, surfaced — this station’s Neil. It gets received fully, answered honestly — relapse often shows nothing from the sofa; the medication stopped quietly, and quietly is how it goes — and then connected out loud: this is why the letter is shaking, why the missed call is unbearable — because the ward’s silence and his own ‘missing it’ have fused into one guilt. The quick absolution — ‘nobody could have known’ — is hollow and he’ll hear it; worse, it’s not quite true, and he knows that too. And ‘refocus on the plan’ sets down the key he just handed you. Honour it, connect it, then move — in that order.",
  },
  {
    stem: "4 · The forty-eight-hour call. It was promised in writing, and it never happened. What does the station do with it?",
    crit: true,
    critName: "the true fault, owned precisely",
    opts: [
      "Own it precisely — the missed call named as the ward’s failure, apologised for unhedged, with exactly what changes and how it’s being reported.",
      "Contextualise it — acknowledged sincerely, alongside honesty about staffing pressure and call volumes, so the apology is realistic, not theatrical.",
      "Broaden it — the whole discharge clearly failed this family; apologise for all of it generously, since parsing which parts were proper feels cold.",
    ],
    ok: 0,
    why: "The true fault, owned precisely — and this one is documented, in his hand, in writing. It gets the full treatment: named specifically — the letter promised a call within forty-eight hours and we did not make it — owned without a comma-but, apologised for as a failure and not a feeling, and paired with consequence: it goes through the incident system, and here is what changes. ‘Context’ about staffing is the comma-but wearing a lanyard — he will hear ‘we’re sorry, but we’re busy.’ And broadening the apology to the whole discharge concedes the bed-pressure lie along with the truth — the surrender’s signature move. One fault. Fully. Alone.",
  },
  {
    stem: "5 · “She doesn’t leave this ward again until you can promise me — promise me — this never happens again.” What can honesty give him?",
    opts: [
      "What can actually be promised — the named contact, the follow-up that will happen, the plan he’ll help build — and honesty about what can’t be.",
      "The promise — he’s owed one after the letter failed him: a personal guarantee that this discharge will be different, staked on your own name.",
      "The correction — discharge timing is a clinical decision, not a negotiation; his conditions can’t bind the team, and it’s kinder to say so now.",
    ],
    ok: 0,
    why: "The hard line held warmly, in this station’s weather: no false promise — relapse cannot be promised away, and he has already watched one written promise fail — but the promisable given fully and concretely: a named person, a follow-up call he can set his watch by, his observations built into the plan, the early-warning signs shared with Noreen’s agreement. The personal guarantee feels generous and forges the next broken letter — staking your name on the unpromisable is how trust dies twice. And the correction — ‘not a negotiation’ — answers a terrified man’s plea with governance. Say what is yours to give; give all of it; and let the honesty about the rest be part of the gift.",
  },
  {
    stem: "6 · The temperature has dropped. What does Patrick leave the relatives’ room holding?",
    crit: true,
    critName: "the relative, brought inside",
    opts: [
      "A role and a route — carer’s assessment offered, his observations in the plan, discharge planning with him in the room, and a number that answers.",
      "Reassurance and respect — the apology made, the record corrected, and space to visit Noreen; pressing plans on him this morning would be too much.",
      "The formal path — help with the complaint he clearly wants to make, honestly supported, so the failure is investigated properly and he feels heard.",
    ],
    ok: 0,
    why: "The relative, brought inside — the conversion that is this construct’s whole point. Patrick was the early-warning system that had no phone number to ring: so he leaves with a role — his sofa-level observations formally in the plan, the signs worth ringing about agreed with Noreen’s consent, discharge planning with a chair for him this time — a carer’s assessment, and a number that answers. ‘Reassurance and space’ leaves him exactly where the letter left him: outside, watching, waiting for a call. And leading with the complaint route — though the route must be offered, undefensively — makes the complaint the plan. The complaint is his right. The role is his need.",
  },
  {
    stem: "7 · He has gone to sit with Noreen. What does the station owe before the ward moves on?",
    opts: [
      "The loop, both directions — the missed call into the incident system, the promises actioned today, the team briefed on the plan — and Noreen told what was shared.",
      "The record — a full, factual note of the meeting including the apology and his threats to escalate, so the trust’s position is protected if this goes formal.",
      "The gesture — the consultant asked to see Patrick personally this week: seniority’s own time is the one apology that actually convinces relatives like him.",
    ],
    ok: 0,
    why: "The loop, closed in both directions, exactly as with Darren and Libby. Toward him: the missed call actually reported — an apology with no incident form behind it is theatre — the named contact told they’re named, the follow-up booked before the promise cools, the team briefed on the plan rather than warned about the man. Toward her: Noreen told what her husband and her doctor discussed — her illness, her plan, her consent to the early-warning sharing — because the pass never builds the husband’s trust on the wife’s blind spot. The defensive note ‘protecting the trust’s position’ re-litigates the meeting it just won; the consultant gesture is fine garnish and no substitute for the phone call that happens this time.",
  },
];

export interface RawOption {
  id?: string;
  source_key?: string;
  sort_order?: number;
  option_text: string;
  is_correct?: boolean;
}

export interface RawQuestion {
  id?: string;
  source_key?: string;
  sort_order?: number;
  is_critical?: boolean;
  critical_label?: string | null;
  stem: string;
  explanation?: string | null;
  correct_option_id?: string;
  answer_options?: RawOption[];
}

export interface RawAssessment {
  id?: string;
  source_key?: string;
  duration_seconds?: number | null;
  pass_score?: number | null;
  assessment_questions?: RawQuestion[];
}

export function extractExamQuestions(
  assessments?: RawAssessment[],
): ExamQuestion[] {
  if (!assessments || !Array.isArray(assessments)) return [];
  const examAssessment = assessments.find(
    (a) => a.source_key === "exam" || a.source_key === "timed_exam",
  );
  if (!examAssessment?.assessment_questions?.length) return [];

  const sortedQuestions = [...examAssessment.assessment_questions].sort(
    (a: RawQuestion, b: RawQuestion) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
  );

  return sortedQuestions.map((q: RawQuestion) => {
    const opts = [...(q.answer_options ?? [])].sort(
      (a: RawOption, b: RawOption) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
    );
    let okIndex = opts.findIndex((o: RawOption) => o.is_correct);
    if (okIndex === -1 && q.correct_option_id) {
      okIndex = opts.findIndex((o: RawOption) => o.id === q.correct_option_id);
    }
    if (okIndex === -1) {
      // Check if source_key indicates option-X
      const match = opts.findIndex((o: RawOption) => o.source_key === "option-0");
      okIndex = match >= 0 ? match : 0;
    }

    return {
      stem: q.stem,
      opts: opts.map((o: RawOption) => o.option_text),
      ok: okIndex,
      why: q.explanation || "",
      crit: Boolean(q.is_critical),
      critName: q.critical_label || undefined,
    };
  });
}

export interface ExamEngineConfig {
  root: HTMLElement;
  questions: ExamQuestion[];
  stationTitle?: string;
  onExamComplete?: (score: number, total: number, passed: boolean) => void;
  onProgress?: () => void;
}

export function initCascInteractiveEngine({
  root,
  questions,
  stationTitle = "CASC Station",
  onExamComplete,
  onProgress,
}: ExamEngineConfig): () => void {
  let timerId: NodeJS.Timeout | null = null;
  let timeLeft = 420;
  let examAnswers: Array<number | null> = new Array(questions.length).fill(null);
  let blankOk = false;
  let firstExamScore: number | null = null;
  let examAttempts = 0;

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const x = s % 60;
    return `${m < 10 ? "0" : ""}${m}:${x < 10 ? "0" : ""}${x}`;
  };

  const switchMode = (m: "learn" | "exam") => {
    const learnPanel = root.querySelector<HTMLElement>("#learnPanel");
    const examPanel = root.querySelector<HTMLElement>("#examPanel");
    const mLearn = root.querySelector<HTMLElement>("#mLearn, .mtoggle button:first-child");
    const mExam = root.querySelector<HTMLElement>("#mExam, .mtoggle button:last-child");
    const timer = root.querySelector<HTMLElement>("#timer");

    if (learnPanel) learnPanel.style.display = m === "learn" ? "block" : "none";
    if (examPanel) examPanel.style.display = m === "exam" ? "block" : "none";
    if (mLearn) mLearn.classList.toggle("active", m === "learn");
    if (mExam) mExam.classList.toggle("active", m === "exam");
    if (timer) timer.style.display = m === "exam" ? "inline" : "none";

    if (m === "learn" && timerId) {
      clearInterval(timerId);
      timerId = null;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const activeQuestions =
    questions && questions.length > 0 ? questions : STATION_7_2_EXAM;

  const startExam = () => {
    examAnswers = new Array(activeQuestions.length).fill(null);
    timeLeft = 420;
    blankOk = false;

    // Ensure Exam Panel is visible and Learn Panel is hidden
    const learnPanel = root.querySelector<HTMLElement>("#learnPanel");
    const examPanel = root.querySelector<HTMLElement>("#examPanel");
    const mLearn = root.querySelector<HTMLElement>("#mLearn, .mtoggle button:first-child");
    const mExam = root.querySelector<HTMLElement>("#mExam, .mtoggle button:last-child");
    if (learnPanel) learnPanel.style.display = "none";
    if (examPanel) examPanel.style.display = "block";
    if (mLearn) mLearn.classList.remove("active");
    if (mExam) mExam.classList.add("active");

    const sb = root.querySelector<HTMLButtonElement>("#examSubmitRow .btn, #examSubmitRow button");
    if (sb) sb.textContent = "Submit answers";

    const examStart = root.querySelector<HTMLElement>("#examStart");
    const results = root.querySelector<HTMLElement>("#results");
    const host = root.querySelector<HTMLElement>("#examQs");
    const examSubmitRow = root.querySelector<HTMLElement>("#examSubmitRow");
    const t = root.querySelector<HTMLElement>("#timer");

    if (examStart) examStart.style.display = "none";
    if (results) results.style.display = "none";

    if (host) {
      host.innerHTML = "";
      host.style.display = "block";

      activeQuestions.forEach((q, qi) => {
        const d = document.createElement("div");
        d.className = "q";
        d.dataset.qi = String(qi);
        let h = `<h3>${q.stem}</h3>`;
        const order = [0, 1, 2];
        for (let i = order.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          const temp = order[i];
          order[i] = order[j];
          order[j] = temp;
        }
        order.forEach((oi) => {
          const isOk = oi === q.ok;
          h += `<button type="button" class="opt" data-qi="${qi}" data-oi="${oi}" ${isOk ? "data-ok" : ""}>${q.opts[oi]}</button>`;
        });
        d.innerHTML = h;
        host.appendChild(d);
      });
    }

    if (examSubmitRow) examSubmitRow.style.display = "block";

    if (t) {
      t.style.display = "inline";
      t.textContent = formatTime(timeLeft);
      t.classList.remove("warn");
    }

    // Scroll smoothly to Question 1 so the user instantly sees the questions
    setTimeout(() => {
      const firstQ = host?.querySelector(".q") || host;
      if (firstQ) {
        const rect = firstQ.getBoundingClientRect();
        const yOffset = -90;
        const targetY = rect.top + window.pageYOffset + yOffset;
        window.scrollTo({ top: Math.max(0, targetY), behavior: "smooth" });
      }
    }, 60);

    if (timerId) clearInterval(timerId);
    timerId = setInterval(() => {
      timeLeft--;
      if (t) {
        t.textContent = formatTime(timeLeft);
        if (timeLeft <= 60) t.classList.add("warn");
      }
      if (timeLeft <= 0) {
        if (timerId) clearInterval(timerId);
        timerId = null;
        submitExam();
      }
    }, 1000);
  };

  const pick = (btn: HTMLButtonElement, qi: number, oi: number) => {
    if (btn.disabled) return;
    const qDiv = btn.closest<HTMLElement>(".q, [data-qi]");
    if (!qDiv) return;

    const q = activeQuestions[qi];
    const isCorrect = Boolean(btn.hasAttribute("data-ok") || (q && oi === q.ok));

    // Record the user's answer
    examAnswers[qi] = oi;

    // Remove any previous feedback element in this question
    qDiv.querySelector(".fb")?.remove();
    const fb = document.createElement("div");

    if (isCorrect) {
      qDiv.dataset.done = "1";
      btn.classList.remove("wrong");
      btn.classList.add("correct");
      btn.classList.add("picked");

      // Disable other options in this question once correct choice is made
      qDiv.querySelectorAll<HTMLButtonElement>(".opt").forEach((o) => {
        o.disabled = true;
      });

      fb.className = "fb good";
      fb.style.display = "block";
      const rationale = q?.why ? ` ${q.why}` : " Correct decision.";
      fb.innerHTML = `<b>THE EXAMINER AGREES</b>${rationale}`;
      qDiv.appendChild(fb);
    } else {
      btn.classList.add("wrong");
      btn.disabled = true;

      fb.className = "fb bad";
      fb.style.display = "block";
      fb.innerHTML = `<b>THE EXAMINER’S VIEW</b> Not this one — try again.`;
      qDiv.appendChild(fb);
    }
  };

  const submitExam = () => {
    if (examAnswers.indexOf(null) > -1 && !blankOk && timeLeft > 0) {
      blankOk = true;
      const sb = root.querySelector<HTMLButtonElement>("#examSubmitRow .btn");
      if (sb) sb.textContent = "Some answers are blank — press again to submit anyway";
      return;
    }

    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }

    let right = 0;
    const critMiss: string[] = [];
    questions.forEach((q, qi) => {
      if (examAnswers[qi] === q.ok) {
        right++;
      } else if (q.crit) {
        critMiss.push(q.critName || `question ${qi + 1}`);
      }
    });

    const pass = right >= 5 && critMiss.length === 0;
    examAttempts++;
    if (firstExamScore === null) firstExamScore = right;

    const examQs = root.querySelector<HTMLElement>("#examQs");
    const examSubmitRow = root.querySelector<HTMLElement>("#examSubmitRow");
    const res = root.querySelector<HTMLElement>("#results");
    const scoreLine = root.querySelector<HTMLElement>("#scoreLine");
    const verdictLine = root.querySelector<HTMLElement>("#verdictLine");
    const cb = root.querySelector<HTMLElement>("#constructBox");
    const rv = root.querySelector<HTMLElement>("#examReview");

    if (examQs) examQs.style.display = "none";
    if (examSubmitRow) examSubmitRow.style.display = "none";
    if (res) res.style.display = "block";

    if (scoreLine) scoreLine.textContent = `${right} / ${questions.length}`;

    if (verdictLine) {
      let v = pass
        ? "Recognised under exam conditions — you walked the tightrope with an unfamiliar patient, under time, without help. Now produce it below, in your own words."
        : "Explored, not yet recognised. Read the analysis, return to Learn Mode, and retake in a few days — recognising the pattern on a new patient is exactly what this mode measures.";

      if (!pass && critMiss.length) {
        v += ` Critical decision missed: <b>${critMiss.join("</b>, <b>")}</b>.`;
      }
      if (examAttempts > 1 && firstExamScore !== null) {
        v += ` <span style="color:var(--grey)">(First attempt: ${firstExamScore} / ${questions.length}.)</span>`;
      }
      verdictLine.innerHTML = v;
    }

    if (cb) {
      if (!cb.dataset.origList) {
        const existingList = cb.querySelector("ul")?.innerHTML;
        if (existingList) cb.dataset.origList = existingList;
      }
      const listHtml = cb.dataset.origList || `
        <li>The fear, heard before the facts</li>
        <li>The true fault, owned precisely</li>
        <li>The relative, brought inside</li>
      `;
      cb.innerHTML = `
        <b>${pass ? "CONSTRUCTS — RECOGNISED UNDER EXAM CONDITIONS" : "CONSTRUCTS — EXPLORED, NOT YET RECOGNISED"}</b>
        <ul>${listHtml}</ul>
        ${pass ? "" : "<p style='margin-top:8px'>These mark as recognised at 5 of 7 or more with all critical decisions correct.</p>"}
      `;
    }

    if (rv) {
      rv.innerHTML = '<h3 style="font-size:19px; margin-bottom:6px">The examiner’s analysis</h3>';
      questions.forEach((q, qi) => {
        const mine = examAnswers[qi];
        const good = mine === q.ok;
        const d = document.createElement("div");
        d.className = "q";
        d.innerHTML = `
          <h3>${q.stem}</h3>
          <p class="stem">Your answer: ${mine === null ? "<em>none</em>" : `“${q.opts[mine]}”`}
          ${good ? ' — <b style="color:var(--goldd)">correct</b>' : ' — <b style="color:var(--red)">not the pass move</b>'}</p>
          <div class="fb ${good ? "good" : "bad"}" style="display:block">
            <b>${good ? "THE EXAMINER AGREES" : "THE EXAMINER’S VIEW"}</b>${q.why}
            ${good ? "" : ` The pass move: “${q.opts[q.ok]}”`}
          </div>
        `;
        rv.appendChild(d);
      });
    }

    if (onExamComplete) onExamComplete(right, questions.length, pass);
    if (onProgress) onProgress();

    if (res) {
      window.scrollTo({
        top: res.offsetTop - 80,
        behavior: "smooth",
      });
    }
  };

  const ftCheck = () => {
    const ftxt = root.querySelector<HTMLTextAreaElement>("#ftxt");
    const ftbtn = root.querySelector<HTMLButtonElement>("#ftbtn");
    const ftchecks = root.querySelector<HTMLElement>("#ftchecks");
    const text = ftxt?.value.trim() || "";

    if (text.length < 20) {
      if (ftbtn) ftbtn.textContent = "Write your answer first";
      return;
    }
    if (ftbtn) ftbtn.textContent = "Checked — score yourself below";
    if (ftchecks) ftchecks.style.display = "block";
  };

  const ftScore = () => {
    const boxes = root.querySelectorAll<HTMLInputElement>("#ftchecks input");
    let n = 0;
    boxes.forEach((b) => {
      if (b.checked) n++;
    });

    const d = root.querySelector<HTMLElement>("#ftdone");
    if (d) d.style.display = n === 4 ? "block" : "none";

    if (n === 4) {
      const cb = root.querySelector<HTMLElement>("#constructBox");
      if (cb && !root.querySelector("#ftbadge")) {
        const pd = document.createElement("p");
        pd.id = "ftbadge";
        pd.style.marginTop = "8px";
        pd.style.fontWeight = "700";
        pd.style.color = "var(--goldd)";
        pd.innerHTML = "+ Demonstrated (self-checked): the hard answer — your own words, against the principles.";
        cb.appendChild(pd);
      }
    }
  };

  const scoreRubric = (cb: HTMLInputElement) => {
    const card = cb.closest(".pcard");
    if (!card) return;
    const names: Record<string, string> = {
      fear: "meeting the fear",
      hon: "honesty",
      deal: "the deal",
      del: "delivery",
      close: "the close",
      comm: "communication skills",
      struc: "structure",
      safety: "patient safety",
    };
    const boxes = card.querySelectorAll<HTMLInputElement>("input[data-d]");
    const per: Record<string, { c: number; t: number }> = {};
    let tot = 0;
    let n = 0;

    boxes.forEach((b) => {
      const d = b.getAttribute("data-d") || "core";
      per[d] = per[d] || { c: 0, t: 0 };
      per[d].t++;
      if (b.checked) {
        per[d].c++;
        tot++;
      }
      n++;
    });

    Object.keys(per).forEach((d) => {
      const el = card.querySelector<HTMLElement>(`[data-dc="${d}"]`);
      if (el) el.textContent = `${per[d].c}/${per[d].t}`;
    });

    const scEl = card.querySelector<HTMLElement>("[data-sc]");
    if (scEl) scEl.textContent = `${tot} / ${n}`;

    const v = card.querySelector<HTMLElement>("[data-verdict]");
    if (v) {
      if (tot === 0) {
        v.textContent = "go domain by domain, not by the total.";
        return;
      }
      let weak = "";
      let ratio = 2;
      Object.keys(per).forEach((d) => {
        const r = per[d].c / per[d].t;
        if (r < ratio) {
          ratio = r;
          weak = d;
        }
      });
      if (tot === n) {
        v.textContent = "every domain covered — this is the station the examiner remembers.";
      } else {
        v.textContent = `weakest domain: ${names[weak] || weak} — start the feedback there.`;
      }
    }
  };

  // Delegated Click Handler
  const handleGlobalClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target) return;

    // 1. Mode Switcher
    const modeBtn = target.closest<HTMLButtonElement>("#mLearn, #mExam, .mtoggle button");
    if (modeBtn) {
      event.preventDefault();
      const isExam = modeBtn.id === "mExam" || modeBtn.textContent?.includes("Exam");
      switchMode(isExam ? "exam" : "learn");
      return;
    }

    // 2. Start Exam or Retake Exam
    const isStartExamBtn =
      Boolean(target.closest("#examStart button, #retakeBtn, button[onclick*='startExam'], .exambox button")) ||
      Boolean(target.closest("button")?.textContent?.toLowerCase().includes("start exam")) ||
      Boolean(target.closest("button")?.textContent?.toLowerCase().includes("retake exam"));

    if (isStartExamBtn) {
      event.preventDefault();
      startExam();
      return;
    }

    // 3. Return to Learn Mode inside Results
    const returnLearnBtn = target.closest<HTMLButtonElement>("#results .btn.ghost");
    if (returnLearnBtn && (returnLearnBtn.textContent?.includes("Learn") || returnLearnBtn.id === "mLearn")) {
      event.preventDefault();
      switchMode("learn");
      return;
    }

    // 4. Exam Option Click
    const examOpt = target.closest<HTMLButtonElement>("#examQs .opt");
    if (examOpt) {
      event.preventDefault();
      const qi = Number(examOpt.dataset.qi ?? "-1");
      const oi = Number(examOpt.dataset.oi ?? "-1");
      if (qi >= 0 && oi >= 0) {
        pick(examOpt, qi, oi);
      }
      return;
    }

    // 5. Submit Exam Answers
    const submitBtn = target.closest<HTMLButtonElement>("#examSubmitRow .btn, #examSubmitRow button, button[onclick*='submitExam']");
    if (submitBtn) {
      event.preventDefault();
      submitExam();
      return;
    }

    // 6. Produce wording check button
    const ftBtn = target.closest<HTMLButtonElement>("#ftbtn, button[onclick*='ftCheck']");
    if (ftBtn) {
      event.preventDefault();
      ftCheck();
      return;
    }

    // 7. Practice Pack Overall Judgement
    const judgOpt = target.closest<HTMLButtonElement>(".pcard .pb .opt:not([data-oi])");
    if (judgOpt) {
      event.preventDefault();
      judgOpt.parentElement?.querySelectorAll<HTMLButtonElement>(".opt").forEach((b) => {
        b.classList.remove("picked");
      });
      judgOpt.classList.add("picked");
      return;
    }

    // 8. Print Pack Cards (PDF)
    const printBtn = target.closest<HTMLButtonElement>(".printrow .btn, button[onclick*='printCard']");
    if (printBtn) {
      event.preventDefault();
      const text = printBtn.textContent?.toLowerCase() || "";
      let mode: "all" | "cand" | "role" | "obs" = "all";
      if (text.includes("candidate")) mode = "cand";
      else if (text.includes("role")) mode = "role";
      else if (text.includes("obs")) mode = "obs";

      const pdfWin = window.open("", "_blank");
      if (pdfWin) {
        pdfWin.document.write(
          `<!DOCTYPE html><html><head><title>Opening PDF...</title></head><body style="margin:0;height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#071326;color:#ffffff;text-align:center;padding:24px"><div style="width:36px;height:36px;border:3px solid rgba(255,255,255,0.2);border-top-color:#d4af37;border-radius:50%;animation:spin 0.8s linear infinite;margin-bottom:16px"></div><div style="font-size:17px;font-weight:600;margin-bottom:6px">Opening Practice Pack PDF...</div><div style="font-size:13px;color:#94a3b8">Preparing cards for mobile viewing and print mode</div><style>@keyframes spin{to{transform:rotate(360deg)}}</style></body></html>`,
        );
      }

      const originalText = printBtn.textContent;
      printBtn.textContent = "Opening PDF...";
      printBtn.style.pointerEvents = "none";

      openPackPdf(root, mode, stationTitle)
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
  };

  // Resilient Document-level Click listener for Exam Mode / Start Exam
  const handleDocumentClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target) return;

    const isStartBtn =
      Boolean(target.closest("#examStart button, #retakeBtn, button[onclick*='startExam'], .exambox button")) ||
      Boolean(target.closest("button")?.textContent?.trim().toLowerCase().startsWith("start exam"));

    if (isStartBtn) {
      event.preventDefault();
      startExam();
    }
  };

  // Delegated Change Handler (Checkboxes)
  const handleGlobalChange = (event: Event) => {
    const target = event.target as HTMLInputElement;

    // Self-score wording checkboxes
    if (target.closest("#ftchecks")) {
      ftScore();
      return;
    }

    // Observer Rubric Checkbox
    if (target.matches(".pcard table.rub input[data-d]")) {
      scoreRubric(target);
      return;
    }
  };

  // Expose global methods on window for any inline onclick handlers in injected HTML
  if (typeof window !== "undefined") {
    const win = window as unknown as Record<string, unknown>;
    win.startExam = startExam;
    win.setMode = switchMode;
    win.submitExam = submitExam;
    win.pick = pick;
    win.ftCheck = ftCheck;
    win.ftScore = ftScore;
    win.ans = (btn: HTMLButtonElement, ok: number | boolean) => {
      const isOk = Boolean(ok) || btn.hasAttribute("data-ok");
      const q = btn.closest<HTMLElement>(".q, [data-q]");
      if (!q || q.dataset.done) return;
      if (!isOk) {
        btn.classList.add("wrong");
        btn.disabled = true;
        return;
      }
      q.dataset.done = "1";
      btn.classList.add("correct");
      q.querySelectorAll<HTMLButtonElement>(".opt").forEach((b) => {
        b.disabled = true;
      });
      const fb = document.createElement("div");
      fb.className = "fb good";
      fb.innerHTML =
        q.querySelector<HTMLTemplateElement>('template[data-fb="ok"]')?.innerHTML ||
        "<b>THE EXAMINER AGREES</b> Correct decision.";
      q.appendChild(fb);
    };
    win.rev = (btn: HTMLButtonElement) => {
      const line = btn.closest(".line");
      if (line) {
        const open = line.classList.toggle("revealed");
        btn.classList.toggle("open", open);
      }
    };
    win.setTake = (btn: HTMLButtonElement) => {
      const player = btn.closest(".player");
      const take = btn.dataset.t;
      if (player && take) {
        player.querySelectorAll<HTMLButtonElement>(".toggle button").forEach((b) => {
          b.classList.toggle("active", b === btn);
        });
        player.querySelectorAll<HTMLElement>(".script").forEach((s) => {
          s.style.display = s.id === `tk-${take}` || s.id === `d-${take}` ? "block" : "none";
        });
      }
    };
  }

  root.addEventListener("click", handleGlobalClick);
  document.addEventListener("click", handleDocumentClick);
  root.addEventListener("change", handleGlobalChange);

  // Default to Learn Mode
  switchMode("learn");

  return () => {
    root.removeEventListener("click", handleGlobalClick);
    document.removeEventListener("click", handleDocumentClick);
    root.removeEventListener("change", handleGlobalChange);
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
    if (typeof window !== "undefined") {
      const win = window as unknown as Record<string, unknown>;
      delete win.startExam;
      delete win.setMode;
      delete win.submitExam;
      delete win.pick;
      delete win.ftCheck;
      delete win.ftScore;
      delete win.ans;
      delete win.rev;
      delete win.setTake;
    }
  };
}
