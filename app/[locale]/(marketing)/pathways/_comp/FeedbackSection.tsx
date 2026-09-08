"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, Quote } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
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
  locale,
}: {
  feedback: PublicFeedback;
  locale: "ar" | "en";
}) {
  const t = useTranslations("feedbackSection");
  const fullName = feedback.full_name?.trim() || t("learner");
  const examDate = feedback.exam_date
    ? formatDate(feedback.exam_date, locale)
    : null;

  return (
    <blockquote className="flex h-64 sm:h-72 w-full flex-col justify-between rounded-2xl border border-white/10 bg-deep/95 p-5 sm:p-6 transition-all hover:border-gold/40 shadow-sm text-start">
      <header className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gold/40 bg-gold/15 font-sans text-xs font-semibold text-gold">
            {feedback.avatar_url ? (
              <img
                src={feedback.avatar_url}
                alt={`${fullName} ${t("profilePhoto")}`}
                className="!h-full !w-full !max-w-none rounded-full object-cover"
                onError={(e) => {
                  // Fallback to initials if image fails to load
                  e.currentTarget.style.display = "none";
                  const fallback = e.currentTarget.nextElementSibling as HTMLElement | null;
                  if (fallback) fallback.style.display = "flex";
                }}
              />
            ) : null}
            <span
              aria-hidden="true"
              style={{ display: feedback.avatar_url ? "none" : "flex" }}
              className="items-center justify-center size-full"
            >
              {initialsFor(fullName)}
            </span>
          </div>
          <cite className="truncate font-serif text-sm sm:text-base font-semibold not-italic text-white">
            {fullName}
          </cite>
        </div>
        {examDate ? (
          <div className="shrink-0 text-end font-sans text-xs leading-tight text-lbody">
            <span className="flex items-center justify-end gap-1 text-[11px] text-mute">
              <CalendarDays aria-hidden="true" className="size-3" />
              {t("examDate")}
            </span>
            <time
              dateTime={feedback.exam_date ?? undefined}
              className="text-gold font-semibold text-xs"
            >
              {examDate}
            </time>
          </div>
        ) : null}
      </header>
      <div className="mt-3.5 border-t border-white/10 pt-3.5 flex-1 min-h-0 overflow-y-auto pr-1">
        <Quote aria-hidden="true" className="size-4 text-gold" />
        <p className="mt-2 font-sans text-xs sm:text-sm leading-relaxed text-lbody line-clamp-4">
          {feedback.feedback}
        </p>
      </div>
      <footer className="mt-3 shrink-0 pt-2 border-t border-white/5">
        <time
          dateTime={feedback.updated_at}
          className="font-body text-[11px] text-mute"
        >
          {t("shared")} {formatDate(feedback.updated_at, locale)}
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
  const t = useTranslations("feedbackSection");
  const locale = useLocale() as "ar" | "en";
  const { data: feedback, isPending, isError } = usePathwayFeedback(pathway);
  const feedbackItems = useMemo<LogoItem[]>(() => {
    const raw = feedback ?? [];
    if (raw.length === 0) return [];
    // Ensure we have at least 4 items in the sequence so the continuous ticker loop animates smoothly
    const items = raw.length < 4 ? [...raw, ...raw, ...raw, ...raw].slice(0, Math.max(raw.length * 2, 4)) : raw;
    return items.map((item) => ({
      node: (
        <div className="w-72 sm:w-80 h-full py-1">
          <FeedbackCard feedback={item} locale={locale} />
        </div>
      ),
    }));
  }, [feedback, locale]);

  if (isError || (!isPending && feedback?.length === 0)) return null;

  return (
    <section
      aria-labelledby="pathway-feedback-title"
      className="overflow-hidden border-b border-white/10 bg-navy text-white on-navy py-12 sm:py-16"
    >
      <div className="mx-auto w-full px-6 sm:px-8 lg:max-w-6xl lg:px-10">
        <p className="kicker text-gold">{t("eyebrow")}</p>
        <h2
          id="pathway-feedback-title"
          className="mt-2 max-w-3xl font-serif text-2xl sm:text-3xl md:text-4xl font-normal leading-tight text-white"
        >
          {t("title")}
        </h2>
        <div className="mt-8">
          {isPending ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }, (_, index) => (
                <div
                  key={index}
                  aria-hidden="true"
                  className="h-48 animate-pulse rounded-2xl border border-white/10 bg-deep/50"
                />
              ))}
            </div>
          ) : (
            <LogoLoop
              logos={feedbackItems}
              renderItem={renderFeedbackItem}
              ariaLabel={t("loopLabel")}
              speed={18}
              gap={16}
              logoHeight={1}
              pauseOnHover
            />
          )}
        </div>
      </div>
    </section>
  );
}
