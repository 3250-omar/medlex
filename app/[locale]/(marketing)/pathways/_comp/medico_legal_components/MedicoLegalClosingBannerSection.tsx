"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";

type Props = {
  locale: string;
};

export default function MedicoLegalClosingBannerSection({ locale }: Props) {
  const t = useTranslations("pathwayPages.medicoLegalLanding.closing");

  return (
    <section className="relative bg-deep text-lbody on-deep py-24 sm:py-28 overflow-hidden">
      {/* Background Image Texture */}
      <div className="absolute inset-0 pointer-events-none select-none z-0">
        <Image
          src="/images/medicolegal/bg_3__final.jpg"
          alt="Closing banner texture"
          fill
          className="object-cover object-center opacity-25 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-deep via-deep/90 to-deep/80" />
      </div>

      <div className="relative z-10 mx-auto w-full px-6 sm:px-8 lg:max-w-5xl lg:px-10 text-center">
        <span className="font-sans font-semibold text-xs uppercase tracking-widest text-goldd block mb-4">
          {t("kicker")}
        </span>
        <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
          {t("title")}
        </h2>
        <p className="mt-5 font-serif text-lg sm:text-xl text-lbody max-w-2xl mx-auto leading-relaxed">
          {t("lead")}
        </p>

        {/* 3 Quick Pathway Links */}
        <div className="mt-12 mb-10 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          <a
            href="#flagship"
            className="group p-5 rounded-2xl bg-navy/70 border border-white/10 backdrop-blur-sm text-left hover:border-gold/40 transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-sans font-semibold uppercase tracking-wider text-gold">
                {t("links.flagshipBadge")}
              </span>
              <ArrowUpRight className="w-4 h-4 text-mute group-hover:text-gold transition-colors" />
            </div>
            <span className="font-serif text-base sm:text-lg font-bold text-white leading-snug">
              {t("links.flagshipTitle")}
            </span>
          </a>

          <a
            href="#levels"
            className="group p-5 rounded-2xl bg-navy/70 border border-white/10 backdrop-blur-sm text-left hover:border-gold/40 transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-sans font-semibold uppercase tracking-wider text-gold">
                {t("links.masterclassesBadge")}
              </span>
              <ArrowUpRight className="w-4 h-4 text-mute group-hover:text-gold transition-colors" />
            </div>
            <span className="font-serif text-base sm:text-lg font-bold text-white leading-snug">
              {t("links.masterclassesTitle")}
            </span>
          </a>

          <Link
            href={`/${locale}/institutional`}
            className="group p-5 rounded-2xl bg-navy/70 border border-white/10 backdrop-blur-sm text-left hover:border-gold/40 transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-sans font-semibold uppercase tracking-wider text-gold">
                {t("links.institutionalBadge")}
              </span>
              <ArrowUpRight className="w-4 h-4 text-mute group-hover:text-gold transition-colors" />
            </div>
            <span className="font-serif text-base sm:text-lg font-bold text-white leading-snug">
              {t("links.institutionalTitle")}
            </span>
          </Link>
        </div>

        {/* Action Button */}
        <div>
          <a
            href="#waitlist"
            className="inline-flex items-center justify-center font-sans font-bold text-base px-8 py-4 rounded-xl bg-gold text-navy hover:bg-[#A8842F] transition-all shadow-xl hover:-translate-y-0.5 cursor-pointer"
          >
            {t("buttonText")}
          </a>
        </div>
      </div>
    </section>
  );
}
