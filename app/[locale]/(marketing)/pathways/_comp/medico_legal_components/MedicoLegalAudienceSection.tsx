"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

export default function MedicoLegalAudienceSection() {
  const t = useTranslations("pathwayPages.medicoLegalLanding.audience");
  const audiences =
    (t.raw("items") as { role: string; description: string }[]) || [];

  return (
    <section className="relative bg-deep text-lbody on-deep py-24 border-b border-white/10 overflow-hidden">
      {/* Background image overlay with deep navy blend */}
      <div className="absolute inset-0 pointer-events-none select-none z-0">
        <Image
          src="/images/mandate-case-review.jpg"
          alt="Case review background"
          fill
          className="object-cover object-center opacity-25 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-deep/95 via-deep/90 to-deep/80" />
      </div>

      <div className="relative z-10 mx-auto w-full px-6 sm:px-8 lg:max-w-6xl lg:px-10">
        {/* Section Header */}
        <div className="max-w-3xl">
          <span className="font-sans font-semibold text-xs uppercase tracking-widest text-goldd block mb-3">
            {t("kicker")}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-bold text-white leading-tight">
            {t("title")}
          </h2>
          <p className="mt-4 font-serif text-lg sm:text-xl text-lbody max-w-2xl">
            {t("lead")}
          </p>
        </div>

        {/* Content Grid */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Method & Mission Quote */}
          <div className="lg:col-span-7 space-y-6">
            <p className="text-base sm:text-lg leading-relaxed text-lbody">
              {t("p1")}
            </p>
            <p className="text-base sm:text-lg leading-relaxed text-lbody">
              {t("p2")}
            </p>

            <blockquote className="mt-8 border-l-4 border-gold pl-6 py-2">
              <p className="font-serif italic text-lg sm:text-xl lg:text-2xl text-lgold leading-snug">
                {t("quote")}
              </p>
              <footer className="mt-3 font-sans text-xs font-semibold tracking-widest uppercase text-white/80">
                {t("quoteCite")}
              </footer>
            </blockquote>
          </div>

          {/* Right Column: Audience Breakdown Card */}
          <div className="lg:col-span-5 bg-navy/80 backdrop-blur-md rounded-2xl border border-white/15 p-6 sm:p-8 shadow-xl">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">
              {t("cardTitle")}
            </h3>

            <div className="space-y-4">
              {audiences.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-white/10 bg-deep/50 p-4 transition-colors hover:border-gold/30"
                >
                  <b className="block font-sans text-base font-semibold text-gold mb-1">
                    {item.role}
                  </b>
                  <p className="text-sm leading-relaxed text-lbody">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 text-xs text-mute italic">
              {t("note")}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
