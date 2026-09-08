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
      className="bg-navy py-20 lg:py-28 border-b border-white/10 on-navy text-lbody"
      aria-labelledby="founder-mandate-heading"
    >
      <div className="w-full px-6 sm:px-10 md:px-14 lg:px-20 xl:px-24 2xl:px-28">
        {/* Header Area */}
        <div className="max-w-3xl">
          {/* Eyebrow */}
          <div className="flex items-center gap-3">
            <span className="h-px w-8 shrink-0 bg-gold" aria-hidden="true" />
            <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.24em] text-gold">
              {t("eyebrow")}
            </span>
          </div>

          {/* Heading */}
          <h2
            id="founder-mandate-heading"
            className="mt-6 font-serif text-3xl sm:text-4xl lg:text-[44px] font-bold leading-[1.15] text-white whitespace-pre-line"
          >
            {t("title")}
          </h2>

          {/* Subtitle */}
          <p className="mt-4 font-sans text-base text-lbody">{t("subtitle")}</p>
        </div>

        {/* 3 Image Cards */}
        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-8">
          {cards.map((card, idx) => (
            <div key={idx} className="group">
              <figure className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-white/12 bg-deep shadow-md">
                <Image
                  src={card.image}
                  alt={card.caption}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-deep/70 via-transparent to-transparent"
                  aria-hidden="true"
                />
              </figure>
              <p className="mt-3 font-sans text-xs leading-relaxed text-mute">
                {card.caption}
              </p>
            </div>
          ))}
        </div>

        {/* 4 Pillars Editorial Divider List */}
        <div className="mt-16 divide-y divide-white/15 border-y border-white/15">
          {/* Row 1 */}
          <div className="grid grid-cols-1 gap-10 py-10 md:grid-cols-2 md:gap-16">
            {pillars.slice(0, 2).map((pillar, idx) => (
              <div key={idx} className="group">
                <div className="mb-3 flex items-center gap-3">
                  <span className="font-serif text-lg font-bold text-gold">
                    0{idx + 1}
                  </span>
                  <span
                    className="h-px w-6 bg-gold/50 transition-all duration-300 group-hover:w-10 group-hover:bg-gold"
                    aria-hidden="true"
                  />
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-white transition-colors duration-200 group-hover:text-gold">
                    {pillar.title}
                  </h3>
                </div>
                <p className="font-sans text-sm sm:text-[15px] leading-relaxed text-slate-300 ps-0 sm:ps-12">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 gap-10 py-10 md:grid-cols-2 md:gap-16">
            {pillars.slice(2, 4).map((pillar, idx) => (
              <div key={idx} className="group">
                <div className="mb-3 flex items-center gap-3">
                  <span className="font-serif text-lg font-bold text-gold">
                    0{idx + 3}
                  </span>
                  <span
                    className="h-px w-6 bg-gold/50 transition-all duration-300 group-hover:w-10 group-hover:bg-gold"
                    aria-hidden="true"
                  />
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-white transition-colors duration-200 group-hover:text-gold">
                    {pillar.title}
                  </h3>
                </div>
                <p className="font-sans text-sm sm:text-[15px] leading-relaxed text-slate-300 ps-0 sm:ps-12">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
