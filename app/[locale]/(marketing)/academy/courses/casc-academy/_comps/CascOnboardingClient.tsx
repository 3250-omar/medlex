"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Check,
  Download,
  AlertCircle,
  Play,
  RotateCcw,
  Clock,
} from "lucide-react";

type Props = {
  locale: string;
  continueSlug: string;
  firstUnitSlug: string;
};

type DecisionOption = {
  id: string;
  text: string;
  isOk: boolean;
};

const INITIAL_OPTIONS: DecisionOption[] = [
  {
    id: "facts",
    text: "Establish the facts — correct the misunderstandings early and calmly.",
    isOk: false,
  },
  {
    id: "receive",
    text: "Receive the man — take the anger as information and invite the worry before explaining anything.",
    isOk: true,
  },
  {
    id: "terms",
    text: "Set the terms — the meeting can happen, but only once he is seated and civil.",
    isOk: false,
  },
];

export default function CascOnboardingClient({
  locale,
  continueSlug,
  firstUnitSlug,
}: Props) {
  const router = useRouter();
  const isAr = locale === "ar";

  // Hide marketing footer on this focused onboarding page (matching lesson experience)
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

  // Step 2 interactive take selection
  const [selectedTake, setSelectedTake] = useState<number>(2); // Default to "The Pass"

  // Step 3 gold circle examiner thought reveal
  const [showExaminerThought, setShowExaminerThought] = useState(false);

  // Step 4 Decision point quiz state
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  // Step 5 Mode switcher & live timer
  const [isExamMode, setIsExamMode] = useState(false);
  const [examSeconds, setExamSeconds] = useState(420); // 7 minutes

  useEffect(() => {
    if (!isExamMode) return;

    const interval = setInterval(() => {
      setExamSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isExamMode]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  // Mark onboarding as seen and navigate
  const markAsSeen = () => {
    try {
      document.cookie =
        "casc_onboarding_seen=1; path=/; max-age=31536000; SameSite=Lax";
      localStorage.setItem("casc_onboarding_seen", "1");
    } catch {
      // Ignore storage errors in restricted iframe/browser modes
    }
  };

  const handleUnderstood = () => {
    markAsSeen();
    router.push(
      `/${locale}/academy/courses/casc-academy/learn/${firstUnitSlug}`,
    );
    router.refresh();
  };

  const handleSkip = () => {
    markAsSeen();
    const target = continueSlug || firstUnitSlug;
    router.push(`/${locale}/academy/courses/casc-academy/learn/${target}`);
    router.refresh();
  };

  const handleOpenWorkbook = () => {
    window.open(
      "/gifts/Twelve%20Weeks%20to%20the%20CASC.pdf",
      "_blank",
      "noopener,noreferrer",
    );
  };

  const selectedOpt = INITIAL_OPTIONS.find((o) => o.id === selectedOptionId);

  return (
    <div
      className="min-h-screen bg-fd-paper! text-fd-body! font-sans selection:bg-fd-gold-pale! selection:text-fd-navy!"
      dir="ltr"
      lang="en"
    >
      {/* ── STICKY ONBOARDING NAV ── */}

      {/* ── HERO ── */}
      <section className="bg-fd-parchment! border-b border-fd-stone! pt-12 pb-11 px-6">
        <div className="max-w-[920px] mx-auto">
          <div className="text-[12.5px] tracking-[0.14em] font-bold text-fd-gold! uppercase mb-3">
            {isAr ? "ابدأ هنا · مقدمة سريعة" : "START HERE"}
          </div>
          <h1 className="font-serif text-[30px] sm:text-[38px] md:text-[42px] font-medium text-fd-navy! leading-[1.12] max-w-[24ch]">
            Six minutes now will save you six hours later.
          </h1>
          <p className="mt-4 text-[16.5px] sm:text-[17.5px] leading-relaxed text-fd-body! max-w-[66ch]">
            The Academy has more inside it than is obvious at first glance. This
            page shows you every part of a station, in the order you will use
            them — and the four things candidates most often miss.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 bg-fd-navy! text-white text-[13px] font-semibold px-3.5 py-1.5 rounded shadow-xs">
              <Clock size={14} className="text-fd-gold-soft!" />
              <span>Read time: 6 minutes · try each part as you go</span>
            </div>
            <button
              type="button"
              onClick={handleSkip}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-fd-navy! hover:text-fd-navy-deep! bg-white/90 hover:bg-white border border-fd-stone! px-3.5 py-1.5 rounded cursor-pointer transition-all shadow-xs"
            >
              <span>
                {isAr ? "تخطي والذهاب للدرس مباشرة" : "Skip directly to course"}
              </span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </section>

      {/* ── MAIN STEPS ── */}
      <div className="max-w-[920px] mx-auto px-6 py-12 sm:py-14 divide-y divide-fd-stone!">
        {/* STEP 1 */}
        <section className="pb-10 sm:pb-12">
          <div className="grid grid-cols-1 sm:grid-cols-[52px_1fr] gap-4 sm:gap-6">
            <div className="font-serif text-[38px] sm:text-[42px] font-normal text-fd-gold! leading-[0.9]">
              1
            </div>
            <div>
              <h2 className="font-serif text-2xl sm:text-[25px] font-medium text-fd-navy! mb-2.5">
                A station is one hour, not one page
              </h2>
              <p className="text-[16px] sm:text-[16.5px] leading-relaxed text-fd-body! max-w-[66ch]">
                Each station is a complete learning module. Work it properly
                once in{" "}
                <strong className="text-fd-navy! font-semibold">
                  Learn Mode
                </strong>{" "}
                — about 45 minutes — then sit{" "}
                <strong className="text-fd-navy! font-semibold">
                  Exam Mode
                </strong>{" "}
                on a fresh case in 7 minutes. Do not read a station like an
                article. You are meant to stop, choose, and be wrong.
              </p>
              <p className="mt-2.5 text-[16px] sm:text-[16.5px] leading-relaxed text-fd-body! max-w-[66ch]">
                Forty-three stations at 45 minutes is roughly 32 hours of work.
                The workbook tells you how to spread it across the weeks you
                have.
              </p>
            </div>
          </div>
        </section>

        {/* STEP 2 */}
        <section className="py-10 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-[52px_1fr] gap-4 sm:gap-6">
            <div className="font-serif text-[38px] sm:text-[42px] font-normal text-fd-gold! leading-[0.9]">
              2
            </div>
            <div>
              <h2 className="font-serif text-2xl sm:text-[25px] font-medium text-fd-navy! mb-2.5">
                Every station is shown three times
              </h2>
              <p className="text-[16px] sm:text-[16.5px] leading-relaxed text-fd-body! max-w-[66ch]">
                The same seven minutes, failed two ways and passed once. The
                first failure is the obvious one.{" "}
                <strong className="text-fd-navy! font-semibold">
                  The second is the kind, reasonable failure
                </strong>{" "}
                — and it is the one most candidates recognise themselves in.
                Read all three, in order. Skipping to the pass is the single
                most common mistake.
              </p>

              {/* Step 2 Interactive Box */}
              <div className="bg-white border border-fd-stone! border-l-4 border-l-fd-gold! rounded-md p-5 sm:p-6 my-6 shadow-xs">
                <div className="text-[11.5px] tracking-[0.12em] font-bold text-fd-gold! uppercase mb-3.5">
                  TRY IT — TAP EACH TAB IN A STATION
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Take 1 */}
                  <button
                    type="button"
                    onClick={() => setSelectedTake(0)}
                    className={`text-left p-3.5 sm:p-4 rounded-md bg-fd-parchment! border border-fd-stone! border-t-[3px] border-t-[#C96E6E] transition-all cursor-pointer ${
                      selectedTake === 0
                        ? "ring-2 ring-[#C96E6E] bg-white shadow-xs"
                        : "hover:bg-fd-paper!"
                    }`}
                  >
                    <b className="block text-[11.5px] tracking-[0.08em] uppercase text-fd-muted! mb-1.5">
                      FAIL 1 — THE DEFENCE
                    </b>
                    <span className="text-[13.5px] text-fd-body! leading-snug block">
                      Every fact correct, the fear underneath never found.
                    </span>
                  </button>

                  {/* Take 2 */}
                  <button
                    type="button"
                    onClick={() => setSelectedTake(1)}
                    className={`text-left p-3.5 sm:p-4 rounded-md bg-fd-parchment! border border-fd-stone! border-t-[3px] border-t-[#C96E6E] transition-all cursor-pointer ${
                      selectedTake === 1
                        ? "ring-2 ring-[#C96E6E] bg-white shadow-xs"
                        : "hover:bg-fd-paper!"
                    }`}
                  >
                    <b className="block text-[11.5px] tracking-[0.08em] uppercase text-fd-muted! mb-1.5">
                      FAIL 2 — THE SURRENDER
                    </b>
                    <span className="text-[13.5px] text-fd-body! leading-snug block">
                      Sounds like good practice. Look at what was given away.
                    </span>
                  </button>

                  {/* Take 3 (Pass) */}
                  <button
                    type="button"
                    onClick={() => setSelectedTake(2)}
                    className={`text-left p-3.5 sm:p-4 rounded-md bg-fd-parchment! border border-fd-stone! border-t-[3px] border-t-fd-gold! transition-all cursor-pointer ${
                      selectedTake === 2
                        ? "ring-2 ring-fd-gold! bg-white shadow-xs"
                        : "hover:bg-fd-paper!"
                    }`}
                  >
                    <b className="block text-[11.5px] tracking-[0.08em] uppercase text-fd-gold! mb-1.5">
                      THE PASS
                    </b>
                    <span className="text-[13.5px] text-fd-body! leading-snug block">
                      The same minutes, done in the order that works.
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STEP 3 */}
        <section className="py-10 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-[52px_1fr] gap-4 sm:gap-6">
            <div className="font-serif text-[38px] sm:text-[42px] font-normal text-gold! leading-[0.9]">
              3
            </div>
            <div>
              <h2 className="font-serif text-2xl sm:text-[25px] font-medium text-fd-navy! mb-2.5">
                The gold circles are the course
              </h2>
              <p className="text-[16px] sm:text-[16.5px] leading-relaxed text-fd-body! max-w-[66ch]">
                Beside many lines there is a small gold circle. Tap it and you
                read{" "}
                <strong className="text-fd-navy! font-semibold">
                  what the examiner is thinking at that moment
                </strong>{" "}
                — why the mark is being won or lost, as it happens. This is the
                part of the Academy that exists nowhere else, and it is the part
                people scroll past.
              </p>
              <p className="mt-2.5 text-[16px] sm:text-[16.5px] leading-relaxed text-fd-body! max-w-[66ch]">
                Open every circle in every station. If you read nothing else
                twice, read these.
              </p>

              {/* Step 3 Interactive Box */}
              <div className="bg-white border border-fd-stone! border-l-4 border-l-fd-gold! rounded-md p-5 sm:p-6 my-6 shadow-xs">
                <div className="text-[11.5px] tracking-[0.12em] font-bold text-fd-gold! uppercase mb-3.5">
                  TRY IT — TAP THE GOLD CIRCLE
                </div>
                <div className="grid grid-cols-[84px_1fr_34px] sm:grid-cols-[90px_1fr_34px] gap-3.5 items-start bg-fd-parchment! rounded-md p-3.5 sm:p-4 text-[15px] border border-fd-stone!">
                  <span className="text-[11.5px] tracking-[0.08em] font-bold text-fd-gold! pt-1">
                    CANDIDATE
                  </span>
                  <span className="text-fd-body! leading-relaxed italic">
                    &ldquo;Mr Boyd, I&apos;ll stop you there, because nothing
                    improper has happened. Libby was assessed as Gillick
                    competent.&rdquo;
                  </span>
                  <button
                    type="button"
                    aria-label="Toggle examiner thoughts"
                    aria-expanded={showExaminerThought}
                    onClick={() => setShowExaminerThought((prev) => !prev)}
                    className={`w-[30px] h-[30px] rounded-full border-[1.5px] font-bold text-[15px] flex items-center justify-center cursor-pointer transition-all ${
                      showExaminerThought
                        ? "bg-fd-gold! text-white border-fd-gold! ring-2 ring-fd-gold/30!"
                        : "border-fd-gold! bg-white text-fd-gold! hover:bg-fd-gold! hover:text-white"
                    }`}
                  >
                    !
                  </button>
                </div>

                {/* Expanded Thought Box */}
                {showExaminerThought && (
                  <div className="mt-3.5 bg-fd-navy! text-[#DCE1EA] rounded-md p-4 sm:p-5 text-[14.5px] border border-fd-navy-deep! animate-in fade-in slide-in-from-top-2 duration-300">
                    <b className="block text-[11px] tracking-[0.12em] text-fd-gold-soft! uppercase mb-1.5">
                      WHAT THE EXAMINER IS THINKING
                    </b>
                    <p className="leading-relaxed">
                      Six accurate facts — and the station is already lost.
                      Every word answered the anger; not one answered the man.
                      The question that opens this station is nowhere in the
                      room.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* STEP 4 */}
        <section className="py-10 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-[52px_1fr] gap-4 sm:gap-6">
            <div className="font-serif text-[38px] sm:text-[42px] font-normal text-fd-gold! leading-[0.9]">
              4
            </div>
            <div>
              <h2 className="font-serif text-2xl sm:text-[25px] font-medium text-fd-navy! mb-2.5">
                Then you are in the chair
              </h2>
              <p className="text-[16px] sm:text-[16.5px] leading-relaxed text-fd-body! max-w-[66ch]">
                Seven decision points per station. Choose, read the
                examiner&apos;s response, and try again until you find the move
                that works.{" "}
                <strong className="text-fd-navy! font-semibold">
                  Getting it wrong is the point
                </strong>{" "}
                — every wrong option has its own feedback explaining why it
                fails, and that is where the learning is. Do not guess and move
                on.
              </p>

              {/* Step 4 Interactive Box */}
              <div className="bg-white border border-fd-stone! border-l-4 border-l-fd-gold! rounded-md p-5 sm:p-6 my-6 shadow-xs">
                <div className="text-[11.5px] tracking-[0.12em] font-bold text-fd-gold! uppercase mb-3.5">
                  TRY IT — CHOOSE AN ANSWER
                </div>
                <div>
                  <h3 className="font-serif text-[17px] font-medium text-fd-navy! mb-3">
                    The opening ten seconds. What does your first minute do?
                  </h3>
                  <div className="space-y-2">
                    {INITIAL_OPTIONS.map((opt) => {
                      const isSelected = selectedOptionId === opt.id;
                      let btnStyle =
                        "border-fd-stone! bg-fd-paper! text-fd-body! hover:border-fd-gold!";
                      if (isSelected) {
                        btnStyle = opt.isOk
                          ? "border-fd-gold! bg-fd-gold-pale! text-fd-navy! font-medium ring-1 ring-fd-gold!"
                          : "border-[#C96E6E] bg-[#FBF3F3] text-[#8a3333] ring-1 ring-[#C96E6E]";
                      }

                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setSelectedOptionId(opt.id)}
                          className={`w-full text-left text-[14.5px] p-3 sm:p-3.5 border-[1.5px] rounded-md transition-all cursor-pointer leading-snug flex items-start justify-between gap-3 ${btnStyle}`}
                        >
                          <span>{opt.text}</span>
                          {isSelected && (
                            <span className="shrink-0 mt-0.5">
                              {opt.isOk ? (
                                <Check size={16} className="text-fd-gold!" />
                              ) : (
                                <AlertCircle
                                  size={16}
                                  className="text-[#C96E6E]"
                                />
                              )}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Feedback display */}
                  {selectedOpt && (
                    <div className="mt-3.5 animate-in fade-in duration-200">
                      {selectedOpt.isOk ? (
                        <div className="p-3.5 sm:p-4 border-l-4 border-l-fd-gold! bg-fd-parchment! text-[14px] text-fd-body! rounded-r-md">
                          <b className="block text-[11px] tracking-[0.1em] text-fd-gold! uppercase mb-1">
                            THE EXAMINER AGREES
                          </b>
                          <p className="leading-relaxed">
                            The anger received as information, the fear
                            legitimised, and then the question that opens every
                            angry-relative station. The facts will keep; the man
                            will not.
                          </p>
                        </div>
                      ) : (
                        <div className="p-3.5 sm:p-4 border-l-4 border-l-[#C96E6E] bg-[#FBF3F3] text-[14px] text-fd-body! rounded-r-md">
                          <b className="block text-[11px] tracking-[0.1em] text-[#C96E6E] uppercase mb-1">
                            THE EXAMINER&apos;S VIEW
                          </b>
                          <p className="leading-relaxed">
                            Corrections fired at an angry man bounce. The first
                            minute is not when the facts land. Try again.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STEP 5 */}
        <section className="py-10 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-[52px_1fr] gap-4 sm:gap-6">
            <div className="font-serif text-[38px] sm:text-[42px] font-normal text-fd-gold! leading-[0.9]">
              5
            </div>
            <div>
              <h2 className="font-serif text-2xl sm:text-[25px] font-medium text-fd-navy! mb-2.5">
                Exam Mode is not optional
              </h2>
              <p className="text-[16px] sm:text-[16.5px] leading-relaxed text-fd-body! max-w-[66ch]">
                At the top of every station there is a switch.{" "}
                <strong className="text-fd-navy! font-semibold">
                  Learn Mode
                </strong>{" "}
                is where you study;{" "}
                <strong className="text-fd-navy! font-semibold">
                  Exam Mode
                </strong>{" "}
                puts you in a seven-minute timed station with a patient you have
                not met, no feedback and no second tries. Knowing the right
                answer for Darren proves memory. Exam Mode is where you find out
                whether the skill transfers.
              </p>
              <p className="mt-2.5 text-[16px] sm:text-[16.5px] leading-relaxed text-fd-body! max-w-[66ch]">
                Best taken a day or two after the Learn Mode pass. The spacing
                is part of the test.
              </p>

              {/* Step 5 Interactive Box */}
              <div className="bg-fd-paper! border border-fd-stone! border-l-4 border-l-fd-gold! rounded-md p-5 sm:p-6 my-6 shadow-xs">
                <div className="text-[11.5px] tracking-[0.12em] font-bold text-fd-gold! uppercase mb-3.5">
                  TRY IT — THE SWITCH AT THE TOP OF EVERY STATION
                </div>
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="inline-flex gap-1.5 bg-fd-parchment! border border-fd-stone! p-1.5 rounded-md">
                    <button
                      type="button"
                      onClick={() => {
                        setIsExamMode(false);
                        setExamSeconds(420);
                      }}
                      className={`text-[14px] font-semibold px-4 py-2 rounded transition-all cursor-pointer ${
                        !isExamMode
                          ? "bg-fd-navy! text-white shadow-xs"
                          : "text-fd-navy! hover:bg-black/5"
                      }`}
                    >
                      Learn Mode
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsExamMode(true);
                        if (examSeconds === 0) setExamSeconds(420);
                      }}
                      className={`text-[14px] font-semibold px-4 py-2 rounded transition-all cursor-pointer flex items-center gap-1.5 ${
                        isExamMode
                          ? "bg-fd-navy! text-white shadow-xs"
                          : "text-fd-navy! hover:bg-black/5"
                      }`}
                    >
                      <Play size={13} className="fill-current" />
                      <span>Exam Mode</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-serif text-[26px] sm:text-[28px] text-fd-navy! font-semibold tabular-nums">
                      {formatTime(examSeconds)}
                    </span>
                    {isExamMode && (
                      <span className="flex h-2.5 w-2.5 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STEP 6 */}
        <section className="py-10 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-[52px_1fr] gap-4 sm:gap-6">
            <div className="font-serif text-[38px] sm:text-[42px] font-normal text-fd-gold! leading-[0.9]">
              6
            </div>
            <div>
              <h2 className="font-serif text-2xl sm:text-[25px] font-medium text-fd-navy! mb-2.5">
                Take the cards to two colleagues
              </h2>
              <p className="text-[16px] sm:text-[16.5px] leading-relaxed text-fd-body! max-w-[66ch]">
                Every station ends with a{" "}
                <strong className="text-fd-navy! font-semibold">
                  three-person practice pack
                </strong>
                : a candidate card, a role-player card with hidden information,
                and an observer card marked the way an examiner marks. Print
                them, or open them on a phone. This is the part of your
                preparation the course cannot do for you.
              </p>
              <p className="mt-2.5 text-[16px] sm:text-[16.5px] leading-relaxed text-fd-body! max-w-[66ch]">
                If you have no one to practise with, post in the{" "}
                <strong className="text-fd-navy! font-semibold">
                  candidates&apos; WhatsApp group
                </strong>{" "}
                — its whole purpose is finding two people who are free on the
                same evening.
              </p>

              {/* Step 6 Cards */}
              <div className="bg-fd-paper! border border-fd-stone! border-l-4 border-l-fd-gold! rounded-md p-5 sm:p-6 my-6 shadow-xs">
                <div className="text-[11.5px] tracking-[0.12em] font-bold text-fd-gold! uppercase mb-3.5">
                  AT THE END OF EVERY STATION
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-fd-parchment! border border-fd-stone! rounded-md p-3.5 sm:p-4 text-[14px]">
                    <b className="block text-fd-navy! font-semibold mb-1">
                      Candidate card
                    </b>
                    <span className="text-fd-body! leading-snug">
                      The task, as you would receive it in the exam.
                    </span>
                  </div>
                  <div className="bg-fd-parchment! border border-fd-stone! rounded-md p-3.5 sm:p-4 text-[14px]">
                    <b className="block text-fd-navy! font-semibold mb-1">
                      Role-player card
                    </b>
                    <span className="text-fd-body! leading-snug">
                      Hidden information, and lines that punish the wrong
                      approach.
                    </span>
                  </div>
                  <div className="bg-fd-parchment! border border-fd-stone! rounded-md p-3.5 sm:p-4 text-[14px]">
                    <b className="block text-fd-navy! font-semibold mb-1">
                      Observer card
                    </b>
                    <span className="text-fd-body! leading-snug">
                      A domain-by-domain rubric, and an overall judgement first.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STEP 7 */}
        <section className="py-10 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-[52px_1fr] gap-4 sm:gap-6">
            <div className="font-serif text-[38px] sm:text-[42px] font-normal text-fd-gold! leading-[0.9]">
              7
            </div>
            <div>
              <h2 className="font-serif text-2xl sm:text-[25px] font-medium text-fd-navy! mb-2.5">
                The workbook is your plan
              </h2>
              <p className="text-[16px] sm:text-[16.5px] leading-relaxed text-fd-body! max-w-[66ch]">
                <strong className="text-fd-navy! font-semibold">
                  12 Weeks to the CASC
                </strong>{" "}
                is the document that turns 43 stations into a schedule. It has
                four routes depending on the weeks you have left, twelve weekly
                planner pages, a station log, a domain tracker, mock debrief
                sheets, a chapter for the last fourteen days, and a chapter for
                candidates resitting.
              </p>
              <p className="mt-2.5 text-[16px] sm:text-[16.5px] leading-relaxed text-fd-body! max-w-[66ch]">
                Download it today and fill in the first page before you open
                station two. Candidates who plan finish the library; candidates
                who browse do not.
              </p>
            </div>
          </div>
        </section>

        {/* STEP 8 */}
        <section className="py-10 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-[52px_1fr] gap-4 sm:gap-6">
            <div className="font-serif text-[38px] sm:text-[42px] font-normal text-fd-gold! leading-[0.9]">
              8
            </div>
            <div>
              <h2 className="font-serif text-2xl sm:text-[25px] font-medium text-fd-navy! mb-2.5">
                Watch your progress, by domain
              </h2>
              <p className="text-[16px] sm:text-[16.5px] leading-relaxed text-fd-body! max-w-[66ch]">
                Your course home shows stations completed and Exam Modes passed,{" "}
                <strong className="text-fd-navy! font-semibold">
                  broken down by domain
                </strong>
                . The number that matters is not the total — it is the weakest
                domain. Work that one next, even when another is more enjoyable.
              </p>

              {/* Step 8 Progress Demo */}
              <div className="bg-fd-paper! border border-fd-stone! border-l-4 border-l-fd-gold! rounded-md p-5 sm:p-6 my-6 shadow-xs">
                <div className="text-[11.5px] tracking-[0.12em] font-bold text-fd-gold! uppercase mb-2">
                  ON YOUR COURSE HOME
                </div>
                <div className="text-[15px] font-medium text-fd-navy!">
                  Domain 3 · Risk Assessment — 2 of 7 stations
                  <div className="h-2.5 bg-fd-stone! rounded-full overflow-hidden mt-2.5">
                    <div
                      className="h-full bg-fd-gold! rounded-full transition-all duration-700"
                      style={{ width: "28.5%" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ── WHAT A GOOD WEEK LOOKS LIKE ── */}
      <section className="bg-fd-paper! border-t border-fd-stone! py-12 sm:py-14 px-6">
        <div className="max-w-[920px] mx-auto">
          <div className="bg-fd-navy! text-[#DCE1EA] rounded-xl p-6 sm:p-8 border border-white/10 shadow-lg">
            <h2 className="font-serif text-2xl sm:text-[25px] font-medium text-white mb-4">
              What a good week looks like
            </h2>
            <ol className="space-y-3 list-decimal list-inside text-[15.5px] leading-relaxed">
              <li className="pl-1">
                <strong className="text-fd-gold-soft! font-semibold">
                  Two or three stations
                </strong>{" "}
                in Learn Mode, one sitting each — circles opened, decisions
                made.
              </li>
              <li className="pl-1">
                <strong className="text-fd-gold-soft! font-semibold">
                  Exam Mode
                </strong>{" "}
                on last week&apos;s stations, a day or two after you studied
                them.
              </li>
              <li className="pl-1">
                <strong className="text-fd-gold-soft! font-semibold">
                  One practice evening
                </strong>{" "}
                with two colleagues, using the cards from the stations you found
                hardest.
              </li>
              <li className="pl-1">
                <strong className="text-fd-gold-soft! font-semibold">
                  Ten minutes in the workbook
                </strong>{" "}
                — log what you did, mark the domain, plan next week.
              </li>
            </ol>
          </div>
        </div>
      </section>

      {/* ── THE FOUR THINGS CANDIDATES MISS ── */}
      <section className="py-12 sm:py-14 px-6 bg-fd-paper!">
        <div className="max-w-[920px] mx-auto">
          <h2 className="font-serif text-[26px] font-medium text-fd-navy! mb-2">
            The four things candidates miss
          </h2>
          <p className="text-fd-body! text-[15.5px] mb-5">
            Every one of these is someone getting less than they paid for.
          </p>
          <div className="grid gap-2.5">
            <div className="bg-fd-paper! border border-fd-stone! rounded-lg p-4 sm:p-4.5 text-[15px] leading-relaxed shadow-xs">
              <b className="text-fd-navy! font-semibold">
                Reading only the pass.
              </b>{" "}
              The second failure is the one that looks like good practice. It is
              where most marks are lost in real stations.
            </div>
            <div className="bg-fd-paper! border border-fd-stone! rounded-lg p-4 sm:p-4.5 text-[15px] leading-relaxed shadow-xs">
              <b className="text-fd-navy! font-semibold">
                Never tapping the gold circles.
              </b>{" "}
              The examiner&apos;s reasoning is the course. Without it you are
              reading dialogue.
            </div>
            <div className="bg-fd-paper! border border-fd-stone! rounded-lg p-4 sm:p-4.5 text-[15px] leading-relaxed shadow-xs">
              <b className="text-fd-navy! font-semibold">Skipping Exam Mode.</b>{" "}
              Recognising the right answer is not the same as producing it under
              time on an unfamiliar patient.
            </div>
            <div className="bg-fd-paper! border border-fd-stone! rounded-lg p-4 sm:p-4.5 text-[15px] leading-relaxed shadow-xs">
              <b className="text-fd-navy! font-semibold">
                Leaving the practice cards unused.
              </b>{" "}
              The CASC is spoken out loud. Nothing on a screen replaces saying
              it to another person.
            </div>
          </div>
        </div>
      </section>

      {/* ── READY (BOTTOM ACTION BAR) ── */}
      <div className="bg-fd-parchment! border-t border-fd-stone! py-12 sm:py-16 px-6">
        <div className="max-w-[920px] mx-auto">
          <h2 className="font-serif text-[26px] sm:text-[30px] font-medium text-fd-navy!">
            Ready.
          </h2>
          <p className="mt-2.5 mb-6 text-[16px] text-fd-body! leading-relaxed max-w-[62ch]">
            Download the workbook, fill in the first page, and open Station 1.1.
            Come back to this page whenever you want to check you are using
            everything.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-3.5">
            {/* Primary button: Understood, go to the course */}
            <button
              type="button"
              onClick={handleUnderstood}
              className="inline-flex items-center justify-center gap-2 bg-fd-navy! text-white border-2 border-fd-navy! hover:bg-fd-navy-deep! px-6 py-3.5 rounded-md font-semibold text-[15px] shadow-sm transition-all cursor-pointer"
            >
              <span>
                {isAr
                  ? "فهمت، الانتقال إلى الدورة"
                  : "Understood, go to the course"}
              </span>
              <ArrowRight size={16} />
            </button>

            {/* Download workbook */}
            <button
              type="button"
              onClick={handleOpenWorkbook}
              className="inline-flex items-center justify-center gap-2 bg-fd-paper! text-fd-navy! border-2 border-fd-stone! hover:border-fd-gold! hover:bg-fd-paper! px-5 py-3.5 rounded-md font-semibold text-[15px] transition-all cursor-pointer"
            >
              <Download size={15} />
              <span>
                {isAr ? "تحميل الدليل (PDF)" : "Download the workbook"}
              </span>
            </button>
            {/* Skip button requested by user */}
            <button
              type="button"
              onClick={handleSkip}
              className="inline-flex items-center justify-center gap-1.5 bg-transparent text-fd-navy! border-2 border-fd-navy/25! hover:border-fd-navy! hover:bg-fd-navy/5! px-5 py-3.5 rounded-md font-semibold text-[15px] transition-all cursor-pointer"
            >
              <span>{isAr ? "تخطي والذهاب للدرس المستحق" : "Skip"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
