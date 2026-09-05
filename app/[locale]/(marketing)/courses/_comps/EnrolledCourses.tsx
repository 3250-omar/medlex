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
          {course.firstUnitSlug ? (
            <Link
              className="mt-7 inline-flex min-h-12 items-center justify-center bg-signal px-5 font-body text-sm font-medium text-ink"
              href={`/${locale}/academy/courses/${course.slug}/learn/${course.firstUnitSlug}`}
            >
              Open course questions
            </Link>
          ) : null}
        </article>
      ))}
    </div>
  );
}
