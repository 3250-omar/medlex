"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";
import Eyebrow from "./Eyebrow";
import InterestButton from "./InterestButton";
import SubscribeButton from "./SubscribeButton";
import {
  useCurrentUser,
  useEnrolledCourses,
} from "../../_apiCalls/academyQueries";
import {
  type PathwayContent,
  type PathwayKey,
  type PathwayLabels,
} from "./pathwayContent";

interface PathwayHeroSectionProps {
  pathway: PathwayKey;
  content: PathwayContent;
  labels: PathwayLabels;
}

export default function PathwayHeroSection({
  pathway,
  content,
  labels,
}: PathwayHeroSectionProps) {
  const locale = useLocale();
  const isMedicoLegal = pathway === "medico-legal";
  const isCascAcademy = pathway === "casc-academy";

  const { data: user } = useCurrentUser();
  const { data: enrolledCourses } = useEnrolledCourses(Boolean(user));

  const enrolledCourse = enrolledCourses?.find((c) => c.slug === pathway);

  const isSubscribed = !!enrolledCourse;

  const buttonClassName =
    "inline-flex min-h-12 items-center justify-center bg-signal px-6 font-body text-sm font-medium text-ink transition-colors hover:bg-signal-light focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal";

  function renderHeroButton() {
    if (!isCascAcademy) {
      // Foundations & medico-legal are not available yet
      return (
        <button
          type="button"
          disabled
          className={`${buttonClassName} disabled:cursor-not-allowed disabled:opacity-60`}
        >
          Coming soon
          <span className="ms-3" aria-hidden="true">
            →
          </span>
        </button>
      );
    }

    if (isSubscribed) {
      // Logged in + subscribed: link directly to the course
      const firstUnit = enrolledCourse.firstUnitSlug ?? "start-here";
      return (
        <Link
          href={`/${locale}/academy/courses/${pathway}/learn/${firstUnit}`}
          className={buttonClassName}
        >
          Go to the course
          <span className="ms-3" aria-hidden="true">
            →
          </span>
        </Link>
      );
    }

    // Not subscribed (or not logged in): show subscribe button
    // SubscribeButton handles auth internally — opens register dialog if guest
    return <SubscribeButton pathway={pathway}>Subscribe</SubscribeButton>;
  }

  return (
    <section className="relative isolate overflow-hidden border-b border-white/10">
      {isMedicoLegal && (
        <>
          <Image
            src="/images/writing-psychiatric-evidence.webp"
            alt=""
            fill
            priority
            sizes="100vw"
            className="-z-20 object-cover opacity-30"
          />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(7,24,42,.97),rgba(7,24,42,.75),rgba(7,24,42,.58))]" />
        </>
      )}
      <div className="mx-auto w-full px-6 py-24 sm:px-8 lg:max-w-6xl lg:px-10 lg:py-28">
        <div className="max-w-3xl">
          <Eyebrow>{content.eyebrow}</Eyebrow>
          <h1 className="mt-7 max-w-3xl font-display text-4xl leading-[1.04] text-white sm:text-5xl lg:text-6xl">
            {content.title}
          </h1>
          <p className="mt-6 max-w-2xl font-body text-base leading-7 text-white/65 sm:text-lg">
            {content.intro}
          </p>
          <dl className="mt-9 grid max-w-3xl gap-5 border-t border-white/15 pt-6 sm:grid-cols-3">
            {[
              [labels.delivery || "Delivery", content.delivery],
              [labels.languages || "Languages", content.languages],
              [labels.status || "Status", content.status],
            ].map(([term, detail]) => (
              <div
                key={term}
                className="border-s border-white/10 ps-4 first:border-s-0 first:ps-0"
              >
                <dt className="font-body text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">
                  {term}
                </dt>
                <dd className="mt-2 font-body text-sm text-white/85">
                  {detail}
                </dd>
              </div>
            ))}
          </dl>
          <div className="mt-8">{renderHeroButton()}</div>
        </div>
      </div>
    </section>
  );
}
