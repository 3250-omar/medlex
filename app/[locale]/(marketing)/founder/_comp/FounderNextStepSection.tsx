"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useCurrentUser } from "../../_apiCalls/academyQueries";

interface FounderNextStepSectionProps {
  locale: string;
}

export default function FounderNextStepSection({
  locale,
}: FounderNextStepSectionProps) {
  const t = useTranslations("founderPage.nextStep");
  const { data: user } = useCurrentUser();

  const pathways = [
    {
      name: t("pathways.0.name"),
      status: t("pathways.0.status"),
    },
    {
      name: t("pathways.1.name"),
      status: t("pathways.1.status"),
    },
    {
      name: t("pathways.2.name"),
      status: t("pathways.2.status"),
    },
  ];

  return (
    <section
      className="relative overflow-hidden border-b border-white/10 on-navy text-lbody"
      aria-labelledby="founder-next-step-heading"
    >
      {/* Background image with dual-tone overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/mandate-case-review.jpg')" }}
        aria-hidden="true"
      />
      {/* Deep Navy / gold dual-tone overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(100deg, rgba(20,42,73,0.95) 0%, rgba(26,54,93,0.88) 45%, rgba(15,35,65,0.95) 100%)",
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative w-full px-6 sm:px-10 md:px-14 lg:px-20 xl:px-24 2xl:px-28 py-16 md:py-20 lg:py-24">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-16 xl:grid-cols-[minmax(0,1fr)_440px]">
          {/* ── Left: Headline copy ── */}
          <div>
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-5">
              <span className="h-px w-8 shrink-0 bg-gold" aria-hidden="true" />
              <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.24em] text-gold">
                {t("eyebrow")}
              </span>
            </div>

            {/* Heading */}
            <h2
              id="founder-next-step-heading"
              className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.12] tracking-tight text-white"
            >
              {t("title")}
            </h2>

            {/* Body */}
            <p className="mt-5 font-sans text-base sm:text-lg leading-relaxed text-lbody max-w-xl">
              {t("body")}
            </p>
          </div>

          {/* ── Right: Pathway card ── */}
          <div className="rounded-2xl border border-white/15 bg-deep/90 backdrop-blur-md p-7 sm:p-9 shadow-2xl">
            {/* Card eyebrow */}
            <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.24em] text-mute block mb-5">
              {t("cardEyebrow")}
            </span>

            {/* Pathway rows */}
            <ul className="space-y-0 divide-y divide-white/10">
              {pathways.map((pathway, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between gap-4 py-3.5"
                >
                  <span className="font-sans text-sm text-white">
                    {pathway.name}
                  </span>
                  <span className="font-sans text-xs font-semibold text-gold shrink-0">
                    {pathway.status}
                  </span>
                </li>
              ))}
            </ul>

            {/* CTA Button */}
            <Link
              href={user ? `/${locale}/courses` : `/${locale}/contact`}
              id="founder-next-step-cta"
              className="btn btn-gold mt-6 w-full text-center !py-3.5 text-sm font-semibold"
            >
              {user ? t("ctaLoggedIn") : t("cta")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
