"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";

type GiftKey = "casc" | "medicoLegal" | "foundations";

interface GiftCardProps {
  pathway: string;
  title: string;
  description: string;
  href: string;
  actionText: string;
}

function GiftCard({
  pathway,
  title,
  description,
  href,
  actionText,
}: GiftCardProps) {
  return (
    <article className="group flex flex-col justify-between rounded-sm border border-gold/30 bg-white shadow-sm transition-all duration-300 hover:border-gold/60 hover:shadow-md hover:-translate-y-0.5">
      {/* Top gold accent line */}
      <div className="h-0.5 w-full bg-gold/60 rounded-t-sm transition-all duration-300 group-hover:bg-gold" />

      <div className="flex flex-1 flex-col p-7 sm:p-8">
        {/* Pathway label */}
        <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
          {pathway}
        </span>

        {/* Title */}
        <h3 className="mt-3 font-serif text-xl sm:text-2xl font-semibold leading-snug !text-navy">
          {title}
        </h3>

        {/* Description */}
        <p className="mt-4 flex-1 font-sans text-sm sm:text-[15px] leading-relaxed text-slate-600">
          {description}
        </p>

        {/* Pathway link with animated hover */}
        <div className="mt-7 pt-5 border-t border-slate-100">
          <Link
            href={href}
            className="group/link relative flex items-center justify-between gap-3 overflow-hidden rounded-sm border border-navy/20 bg-[#faf9f6] px-4 py-3.5 text-xs sm:text-sm font-semibold text-navy transition-all duration-300 hover:border-navy hover:bg-navy hover:text-white hover:shadow-md active:scale-[0.99]"
          >
            <span className="leading-snug transition-transform duration-300 group-hover/link:translate-x-0.5">
              {actionText}
            </span>
            <span
              className="flex size-7 shrink-0 items-center justify-center rounded-full bg-navy/5 text-navy transition-all duration-300 group-hover/link:bg-gold group-hover/link:text-navy group-hover/link:translate-x-1 rtl:group-hover/link:-translate-x-1"
              aria-hidden="true"
            >
              <ArrowRight className="size-3.5 transition-transform duration-300 rtl:rotate-180" />
            </span>
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function GiftsSection() {
  const t = useTranslations("home.gifts");
  const locale = useLocale();

  const cards: {
    giftKey: GiftKey;
    href: string;
    defaultActionText: string;
  }[] = [
    {
      giftKey: "casc",
      href: "/pathways/casc-academy",
      defaultActionText:
        "Visit The CASC Academy Pathway to download your FREE GIFT",
    },
    {
      giftKey: "medicoLegal",
      href: "/pathways/medico-legal",
      defaultActionText:
        "Visit The Medico-Legal Education Pathway to download your FREE GIFT",
    },
    {
      giftKey: "foundations",
      href: "/pathways/foundations",
      defaultActionText:
        "Visit The MedLex Foundation Pathway to download your FREE GIFT",
    },
  ];

  return (
    <section
      className="bg-[#fbfaf6] py-20 lg:py-28 border-b border-[#e6e6e0]"
      aria-labelledby="gifts-heading"
    >
      <div className="px-6 sm:px-10 md:px-14 lg:px-20 xl:px-24 2xl:px-28">
        {/* Section header */}
        <div className="max-w-3xl">
          <h2
            id="gifts-heading"
            className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-navy!"
          >
            {t("title")}
          </h2>
          <div className="mt-4 h-0.5 w-14 bg-gold" />
          <p className="mt-5 font-sans text-base sm:text-lg leading-relaxed text-body max-w-2xl text-navy!">
            {t("subtitle")}
          </p>
        </div>

        {/* Cards grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map(({ giftKey, href, defaultActionText }) => {
            const actionText = t.has(`cards.${giftKey}.action`)
              ? t(`cards.${giftKey}.action`)
              : defaultActionText;

            return (
              <GiftCard
                key={giftKey}
                pathway={t(`cards.${giftKey}.pathway`)}
                title={t(`cards.${giftKey}.title`)}
                description={t(`cards.${giftKey}.description`)}
                href={`/${locale}${href}`}
                actionText={actionText}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
