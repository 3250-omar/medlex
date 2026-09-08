"use client";

import { useCallback, useContext, useState } from "react";
import Link from "next/link";
import { Download, Gift, Loader2 } from "lucide-react";
import confetti from "canvas-confetti";
import { useLocale } from "next-intl";
import { useQueryClient } from "@tanstack/react-query";
import { InterestDialogContext } from "@/components/marketing/InterestDialog";
import FounderPortrait from "@/components/marketing/FounderPortrait";
import FAQAccordion from "../../_comps/FAQAccordion";
import {
  academyQueryKeys,
  type EnrolledCourse,
  type GiftStatus,
  useCurrentUser,
  useEnrolledCourses,
  useGiftStatus,
} from "../../_apiCalls/academyQueries";
import SubscribeButton from "./SubscribeButton";
import FeedbackSection from "./FeedbackSection";
import type { PathwayContent, PathwayLabels } from "./pathwayContent";

type Props = { content: PathwayContent; labels: PathwayLabels };

type EnrolOrContinueProps = {
  className: string;
  label?: string;
  cascEnrolment?: EnrolledCourse;
  continueSlug?: string | null;
  locale: string;
};

function EnrolOrContinue({
  className,
  label = "Enrol — £147 for the founding hundred",
  cascEnrolment,
  continueSlug,
  locale,
}: EnrolOrContinueProps) {
  return cascEnrolment && continueSlug ? (
    <Link
      href={`/${locale}/academy/casc-academy/${continueSlug}`}
      className={className}
    >
      Continue course
    </Link>
  ) : (
    <SubscribeButton className={className} showArrow={false}>
      {label}
    </SubscribeButton>
  );
}

const referenceFaqs = [
  {
    question: "How long do I have access?",
    answer:
      "Twelve months from the day you enrol — long enough to prepare, sit, and if it comes to it, resit at the following diet. If your access runs out before a resit, show us the booking and you get three further months at no charge.",
  },
  {
    question: "How long does a station take?",
    answer:
      "About forty-five minutes to work through properly in Learn Mode, plus seven minutes for Exam Mode. The library is ordered so that a domain can be walked in a sitting.",
  },
  {
    question: "Does it work on my phone?",
    answer:
      "Yes — every station is built for the phone screen first, and tested there.",
  },
  {
    question: "Is this a substitute for practising with colleagues?",
    answer:
      "No, and it says so repeatedly inside the course. It gives you the stations, the marking standard and a group to find people in. You still have to open your mouth in front of someone.",
  },
  {
    question: "Can I share it with colleagues?",
    answer:
      "The workbook, yes — it is designed to travel. The library, no: it lives inside your account, and the practice packs are written so that you bring colleagues to it rather than the other way round.",
  },
  {
    question: "I have already failed once. Is this useful?",
    answer:
      "The workbook has a chapter written specifically for resits, and the honest answer is in it: if you failed on structure, timing or communication, more reading will not touch it.",
  },
  {
    question: "Do I need to be in the UK?",
    answer: "No. Everything is online and the group spans several time zones.",
  },
  {
    question: "Is this endorsed by the Royal College of Psychiatrists?",
    answer: "No. It is an independent course.",
  },
];

