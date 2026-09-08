import Image from "next/image";
import { useTranslations } from "next-intl";

const AUDIENCE_KEYS = [
  "Psychiatrists",
  "Courts",
  "Prosecution",
  "Ministries",
  "Legal counsel",
];

const STATS = [
  {
    value: "UK",
    detail: "Consultant training and practice\nin forensic psychiatry.",
  },
  {
    value: "3",
    detail: "Countries of practice: the United\nKingdom, Egypt, and Qatar.",
  },
];

export default function WhoWeAreSection() {
  const t = useTranslations("home");
  return (
    <section
      className="bg-white py-20 lg:py-28 text-char border-b border-hair"
      aria-labelledby="who-we-are-heading"
    >
      <div className="w-full px-6 sm:px-10 md:px-14 lg:px-20 xl:px-24 2xl:px-28">
        {/* Section Header */}
        <div className="mb-14 grid grid-cols-1 gap-8 lg:grid-cols-[220px_1fr] lg:gap-16">
          <div className="flex items-start gap-4 pt-1">
            <span className="mt-2 block h-px w-10 shrink-0 bg-gold" />
            <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-goldd font-semibold">
              {t("who.eyebrow")}
            </span>
          </div>

          <div>
            <h2
              id="who-we-are-heading"
              className="max-w-3xl font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.12] text-navy!"
            >
              {t("who.title")}
            </h2>
            <p className="mt-5 max-w-3xl font-serif text-lg sm:text-xl leading-relaxed text-ink">
              {t("who.intro")}
            </p>
          </div>
        </div>

        {/* Content Grid: Balanced Narrative & Visual */}
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(360px,.9fr)] lg:gap-16">
          {/* Narrative Column */}
          <div className="space-y-5 max-w-3xl">
            <p className="font-sans text-[16px] leading-[1.75] text-char">
              {t("who.paragraphs.0")}
            </p>
            <p className="font-sans text-[16px] leading-[1.75] text-char">
              {t("who.paragraphs.1")}
            </p>

            {/* Embedded Institutional Quote */}
            <div className="border-s-4 border-gold bg-warm/40 px-6 py-4 rounded-e-xl my-6">
              <blockquote className="font-serif text-lg sm:text-xl font-semibold leading-snug text-navy">
                &ldquo;{t("who.quote")}&rdquo;
              </blockquote>
              <cite className="mt-2 block font-sans text-[11px] font-semibold not-italic uppercase tracking-[0.2em] text-char/60">
                {t("who.mission")}
              </cite>
            </div>

            <p className="font-sans text-[16px] leading-[1.75] text-char">
              {t("who.paragraphs.2")}
            </p>

            {/* Audience Badges */}
            <div className="flex flex-wrap gap-2.5 pt-4">
              {AUDIENCE_KEYS.map((audience) => (
                <span
                  key={audience}
                  className="rounded-full border border-gold bg-warm/40 px-4 py-1.5 font-sans text-xs sm:text-sm font-medium text-navy transition-colors hover:border-gold/80 hover:bg-warm"
                >
                  <strong className="font-semibold text-navy">
                    {t(`who.audiences.${AUDIENCE_KEYS.indexOf(audience)}`)}
                  </strong>
                </span>
              ))}
            </div>
          </div>

          {/* Visual & Stats Column */}
          <div>
            {/* Image with refined aspect ratio and rounded styling */}
            <figure className="relative aspect-[16/10] w-full overflow-hidden bg-warm/30 rounded-2xl border border-hair shadow-sm">
              <Image
                src="/images/medlex-who-we-are-scales.png"
                alt={t("who.imageAlt")}
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
              <span
                className="pointer-events-none absolute inset-0 bg-navy/5 mix-blend-color"
                aria-hidden="true"
              />
              <span
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"
                aria-hidden="true"
              />
            </figure>

            {/* Compact 2-column Stat Cards directly beneath the image */}
            <div className="mt-5 grid grid-cols-2 gap-4">
              {STATS.map((stat) => (
                <div
                  key={stat.value}
                  className="rounded-2xl border border-gold/80 bg-warm/30 p-5 transition-all hover:border-gold/40 hover:bg-white hover:shadow-sm"
                >
                  <span className="font-serif text-3xl sm:text-4xl font-bold text-gold">
                    {stat.value}
                  </span>
                  <p className="mt-2 whitespace-pre-line font-sans text-xs sm:text-sm leading-relaxed text-char/75">
                    {t(`who.stats.${STATS.indexOf(stat)}`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
