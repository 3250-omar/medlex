"use client";

import { useEffect } from "react";
import Link from "next/link";
import SpotlightCard from "@/components/SpotlightCard";
import { useLocale, useTranslations } from "next-intl";
import {
  useCurrentUser,
  useEnrolledCourses,
} from "../_apiCalls/academyQueries";

const PATHWAYS = [
  {
    href: "/pathways/medico-legal",
    courseSlug: "medico-legal",
    audienceClass: "text-gold",
    featureStates: [true, true, false],
  },
  {
    href: "/pathways/casc-academy",
    courseSlug: "casc-academy",
    audienceClass: "text-white/55",
    featureStates: [true, true, true],
  },
  {
    href: "/pathways/foundations",
    courseSlug: "foundations",
    audienceClass: "text-white/55",
    featureStates: [false, false, false],
  },
] as const;

export default function PathwaysSection() {
  const t = useTranslations("home");
  const locale = useLocale();
  const { data: user } = useCurrentUser();
  const { data: enrolledCourses = [] } = useEnrolledCourses(Boolean(user));
  const enrolledCourseSlugs = new Set(
    enrolledCourses.map((course) => course.slug),
  );

  useEffect(() => {
    const scrollToTarget = () => {
      const hash = window.location.hash;
      if (
        hash === "#pathways" ||
        hash === "#pathways-heading" ||
        hash === "#threepathways"
      ) {
        const elem =
          document.getElementById("pathways") ||
          document.getElementById("pathways-heading");
        if (elem) {
          setTimeout(() => {
            elem.scrollIntoView({ behavior: "smooth" });
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
      className="scroll-mt-20 bg-navy py-20 lg:py-28 on-navy text-lbody"
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
          {PATHWAYS.map((pathway, pathwayIndex) => {
            const isEnrolled = enrolledCourseSlugs.has(pathway.courseSlug);
            return (
              <SpotlightCard
                key={pathway.href}
                className="rounded-2xl border border-white/12 bg-deep/90 transition-all hover:border-gold/50 hover:-translate-y-1.5 duration-200 shadow-xl"
              >
                <article className="flex h-full flex-col gap-6 p-8 lg:p-10">
                  <div>
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <span className="font-serif text-base font-bold text-gold">
                        {String(pathwayIndex + 1).padStart(2, "0")}
                      </span>
                      {isEnrolled && (
                        <span className="border border-gold/50 bg-gold/15 px-3 py-1 font-sans text-[10px] uppercase tracking-[0.16em] text-gold font-semibold rounded-full">
                          {t("pathways.enrolled")}
                        </span>
                      )}
                    </div>
                    <h3 className="mb-2 font-serif text-2xl font-bold text-white leading-snug">
                      {t(`pathwayCards.${pathwayIndex}.title`)}
                    </h3>
                    <p
                      className={`font-sans text-xs uppercase tracking-wider font-semibold ${pathway.audienceClass}`}
                    >
                      {t(`pathwayCards.${pathwayIndex}.audience`)}
                    </p>
                  </div>

                  <div className="h-px bg-white/10" />

                  <p className="flex-1 font-sans text-sm sm:text-[15px] leading-relaxed text-lbody">
                    {t(`pathwayCards.${pathwayIndex}.description`)}
                  </p>

                  <ul className="flex flex-col gap-2.5">
                    {pathway.featureStates.map((active, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-center gap-2.5 font-sans text-xs"
                      >
                        <span
                          className="grid size-3.5 shrink-0 place-items-center"
                          aria-hidden="true"
                        >
                          <span
                            className={
                              active
                                ? "size-1.5 rotate-45 bg-gold"
                                : "size-2 border border-white/30"
                            }
                          />
                        </span>
                        <span
                          className={
                            active
                              ? "text-white/90 font-medium"
                              : "text-white/40"
                          }
                        >
                          {t(
                            `pathwayCards.${pathwayIndex}.features.${featureIndex}`,
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={`/${locale}${pathway.href}`}
                    className="mt-auto inline-flex items-center gap-2 font-sans text-sm font-semibold tracking-wide text-gold transition-colors hover:text-white pt-2"
                  >
                    {t(`pathwayCards.${pathwayIndex}.link`)}
                    <span aria-hidden="true">→</span>
                  </Link>
                </article>
              </SpotlightCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
