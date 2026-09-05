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
    audienceClass: "text-signal",
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
      className="scroll-mt-20 bg-ink py-24 lg:py-32"
      aria-labelledby="pathways-heading"
    >
      <div
        className="mx-auto w-full px-6 md:px-8 lg:px-12"
        style={{ maxWidth: "var(--content-max)" }}
      >
        <div
          data-reveal
          className="mb-16 grid grid-cols-1 gap-8 lg:grid-cols-[180px_1fr] lg:gap-16"
        >
          <div className="flex items-start gap-4 pt-1">
            <span className="mt-2 block h-px w-10 shrink-0 bg-signal opacity-70" />
            <span className="font-body text-[9px] uppercase leading-relaxed tracking-[0.25em] text-white/35">
              {t("pathways.eyebrow")}
            </span>
          </div>
          <div>
            <h2
              id="pathways-heading"
              className="scroll-mt-28 font-display text-3xl text-white! lg:text-5xl"
            >
              {t("pathways.title")}
            </h2>
            <p className="mt-4 max-w-lg font-body text-base text-white/45!">
              {t("pathways.intro")}
            </p>
          </div>
        </div>

        <div
          data-reveal
          style={{ "--reveal-delay": "100ms" } as React.CSSProperties}
          className="grid grid-cols-1 gap-px bg-white/10 md:grid-cols-3"
        >
          {PATHWAYS.map((pathway, pathwayIndex) => {
            const isEnrolled = enrolledCourseSlugs.has(pathway.courseSlug);
            return (
              <SpotlightCard
                key={pathway.href}
                className="border border-white/10 bg-ink transition-transform hover:-translate-y-1 duration-200"
              >
                <article className="flex h-full flex-col gap-6 p-8">
                  <div>
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <span className="font-body text-[9px] uppercase tracking-[0.3em] text-white/30">
                        {String(pathwayIndex + 1).padStart(2, "0")}
                      </span>
                      {isEnrolled && (
                        <span className="border border-signal/50 bg-signal/10 px-2 py-1 font-body text-[9px] uppercase tracking-[0.16em] text-signal">
                          {t("pathways.enrolled")}
                        </span>
                      )}
                    </div>
                    <h3 className="mb-2 font-display text-xl text-white">
                      {t(`pathwayCards.${pathwayIndex}.title`)}
                    </h3>
                    <p className={`font-body text-xs ${pathway.audienceClass}`}>
                      {t(`pathwayCards.${pathwayIndex}.audience`)}
                    </p>
                  </div>

                  <div className="h-px bg-white/10" />

                  <p className="flex-1 font-body text-sm leading-6 text-white/55">
                    {t(`pathwayCards.${pathwayIndex}.description`)}
                  </p>

                  <ul className="flex flex-col gap-2">
                    {pathway.featureStates.map((active, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-center gap-2 font-body text-xs"
                      >
                        <span
                          className="grid size-3 shrink-0 place-items-center"
                          aria-hidden="true"
                        >
                          <span
                            className={
                              active
                                ? "size-1.5 rotate-45 bg-signal"
                                : "size-2 border border-white/30"
                            }
                          />
                        </span>
                        <span
                          className={active ? "text-white/75" : "text-white/40"}
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
                    className="mt-auto inline-flex items-center gap-2 font-body text-xs tracking-wide text-white/40 transition-colors hover:text-signal"
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
