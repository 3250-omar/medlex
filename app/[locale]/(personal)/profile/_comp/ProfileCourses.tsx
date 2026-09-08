import Link from "next/link";
import { BookOpen, GraduationCap, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import type { EnrolledCourse } from "@/app/[locale]/(marketing)/_apiCalls/academyQueries";

interface ProfileCoursesProps {
  courses?: EnrolledCourse[];
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
    <section className="rounded-2xl border border-white/10 bg-deep p-6 sm:p-8">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <p className="font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">
            {t("eyebrow")}
          </p>
          <h2 className="mt-1 font-serif text-2xl font-normal text-white">
            {t("title")}
          </h2>
        </div>
        <BookOpen className="size-5 text-gold/40" />
      </div>

      <div className="mt-6">
        {isLoading ? (
          <div className="space-y-4">
            <div className="h-28 animate-pulse rounded-xl border border-white/10 bg-white/5" />
            <div className="h-28 animate-pulse rounded-xl border border-white/10 bg-white/5" />
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
                  className="flex flex-col justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-5 transition-all hover:border-gold/30 sm:flex-row sm:items-center"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-body text-[10px] font-semibold uppercase tracking-wider text-gold">
                        {course.status}
                      </span>
                      {course.expiresAt && (
                        <span className="font-sans text-[11px] text-mute">
                          • {t("expires")}{" "}
                          {new Date(course.expiresAt).toLocaleDateString(
                            isAr ? "ar-EG" : "en-US"
                          )}
                        </span>
                      )}
                    </div>
                    <h3 className="mt-2 font-serif text-xl font-normal text-white">{title}</h3>
                    {description && (
                      <p className="mt-1 line-clamp-2 font-sans text-xs text-mute">
                        {description}
                      </p>
                    )}
                  </div>

                  {course.firstUnitSlug && (
                    <Link
                      href={`/${locale}/academy/courses/${course.slug}/learn/${course.firstUnitSlug}`}
                      className="btn btn-gold !rounded-full !px-5 !py-2.5 text-xs font-semibold text-navy inline-flex shrink-0 items-center justify-center gap-2"
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
          <div className="rounded-xl border border-white/10 bg-white/[0.01] p-8 text-center">
            <GraduationCap className="mx-auto size-10 text-gold/40" />
            <h3 className="mt-3 font-serif text-xl font-normal text-white">
              {t("emptyTitle")}
            </h3>
            <p className="mx-auto mt-2 max-w-md font-sans text-xs leading-relaxed text-mute">
              {t("emptyDescription")}
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href={`/${locale}#pathways-heading`}
                className="btn btn-gold !rounded-full !px-5 !py-2 text-xs font-semibold text-navy inline-flex items-center gap-1.5"
              >
                {t("explorePathways")}
                <ArrowRight className="size-3.5" />
              </Link>
              <Link
                href={`/${locale}/courses`}
                className="btn btn-ghost !rounded-full !px-4 !py-2 text-xs text-white inline-flex items-center"
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
