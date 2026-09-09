"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Award, BookOpen, CalendarDays, Quote } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import LogoLoop, { type LogoItem } from "@/components/LogoLoop";
import { apiRequest } from "@/lib/api/client";
import type { PathwayKey } from "./pathwayContent";

export type FeedbackScope = PathwayKey | "all";

type PublicFeedback = {
  feedback: string;
  updated_at: string;
  course_slug: string;
  course_name: string | null;
  course_name_ar: string | null;
  certificate_date: string | null;
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
  const courseName =
    (locale === "ar" && feedback.course_name_ar
      ? feedback.course_name_ar
      : feedback.course_name) || null;
  const certificateDate = feedback.certificate_date
    ? formatDate(feedback.certificate_date, locale)
    : null;
  const examDate = feedback.exam_date
    ? formatDate(feedback.exam_date, locale)
    : null;

  return (
    <blockquote className="group relative flex h-[270px] sm:h-[285px] w-full flex-col justify-between rounded-2xl border border-white/10 bg-gradient-to-b from-deep/95 via-[#11233d]/90 to-deep/95 p-5 sm:p-6 text-start shadow-md transition-all duration-300 hover:border-gold/40 hover:shadow-[0_8px_30px_rgba(212,175,55,0.08)]">
      {/* Header: Candidate Identity, Credentials & Quote Accent */}
      <header className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gold/30 bg-gold/10 font-sans text-xs font-semibold text-gold shadow-sm">
            {feedback.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={feedback.avatar_url}
                alt={`${fullName} ${t("profilePhoto")}`}
                className="size-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  const fallback = e.currentTarget
                    .nextElementSibling as HTMLElement | null;
                  if (fallback) fallback.style.display = "flex";
                }}
              />
            ) : null}
            <span
              aria-hidden="true"
              style={{ display: feedback.avatar_url ? "none" : "flex" }}
              className="items-center justify-center size-full font-serif"
            >
              {initialsFor(fullName)}
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <cite className="block truncate font-serif text-sm sm:text-base font-semibold not-italic text-white">
              {fullName}
            </cite>
            <div className="mt-1 flex flex-col gap-0.5 font-sans text-[11px]">
              {examDate ? (
                <div className="flex items-center gap-1.5 text-mute">
                  <CalendarDays
                    aria-hidden="true"
                    className="size-3 shrink-0 text-mute/80"
                  />
                  <span className="truncate">
                    {t("examDate")}:{" "}
                    <time
                      dateTime={feedback.exam_date ?? undefined}
                      className="text-lbody font-medium"
                    >
                      {examDate}
                    </time>
                  </span>
                </div>
              ) : null}

              {certificateDate ? (
                <div className="flex items-center gap-1.5 text-gold font-medium">
                  <Award
                    aria-hidden="true"
                    className="size-3.5 shrink-0 text-gold"
                  />
                  <span className="truncate">
                    {t("certificateDate")}:{" "}
                    <time
                      dateTime={feedback.certificate_date ?? undefined}
                      className="text-lbody/90 font-normal"
                    >
                      {certificateDate}
                    </time>
                  </span>
                </div>
              ) : null}

              {!examDate && !certificateDate ? (
                <div className="text-mute truncate">
                  {courseName || t("learner")}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <Quote
          aria-hidden="true"
          className="size-5 shrink-0 text-gold/30 transition-colors duration-300 group-hover:text-gold/60"
        />
      </header>

      {/* Quote Body */}
      <div className="my-auto py-2 flex-1 flex items-center">
        <p
          className="font-sans text-xs sm:text-sm leading-relaxed text-lbody/95 line-clamp-4 font-normal"
          title={feedback.feedback}
        >
          &ldquo;{feedback.feedback}&rdquo;
        </p>
      </div>

      {/* Footer: Course Context & Shared Date */}
      <footer className="mt-auto pt-3 border-t border-white/[0.08] flex items-center justify-between gap-2 text-xs text-mute font-sans">
        {courseName ? (
          <div
            className="flex items-center gap-1.5 min-w-0 max-w-[62%]"
            title={courseName}
          >
            <BookOpen aria-hidden="true" className="size-3.5 text-gold/80 shrink-0" />
            <span className="truncate text-lbody/90 font-medium">
              {courseName}
            </span>
          </div>
        ) : (
          <div />
        )}

        <time
          dateTime={feedback.updated_at}
          className="shrink-0 text-[11px] text-mute/80"
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
    const items =
      raw.length < 4
        ? [...raw, ...raw, ...raw, ...raw].slice(0, Math.max(raw.length * 2, 4))
        : raw;
    return items.map((item) => ({
      node: (
        <div className="w-[320px] sm:w-[360px] h-full py-1.5">
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
                  className="h-[270px] sm:h-[285px] animate-pulse rounded-2xl border border-white/10 bg-deep/50"
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
