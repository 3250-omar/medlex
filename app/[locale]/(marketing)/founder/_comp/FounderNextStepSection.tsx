import Link from "next/link";
import { useTranslations } from "next-intl";

interface FounderNextStepSectionProps {
  locale: string;
}

export default function FounderNextStepSection({
  locale,
}: FounderNextStepSectionProps) {
  const t = useTranslations("founderPage.nextStep");

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
      className="relative overflow-hidden border-b border-white/10"
      aria-labelledby="founder-next-step-heading"
    >
      {/* Background image with dual-tone overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/mandate-case-review.jpg')" }}
        aria-hidden="true"
      />
      {/* Left warm gold tint / right deep navy tint split */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(100deg, rgba(18,12,4,0.82) 0%, rgba(172,130,40,0.55) 38%, rgba(10,14,30,0.88) 62%, rgba(10,14,30,0.96) 100%)",
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div
        className="relative mx-auto w-full px-6 py-16 md:px-8 md:py-20 lg:px-12 lg:py-24"
        style={{ maxWidth: "var(--content-max)" }}
      >
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-16 xl:grid-cols-[minmax(0,1fr)_440px]">
          {/* ── Left: Headline copy ── */}
          <div>
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-5">
              <span className="h-px w-6 shrink-0 bg-signal" aria-hidden="true" />
              <span className="font-body text-[10px] sm:text-xs font-semibold uppercase tracking-[0.24em] text-white/60">
                {t("eyebrow")}
              </span>
            </div>

            {/* Heading */}
            <h2
              id="founder-next-step-heading"
              className="font-display text-3xl sm:text-4xl lg:text-[42px] font-normal leading-[1.12] tracking-tight text-white"
            >
              {t("title")}
            </h2>

            {/* Body */}
            <p className="mt-5 font-body text-sm sm:text-base leading-relaxed text-white/65 max-w-md">
              {t("body")}
            </p>
          </div>

          {/* ── Right: Pathway card ── */}
          <div
            className="border border-white/15 bg-ink/80 backdrop-blur-sm p-6 sm:p-8"
            style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.45)" }}
          >
            {/* Card eyebrow */}
            <span className="font-body text-[10px] font-semibold uppercase tracking-[0.24em] text-white/50 block mb-5">
              {t("cardEyebrow")}
            </span>

            {/* Pathway rows */}
            <ul className="space-y-0 divide-y divide-white/10">
              {pathways.map((pathway, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between gap-4 py-3.5"
                >
                  <span className="font-body text-sm text-white/80">
                    {pathway.name}
                  </span>
                  <span className="font-body text-[11px] font-semibold text-signal shrink-0">
                    {pathway.status}
                  </span>
                </li>
              ))}
            </ul>

            {/* CTA Button */}
            <Link
              href={`/${locale}/contact`}
              id="founder-next-step-cta"
              className="mt-6 block w-full bg-signal text-ink font-body text-sm font-semibold px-6 py-3.5 text-center hover:bg-signal/90 active:scale-[0.98] transition-all"
            >
              {t("cta")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
