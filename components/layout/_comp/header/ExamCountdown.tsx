"use client";

import { useState, useEffect, memo } from "react";
import Link from "next/link";
import { CalendarDays, Play } from "lucide-react";
import Counter from "@/components/Counter";
import { useLocale, useTranslations } from "next-intl";
import type { EnrolledCourse } from "@/app/[locale]/(marketing)/_apiCalls/academyQueries";

export interface ExamCountdownProps {
  examDate: string;
  course: EnrolledCourse | null | undefined;
  isLoading: boolean;
  containerRef?: React.RefObject<HTMLElement | null>;
}

export const ExamCountdown = memo(function ExamCountdown({
  examDate,
  course,
  isLoading,
  containerRef,
}: ExamCountdownProps) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1_000);
    return () => window.clearInterval(timer);
  }, []);

  const t = useTranslations("exam");
  const locale = useLocale();
  const examTime = new Date(`${examDate}T00:00:00`).getTime();
  const isExamDay = now >= examTime;
  const remainingSeconds = Math.max(0, Math.floor((examTime - now) / 1_000));
  const days = Math.floor(remainingSeconds / 86_400);
  const hours = Math.floor((remainingSeconds % 86_400) / 3_600);
  const minutes = Math.floor((remainingSeconds % 3_600) / 60);
  const seconds = remainingSeconds % 60;
  const resumeUnit = course?.currentUnitSlug ?? course?.firstUnitSlug;
  const formattedExamDate = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${examDate}T00:00:00`));

  const getCountdownLabel = (
    key: "daysShort" | "hoursShort" | "minutesShort" | "secondsShort",
    fallback: string,
  ) => (t.has(key) ? t(key) : fallback);

  const countdownUnits = [
    { value: days, label: getCountdownLabel("daysShort", "days") },
    { value: hours, label: getCountdownLabel("hoursShort", "hrs") },
    { value: minutes, label: getCountdownLabel("minutesShort", "min") },
    { value: seconds, label: getCountdownLabel("secondsShort", "sec") },
  ];

  return (
    <section
      ref={containerRef}
      aria-label={t("title")}
      className="border-b border-gold/25 bg-deep/95 text-white backdrop-blur-md"
    >
      <div className="mx-auto flex min-h-[64px] sm:min-h-[72px] w-full max-w-7xl items-center justify-between gap-2.5 sm:gap-4 px-3 sm:px-6 lg:justify-center lg:gap-x-6 lg:px-10 py-1.5 sm:py-2">
        <div className="flex shrink-0 items-center justify-center gap-2 sm:gap-3 rounded-lg border border-gold/45 bg-gold/[0.08] px-2 sm:px-2.5 py-1 sm:py-1.5 shadow-[0_0_24px_rgba(212,175,55,0.12)]">
          <CalendarDays
            className="size-3.5 sm:size-4 text-gold shrink-0"
            aria-hidden="true"
          />
          {isExamDay ? (
            <p className="whitespace-nowrap px-1 text-xs font-semibold text-gold sm:text-base">
              {t("today")} — {locale === "ar" ? "بالتوفيق" : "Good luck"}
            </p>
          ) : (
            <>
              <div
                className="flex items-center overflow-hidden rounded-sm border border-white/10 bg-deep/60"
                dir="ltr"
                aria-hidden="true"
              >
                {countdownUnits.map((unit) => (
                  <div
                    key={unit.label}
                    className="min-w-[28px] sm:min-w-8 lg:min-w-9 border-e border-white/10 px-0.5 sm:px-1 text-center last:border-e-0"
                  >
                    <Counter
                      value={String(unit.value)}
                      fontSize={22}
                      padding={2}
                      gap={0}
                      horizontalPadding={0}
                      textColor="var(--gold)"
                      fontWeight="600"
                      gradientHeight={4}
                      gradientFrom="rgba(20, 42, 73, 0.95)"
                    />
                    <p className="mt-0.5 text-[7px] sm:text-[8px] lg:text-[9px] font-semibold uppercase tracking-[0.1em] text-white/45">
                      {unit.label}
                    </p>
                  </div>
                ))}
              </div>
              <span className="sr-only">
                {t("daysRemaining", { count: days })}
              </span>
            </>
          )}
          <div className="hidden border-s border-white/10 ps-3 sm:ps-4 leading-tight md:block">
            <p className="font-body text-[10px] font-semibold uppercase tracking-[0.14em] text-gold">
              {t("examDateLabel")}
            </p>
            <p className="mt-0.5 text-xs text-white/65">{formattedExamDate}</p>
          </div>
        </div>
        {!isLoading && (
          <div className="flex min-w-0 flex-1 flex-col items-start justify-center gap-1 lg:flex-row lg:items-center lg:gap-4 lg:flex-initial">
            <p
              className="w-full truncate text-[11px] sm:text-xs lg:text-sm text-white/80 leading-tight lg:w-auto"
              title={course ? t("subscribedMessage") : t("subscribeMessage")}
            >
              {course ? t("subscribedMessage") : t("subscribeMessage")}
            </p>

            <div className="flex items-center gap-2 shrink-0">
              {course ? (
                <>
                  <div
                    className="hidden h-1.5 w-16 sm:w-20 lg:w-28 overflow-hidden rounded-full bg-white/15 sm:block"
                    role="progressbar"
                    aria-label={t("progress", {
                      count: course.progressPercent,
                    })}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={course.progressPercent}
                  >
                    <div
                      className="h-full rounded-full bg-gold transition-[width] duration-500"
                      style={{ width: `${course.progressPercent}%` }}
                    />
                  </div>
                  <span className="text-[10px] sm:text-xs font-semibold text-gold">
                    {course.progressPercent}%
                  </span>
                  {resumeUnit && (
                    <Link
                      href={`/${locale}/academy/courses/${course.slug}/learn/${resumeUnit}`}
                      className="btn btn-gold shrink-0 !h-7 sm:!h-8.5 !py-0.5 sm:!py-1 !px-2.5 sm:!px-3.5 text-[11px] sm:text-xs font-semibold whitespace-nowrap"
                    >
                      <Play
                        className="size-3 sm:size-3.5 me-1 shrink-0"
                        aria-hidden="true"
                      />
                      <span className="text-xs">{t("continueLesson")}</span>
                    </Link>
                  )}
                </>
              ) : (
                <Link
                  href={`/${locale}#pathways-heading`}
                  className="btn btn-ghost shrink-0 !h-7 sm:!h-8.5 !py-0.5 sm:!py-1 !px-2.5 sm:!px-3.5 text-[11px] sm:text-xs font-semibold !text-gold !border-gold/60 hover:!bg-gold hover:!text-navy whitespace-nowrap"
                >
                  <span>{t("exploreCourses")}</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
});

export default ExamCountdown;
