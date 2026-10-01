"use client";

import { useEffect } from "react";
import Link from "next/link";
import SpotlightCard from "@/components/SpotlightCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocale, useTranslations } from "next-intl";
import {
  useCurrentUser,
  useEnrolledCourses,
  useAllCourses,
} from "../_apiCalls/academyQueries";

const COURSE_INDEX_MAP: Record<string, number> = {
  "medico-legal": 0,
  "casc-academy": 1,
  foundations: 2,
};

const PATHWAY_STATIC_DATA = {
  "medico-legal": {
    audienceClass: "text-gold",
    audienceI18nKey: "pathwayCards.0.audience",
  },
  "casc-academy": {
    audienceClass: "text-white/55",
    audienceI18nKey: "pathwayCards.1.audience",
  },
  foundations: {
    audienceClass: "text-white/55",
    audienceI18nKey: "pathwayCards.2.audience",
  },
} as const;

export default function PathwaysSection() {
  const t = useTranslations("home");
  const locale = useLocale();
  const { data: user } = useCurrentUser();
  const { data: enrolledCourses = [] } = useEnrolledCourses(Boolean(user));
  const { data: allCourses = [], isLoading } = useAllCourses();
  const enrolledCourseSlugs = new Set(
    enrolledCourses.map((course) => course.slug),
  );

  useEffect(() => {
    const scrollToTarget = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash === "pathways" || hash === "pathways-heading") {
        const elem = document.getElementById(hash);
        if (elem) {
          setTimeout(() => {
            if (hash === "pathways") {
              const top = elem.getBoundingClientRect().top + window.scrollY;
              window.scrollTo({ top, behavior: "smooth" });
            } else {
              elem.scrollIntoView({ behavior: "smooth" });
            }
          }, 120);
        }
      }
    };

    scrollToTarget();
    window.addEventListener("hashchange", scrollToTarget);
    return () => window.removeEventListener("hashchange", scrollToTarget);
  }, []);

  return (
    <section
      id="pathways"
      style={{ scrollMarginTop: "calc(-1 * (var(--header-h)))" }}
      className="bg-navy py-20 lg:py-28 on-navy text-lbody"
      aria-labelledby="pathways-heading"
    >
      <div
        className="mx-auto w-full px-6 md:px-8 lg:px-12"
        style={{ maxWidth: "var(--content-max)" }}
      >
        <div
          data-reveal
          className="mb-14 grid grid-cols-1 gap-8 lg:grid-cols-[220px_1fr] lg:gap-16"
        >
          <div className="flex items-start gap-4 pt-1">
            <span className="mt-2 block h-px w-10 shrink-0 bg-gold opacity-90" />
            <span className="font-sans text-[11px] uppercase leading-relaxed tracking-[0.25em] text-gold font-semibold">
              {t("pathways.eyebrow")}
            </span>
          </div>
          <div>
            <h2
              id="pathways-heading"
              className="scroll-mt-28 font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white font-bold leading-tight "
            >
              {t("pathways.title")}
            </h2>
            <p className="mt-4 max-w-3xl font-sans text-base sm:text-lg text-lbody leading-relaxed">
              {t("pathways.intro")}
            </p>
          </div>
        </div>

        <div
          data-reveal
          style={{ "--reveal-delay": "100ms" } as React.CSSProperties}
          className="grid grid-cols-1 gap-6 lg:gap-8 md:grid-cols-3"
        >
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-white/12 bg-deep/90 flex flex-col gap-6 p-8 lg:p-10"
                >
                  <div className="flex items-center justify-between mb-4">
                    <Skeleton className="h-6 w-8 bg-white/10" />
                    <Skeleton className="h-5 w-20 bg-white/10" />
                  </div>
                  <div>
                    <Skeleton className="h-8 w-3/4 mb-3 bg-white/10" />
                    <Skeleton className="h-4 w-1/2 bg-white/10" />
                  </div>
                  <div className="h-px bg-white/10" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-full bg-white/10" />
                    <Skeleton className="h-4 w-[90%] bg-white/10" />
                    <Skeleton className="h-4 w-[80%] bg-white/10" />
                  </div>
                  <div className="space-y-3 mt-4">
                    <Skeleton className="h-4 w-2/3 bg-white/10" />
                    <Skeleton className="h-4 w-1/2 bg-white/10" />
                  </div>
                  <Skeleton className="h-5 w-32 mt-auto bg-white/10" />
                </div>
              ))
            : [...allCourses]
                .sort(
                  (a, b) =>
                    (COURSE_INDEX_MAP[a.slug] ?? 99) -
                    (COURSE_INDEX_MAP[b.slug] ?? 99),
                )
                .map((course, index) => {
                  const courseIndex = COURSE_INDEX_MAP[course.slug] ?? index;
                  const isEnrolled = enrolledCourseSlugs.has(course.slug);
                  const staticData = PATHWAY_STATIC_DATA[
                    course.slug as keyof typeof PATHWAY_STATIC_DATA
                  ] || {
                    audienceClass: "text-white/55",
                    audienceI18nKey: `pathwayCards.${courseIndex}.audience`,
                  };

                  const title =
                    locale === "ar" && course.title_ar
                      ? course.title_ar
                      : course.title_en;
                  const description =
                    locale === "ar" && course.description_ar
                      ? course.description_ar
                      : course.description_en;
                  const features =
                    (locale === "ar" && course.features_ar
                      ? course.features_ar
                      : course.features_en) || [];

                  let statusText = t(`pathwayCards.${courseIndex}.status`);
                  if (course.course_status === "active")
                    statusText = locale === "ar" ? "متاح الآن" : "Open now";
                  else if (course.course_status === "waiting_list")
                    statusText =
                      locale === "ar"
                        ? "قائمة الانتظار مفتوحة"
                        : "Waitlist open";
                  else if (course.course_status === "launching")
                    statusText = locale === "ar" ? "قريباً" : "Coming soon";

                  return (
                    <Link
                      key={course.slug}
                      href={`/${locale}/pathways/${course.slug}`}
                      className="block h-full group focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-2xl transition-transform hover:-translate-y-1.5 duration-200"
                    >
                      <SpotlightCard className="h-full rounded-2xl border border-white/12 bg-deep/90 transition-all group-hover:border-gold/50 duration-200 shadow-xl cursor-pointer">
                        <article className="flex h-full flex-col gap-6 p-8 lg:p-10">
                          <div>
                            <div className="mb-4 flex items-center justify-between gap-3">
                              <span className="font-serif text-base font-bold text-gold">
                                {String(courseIndex + 1).padStart(2, "0")}
                              </span>
                              <div className="flex items-center gap-2">
                                <span
                                  className={`rounded px-2.5 py-0.5 font-sans text-[10px] uppercase tracking-wider font-semibold ${
                                    course.course_status === "active"
                                      ? "border border-emerald-400/40 bg-emerald-500/15 text-emerald-300"
                                      : "border border-gold/40 bg-gold/15 text-gold"
                                  }`}
                                >
                                  {statusText}
                                </span>
                                {isEnrolled && (
                                  <span className="border border-gold/50 bg-gold/15 px-3 py-1 font-sans text-[10px] uppercase tracking-[0.16em] text-gold font-semibold rounded-full">
                                    {t("pathways.enrolled")}
                                  </span>
                                )}
                              </div>
                            </div>
                            <h3 className="mb-2 font-serif text-2xl font-bold text-white leading-snug group-hover:text-gold transition-colors">
                              {title}
                            </h3>
                            <p
                              className={`font-sans text-xs uppercase tracking-wider font-semibold ${staticData.audienceClass}`}
                            >
                              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                              {t(staticData.audienceI18nKey as any)}
                            </p>
                          </div>

                          <div className="h-px bg-white/10" />

                          <p className="flex-1 font-sans text-sm sm:text-[15px] leading-relaxed text-lbody whitespace-pre-line">
                            {description}
                          </p>

                          <ul className="flex flex-col gap-2.5">
                            {features.map((feature, featureIndex) => (
                              <li
                                key={featureIndex}
                                className="flex items-center gap-2.5 font-sans text-xs"
                              >
                                <span
                                  className="grid size-3.5 shrink-0 place-items-center"
                                  aria-hidden="true"
                                >
                                  <span className="size-1.5 rotate-45 bg-gold" />
                                </span>
                                <span className="text-white/90 font-medium">
                                  {feature}
                                </span>
                              </li>
                            ))}
                          </ul>

                          <div className="mt-auto inline-flex items-center gap-2 font-sans text-sm font-semibold tracking-wide text-gold transition-colors group-hover:text-white pt-2">
                            <span>{t(`pathwayCards.${courseIndex}.link`)}</span>
                            <span
                              aria-hidden="true"
                              className="transition-transform duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
                            >
                              →
                            </span>
                          </div>
                        </article>
                      </SpotlightCard>
                    </Link>
                  );
                })}
        </div>

        <div className="mt-12 text-center">
          <Link
            href={`/${locale}/pathways`}
            className="inline-flex items-center gap-2 font-sans text-sm font-semibold text-gold hover:text-white transition-colors border border-gold/30 hover:border-gold px-6 py-2.5 rounded-full"
          >
            <span>{t("pathways.exploreAll")}</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
