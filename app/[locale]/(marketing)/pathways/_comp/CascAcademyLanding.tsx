"use client";

import { useContext, useState } from "react";
import Link from "next/link";
import { Download, Gift, Loader2, Mail } from "lucide-react";
import { useLocale } from "next-intl";
import { useQueryClient } from "@tanstack/react-query";
import { InterestDialogContext } from "@/components/marketing/InterestDialog";
import FounderPortrait from "@/components/marketing/FounderPortrait";
import FAQAccordion from "../../_comps/FAQAccordion";
import {
  academyQueryKeys,
  type GiftStatus,
  useCurrentUser,
  useGiftStatus,
} from "../../_apiCalls/academyQueries";
import SubscribeButton from "./SubscribeButton";
import FeedbackSection from "./FeedbackSection";
import type { PathwayContent, PathwayLabels } from "./pathwayContent";

type Props = { content: PathwayContent; labels: PathwayLabels };

const englishCopy = {
  hero: "Learn the CASC from the examiner's side of the table.",
  intro:
    "Interactive stations that show the decisions, structure and consultation style examiners reward.",
  enrol: "Enrol in the Academy",
  free: "Open Station 7.2 - free",
  problemTitle: "Most candidates who fail have already read enough.",
  problem:
    "The missing work is not another lecture. It is practising difficult consultation moments, seeing why a mark is won or lost, and trying the move again.",
  howTitle: "Not lectures. Not model answers. Stations, taken apart.",
  steps: [
    [
      "The trap, named",
      "See what the station is really testing and where good candidates lose marks.",
    ],
    [
      "Two failures, one pass",
      "Compare approaches line by line before you make the decision yourself.",
    ],
    [
      "The examiner's reasoning",
      "Read the reasoning behind the marks at the moment it matters.",
    ],
    ["Seven decisions", "Choose the next move, learn from it, and try again."],
    [
      "Exam mode and practice pack",
      "Move from deliberate practice to timed rehearsal with colleagues.",
    ],
  ],
  previewTitle: "See a station before you decide.",
  preview:
    "Station 7.2 is open to everyone. Explore the teaching content without the course menu or progression controls.",
  domainsTitle: "Eight domains. Forty-three stations.",
  domains: [
    "History taking",
    "Mental state examination",
    "Risk assessment",
    "Diagnosis and management",
    "Communication",
    "Psychotherapy",
    "Physical health",
    "Critical review",
  ],
  includedTitle: "Everything a candidate needs, in one place.",
  included: [
    [
      "The station library",
      "Interactive stations with failing takes, passing takes, examiner reasoning and decision points.",
    ],
    [
      "Twelve Weeks to the CASC",
      "A structured preparation workbook to plan, practise and review.",
    ],
    [
      "Candidate community",
      "A place to find practice partners and keep momentum.",
    ],
    ["Examiner's notes", "Short, practical guidance on what to practise next."],
    ["Your certificate", "A record of the stations and domains you complete."],
  ],
  giftsEyebrow: "Before you enrol",
  giftsTitle: "Two things from the examiner's chair, free.",
  giftsBody: "Register or sign in to download both practical CASC resources.",
  login: "Register or sign in",
  downloads: "Download your resources",
  email: "Send via email - coming soon",
  coaching: "If a weakness will not shift",
  coachingBody: "Talk through a specific challenge with the MedLex team.",
  contact: "Contact us",
  faqTitle: "Questions.",
  close: "The candidates who pass are rarely the ones who knew the most.",
  final: "Enrol in the Academy",
} as const;

