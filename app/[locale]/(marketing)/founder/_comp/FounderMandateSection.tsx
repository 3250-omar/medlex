import Image from "next/image";
import { useTranslations } from "next-intl";

interface FounderMandateSectionProps {
  locale: string;
}

export default function FounderMandateSection({
  locale,
}: FounderMandateSectionProps) {
  const t = useTranslations("founderPage.mandate");

  const cards = [
    {
      image: "/images/mandate-case-review.jpg",
      caption: t("cards.0.caption"),
    },
    {
      image: "/images/mandate-evidence.jpg",
      caption: t("cards.1.caption"),
    },
    {
      image: "/images/mandate-leadership.jpg",
      caption: t("cards.2.caption"),
    },
  ];

  const pillars = [
    {
      title: t("pillars.0.title"),
      description: t("pillars.0.description"),
    },
    {
      title: t("pillars.1.title"),
      description: t("pillars.1.description"),
    },
    {
      title: t("pillars.2.title"),
      description: t("pillars.2.description"),
    },
    {
      title: t("pillars.3.title"),
      description: t("pillars.3.description"),
    },
  ];

  return (
    <section
      className="bg-ink py-20 lg:py-28 border-b border-white/10"
      aria-labelledby="founder-mandate-heading"
    >
      <div
        className="mx-auto w-full px-6 md:px-8 lg:px-12"
        style={{ maxWidth: "var(--content-max)" }}
      >
        {/* Header Area */}
        <div className="max-w-3xl">
          {/* Eyebrow */}
          <div className="flex items-center gap-3">
            <span className="h-px w-7 shrink-0 bg-signal" aria-hidden="true" />
            <span className="font-body text-[10px] sm:text-xs font-semibold uppercase tracking-[0.24em] text-white/60">
              {t("eyebrow")}
            </span>
          </div>

          {/* Heading */}
          <h2
            id="founder-mandate-heading"
            className="mt-6 font-display text-3xl sm:text-4xl lg:text-[44px] font-normal leading-[1.15] text-white whitespace-pre-line"
          >
            {t("title")}
          </h2>

          {/* Subtitle */}
          <p className="mt-4 font-body text-sm sm:text-base text-white/70">
            {t("subtitle")}
          </p>
        </div>

        {/* 3 Image Cards */}
        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-8">
          {cards.map((card, idx) => (
            <div key={idx} className="group">
              <figure className="relative aspect-[4/3] w-full overflow-hidden border border-white/10 bg-surface">
                <Image
                  src={card.image}
                  alt={card.caption}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Subtle vignette/tint overlay */}
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent"
                  aria-hidden="true"
                />
              </figure>
              <p className="mt-3 font-body text-xs leading-relaxed text-white/60">
                {card.caption}
              </p>
            </div>
          ))}
        </div>

        {/* 4 Pillars Grid with dividers */}
        <div className="mt-16 divide-y divide-white/15 border-y border-white/15">
          {/* Row 1 */}
          <div className="grid grid-cols-1 gap-8 py-8 md:grid-cols-2 md:gap-14">
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <span className="text-signal text-[11px]" aria-hidden="true">
                  ◆
                </span>
                <h3 className="font-display text-lg sm:text-xl font-normal text-white">
                  {pillars[0].title}
                </h3>
              </div>
              <p className="font-body text-xs sm:text-sm leading-relaxed text-white/65 ps-5">
                {pillars[0].description}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <span className="text-signal text-[11px]" aria-hidden="true">
                  ◆
                </span>
                <h3 className="font-display text-lg sm:text-xl font-normal text-white">
                  {pillars[1].title}
                </h3>
              </div>
              <p className="font-body text-xs sm:text-sm leading-relaxed text-white/65 ps-5">
                {pillars[1].description}
              </p>
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 gap-8 py-8 md:grid-cols-2 md:gap-14">
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <span className="text-signal text-[11px]" aria-hidden="true">
                  ◆
                </span>
                <h3 className="font-display text-lg sm:text-xl font-normal text-white">
                  {pillars[2].title}
                </h3>
              </div>
              <p className="font-body text-xs sm:text-sm leading-relaxed text-white/65 ps-5">
                {pillars[2].description}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <span className="text-signal text-[11px]" aria-hidden="true">
                  ◆
                </span>
                <h3 className="font-display text-lg sm:text-xl font-normal text-white">
                  {pillars[3].title}
                </h3>
              </div>
              <p className="font-body text-xs sm:text-sm leading-relaxed text-white/65 ps-5">
                {pillars[3].description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
