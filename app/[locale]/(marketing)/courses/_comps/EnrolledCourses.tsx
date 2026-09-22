"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  Play,
  RotateCcw,
  Video,
} from "lucide-react";
import SpotlightCard from "@/components/SpotlightCard";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  type EnrolledCourse,
  type UserUpcomingBooking,
  useCurrentUser,
  useEnrolledCourses,
} from "../../_apiCalls/academyQueries";
import PrivateSessionsDialog from "./PrivateSessionsDialog";

export default function EnrolledCourses() {
  const locale = useLocale();
  const t = useTranslations("enrolledCourses");
  const { data: user } = useCurrentUser();
  const [selectedCourseSessions, setSelectedCourseSessions] = useState<{
    courseTitle: string;
    sessions: UserUpcomingBooking[];
  } | null>(null);

  const {
    data: courses,
    isLoading,
    error,
    refetch,
  } = useEnrolledCourses(Boolean(user));

  const handlePrivateSessionClick = (
    e: React.MouseEvent,
    course: EnrolledCourse,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    const sessions = course.privateSessions || [];
    if (sessions.length === 0) return;

    if (sessions.length === 1) {
      const link = sessions[0].joinUrl || sessions[0].sessionLink;
      if (link) {
        window.open(link, "_blank", "noopener,noreferrer");
        return;
      }
    }

    const courseTitle =
      locale === "ar" && course.titleAr ? course.titleAr : course.titleEn;
    setSelectedCourseSessions({
      courseTitle,
      sessions,
    });
  };

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2" aria-label="Loading courses">
        <div className="h-80 animate-pulse rounded-2xl border border-white/10 bg-deep/60" />
        <div className="h-80 animate-pulse rounded-2xl border border-white/10 bg-deep/60" />
      </div>
    );
  }

  if (error) {
    return (
      <SpotlightCard className="rounded-2xl">
        <div className="rounded-2xl border border-red-500/30 bg-red-950/20 p-6 text-white sm:p-8">
          <p className="font-serif text-2xl">{t("errorTitle")}</p>
          <p className="mt-2 max-w-xl font-sans text-sm leading-6 text-lbody">
            {t("errorDescription")}
          </p>
          <button
            type="button"
            className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 px-5 font-body text-sm text-white transition-colors hover:border-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
            onClick={() => void refetch()}
          >
            <RotateCcw aria-hidden="true" className="size-4" />
            {t("tryAgain")}
          </button>
        </div>
      </SpotlightCard>
    );
  }

  if (!courses?.length) {
    return (
      <SpotlightCard className="rounded-2xl">
        <div className="rounded-2xl border border-white/10 bg-deep p-8 sm:p-12">
          <BookOpen aria-hidden="true" className="size-8 text-gold" />
          <h2 className="mt-5 font-serif text-3xl font-normal text-white">
            {t("emptyTitle")}
          </h2>
          <p className="mt-3 max-w-xl font-sans leading-7 text-lbody">
            {t("emptyDescription")}
          </p>
          <Link
            className="btn btn-gold !rounded-full mt-6 !min-h-12 !px-7 text-sm font-semibold text-navy inline-flex items-center gap-2"
            href={`/${locale}#pathways-heading`}
          >
            {t("explorePathways")}
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
      </SpotlightCard>
    );
  }

  return (
    <TooltipProvider delay={100}>
      <div className="grid gap-6 md:grid-cols-2">
        {courses.map((course) => {
          const progress = Math.min(
            100,
            Math.max(0, course.progressPercent || 0),
          );
          const completedUnits = course.completedUnits || 0;
          const totalUnits = course.totalUnits || 0;
          const isComplete = progress >= 100;
          const hasStarted = progress > 0;
          const title =
            locale === "ar" && course.titleAr ? course.titleAr : course.titleEn;
          const description =
            locale === "ar" && course.descriptionAr
              ? course.descriptionAr
              : course.descriptionEn;
          const actionLabel = isComplete
            ? t("reviewCourse")
            : hasStarted
              ? t("resumeCourse")
              : t("startCourse");

          return (
            <SpotlightCard key={course.enrollmentId} className="rounded-2xl">
              <article className="flex min-h-80 flex-col rounded-2xl border border-white/10 bg-deep p-6 sm:p-8 transition-all duration-300 hover:border-gold/30">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 font-body text-[10px] font-semibold uppercase tracking-[0.16em] text-gold">
                      <CheckCircle2 aria-hidden="true" className="size-3" />
                      {course.status}
                    </span>

                    {course.privateSessions &&
                      course.privateSessions.length > 0 &&
                      (() => {
                        const count = course.privateSessions.length;
                        const singleDate = course.privateSessions[0]?.startsAt
                          ? new Date(
                              course.privateSessions[0].startsAt,
                            ).toLocaleDateString(
                              locale === "ar" ? "ar-EG" : "en-US",
                              {
                                day: "numeric",
                                month: "short",
                              },
                            )
                          : "";

                        const label =
                          count > 1
                            ? t("multipleSessions", { count })
                            : singleDate
                              ? t("liveSessionWithDate", { date: singleDate })
                              : t("liveSession");

                        const tooltipText =
                          count > 1
                            ? t("tooltipMultiple")
                            : t("tooltipSingle");

                        return (
                          <Tooltip>
                            <TooltipTrigger
                              type="button"
                              onClick={(e) =>
                                handlePrivateSessionClick(e, course)
                              }
                              className="group relative inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/15 hover:bg-emerald-500/25 px-3 py-1 font-body text-[11px] font-medium text-emerald-300 transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_12px_rgba(16,185,129,0.25)] hover:shadow-[0_0_18px_rgba(16,185,129,0.4)] cursor-pointer"
                              title={tooltipText}
                            >
                              <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                              </span>
                              <Video className="size-3.5 text-emerald-400 transition-transform duration-300 group-hover:scale-110" />
                              <span>{label}</span>
                            </TooltipTrigger>
                            <TooltipContent
                              side="top"
                              className="border border-emerald-500/30 bg-navy text-white text-xs px-3 py-1.5 rounded-lg shadow-xl"
                            >
                              {tooltipText}
                            </TooltipContent>
                          </Tooltip>
                        );
                      })()}
                  </div>

                  <span className="font-body text-sm font-semibold tabular-nums text-gold">
                    {progress}%
                  </span>
                </div>

                <h2 className="mt-5 font-serif text-2xl sm:text-3xl font-normal leading-tight text-white">
                  {title}
                </h2>
                <p className="mt-3 flex-1 font-sans text-sm leading-relaxed text-lbody sm:text-base">
                  {description}
                </p>

                <div className="mt-7 border-t border-white/10 pt-5">
                  <div className="flex items-center justify-between gap-4 font-body text-xs text-mute">
                    <span>
                      {t("lessonsCompleted", {
                        completed: completedUnits,
                        total: totalUnits,
                      })}
                    </span>
                    <span className="shrink-0 text-white/50">
                      {isComplete ? t("completed") : t("inProgress")}
                    </span>
                  </div>
                  <div
                    className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10"
                    role="progressbar"
                    aria-label={`${title} progress`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={progress}
                  >
                    <div
                      className="h-full rounded-full bg-gold transition-[width] duration-500 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="mt-7 flex flex-wrap items-center gap-3">
                  {course.currentUnitSlug || course.firstUnitSlug ? (
                    <Link
                      className="btn btn-gold !rounded-full !min-h-12 flex-1 items-center justify-center gap-2 !px-6 text-sm font-semibold text-navy inline-flex"
                      href={`/${locale}/academy/courses/${course.slug}/learn/${course.currentUnitSlug || course.firstUnitSlug}`}
                    >
                      {isComplete ? (
                        <RotateCcw aria-hidden="true" className="size-4" />
                      ) : (
                        <Play aria-hidden="true" className="size-4" />
                      )}
                      {actionLabel}
                    </Link>
                  ) : null}

                  {progress >= 50 ? (
                    <Link
                      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-gold/60 bg-gold/10 px-5 font-body text-sm font-semibold text-gold transition-colors hover:bg-gold hover:text-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
                      href={`/${locale}/academy/courses/${course.slug}/certificate`}
                      title={t("viewCertificate")}
                    >
                      <Award aria-hidden="true" className="size-4" />
                      {t("certificate")}
                    </Link>
                  ) : null}
                </div>
              </article>
            </SpotlightCard>
          );
        })}
      </div>

      <PrivateSessionsDialog
        open={Boolean(selectedCourseSessions)}
        onOpenChange={(open) => {
          if (!open) setSelectedCourseSessions(null);
        }}
        courseTitle={selectedCourseSessions?.courseTitle}
        sessions={selectedCourseSessions?.sessions || []}
      />
    </TooltipProvider>
  );
}
