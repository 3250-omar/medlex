"use client";

import Image from "next/image";
import Link from "next/link";
import { Scale, Globe, FileText, Award } from "lucide-react";
import { useTranslations } from "next-intl";

type Props = {
  locale: string;
};

type PrincipleItem = {
  title: string;
  description: string;
  tag: string;
};

const icons = [Scale, Globe, FileText, Award];

export default function MedicoLegalFounderSection({ locale }: Props) {
  const t = useTranslations("pathwayPages.medicoLegalLanding.founder");
  const principles = (t.raw("principles") as PrincipleItem[]) || [];

  return (
    <section className="relative bg-deep text-lbody on-deep py-24 border-b border-white/10 overflow-hidden">
      {/* Background Courtroom Texture */}
      <div className="absolute inset-0 pointer-events-none select-none z-0">
        <Image
          src="/images/medicolegal/bg_1__how.jpg"
          alt="Courtroom background"
          fill
          className="object-cover object-center opacity-15 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-deep/95 via-deep/90 to-deep" />
      </div>

      <div className="relative z-10 mx-auto w-full px-6 sm:px-8 lg:max-w-6xl lg:px-10">
        {/* Section Header */}
        <div className="max-w-3xl">
          <span className="font-sans font-semibold text-xs uppercase tracking-widest text-goldd block mb-3">
            {t("kicker")}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[40px] font-bold text-white leading-tight">
            {t("title")}
          </h2>
          <div className="w-14 h-0.5 bg-gold my-5" />
          <p className="font-serif text-lg sm:text-xl text-lbody leading-relaxed max-w-2xl">
            {t("lead")}
          </p>
        </div>

        {/* Founder Profile Strip */}
        <div className="mt-10 mb-14 bg-navy/80 border border-white/15 rounded-2xl p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center gap-6 shadow-xl backdrop-blur-md">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-gold/40 shrink-0 shadow-md">
            <Image
              src="/images/dr-ahmed-abouelghit.webp"
              alt={t("name")}
              fill
              className="object-cover object-center"
            />
          </div>
          <div className="flex-1">
            <b className="block font-serif text-xl sm:text-2xl font-bold text-white mb-1">
              {t("name")}
            </b>
            <p className="text-sm sm:text-base text-mute mb-3 font-sans">
              {t("role")}
            </p>
            <Link
              href={`/${locale}/founder`}
              className="inline-flex items-center text-sm font-semibold text-gold hover:text-lgold transition-colors underline underline-offset-4"
            >
              {t("profileLink")}
            </Link>
          </div>
        </div>

        {/* 4 Methodological Principle Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {principles.map((item, idx) => {
            const Icon = icons[idx % icons.length];
            return (
              <div
                key={idx}
                className="rounded-2xl border border-white/10 bg-navy/50 p-6 sm:p-8 backdrop-blur-sm hover:border-gold/30 hover:bg-navy/70 transition-all flex flex-col justify-between shadow-lg"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold mb-6">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm sm:text-[15px] leading-relaxed text-lbody font-sans">
                    {item.description}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/10 text-xs font-sans font-semibold tracking-wider text-mute">
                  {item.tag}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