const copy = { en: englishCopy, ar: englishCopy } as const;
const referenceFaqs = [
  {
    question: "How long do I have access?",
    answer:
      "Twelve months from the day you enrol, with three further months at no charge if you need to resit and can show your booking.",
  },
  {
    question: "How long does a station take?",
    answer:
      "About forty-five minutes in Learn Mode, plus seven minutes for Exam Mode.",
  },
  {
    question: "Does it work on my phone?",
    answer:
      "Yes. Every station is designed and tested for the phone screen first.",
  },
  {
    question: "Is this a substitute for practising with colleagues?",
    answer:
      "No. The course gives you stations and a marking standard; you still need to practise out loud with someone watching.",
  },
  {
    question: "Can I share it with colleagues?",
    answer:
      "The workbook is designed to travel. The station library stays inside your account.",
  },
  {
    question: "I have already failed once. Is this useful?",
    answer:
      "Yes. The workbook includes a resit chapter focused on structure, timing and communication.",
  },
  {
    question: "Do I need to be in the UK?",
    answer:
      "No. Everything is online and the candidate community spans time zones.",
  },
  {
    question: "Is this endorsed by the Royal College of Psychiatrists?",
    answer: "No. It is an independent course.",
  },
];

export default function CascAcademyLanding({ content }: Props) {
  const locale = useLocale() === "ar" ? "ar" : "en";
  const t = copy[locale];
  const dialog = useContext(InterestDialogContext);
  const { data: user } = useCurrentUser();
  const { data: giftStatus } = useGiftStatus(Boolean(user));
  const queryClient = useQueryClient();
  const [downloading, setDownloading] = useState<"1" | "2" | null>(null);
  const [downloadError, setDownloadError] = useState(false);

  async function downloadGift(id: "1" | "2", fileName: string) {
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

  const button =
    "inline-flex min-h-12 items-center justify-center gap-2 bg-signal px-6 font-body text-sm font-semibold text-ink transition-colors hover:bg-signal-light focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal";
  return (
    <main className="bg-ink text-white pt-16">
      <section className="border-b border-white/10">
        <div className="mx-auto w-full px-6 py-20 sm:px-8 lg:max-w-6xl lg:px-10 lg:py-28">
          <div className="max-w-3xl">
            <p className="font-body text-xs font-semibold uppercase tracking-[.2em] text-signal">
              {content.eyebrow}
            </p>
            <h1 className="mt-6 font-display text-4xl leading-tight sm:text-6xl">
              {t.hero}
            </h1>
            <p className="mt-6 max-w-2xl font-body text-lg leading-8 text-white/65">
              {t.intro}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <SubscribeButton className={button} showArrow={false}>
                {t.enrol}
              </SubscribeButton>
              <Link
                className="inline-flex min-h-12 items-center justify-center border border-white/30 px-6 font-body text-sm font-semibold transition-colors hover:border-signal hover:text-signal"
                href={`/${locale}/academy/preview/station-7-2`}
              >
                {t.free}
              </Link>
            </div>
            <div className="mt-12 grid gap-5 border-t border-white/15 pt-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <p className="font-body text-xs font-semibold uppercase tracking-[.18em] text-signal">
                  Station 7.2 preview
                </p>
                <p className="mt-3 max-w-2xl font-body text-sm leading-6 text-white/65">
                  Read the opening, compare two failed approaches with a pass,
                  and see the examiner&apos;s reasoning at each decision point.
                </p>
              </div>
              <div className="border-s-2 border-signal ps-4 font-body text-sm leading-6 text-white/75">
                The consultation is not a script to memorise. It is a sequence
                of decisions you can practise.
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="border-b border-white/10 bg-[#09192b]">
        <div className="mx-auto grid w-full gap-8 px-6 py-16 sm:px-8 lg:max-w-6xl lg:grid-cols-[10rem_1fr] lg:px-10 lg:py-24">
          <p className="font-body text-xs font-semibold uppercase tracking-[.2em] text-signal">
            CASC
          </p>
          <div>
            <h2 className="max-w-3xl font-display text-3xl leading-tight sm:text-4xl">
              {t.problemTitle}
            </h2>
            <p className="mt-5 max-w-2xl font-body leading-7 text-white/65">
              {t.problem}
            </p>
            <blockquote className="mt-8 max-w-xl border-s-2 border-signal ps-5 font-display text-xl leading-snug text-white/90">
              Would I be confident to have this candidate as my registrar? That
              is the question behind every mark.
            </blockquote>
          </div>
        </div>
      </section>
      <section id="station" className="border-b border-white/10">
        <div className="mx-auto w-full px-6 py-16 sm:px-8 lg:max-w-6xl lg:px-10 lg:py-24">
          <h2 className="max-w-3xl font-display text-3xl sm:text-4xl">
            {t.howTitle}
          </h2>
          <p className="mt-5 max-w-3xl font-body leading-7 text-white/65">
            Every station is built around one named trap: the precise error that
            costs candidates marks in that scenario. Then you make the decisions
            yourself.
          </p>
          <div className="mt-10 grid gap-px bg-white/10 md:grid-cols-2 lg:grid-cols-5">
            {t.steps.map(([title, body], index) => (
              <article key={title} className="bg-ink p-6">
                <p className="font-body text-xs font-semibold text-signal">
                  0{index + 1}
                </p>
                <h3 className="mt-5 font-display text-xl">{title}</h3>
                <p className="mt-3 font-body text-sm leading-6 text-white/60">
                  {body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="border-b border-white/10 bg-[#09192b]">
        <div className="mx-auto flex w-full flex-col justify-between gap-8 px-6 py-16 sm:px-8 lg:max-w-6xl lg:flex-row lg:items-end lg:px-10 lg:py-24">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl">
              {t.previewTitle}
            </h2>
            <p className="mt-4 max-w-2xl font-body leading-7 text-white/65">
              {t.preview}
            </p>
          </div>
          <Link
            className={button}
            href={`/${locale}/academy/preview/station-7-2`}
          >
            {t.free}
          </Link>
        </div>
      </section>
      <section className="border-b border-white/10">
        <div className="mx-auto w-full px-6 py-16 sm:px-8 lg:max-w-6xl lg:px-10 lg:py-24">
          <h2 className="font-display text-3xl sm:text-4xl">
            {t.domainsTitle}
          </h2>
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {t.domains.map((domain, index) => (
              <div
                key={domain}
                className="border border-white/10 p-5 font-body text-sm"
              >
                <span className="me-3 text-signal">0{index + 1}</span>
                {domain}
              </div>
            ))}
          </div>
        </div>
      </section>
      <section id="included" className="border-b border-white/10 bg-[#09192b]">
        <div className="mx-auto w-full px-6 py-16 sm:px-8 lg:max-w-6xl lg:px-10 lg:py-24">
          <h2 className="font-display text-3xl sm:text-4xl">
            {t.includedTitle}
          </h2>
          <div className="mt-10 divide-y divide-white/10">
            {t.included.map(([title, body]) => (
              <article
                key={title}
                className="grid gap-4 py-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]"
              >
                <h3 className="font-display text-xl">{title}</h3>
                <p className="font-body leading-7 text-white/60">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="border-b border-white/10 bg-[#09192b]">
        <div className="mx-auto grid w-full gap-8 px-6 py-16 sm:px-8 lg:max-w-6xl lg:grid-cols-[10rem_1fr] lg:px-10 lg:py-24">
          <p className="font-body text-xs font-semibold uppercase tracking-[.2em] text-signal">
            {content.audience.eyebrow}
          </p>
          <div>
            <h2 className="max-w-3xl font-display text-3xl sm:text-4xl">
              {content.audience.title}
            </h2>
            <p className="mt-5 max-w-2xl font-body leading-7 text-white/65">
              {content.audience.body}
            </p>
            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {content.audience.items.map((item) => (
                <article
                  key={item.title}
                  className="border-t border-white/10 pt-5"
                >
                  <h3 className="font-display text-xl">{item.title}</h3>
                  <p className="mt-3 font-body text-sm leading-6 text-white/60">
                    {item.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>{" "}
      <section id="about" className="border-b border-white/10">
        <div className="mx-auto grid w-full gap-10 px-6 py-16 sm:px-8 lg:max-w-6xl lg:grid-cols-[10rem_minmax(0,1fr)_minmax(16rem,.65fr)] lg:px-10 lg:py-24">
          <p className="font-body text-xs font-semibold uppercase tracking-[.2em] text-signal">
            {content.founder.eyebrow}
          </p>
          <div>
            <h2 className="font-display text-3xl sm:text-4xl">
              {content.founder.title}
            </h2>
            <p className="mt-5 max-w-2xl font-body leading-7 text-white/65">
              {content.founder.body}
            </p>
            <Link
              className="mt-7 inline-flex border-b border-signal pb-1 font-body text-sm text-signal"
              href="/founder"
            >
              {content.founder.action}
            </Link>
          </div>
          <FounderPortrait
            caption="Dr Ahmed Abouelghit - former MRCPsych CASC examiner"
            className="max-w-[330px]"
          />
        </div>
      </section>
      <section id="gifts" className="border-b border-white/10 bg-[#09192b]">
        <div className="mx-auto grid w-full gap-10 px-6 py-16 sm:px-8 lg:max-w-6xl lg:grid-cols-2 lg:px-10 lg:py-24">
          <div>
            <p className="font-body text-xs font-semibold uppercase tracking-[.2em] text-signal">
              {t.giftsEyebrow}
            </p>
            <h2 className="mt-5 font-display text-3xl sm:text-4xl">
              {t.giftsTitle}
            </h2>
            <p className="mt-5 max-w-xl font-body leading-7 text-white/65">
              {t.giftsBody}
            </p>
          </div>
          <div className="border border-white/10 bg-ink p-6 sm:p-8">
            {!user ? (
              <>
                <h3 className="font-display text-2xl">{t.giftsTitle}</h3>
                <p className="mt-3 font-body leading-7 text-white/60">
                  {t.giftsBody}
                </p>
                <button
                  type="button"
                  className={`${button} mt-6`}
                  onClick={() =>
                    dialog?.openInterestDialog("casc-academy", "register")
                  }
                >
                  {t.login}
                </button>
              </>
            ) : (
              <>
                <h3 className="font-display text-2xl">{t.downloads}</h3>
                <div className="mt-6 grid gap-3">
                  {[
                    ["1", "The Examiner's Briefing.pdf"],
                    ["2", "The Examiner's Error Log.pdf"],
                  ].map(([id, name]) => (
                    <button
                      key={id}
                      type="button"
                      disabled={downloading !== null}
                      onClick={() =>
                        void downloadGift(
                          id as "1" | "2",
                          `${name}${(id === "1" && giftStatus?.gift1Downloaded) || (id === "2" && giftStatus?.gift2Downloaded) ? " - downloaded" : ""}`,
                        )
                      }
                      className="flex min-h-12 items-center justify-between border border-signal/50 px-4 text-start font-body text-sm font-semibold text-signal hover:bg-signal hover:text-ink disabled:opacity-60"
                    >
                      {downloading === id ? (
                        <Loader2 className="animate-spin" size={18} />
                      ) : (
                        <Gift size={18} />
                      )}
                      <span className="flex-1 px-3">{name}</span>
                      <Download size={16} />
                    </button>
                  ))}
                  <button
                    type="button"
                    disabled
                    className="flex min-h-12 items-center gap-3 border border-white/15 px-4 text-start font-body text-sm text-white/45"
                  >
                    <Mail size={18} />
                    {t.email}
                  </button>
                  {downloadError ? (
                    <p role="alert" className="font-body text-sm text-red-300">
                      Unable to download the resource. Please try again.
                    </p>
                  ) : null}
                </div>
              </>
            )}
          </div>
        </div>
      </section>
      <FeedbackSection pathway="casc-academy" />
      <section className="border-b border-white/10">
        <div className="mx-auto grid w-full gap-8 px-6 py-16 sm:px-8 lg:max-w-6xl lg:grid-cols-2 lg:px-10 lg:py-24">
          <div>
            <h2 className="font-display text-3xl">{t.coaching}</h2>
            <p className="mt-4 font-body leading-7 text-white/65">
              {t.coachingBody}
            </p>
          </div>
          <div className="lg:text-end">
            <Link href={`/${locale}/contact`} className={button}>
              {t.contact}
            </Link>
          </div>
        </div>
      </section>
      <section id="enrol" className="border-b border-white/10 bg-[#09192b]">
        <div className="mx-auto grid w-full gap-12 px-6 py-18 sm:px-8 lg:max-w-6xl lg:grid-cols-[minmax(0,1fr)_minmax(22rem,31rem)] lg:items-center lg:gap-20 lg:px-10 lg:py-28">
          <div className="max-w-xl">
            <p className="font-body text-xs font-semibold uppercase tracking-[.2em] text-signal">
              Enrol
            </p>
            <h2 className="mt-5 font-display text-4xl leading-tight sm:text-5xl">
              The founding hundred.
            </h2>
            <p className="mt-6 font-display text-xl leading-8 text-white/90">
              The first hundred candidates pay GBP 147. After that the price is
              GBP 247.
            </p>
            <p className="mt-5 font-body leading-7 text-white/65">
              This is not a countdown timer: there are one hundred places at the
              founding price, and when they are gone, they are gone.
            </p>
            <p className="mt-5 font-body leading-7 text-white/65">
              In exchange, we ask for one thing: a short piece of honest
              feedback once you have worked through the course.
            </p>
          </div>
          <aside className="rounded-2xl border border-white/80 border-t-4 border-t-signal bg-white p-6 text-ink shadow-2xl shadow-black/20 sm:p-9">
            <p className="font-display text-5xl leading-none sm:text-6xl">
              GBP 147
            </p>
            <p className="mt-3 font-body text-sm text-ink/65">
              For the founding hundred - then GBP 247
            </p>
            <ul className="mt-6 divide-y divide-ink/10 border-y border-ink/10 font-body text-sm text-ink/80">
              <li className="flex gap-3 py-3">
                <span className="text-signal">-</span>The full 43-station
                library
              </li>
              <li className="flex gap-3 py-3">
                <span className="text-signal">-</span>Twelve Weeks to the CASC
                workbook
              </li>
              <li className="flex gap-3 py-3">
                <span className="text-signal">-</span>The candidates&apos;
                practice community
              </li>
              <li className="flex gap-3 py-3">
                <span className="text-signal">-</span>The examiner&apos;s notes
                by email
              </li>
              <li className="flex gap-3 py-3">
                <span className="text-signal">-</span>Your certificate on
                completion
              </li>
              <li className="flex gap-3 py-3">
                <span className="text-signal">-</span>Twelve months&apos;
                access, extended for a resit
              </li>
            </ul>
            <SubscribeButton
              className="mt-7 flex min-h-12 w-full items-center justify-center rounded-full bg-signal px-6 font-body text-sm font-semibold text-ink transition-colors hover:bg-signal-light"
              showArrow={false}
            >
              Enrol now - GBP 147
            </SubscribeButton>
          </aside>
        </div>
      </section>
      <section className="border-b border-white/10">
        <div className="mx-auto w-full px-6 py-16 sm:px-8 lg:max-w-6xl lg:px-10 lg:py-24">
          <h2 className="font-display text-3xl">{t.faqTitle}</h2>
          <div className="mt-8">
            <FAQAccordion items={referenceFaqs} />
          </div>
        </div>
      </section>
      <section className="bg-[#09192b]">
        <div className="mx-auto max-w-3xl px-6 py-16 text-center sm:px-8 lg:py-24">
          <h2 className="font-display text-3xl sm:text-4xl">{t.close}</h2>
          <div className="mt-8">
            <SubscribeButton className={button} showArrow={false}>
              {t.final}
            </SubscribeButton>
          </div>
        </div>
      </section>
    </main>
  );
}
