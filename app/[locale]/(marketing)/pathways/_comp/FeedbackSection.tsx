"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, Quote } from "lucide-react";
import { useLocale } from "next-intl";
import LogoLoop, { type LogoItem } from "@/components/LogoLoop";
import { apiRequest } from "@/lib/api/client";
import type { PathwayKey } from "./pathwayContent";

export type FeedbackScope = PathwayKey | "all";

type PublicFeedback = {
  feedback: string;
  updated_at: string;
  course_slug: string;
  full_name: string | null;
  exam_date: string | null;
  avatar_url: string | null;
};

type FeedbackSectionProps = {
  pathway?: FeedbackScope;
};

type FeedbackLabels = {
  eyebrow: string;
  title: string;
  learner: string;
  examDate: string;
  shared: string;
  profilePhoto: string;
  loopLabel: string;
};

const copy: Record<"en" | "ar", FeedbackLabels> = {
  en: {
    eyebrow: "Candidate feedback",
    title: "What learners say after working through the course.",
    learner: "MedLex learner",
    examDate: "Exam date",
    shared: "Shared",
    profilePhoto: "profile photo",
    loopLabel: "Learner feedback",
  },
  ar: {
    eyebrow:
      "\u0622\u0631\u0627\u0621 \u0627\u0644\u0645\u062a\u062f\u0631\u0628\u064a\u0646",
    title:
      "\u0645\u0627 \u064a\u0642\u0648\u0644\u0647 \u0627\u0644\u0645\u062a\u062f\u0631\u0628\u0648\u0646 \u0628\u0639\u062f \u0625\u062a\u0645\u0627\u0645 \u0627\u0644\u062f\u0648\u0631\u0629.",
    learner:
      "\u0645\u062a\u062f\u0631\u0628 \u0645\u064a\u062f\u0644\u064a\u0643\u0633",
    examDate:
      "\u062a\u0627\u0631\u064a\u062e \u0627\u0644\u0627\u0645\u062a\u062d\u0627\u0646",
    shared:
      "\u062a\u0645\u062a \u0627\u0644\u0645\u0634\u0627\u0631\u0643\u0629",
    profilePhoto: "\u0635\u0648\u0631\u0629 \u0634\u062e\u0635\u064a\u0629",
    loopLabel:
      "\u0622\u0631\u0627\u0621 \u0627\u0644\u0645\u062a\u062f\u0631\u0628\u064a\u0646",
  },
};

function usePathwayFeedback(pathway: FeedbackScope) {
  return useQuery({
    queryKey: ["pathway-feedback", pathway],
    queryFn: () =>
      apiRequest<PublicFeedback[]>(
        `/api/pathway-feedback?pathway=${encodeURIComponent(pathway)}`,
      ),
    staleTime: 60_000,
  });
}

function formatDate(value: string, locale: "ar" | "en") {
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value.slice(0, 10)}T00:00:00`));
}

function initialsFor(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function FeedbackCard({
  feedback,
  labels,
  locale,
}: {
  feedback: PublicFeedback;
  labels: FeedbackLabels;
  locale: "ar" | "en";
}) {
  const fullName = feedback.full_name?.trim() || labels.learner;
  const examDate = feedback.exam_date
    ? formatDate(feedback.exam_date, locale)
    : null;

  return (
    <blockquote className="flex min-h-72 flex-col border border-white/10 bg-[#09192b] p-6 transition-colors hover:border-signal/40">
      <header className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-signal/40 bg-signal/15 font-body text-sm font-semibold text-signal">
            {feedback.avatar_url ? (
              <img
                src={feedback.avatar_url}
                alt={`${fullName} ${labels.profilePhoto}`}
                className="size-full object-cover"
              />
            ) : (
              <span aria-hidden="true">{initialsFor(fullName)}</span>
            )}
          </div>
          <cite className="truncate font-body text-sm font-semibold not-italic text-white">
            {fullName}
          </cite>
        </div>
        {examDate ? (
          <div className="shrink-0 text-end font-body text-xs leading-5 text-white/60">
            <span className="flex items-center justify-end gap-1.5 text-white/45">
              <CalendarDays aria-hidden="true" className="size-3.5" />
              {labels.examDate}
            </span>
            <time
              dateTime={feedback.exam_date ?? undefined}
              className="text-signal"
            >
              {examDate}
            </time>
          </div>
        ) : null}
      </header>
      <div className="mt-7 border-t border-white/10 pt-6">
        <Quote aria-hidden="true" className="size-5 text-signal" />
        <p className="mt-4 font-body text-base leading-7 text-white/80">
          {feedback.feedback}
        </p>
      </div>
      <footer className="mt-auto pt-6">
        <time
          dateTime={feedback.updated_at}
          className="font-body text-xs text-white/45"
        >
          {labels.shared} {formatDate(feedback.updated_at, locale)}
        </time>
      </footer>
    </blockquote>
  );
}

function renderFeedbackItem(item: LogoItem) {
  return "node" in item ? item.node : null;
}

export default function FeedbackSection({
  pathway = "all",
}: FeedbackSectionProps) {
  const locale = useLocale() === "ar" ? "ar" : "en";
  const labels = copy[locale];
  const { data: feedback, isPending, isError } = usePathwayFeedback(pathway);
  const shouldLoop = (feedback?.length ?? 0) > 4;
  const feedbackItems = useMemo<LogoItem[]>(
    () =>
      (feedback ?? []).map((item) => ({
        node: (
          <div className="w-80 sm:w-96">
            <FeedbackCard feedback={item} labels={labels} locale={locale} />
          </div>
        ),
      })),
    [feedback, labels, locale],
  );

  if (isError || (!isPending && feedback?.length === 0)) return null;

  return (
    <section
      aria-labelledby="pathway-feedback-title"
      className={
        shouldLoop
          ? "overflow-hidden border-b border-white/10 bg-ink text-white"
          : "border-b border-white/10 bg-ink text-white"
      }
    >
      <div className="mx-auto w-full px-6 py-16 sm:px-8 lg:max-w-6xl lg:px-10 lg:py-24">
        <p className="font-body text-xs font-semibold uppercase tracking-[.2em] text-signal">
          {labels.eyebrow}
        </p>
        <h2
          id="pathway-feedback-title"
          className="mt-5 max-w-3xl font-display text-3xl leading-tight sm:text-4xl"
        >
          {labels.title}
        </h2>
        <div className="mt-10">
          {isPending ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }, (_, index) => (
                <div
                  key={index}
                  aria-hidden="true"
                  className="h-72 animate-pulse border border-white/10 bg-white/5"
                />
              ))}
            </div>
          ) : shouldLoop ? (
            <LogoLoop
              logos={feedbackItems}
              renderItem={renderFeedbackItem}
              ariaLabel={labels.loopLabel}
              speed={18}
              gap={16}
              logoHeight={1}
              pauseOnHover
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {feedback?.map((item) => (
                <FeedbackCard
                  key={`${item.course_slug}-${item.updated_at}-${item.feedback}`}
                  feedback={item}
                  labels={labels}
                  locale={locale}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
