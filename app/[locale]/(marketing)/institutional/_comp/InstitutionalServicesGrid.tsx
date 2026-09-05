"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import SpotlightCard from "@/components/SpotlightCard";

interface InstitutionalServicesGridProps {
  locale: string;
}

const SERVICE_IMAGES = [
  {
    src: "/images/medlex-brain-hero.png",
    alt: "Clinical Forensic Assessment",
    anchor: "#service-01",
  },
  {
    src: "/images/medlex-who-we-are-scales.png",
    alt: "Institutional Policy & Protocols",
    anchor: "#service-02",
  },
  {
    src: "/images/medlex-hero-evidence.webp",
    alt: "Case Review & Second Opinions",
    anchor: "#service-03",
  },
  {
    src: "/images/mandate-leadership.jpg",
    alt: "Capacity Building & Training",
    anchor: "#service-04",
  },
];

export default function InstitutionalServicesGrid({
  locale,
}: InstitutionalServicesGridProps) {
  const t = useTranslations("institutionalPage.servicesGrid");
  const isRtl = locale === "ar";

  const cards = [
    {
      ...SERVICE_IMAGES[0],
      tag: t("cards.0.tag"),
      title: t("cards.0.title"),
      desc: t("cards.0.desc"),
      linkText: t("cards.0.linkText"),
    },
    {
      ...SERVICE_IMAGES[1],
      tag: t("cards.1.tag"),
      title: t("cards.1.title"),
      desc: t("cards.1.desc"),
      linkText: t("cards.1.linkText"),
    },
    {
      ...SERVICE_IMAGES[2],
      tag: t("cards.2.tag"),
      title: t("cards.2.title"),
      desc: t("cards.2.desc"),
      linkText: t("cards.2.linkText"),
    },
    {
      ...SERVICE_IMAGES[3],
      tag: t("cards.3.tag"),
      title: t("cards.3.title"),
      desc: t("cards.3.desc"),
      linkText: t("cards.3.linkText"),
    },
  ];

  return (
    <section
      id="services-overview"
      className="bg-paper py-20 lg:py-28 border-b border-white/10"
      aria-labelledby="services-grid-heading"
    >
      <div
        className="mx-auto w-full px-6 md:px-8 lg:px-12"
        style={{ maxWidth: "var(--content-max)" }}
      >
        {/* Section Header */}
        <div className="mb-14 md:mb-18 max-w-3xl">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-signal" aria-hidden="true" />
            <span className="font-body text-[10px] uppercase tracking-[0.25em] text-muted font-semibold">
              {t("eyebrow")}
            </span>
          </div>
          <h2
            id="services-grid-heading"
            className="mt-4 font-display text-3xl md:text-4xl lg:text-5xl text-white font-normal leading-tight"
          >
            {t("title")}
          </h2>
        </div>

        {/* 4 Cards in 2x2 Grid with Image Cover */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {cards.map((card, idx) => (
            <SpotlightCard
              key={idx}
              className="group flex flex-col justify-between border border-white/10 bg-surface/70 hover:border-signal/50 transition-all duration-300"
              spotlightColor="rgb(220 164 53 / 0.14)"
            >
              <div>
                {/* Image Cover Container */}
                <div className="relative h-48 sm:h-56 w-full overflow-hidden border-b border-white/10 bg-ink">
                  <Image
                    src={card.src}
                    alt={card.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover object-center opacity-70 transition-transform duration-700 ease-out group-hover:scale-105 group-hover:opacity-85"
                  />
                  {/* Subtle Gradient Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-80" />
                  <div className="absolute top-4 start-4">
                    <span className="inline-block bg-ink/80 backdrop-blur-md border border-white/15 px-3 py-1 font-body text-[10px] font-semibold tracking-wider text-signal uppercase">
                      {card.tag}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-7 sm:p-8">
                  <h3 className="font-display text-xl sm:text-2xl text-white group-hover:text-signal transition-colors font-medium">
                    {card.title}
                  </h3>
                  <p className="mt-3.5 font-body text-xs sm:text-sm text-muted leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              </div>

              {/* Action Link Footer */}
              <div className="px-7 sm:px-8 pb-7 sm:pb-8 pt-2">
                <a
                  href={card.anchor}
                  className="font-body text-xs font-semibold text-signal hover:text-signal-light transition-colors inline-flex items-center gap-1.5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 duration-200"
                >
                  <span>{card.linkText}</span>
                  <span aria-hidden="true">{isRtl ? "←" : "→"}</span>
                </a>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
}
