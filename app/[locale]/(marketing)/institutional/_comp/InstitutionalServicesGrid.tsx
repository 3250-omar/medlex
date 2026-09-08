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
      className="bg-white py-20 lg:py-28 text-char border-b border-hair"
      aria-labelledby="services-grid-heading"
    >
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-10">
        {/* Section Header */}
        <div className="mb-12 md:mb-16 max-w-3xl">
          <div className="flex items-center gap-3">
            <span className="h-0.5 w-7 shrink-0 bg-gold" aria-hidden="true" />
            <span className="font-sans text-[11px] sm:text-xs uppercase tracking-[0.25em] text-gold font-semibold">
              {t("eyebrow")}
            </span>
          </div>
          <h2
            id="services-grid-heading"
            className="mt-4 font-serif text-3xl md:text-4xl lg:text-5xl text-navy! font-bold leading-tight"
          >
            {t("title")}
          </h2>
        </div>

        {/* 4 Cards in Compact Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, idx) => (
            <SpotlightCard
              key={idx}
              className="group flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white hover:border-gold/60 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 shadow-sm overflow-hidden"
              spotlightColor="rgba(212, 175, 55, 0.12)"
            >
              <div className="flex flex-col">
                {/* Compact Image Cover Container */}
                <div className="relative h-36 sm:h-40 w-full overflow-hidden border-b border-slate-100 bg-slate-100">
                  <Image
                    src={card.src}
                    alt={card.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover object-center opacity-90 transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  <div className="absolute top-3 start-3">
                    <span className="inline-block bg-white/95 backdrop-blur-md border border-slate-200/80 px-2.5 py-0.5 font-sans text-[10px] font-semibold tracking-wider text-navy uppercase rounded-full shadow-sm">
                      {card.tag}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col">
                  <h3 className="font-serif text-lg sm:text-xl text-navy group-hover:text-gold transition-colors font-bold leading-snug">
                    {card.title}
                  </h3>
                  <p className="mt-2.5 font-sans text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              </div>

              {/* Action Link Footer */}
              <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-2">
                <a
                  href={card.anchor}
                  className="font-sans text-xs font-semibold text-gold hover:text-navy transition-colors inline-flex items-center gap-1.5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 duration-200"
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
