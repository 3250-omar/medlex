"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

type Props = {
  locale: string;
};

type FactItem = {
  title: string;
  body: string;
};

export default function MedicoLegalFlagshipSection({ locale }: Props) {
  const t = useTranslations("pathwayPages.medicoLegalLanding.flagship");
  const facts = (t.raw("facts") as FactItem[]) || [];

  return (
    <section
      id="flagship"
      className="relative bg-deep text-lbody on-deep py-24 border-b border-white/10 overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none select-none z-0">
        <Image
          src="/images/medicolegal/bg_4__flag.jpg"
          alt="Flagship background"
          fill
          className="object-cover object-center opacity-20 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-deep/95 via-deep/90 to-deep" />
      </div>

      <div className="relative z-10 mx-auto w-full px-6 sm:px-8 lg:max-w-6xl lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Realistic 3D Case File Showcase */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[420px] rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-navy/80 group">
              <div className="relative aspect-[4/5] w-full">
                <Image
                  src="/images/medicolegal/img_2_mlc_100___the_train_fire_case_.jpg"
                  alt="MLC-100 — The Train Fire Case, the flagship case file for Writing Psychiatric Evidence"
                  fill
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-102"
                />
              </div>
              <div className="p-4 bg-navy/95 border-t border-white/10">
                <p className="text-xs font-sans font-semibold tracking-wider uppercase text-goldd">
                  {t("caseFileKicker")}
                </p>
                <p className="text-sm font-serif text-white font-medium">
                  {t("caseFileName")}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Flagship Details */}
          <div className="lg:col-span-7">
            <div className="inline-block font-sans font-semibold text-xs uppercase tracking-widest text-gold bg-gold/10 border border-gold/30 px-3.5 py-1.5 rounded-full mb-4">
              {t("badge")}
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              {t("title")}
            </h2>
            <div className="w-14 h-0.5 bg-gold my-5" />

            <p className="font-serif text-lg sm:text-xl text-lbody leading-relaxed max-w-2xl mb-8">
              {t("lead")}
            </p>

            {/* Facts Grid */}
            <div className="space-y-4 mb-10">
              {facts.map((f, i) => (
                <div key={i} className="flex gap-3.5 items-start">
                  <span className="w-2 h-2 rounded-full bg-gold shrink-0 mt-2" />
                  <p className="text-sm sm:text-[15px] leading-relaxed text-lbody">
                    <b className="font-semibold text-white mr-1">{f.title}</b>
                    {f.body}
                  </p>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#waitlist"
                className="inline-flex items-center justify-center font-sans font-semibold text-[15px] px-6 py-3.5 rounded bg-gold text-navy hover:bg-[#A8842F] transition-all shadow-md hover:-translate-y-0.5"
              >
                {t("joinWaitlist")}
              </a>
              <Link
                href={`/${locale}/programmes/writing-psychiatric-evidence`}
                className="inline-flex items-center justify-center font-sans font-semibold text-[15px] px-6 py-3.5 rounded border border-white/20 text-white hover:bg-white/10 transition-colors"
              >
                {t("brochure")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
