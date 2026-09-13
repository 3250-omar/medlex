"use client";

import { Stethoscope, Scale } from "lucide-react";
import { useTranslations } from "next-intl";

export default function MedicoLegalTwoAudiencesSection() {
  const t = useTranslations("pathwayPages.medicoLegalLanding.twoAudiences");

  return (
    <section className="bg-tint/70 text-char py-24 border-b border-hair">
      <div className="mx-auto w-full px-6 sm:px-8 lg:max-w-6xl lg:px-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <span className="font-sans font-semibold text-xs uppercase tracking-widest text-goldd block mb-3">
            {t("kicker")}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[40px] font-bold text-ink! leading-tight">
            {t("title")}
          </h2>
          <div className="w-14 h-0.5 bg-gold my-5" />
          <p className="font-serif text-lg sm:text-xl text-char/85 leading-relaxed">
            {t("lead")}
          </p>
        </div>

        {/* 2-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: For Clinicians */}
          <div className="bg-white rounded-2xl border border-hair p-8 sm:p-10 flex flex-col justify-between shadow-sm hover:border-gold/40 hover:shadow-md transition-all">
            <div>
              <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center text-goldd mb-6">
                <Stethoscope className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-navy! mb-4">
                {t("clinicians.title")}
              </h3>
              <p className="text-base sm:text-lg leading-relaxed text-char/90 font-sans">
                {t("clinicians.description")}
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-hair">
              <div className="inline-flex items-center gap-2 text-xs sm:text-[13px] font-sans font-semibold tracking-wider uppercase text-goldd bg-tint px-3 py-1.5 rounded-md">
                {t("clinicians.tag")}
              </div>
            </div>
          </div>

          {/* Card 2: For Legal Professionals */}
          <div className="bg-white rounded-2xl border border-hair p-8 sm:p-10 flex flex-col justify-between shadow-sm hover:border-gold/40 hover:shadow-md transition-all">
            <div>
              <div className="w-12 h-12 rounded-xl bg-navy/10 border border-navy/20 flex items-center justify-center text-navy! mb-6">
                <Scale className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-navy! mb-4">
                {t("legal.title")}
              </h3>
              <p className="text-base sm:text-lg leading-relaxed text-char/90 font-sans">
                {t("legal.description")}
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-hair">
              <div className="inline-flex items-center gap-2 text-xs sm:text-[13px] font-sans font-semibold tracking-wider uppercase text-navy! bg-tint px-3 py-1.5 rounded-md">
                {t("legal.tag")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
