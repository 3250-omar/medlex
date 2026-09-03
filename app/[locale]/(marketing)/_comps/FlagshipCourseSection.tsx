"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "../_apiCalls/academyQueries";

interface FlagshipCourseSectionProps {
  locale: string;
}

export default function FlagshipCourseSection({
  locale,
}: FlagshipCourseSectionProps) {
  const t = useTranslations("home");
  const router = useRouter();
  const { data: user } = useCurrentUser();
  return (
    <section
      className="relative isolate overflow-hidden bg-ink py-24 lg:py-32"
      aria-labelledby="flagship-heading"
    >
      <Image
        src="/images/writing-psychiatric-evidence.webp"
        alt=""
        fill
        sizes="100vw"
        className="-z-20 object-cover object-center opacity-60"
      />
      <div
        className="absolute inset-0 -z-10 bg-linear-to-r from-ink via-ink/90 to-ink/65"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 -z-10 bg-linear-to-t from-ink via-transparent to-ink/35"
        aria-hidden="true"
      />

      <div
        className="mx-auto grid w-full grid-cols-1 gap-8 px-6 md:px-8 lg:grid-cols-[180px_1fr] lg:gap-16 lg:px-12"
        style={{ maxWidth: "var(--content-max)" }}
      >
        <div className="flex flex-col items-start">
          <div className="flex items-start gap-4 pt-1">
            <span className="mt-2 block h-px w-10 shrink-0 bg-signal" />
            <span className="font-body text-[10px] font-semibold uppercase tracking-[0.18em] text-signal">
              {t("flagship.eyebrow")}
            </span>
          </div>
          {user ? <button
            type="button"
            onClick={() => router.push(`/${locale}/courses`)}
            className="mt-10 inline-flex min-h-11 items-center gap-3 bg-signal px-5 py-3 font-body text-sm font-medium text-ink transition-colors hover:bg-signal-light focus-visible:bg-signal-light"
          >
            Go to your courses
          </button> : <Link
            href={`/${locale}/pathways/medico-legal`}
            className="mt-10 inline-flex min-h-11 items-center gap-3 bg-signal px-5 py-3 font-body text-sm font-medium text-ink transition-colors hover:bg-signal-light focus-visible:bg-signal-light"
          >
            {t("flagship.register")}
            {/* <span aria-hidden="true">â†’</span> */}
          </Link>}
        </div>

        <div data-reveal>
          <h2
            id="flagship-heading"
            className="max-w-3xl font-display text-4xl leading-tight text-white md:text-5xl lg:text-6xl"
          >
            {t("flagship.title")}
          </h2>
          <p className="mt-5 max-w-2xl font-body text-base leading-7 text-white/75 lg:text-lg">
            {t("flagship.body")}
          </p>
        </div>
      </div>
    </section>
  );
}
