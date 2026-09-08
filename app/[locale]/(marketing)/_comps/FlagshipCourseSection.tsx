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
      className="relative overflow-hidden bg-white py-20 lg:py-28 text-char border-b border-hair"
      aria-labelledby="flagship-heading"
    >
      <div className="w-full px-6 sm:px-10 md:px-14 lg:px-20 xl:px-24 2xl:px-28">
        <div className="grid w-full grid-cols-1 gap-10 lg:grid-cols-[220px_1fr] lg:gap-16 items-start">
          <div className="flex flex-col items-start">
            <div className="flex items-start gap-4 pt-1">
              <span className="mt-2 block h-px w-10 shrink-0 bg-gold" />
              <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-gold text-nowrap">
                {t("flagship.eyebrow")}
              </span>
            </div>
            {user ? (
              <button
                type="button"
                onClick={() => router.push(`/${locale}/courses`)}
                className="btn btn-navy mt-8 py-3.5! px-7 text-sm font-semibold gap-2 inline-flex items-center shadow-md"
              >
                Go to your courses
                <span aria-hidden="true">→</span>
              </button>
            ) : (
              <Link
                href={`/${locale}/pathways/medico-legal`}
                className="btn text-nowrap! btn-navy mt-8 py-3.5! px-7! text-sm font-semibold! gap-2 inline-flex! items-center shadow-md"
              >
                {t("flagship.register")}
                <span aria-hidden="true">→</span>
              </Link>
            )}
          </div>

          <div
            data-reveal
            className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,.8fr)] lg:gap-12 items-center"
          >
            <div>
              <h2
                id="flagship-heading"
                className="max-w-3xl font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.12] text-navy!"
              >
                {t("flagship.title")}
              </h2>
              <p className="mt-6 max-w-2xl font-sans text-base sm:text-lg leading-relaxed text-char">
                {t("flagship.body")}
              </p>
            </div>

            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-hair shadow-lg bg-tint">
              <Image
                src="/images/writing-psychiatric-evidence.webp"
                alt="Writing Psychiatric Evidence course preview"
                fill
                sizes="(min-width: 1024px) 35vw, 90vw"
                className="object-cover"
              />
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy/30 via-transparent to-transparent"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