export default function CascAcademyLanding(_props: Props) {
  const locale = useLocale() === "ar" ? "ar" : "en";
  const dialog = useContext(InterestDialogContext);
  const { data: user } = useCurrentUser();
  const { data: giftStatus } = useGiftStatus(Boolean(user));
  const { data: enrolledCourses } = useEnrolledCourses(Boolean(user));
  const queryClient = useQueryClient();
  const [downloading, setDownloading] = useState<"1" | "2" | null>(null);

  // Detect active casc-academy enrolment
  const cascEnrolment = enrolledCourses?.find(
    (c) => c.slug === "casc-academy" && c.status === "active",
  );
  const continueSlug =
    cascEnrolment?.currentUnitSlug ?? cascEnrolment?.firstUnitSlug;
  const [downloadError, setDownloadError] = useState(false);

  const triggerCelebration = useCallback(() => {
    const count = 200;
    const defaults = { origin: { y: 0.65 }, zIndex: 99999 };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
  }, []);

  async function downloadGift(id: "1" | "2", fileName: string) {
    if (!user) {
      dialog?.openInterestDialog("casc-academy", "register", () => {
        void downloadGift(id, fileName);
      });
      return;
    }

    setDownloading(id);
    try {
      const response = await fetch(`/api/gifts/download?gift=${id}`);
      if (!response.ok) throw new Error("Gift download failed");
      const url = URL.createObjectURL(await response.blob());
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = fileName;
      anchor.click();
      URL.revokeObjectURL(url);
      triggerCelebration();
      queryClient.setQueryData<GiftStatus>(
        academyQueryKeys.giftStatus,
        (current) => ({
          gift1Downloaded: id === "1" || current?.gift1Downloaded === true,
          gift1DownloadedAt:
            id === "1"
              ? new Date().toISOString()
              : (current?.gift1DownloadedAt ?? null),
          gift2Downloaded: id === "2" || current?.gift2Downloaded === true,
          gift2DownloadedAt:
            id === "2"
              ? new Date().toISOString()
              : (current?.gift2DownloadedAt ?? null),
        }),
      );
    } catch {
      setDownloadError(true);
    } finally {
      setDownloading(null);
    }
  }

  const btnGold =
    "btn btn-gold !min-h-12 !px-7 font-semibold text-navy! text-sm !rounded-full transition-transform hover:-translate-y-0.5";
  const btnGhost =
    "btn btn-ghost !min-h-12 !px-7 font-semibold text-white text-sm !rounded-full transition-transform hover:-translate-y-0.5";
  const btnNavy =
    "btn btn-navy !min-h-12 !px-7 font-semibold text-white text-sm !rounded-full transition-transform hover:-translate-y-0.5";

  return (
    <main id="top" className="bg-white text-char">
      {/* =========================================================================
          1. HERO SECTION
          ========================================================================= */}
      <section className="bg-navy text-lbody on-navy pt-20 pb-0 border-b border-white/10">
        <div className="mx-auto w-full px-6 sm:px-8 lg:max-w-6xl lg:px-10">
          <p className="kicker text-gold">
            The CASC Academy · by MedLex Foundations
          </p>
          <h1 className="mt-4 max-w-4xl font-serif text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.12] text-white">
            Learn the CASC from the examiner’s side of the table.
          </h1>
          <p className="mt-6 max-w-2xl font-serif text-lg sm:text-xl lg:text-[22px] leading-relaxed text-lbody">
            Forty-three stations, each shown failed two ways and passed once —
            with what the examiner is thinking at every decision. Built by a
            former CASC examiner.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <EnrolOrContinue
              className={btnGold}
              cascEnrolment={cascEnrolment}
              continueSlug={continueSlug}
              locale={locale}
            />
            <Link
              className={btnGhost}
              href={`/${locale}/academy/preview/station-7-2`}
            >
              Try a station free
            </Link>
          </div>

          <p className="mt-5 text-[13.5px] text-mute">
            Eight domains · 43 stations · 43 role-play practice cases · 12
            months&apos; access
          </p>

          {/* Real 3-take consultation showcase */}
          <div className="mt-16 border-t border-white/15 pt-8 pb-12">
            <p className="font-serif italic text-base sm:text-lg text-lgold max-w-3xl leading-relaxed">
              Darren Boyd, 44, is on his feet with a printout in his fist. His
              daughter Libby, 15, is three weeks into fluoxetine — and he found
              out from a pharmacy bag. Almost every fact he shouts is slightly
              wrong. Seven minutes.
            </p>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 rounded-2xl border border-white/15 bg-deep overflow-hidden shadow-lg">
              {/* Fail 1 */}
              <div className="p-6 sm:p-7 border-b md:border-b-0 md:border-r border-white/15">
                <p className="text-xs font-bold uppercase tracking-wider text-mute mb-3">
                  Fail 1 — the defence
                </p>
                <p className="font-serif text-[15.5px] sm:text-base leading-relaxed text-white mb-4">
                  &ldquo;Mr Boyd, I’ll stop you there, because nothing improper
                  has happened. Libby was assessed as Gillick competent. Her
                  mother attended with her. Fluoxetine is the recommended first
                  line — and with respect, that printout misreads the
                  data.&rdquo;
                </p>
                <div className="border-l-2 border-gold pl-3 text-[13.5px] leading-relaxed text-lbody">
                  <b className="text-lgold font-semibold block mb-1">
                    What the examiner is thinking
                  </b>
                  Six sentences, six accurate facts — and the station is already
                  lost. Every word answered the armour; not one answered the
                  man.
                </div>
              </div>

              {/* Fail 2 */}
              <div className="p-6 sm:p-7 border-b md:border-b-0 md:border-r border-white/15">
                <p className="text-xs font-bold uppercase tracking-wider text-mute mb-3">
                  Fail 2 — the surrender
                </p>
                <p className="font-serif text-[15.5px] sm:text-base leading-relaxed text-white mb-4">
                  &ldquo;Mr Boyd — I can see why you’re angry, and I’m sorry.
                  You should have been consulted, absolutely. Look — if you’re
                  not comfortable with Libby being on it, we can stop the
                  fluoxetine today and think again.&rdquo;
                </p>
                <div className="border-l-2 border-gold pl-3 text-[13.5px] leading-relaxed text-lbody">
                  <b className="text-lgold font-semibold block mb-1">
                    What the examiner is thinking
                  </b>
                  The room is quieter already — and everything paying for the
                  quiet was never this doctor’s to spend. A fault conceded that
                  did not occur, and a fifteen-year-old’s working treatment
                  offered to her father, in her absence, as the price of his
                  calm.
                </div>
              </div>

              {/* Pass */}
              <div className="p-6 sm:p-7 bg-deep/90">
                <p className="text-xs font-bold uppercase tracking-wider text-gold mb-3">
                  The pass
                </p>
                <p className="font-serif text-[15.5px] sm:text-base leading-relaxed text-white mb-4">
                  &ldquo;Mr Boyd — I’m glad you came in, and I’m not going
                  anywhere, so let’s sit. You found out from a pharmacy bag on a
                  kitchen counter, and you’ve been reading things that would
                  frighten any parent. Before I explain anything, tell me the
                  thing that’s worrying you most.&rdquo;
                </p>
                <div className="border-l-2 border-gold pl-3 text-[13.5px] leading-relaxed text-lbody">
                  <b className="text-lgold font-semibold block mb-1">
                    What the examiner is thinking
                  </b>
                  Not one fact corrected, not one protocol cited — and the
                  temperature has already dropped. The corrections can all wait.
                  They will land later precisely because they were not fired
                  now.
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-4 text-sm text-mute">
              <span>
                This is the opening of Station 7.2. Every station in the library
                is built this way.
              </span>
              <Link
                href={`/${locale}/academy/preview/station-7-2`}
                className="text-gold font-semibold hover:text-lgold transition-colors inline-flex items-center gap-1"
              >
                Read the whole station, free →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. PROBLEM SECTION
          ========================================================================= */}
      <section className="py-20 lg:py-24 border-b border-hair bg-white">
        <div className="mx-auto w-full px-6 sm:px-8 lg:max-w-6xl lg:px-10 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-start">
          <div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-[40px] font-bold leading-tight text-navy!">
              Most candidates who fail have already read enough.
            </h2>
            <p className="mt-5 font-serif text-lg sm:text-xl text-char leading-relaxed">
              They have the textbooks. They have watched the videos. They can
              describe a risk assessment accurately at a desk, on their own,
              with no clock running.
            </p>
            <p className="mt-4 font-sans text-base text-char/85 leading-relaxed">
              Then they walk into a station where a woman is packing her bag to
              go home, and something she says at minute three changes what the
              station is actually about — and nothing they revised tells them
              what to do in the next four seconds.
            </p>
            <p className="mt-4 font-sans text-base text-char/85 leading-relaxed">
              The CASC is a performance examination. It tests what comes out of
              your mouth, under time, in front of someone who is marking you.
              Reading is the cheapest form of preparation to consume and the
              least likely to change your score.
            </p>
          </div>

          <blockquote className="font-serif text-2xl lg:text-[26px] leading-snug text-navy! border-t-4 border-gold pt-5 mt-2">
            &ldquo;Would I be confident to have this candidate as my registrar?
            That is the question behind every mark — and the lens every station
            here is marked through.&rdquo;
          </blockquote>
        </div>
      </section>

      {/* =========================================================================
          3. HOW A STATION WORKS (ANATOMY)
          ========================================================================= */}
      <section
        id="station"
        className="py-20 lg:py-24 border-b border-hair bg-tint"
      >
        <div className="mx-auto w-full px-6 sm:px-8 lg:max-w-6xl lg:px-10">
          <p className="kicker text-goldd">How a station works</p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[40px] font-bold leading-tight text-navy!">
            Not lectures. Not model answers. Stations, taken apart.
          </h2>
          <p className="mt-4 max-w-3xl font-serif text-lg sm:text-xl leading-relaxed text-char">
            Every station is built the same way, around a single named trap —
            the specific error that costs candidates the mark in that scenario.
            Then you make the decisions yourself.
          </p>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              {
                num: "1",
                title: "The trap, named",
                desc: "What this station is really testing, and the two ways good candidates get it wrong.",
              },
              {
                num: "2",
                title: "Two failures, one pass",
                desc: "The same consultation three times, line by line. One failure is obvious; the other is the kind one, and worse.",
              },
              {
                num: "3",
                title: "The examiner's reasoning",
                desc: "Tap any moment and read what an examiner is thinking as it happens — and why the mark is being lost or won.",
              },
              {
                num: "4",
                title: "Seven decisions",
                desc: "You are in the chair. Choose, read the examiner's response, try again until you find the move that works.",
              },
              {
                num: "5",
                title: "Exam Mode, then the cards",
                desc: "Seven minutes, timed, on a patient you have not met. Then a three-person practice pack to run with colleagues that evening.",
              },
            ].map((step) => (
              <div
                key={step.num}
                className="border-t-2 border-gold pt-5 bg-transparent"
              >
                <span className="font-serif text-3xl font-bold text-gold block leading-none mb-3">
                  {step.num}
                </span>
                <h3 className="font-serif text-lg font-bold text-navy! mb-2">
                  {step.title}
                </h3>
                <p className="font-sans text-sm leading-relaxed text-grey">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. FREE STATION PREVIEW CALLOUT
          ========================================================================= */}
      <section id="free" className="py-14 border-b border-hair bg-white">
        <div className="mx-auto w-full px-6 sm:px-8 lg:max-w-6xl lg:px-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 rounded-2xl border border-hair p-8 sm:p-10 bg-white shadow-sm">
            <div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-navy!">
                See a station before you decide.
              </h3>
              <p className="mt-2 text-base text-grey max-w-2xl leading-relaxed">
                Station 7.2 — the one above — is open to anyone, no login. Read
                it fail twice, read it pass, tap the examiner&apos;s reasoning,
                then make the seven decisions yourself.
              </p>
            </div>
            <Link
              href={`/${locale}/academy/preview/station-7-2`}
              className={btnNavy}
            >
              Open Station 7.2 — free
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. DOMAINS SECTION
          ========================================================================= */}
      <section className="py-20 lg:py-24 border-b border-hair bg-white">
        <div className="mx-auto w-full px-6 sm:px-8 lg:max-w-6xl lg:px-10">
          <p className="kicker text-goldd">The library</p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[40px] font-bold leading-tight text-navy!">
            Eight domains. Forty-three stations.
          </h2>
          <p className="mt-4 font-serif text-lg sm:text-xl text-char leading-relaxed max-w-3xl">
            Organised the way examiners think, each domain with its own hub and
            the stations that test it.
          </p>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-x-12">
            {[
              {
                num: "1",
                title: "Communication & Rapport",
                sub: "The grammar of every consultation.",
              },
              {
                num: "2",
                title: "Information Giving",
                sub: "The difference between a leaflet and a lightbulb.",
              },
              {
                num: "3",
                title: "Risk Assessment",
                sub: "Where marks are lost fastest and most quietly.",
              },
              {
                num: "4",
                title: "Mental State Examination",
                sub: "Phenomenology, and the questions that get you there.",
              },
              {
                num: "5",
                title: "Capacity, Consent & the Law",
                sub: "Decision-specific, time-specific, defensible.",
              },
              {
                num: "6",
                title: "Management & Emergencies",
                sub: "The ward at three in the morning.",
              },
              {
                num: "7",
                title: "Difficult Conversations",
                sub: "Families, complaints, colleagues, apologies.",
              },
              {
                num: "8",
                title: "Physical Examination",
                sub: "The examinations psychiatry cannot delegate.",
              },
            ].map((d) => (
              <div
                key={d.num}
                className="grid grid-cols-[44px_1fr] gap-3 py-5 border-b border-hair items-baseline"
              >
                <span className="font-serif text-2xl font-bold text-gold leading-none">
                  {d.num}
                </span>
                <div>
                  <b className="font-serif text-lg font-semibold text-navy! block">
                    {d.title}
                  </b>
                  <span className="text-sm text-grey leading-relaxed">
                    {d.sub}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. INCLUDED SECTION
          ========================================================================= */}
      <section
        id="included"
        className="py-20 lg:py-24 border-b border-white/10 bg-navy text-lbody on-navy"
      >
        <div className="mx-auto w-full px-6 sm:px-8 lg:max-w-6xl lg:px-10">
          <p className="kicker text-gold">What you get</p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[40px] font-bold leading-tight text-white">
            Everything a candidate needs, in one place.
          </h2>
          <p className="mt-4 font-serif text-lg sm:text-xl text-lbody max-w-3xl leading-relaxed">
            Enrolment gives you the whole of it — the library and the four
            things built around it.
          </p>

          <div className="mt-12 divide-y divide-white/15">
            {[
              {
                title: "The station library",
                how: "Online · phone, tablet and desktop",
                desc: "43 stations across 8 domains, each with two failing takes, a passing take, the examiner's reasoning, seven decision points, take-home principles, a timed Exam Mode and a three-person practice pack.",
              },
              {
                title: "Twelve Weeks to the CASC",
                how: "Fillable workbook · type or print",
                desc: "A planning workbook: four routes depending on the weeks you have, twelve weekly planner pages, a station log, a domain tracker, mock debrief sheets, the last fourteen days, and a chapter for candidates resitting.",
              },
              {
                title: "The candidates' WhatsApp group",
                how: "Everyone enrolled · all time zones",
                desc: "It exists to solve the problem that actually stops people practising — not motivation, but finding two other people who are free on Tuesday evening. Find a trio, fix a time, swap the stations you found hardest.",
              },
              {
                title: "The examiner's notes",
                how: "By email · through your preparation",
                desc: "Short notes from the examiner's side of the table, sent as you work through the library: one thing examiners see, one thing to practise this week, and the station it lives in.",
              },
              {
                title: "Your certificate",
                how: "On completion · in your name",
                desc: "Issued when you finish, recording the 43 stations and 8 domains you worked through.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-4 py-7 items-start"
              >
                <div>
                  <h3 className="font-serif text-xl font-bold text-white">
                    {item.title}
                  </h3>
                  <div className="text-xs text-mute mt-1.5">{item.how}</div>
                </div>
                <p className="font-sans text-sm sm:text-base leading-relaxed text-lbody max-w-3xl">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. WHO IT IS FOR
          ========================================================================= */}
      <section className="py-20 lg:py-24 border-b border-hair bg-white text-char">
        <div className="mx-auto w-full px-6 sm:px-8 lg:max-w-6xl lg:px-10 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-start">
          <div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-[40px] font-bold leading-tight text-navy!">
              Who it is for.
            </h2>
            <p className="mt-5 font-serif text-lg sm:text-xl text-char leading-relaxed">
              You are sitting the MRCPsych CASC, you have done the reading, and
              you know the gap is in performance rather than knowledge — or you
              are resitting and cannot afford to prepare the same way again.
            </p>
          </div>

          <div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-navy!">
              Also for.
            </h3>
            <p className="mt-3 font-sans text-sm sm:text-base leading-relaxed text-char/80">
              Candidates sitting other psychiatry clinical examinations built on
              observed stations — the Arab Board and national board OSCEs among
              them. The marking language here is the CASC’s; the skills
              underneath it — structure under time, the alliance before the
              assessment, the risk question that actually gets answered — are
              the foundations of psychiatric practice anywhere.
            </p>

            <h3 className="mt-7 font-serif text-xl sm:text-2xl font-bold text-navy!">
              Not for.
            </h3>
            <p className="mt-3 font-sans text-sm sm:text-base leading-relaxed text-char/80">
              Anyone who wants model answers to memorise. This course will not
              give you scripts. It will show you why the scripts fail.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          8. THE EXAMINER (ABOUT)
          ========================================================================= */}
      <section
        id="about"
        className="py-20 lg:py-24 border-b border-white/10 bg-navy text-lbody on-navy"
      >
        <div className="mx-auto w-full px-6 sm:px-8 lg:max-w-6xl lg:px-10 grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-12 items-start">
          <FounderPortrait
            caption="Dr Ahmed Abouelghit · former CASC examiner"
            className="w-full max-w-[280px] sm:max-w-[300px]"
          />
          <div>
            <p className="kicker text-gold">The examiner</p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-[40px] font-bold leading-tight text-white">
              Dr Ahmed Abouelghit
            </h2>
            <p className="font-serif italic text-lg text-lgold mt-2 mb-6">
              Consultant Forensic Psychiatrist · former CASC examiner
            </p>

            <p className="font-sans text-sm sm:text-base leading-relaxed text-lbody mb-4">
              UK-trained Consultant Forensic Psychiatrist and Forensic
              Psychiatry Training Programme Director, with senior experience
              across clinical psychiatry, medico-legal practice, teaching and
              service leadership.
            </p>
            <p className="font-sans text-sm sm:text-base leading-relaxed text-lbody mb-4">
              He has sat on the other side of the table. He knows where the mark
              is actually decided in each station — and it is rarely where
              candidates think. It is the four seconds after a patient says
              something unexpected. It is the risk question asked in a form that
              lets the patient say no. It is the capacity assessment that is
              fluent and general when it needed to be specific to one decision
              on one afternoon. It is the examination performed perfectly in
              silence on a man who was never told why.
            </p>
            <p className="font-sans text-sm sm:text-base leading-relaxed text-lbody">
              These are the things that are easily missed and cost a great deal,
              and they are what this course is built around: not what to know,
              but what an examiner is watching for while you say it.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          9. BEFORE YOU ENROL (GIFTS) — EXACT COPY & STYLING WITH 2 GIFT BUTTONS
          ========================================================================= */}
      <section
        id="gifts"
        className="py-20 lg:py-24 border-b border-hair bg-tint text-char on-tint"
      >
        <div className="mx-auto w-full px-6 sm:px-8 lg:max-w-6xl lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="kicker text-goldd">Before you enrol</p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-[40px] font-bold leading-tight text-navy!">
              Two things from the examiner&apos;s chair, free.
            </h2>
            <p className="mt-4 font-serif text-lg sm:text-xl text-char leading-relaxed">
              Download both practical CASC resources straight away. No card, no
              commitment.
            </p>

            <ul className="mt-8 list-none p-0 divide-y divide-hair">
              <li className="grid grid-cols-[44px_1fr] gap-4 py-4 items-center">
                <div
                  className="w-11 h-14 bg-navy rounded border-b-4 border-gold shrink-0"
                  aria-hidden="true"
                />
                <div>
                  <b className="font-serif text-lg font-semibold text-navy! block">
                    The Examiner&apos;s Briefing
                  </b>
                  <span className="text-sm text-grey leading-relaxed">
                    How the CASC is actually marked, the errors examiners see
                    most, and the grammar of a British consultation — thirteen
                    pages, from the other side of the table.
                  </span>
                </div>
              </li>
              <li className="grid grid-cols-[44px_1fr] gap-4 py-4 items-center">
                <div
                  className="w-11 h-14 bg-navy rounded border-b-4 border-gold shrink-0"
                  aria-hidden="true"
                />
                <div>
                  <b className="font-serif text-lg font-semibold text-navy! block">
                    The Examiner&apos;s Error Log
                  </b>
                  <span className="text-sm text-grey leading-relaxed">
                    A one-page self-audit you fill in after every practice
                    station, so the person watching you can tick what they saw.
                  </span>
                </div>
              </li>
            </ul>
          </div>

          {/* Right Card: Instead of Send Me Both input boxes, display the Two Gifts Buttons */}
          <div className="bg-white border border-hair rounded-2xl p-7 sm:p-9 shadow-sm">
            <h3 className="font-serif text-2xl font-bold text-navy! mb-2">
              Download Both
            </h3>
            <p className="text-sm text-grey mb-6">
              Get immediate access to both preparation resources. Choose a guide
              below to download:
            </p>

            <div className="grid gap-3.5">
              {[
                ["1", "The Examiner's Briefing.pdf"],
                ["2", "The Examiner's Error Log.pdf"],
              ].map(([id, name]) => {
                const isDownloaded =
                  (id === "1" && giftStatus?.gift1Downloaded) ||
                  (id === "2" && giftStatus?.gift2Downloaded);

                return (
                  <button
                    key={id}
                    type="button"
                    disabled={downloading !== null}
                    onClick={() =>
                      void downloadGift(
                        id as "1" | "2",
                        `${name}${isDownloaded ? " - downloaded" : ""}`,
                      )
                    }
                    className="flex min-h-12 items-center justify-between rounded-xl border border-gold bg-tint px-4 py-3 text-start font-sans text-sm font-semibold text-navy! transition-colors hover:bg-gold hover:text-navy! disabled:opacity-60 shadow-xs cursor-pointer"
                  >
                    <span className="flex items-center gap-2.5">
                      {downloading === id ? (
                        <Loader2
                          className="animate-spin text-navy!"
                          size={18}
                        />
                      ) : (
                        <Gift className="text-navy!" size={18} />
                      )}
                      <span className="font-medium text-navy!">{name}</span>
                    </span>
                    <Download className="text-navy!" size={16} />
                  </button>
                );
              })}

              {downloadError ? (
                <p role="alert" className="text-xs text-red-600 mt-1">
                  Unable to download the resource. Please try again.
                </p>
              ) : null}
            </div>

            <small className="block mt-5 text-xs leading-relaxed text-grey">
              You will get immediate access to the PDF. After that, occasional
              notes from the examiner&apos;s side of the table — unsubscribe in
              one click.
            </small>
          </div>
        </div>
      </section>

      {/* =========================================================================
          10. FEEDBACK SECTION (PERSISTENT LOGOLOOP)
          ========================================================================= */}
      <FeedbackSection pathway="casc-academy" />

      {/* =========================================================================
          11. COACHING (QUIET)
          ========================================================================= */}
      <section className="py-20 lg:py-24 border-b border-hair bg-white text-char">
        <div className="mx-auto w-full px-6 sm:px-8 lg:max-w-6xl lg:px-10">
          <div className="border border-hair rounded-2xl p-8 sm:p-10 max-w-4xl bg-white shadow-xs">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-navy!">
              If a weakness will not shift
            </h3>
            <p className="mt-3 font-sans text-sm sm:text-base leading-relaxed text-char/80">
              Most candidates do not need coaching. If you are not yet
              practising out loud every week, arrange that first — it is free
              and it will do more. Coaching is worth buying when a specific
              weakness has not moved despite regular practice, or after a failed
              attempt: sixty minutes online, performing stations and being
              marked the way an examiner marks.
            </p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 py-4 border-y border-hair">
              <div>
                <b className="font-serif text-base font-semibold text-navy! block mb-1">
                  One to one, 60 minutes
                </b>
                <span className="text-sm text-grey">
                  £120 · five for £540 · ten for £960
                </span>
              </div>
              <div>
                <b className="font-serif text-base font-semibold text-navy! block mb-1">
                  Small group, maximum three
                </b>
                <span className="text-sm text-grey">
                  £60 per person · five for £250
                </span>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <Link href={`/${locale}/contact`} className={btnNavy}>
                Book a session
              </Link>
              <span className="text-xs text-grey">
                Booked separately; not part of the course price.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          12. PRICING & ENROL
          ========================================================================= */}
      <section
        id="enrol"
        className="py-20 lg:py-28 border-b border-white/10 bg-navy text-lbody on-navy"
      >
        <div className="mx-auto w-full px-6 sm:px-8 lg:max-w-6xl lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <p className="kicker text-gold">Enrol</p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-white">
              The founding hundred.
            </h2>
            <p className="mt-5 font-serif text-xl leading-relaxed text-lbody">
              The first hundred candidates pay £147. After that the price is
              £247. This is not a countdown timer: there are a hundred places at
              the founding price, and when they are gone, they are gone.
            </p>
            <p className="mt-4 font-sans text-base text-lbody/90 leading-relaxed">
              In exchange, I ask for one thing — a short piece of honest
              feedback once you have worked through it.
            </p>
          </div>

          <div className="bg-white text-char rounded-2xl p-8 sm:p-10 border-t-8 border-gold shadow-xl">
            <div className="font-serif text-5xl sm:text-6xl font-bold text-navy! leading-none">
              £147
            </div>
            <div className="text-sm text-grey mt-2 mb-6">
              for the founding hundred · then £247
            </div>

            <ul className="list-none p-0 m-0 mb-8 divide-y divide-hair">
              {[
                "The full 43-station library",
                "Twelve Weeks to the CASC — the workbook",
                "The candidates' WhatsApp group",
                "The examiner's notes by email",
                "Your certificate on completion",
                "12 months' access — extended free by three months if you resit",
              ].map((item) => (
                <li
                  key={item}
                  className="py-2.5 text-sm sm:text-base text-char flex items-center gap-2"
                >
                  <span className="text-gold font-bold">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <EnrolOrContinue
              className="btn btn-gold !min-h-12 w-full text-center text-sm font-semibold !rounded-full shadow-sm"
              label="Enrol now — £147"
              cascEnrolment={cascEnrolment}
              continueSlug={continueSlug}
              locale={locale}
            />
          </div>
        </div>
      </section>

      {/* =========================================================================
          13. QUESTIONS (FAQ)
          ========================================================================= */}
      <section className="py-20 lg:py-24 border-b border-hair bg-white text-char">
        <div className="mx-auto w-full px-6 sm:px-8 lg:max-w-6xl lg:px-10">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[40px] font-bold text-navy!">
            Questions.
          </h2>
          <div className="mt-8 max-w-3xl">
            <FAQAccordion items={referenceFaqs} />
          </div>
        </div>
      </section>

      {/* =========================================================================
          14. CLOSING BANNER
          ========================================================================= */}
      <section className="py-20 lg:py-28 bg-deep text-lbody on-deep text-center">
        <div className="mx-auto max-w-3xl px-6 sm:px-8">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-bold leading-tight text-white max-w-2xl mx-auto">
            The candidates who pass are rarely the ones who knew the most.
          </h2>
          <p className="mt-5 font-serif text-lg sm:text-xl text-lbody leading-relaxed max-w-xl mx-auto">
            They are the ones who practised out loud, on purpose, with someone
            watching — and who knew, before they walked in, which four seconds
            of each station the mark actually turns on.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <EnrolOrContinue
              className={btnGold}
              cascEnrolment={cascEnrolment}
              continueSlug={continueSlug}
              locale={locale}
            />
            <Link
              className={btnGhost}
              href={`/${locale}/academy/preview/station-7-2`}
            >
              Try a station free
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
