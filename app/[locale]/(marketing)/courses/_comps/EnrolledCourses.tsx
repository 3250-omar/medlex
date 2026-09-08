"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  Play,
  RotateCcw,
} from "lucide-react";
import SpotlightCard from "@/components/SpotlightCard";
import {
  useCurrentUser,
  useEnrolledCourses,
} from "../../_apiCalls/academyQueries";

export default function EnrolledCourses() {
  const locale = useLocale();
  const { data: user } = useCurrentUser();
  const {
    data: courses,
    isLoading,
    error,
    refetch,
  } = useEnrolledCourses(Boolean(user));

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
          <p className="font-serif text-2xl">
            We could not load your courses.
          </p>
          <p className="mt-2 max-w-xl font-sans text-sm leading-6 text-lbody">
            Please check your connection and try again.
          </p>
          <button
            type="button"
            className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 px-5 font-body text-sm text-white transition-colors hover:border-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
            onClick={() => void refetch()}
          >
            <RotateCcw aria-hidden="true" className="size-4" />
            Try again
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
            No enrolled courses yet.
          </h2>
          <p className="mt-3 max-w-xl font-sans leading-7 text-lbody">
            Your active courses will appear here once you subscribe.
          </p>
          <Link
            className="btn btn-gold !rounded-full mt-6 !min-h-12 !px-7 text-sm font-semibold text-navy inline-flex items-center gap-2"
            href={`/${locale}#pathways-heading`}
          >
            Explore pathways
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
      </SpotlightCard>
    );
  }

  return (
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
          ? locale === "ar"
            ? "مراجعة الكورس"
            : "Review course"
          : hasStarted
            ? locale === "ar"
              ? "متابعة الكورس"
              : "Resume course"
            : locale === "ar"
              ? "ابدأ الكورس"
              : "Start course";

        return (
          <SpotlightCard key={course.enrollmentId} className="rounded-2xl">
            <article className="flex min-h-80 flex-col rounded-2xl border border-white/10 bg-deep p-6 sm:p-8 transition-all duration-300 hover:border-gold/30">
              <div className="flex items-center justify-between gap-4">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 font-body text-[10px] font-semibold uppercase tracking-[0.16em] text-gold">
                  <CheckCircle2 aria-hidden="true" className="size-3" />
                  {course.status}
                </span>
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
                    {locale === "ar"
                      ? `${completedUnits} من أصل ${totalUnits} درس مكتمل`
                      : `${completedUnits} of ${totalUnits} lessons completed`}
                  </span>
                  <span className="shrink-0 text-white/50">
                    {isComplete
                      ? locale === "ar"
                        ? "مكتمل"
                        : "Completed"
                      : locale === "ar"
                        ? "قيد التقدم"
                        : "In progress"}
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
                    title={
                      locale === "ar"
                        ? "عرض شهادة الإتمام"
                        : "View Certificate of Completion"
                    }
                  >
                    <Award aria-hidden="true" className="size-4" />
                    {locale === "ar" ? "الشهادة" : "Certificate"}
                  </Link>
                ) : null}
              </div>
            </article>
          </SpotlightCard>
        );
      })}
    </div>
  );
}
