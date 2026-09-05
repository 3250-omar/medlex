"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
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

  if (isLoading)
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="h-48 animate-pulse bg-white/10" />
        <div className="h-48 animate-pulse bg-white/10" />
      </div>
    );
  if (error)
    return (
      <div className="border border-red-300/30 bg-red-500/10 p-6 text-white">
        <p>We could not load your courses.</p>
        <button
          className="mt-4 text-signal underline"
          onClick={() => void refetch()}
        >
          Try again
        </button>
      </div>
    );
  if (!courses?.length)
    return (
      <div className="border border-white/10 bg-white/5 p-8">
        <h2 className="font-display text-3xl">No enrolled courses yet.</h2>
        <p className="mt-3 max-w-xl text-white/65">
          Your active courses will appear here once you subscribe.
        </p>
        <Link
          className="mt-6 inline-flex min-h-12 items-center bg-signal px-6 font-body text-sm font-medium text-ink transition-transform hover:-translate-y-0.5 hover:bg-signal-light"
          href={`/${locale}#pathways-heading`}
        >
          Explore pathways
        </Link>
      </div>
    );
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {courses.map((course) => (
        <article
          key={course.enrollmentId}
          className="flex min-h-60 flex-col border border-white/10 bg-white/5 p-6"
        >
          <p className="font-body text-[10px] font-semibold uppercase tracking-[.2em] text-signal">
            {course.status}
          </p>
          <h2 className="mt-4 font-display text-3xl">
            {locale === "ar" && course.titleAr
              ? course.titleAr
              : course.titleEn}
          </h2>
          <p className="mt-4 flex-1 font-body leading-7 text-white/65">
            {locale === "ar" && course.descriptionAr
              ? course.descriptionAr
              : course.descriptionEn}
          </p>

          {/* Progress bar and counter */}
          <div className="mt-6 border-t border-white/10 pt-4">
            <div className="flex items-center justify-between font-body text-xs text-white/70">
              <span>
                {locale === "ar"
                  ? `${course.completedUnits || 0} من أصل ${course.totalUnits || 0} درس مكتمل`
                  : `${course.completedUnits || 0} of ${course.totalUnits || 0} lessons completed`}
              </span>
              <span className="font-medium text-signal">
                {course.progressPercent || 0}%
              </span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full bg-signal transition-all duration-500 ease-out"
                style={{
                  width: `${Math.min(100, Math.max(0, course.progressPercent || 0))}%`,
                }}
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {course.currentUnitSlug || course.firstUnitSlug ? (
              <Link
                className="inline-flex min-h-12 flex-1 items-center justify-center bg-signal px-5 font-body text-sm font-medium text-ink transition-transform hover:-translate-y-0.5 hover:bg-signal-light"
                href={`/${locale}/academy/courses/${course.slug}/learn/${course.currentUnitSlug || course.firstUnitSlug}`}
              >
                {course.progressPercent && course.progressPercent >= 100
                  ? locale === "ar"
                    ? "مراجعة الكورس ✓"
                    : "Review course ✓"
                  : course.progressPercent && course.progressPercent > 0
                    ? locale === "ar"
                      ? "متابعة الكورس →"
                      : "Resume course →"
                    : locale === "ar"
                      ? "ابدأ الكورس →"
                      : "Start course →"}
              </Link>
            ) : null}

            {course.progressPercent && course.progressPercent >= 50 ? (
              <Link
                className="inline-flex min-h-12 items-center justify-center border border-[#d4af37]/60 bg-[#d4af37]/10 px-5 font-body text-sm font-semibold text-[#d4af37] transition-all hover:bg-[#d4af37] hover:text-[#070e17]"
                href={`/${locale}/academy/courses/${course.slug}/certificate`}
                title={
                  locale === "ar"
                    ? "عرض شهادة الإتمام"
                    : "View Certificate of Completion"
                }
              >
                🎓 {locale === "ar" ? "الشهادة" : "Certificate"}
              </Link>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
}
