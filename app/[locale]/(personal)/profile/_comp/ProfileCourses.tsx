import Link from "next/link";
import { BookOpen, GraduationCap, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import type { EnrolledCourse } from "@/app/[locale]/(marketing)/_apiCalls/academyQueries";

interface ProfileCoursesProps {
  courses: EnrolledCourse[] | undefined;
  isLoading: boolean;
  locale: string;
}

export default function ProfileCourses({
  courses,
  isLoading,
  locale,
}: ProfileCoursesProps) {
  const t = useTranslations("profile.courses");
  const isAr = locale === "ar";
  const enrolledCount = courses?.length ?? 0;

  return (
    <section className="border border-white/10 bg-white/[0.02] p-6 sm:p-8">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <p className="font-body text-[10px] uppercase tracking-[0.2em] text-signal">
            {t("eyebrow")}
          </p>
          <h2 className="mt-1 font-display text-2xl font-normal">
            {t("title")}
          </h2>
        </div>
        <BookOpen className="size-5 text-white/30" />
      </div>

      <div className="mt-6">
        {isLoading ? (
          <div className="space-y-4">
            <div className="h-28 animate-pulse border border-white/10 bg-white/5" />
            <div className="h-28 animate-pulse border border-white/10 bg-white/5" />
          </div>
        ) : enrolledCount > 0 ? (
          <div className="space-y-4">
            {courses?.map((course) => {
              const title =
                isAr && course.titleAr ? course.titleAr : course.titleEn;
              const description =
                isAr && course.descriptionAr
                  ? course.descriptionAr
                  : course.descriptionEn;

              return (
                <div
                  key={course.enrollmentId}
                  className="flex flex-col justify-between gap-4 border border-white/10 bg-white/[0.03] p-5 sm:flex-row sm:items-center"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-body text-[10px] font-semibold uppercase tracking-wider text-signal">
                        {course.status}
                      </span>
                      {course.expiresAt && (
                        <span className="font-body text-[11px] text-white/40">
                          • {t("expires")}{" "}
                          {new Date(course.expiresAt).toLocaleDateString(
                            isAr ? "ar-EG" : "en-US"
                          )}
                        </span>
                      )}
                    </div>
                    <h3 className="mt-2 font-display text-xl">{title}</h3>
                    {description && (
                      <p className="mt-1 line-clamp-2 font-body text-xs text-white/60">
                        {description}
                      </p>
                    )}
                  </div>

                  {course.firstUnitSlug && (
                    <Link
                      href={`/${locale}/academy/courses/${course.slug}/learn/${course.firstUnitSlug}`}
                      className="inline-flex shrink-0 items-center justify-center gap-2 bg-signal px-5 py-2.5 font-body text-xs font-semibold text-ink transition-transform hover:-translate-y-0.5 hover:bg-signal-light"
                    >
                      {t("continueCourse")}
                      <ArrowRight className="size-3.5" />
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="border border-white/5 bg-white/[0.01] p-8 text-center">
            <GraduationCap className="mx-auto size-10 text-white/30" />
            <h3 className="mt-3 font-display text-xl text-white/90">
              {t("emptyTitle")}
            </h3>
            <p className="mx-auto mt-2 max-w-md font-body text-xs leading-relaxed text-white/50">
              {t("emptyDescription")}
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href={`/${locale}#pathways-heading`}
                className="inline-flex items-center gap-1.5 bg-signal px-5 py-2 font-body text-xs font-semibold text-ink transition-transform hover:-translate-y-0.5 hover:bg-signal-light"
              >
                {t("explorePathways")}
                <ArrowRight className="size-3.5" />
              </Link>
              <Link
                href={`/${locale}/courses`}
                className="inline-flex items-center border border-white/15 px-4 py-2 font-body text-xs text-white/70 transition-colors hover:border-white hover:text-white"
              >
                {t("courseCatalogue")}
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
