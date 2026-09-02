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
      className="bg-ink py-24 lg:py-32"
      aria-labelledby="who-we-are-heading"
    >
      <div
        className="mx-auto w-full px-6 md:px-8 lg:px-12"
        style={{ maxWidth: "var(--content-max)" }}
      >
        <div className="mb-16 grid grid-cols-1 gap-8 lg:grid-cols-[180px_1fr] lg:gap-16">
          <div className="flex items-start gap-4 pt-1">
            <span className="mt-2 block h-px w-10 shrink-0 bg-signal" />
            <span className="font-body text-[9px] uppercase tracking-[0.25em] text-white/60">
              {t("who.eyebrow")}
            </span>
          </div>

          <div>
            <h2
              id="who-we-are-heading"
              className="max-w-[18ch] font-display text-3xl leading-snug text-white lg:text-4xl xl:text-5xl"
            >
              {t("who.title")}
            </h2>
            <p className="mt-5 max-w-xl font-body text-base leading-7 text-white/70">
              {t("who.intro")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,.92fr)] lg:gap-20">
          <div className="space-y-5">
            <p className="font-body text-[15px] leading-7 text-white/80">
              {t("who.paragraphs.0")}
            </p>
            <p className="font-body text-[15px] leading-7 text-white/80">
              {t("who.paragraphs.1")}
            </p>
            <p className="font-body text-[15px] leading-7 text-white/80">
              {t("who.paragraphs.2")}
            </p>

            <div className="flex flex-wrap gap-2 pt-4">
              {AUDIENCE_KEYS.map((audience) => (
                <span
                  key={audience}
                  className="border border-white/20 px-3 py-1.5 font-body text-sm text-white/80 transition-colors hover:border-signal/50"
                >
                  <strong className="font-semibold text-white">
                    {t(`who.audiences.${AUDIENCE_KEYS.indexOf(audience)}`)}
                  </strong>
                </span>
              ))}
            </div>
          </div>

          <div>
            <figure className="relative aspect-4/3 overflow-hidden bg-ink">
              <Image
                src="/images/medlex-who-we-are-scales.png"
                alt={t("who.imageAlt")}
                fill
                sizes="(min-width: 1024px) 42vw, 100vw"
                className="object-cover"
              />
              {/* grayscale sepia-[.3] contrast-110 brightness-[.8] */}
              <span
                className="pointer-events-none absolute inset-0 bg-accent/45 mix-blend-color"
                aria-hidden="true"
              />
              <span
                className="pointer-events-none absolute inset-0 bg-linear-to-t from-ink/75 via-transparent to-signal/15"
                aria-hidden="true"
              />
            </figure>

            <div className="border-l-2 border-signal px-5 py-7 lg:px-6">
              <blockquote className="font-display text-lg leading-snug text-white lg:text-2xl">
                &ldquo;{t("who.quote")}&rdquo;
              </blockquote>
              <cite className="mt-4 block font-body text-[9px] not-italic uppercase tracking-[0.2em] text-white/55">
                {t("who.mission")}
              </cite>
            </div>

            <div className="divide-y divide-white/15 border-y border-white/15">
              {STATS.map((stat) => (
                <div
                  key={stat.value}
                  className="grid grid-cols-[72px_1fr] gap-6 py-6 text-left"
                >
                  <span className="font-display text-4xl text-signal">
                    {stat.value}
                  </span>
                  <p className="whitespace-pre-line font-body text-xs leading-relaxed text-white/65">
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
