"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

interface InstitutionalTrackRecordProps {
  locale: string;
}

export default function InstitutionalTrackRecord({
  locale,
}: InstitutionalTrackRecordProps) {
  const t = useTranslations("institutionalPage.trackRecord");

  const facts = [t("facts.0"), t("facts.1"), t("facts.2"), t("facts.3")];

  return (
    <section className="py-24 bg-fd-parchment border-y border-fd-stone text-char">
      <div className="mx-auto max-w-[1120px] px-7">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-14 items-center">
          {/* Left Text Content */}
          <div>
            <span className="inline-block bg-navy! text-fd-gold-soft text-xs font-bold tracking-[0.1em] py-1.5 px-3 rounded-xs mb-3.5">
              {t("tag")}
            </span>

            <h2 className="font-serif font-medium text-2xl sm:text-3xl lg:text-[32px] leading-tight text-navy! mb-3.5">
              {t("title")}
            </h2>

            <div className="w-14 h-0.5 bg-gold my-5" />

            <p className="font-sans text-[16px] sm:text-[17px] leading-relaxed text-char/85 max-w-[55ch]">
              {t("lead")}
            </p>

            <div className="mt-6 space-y-3 font-sans text-[15px] sm:text-[15.5px] text-char/85">
              {facts.map((fact, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span className="size-2 bg-gold shrink-0 mt-2" />
                  <span className="leading-snug">{fact}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Image */}
          <figure className="m-0 relative rounded-md overflow-hidden shadow-xl border border-fd-stone">
            <Image
              src="/images/institutional/institutional-track-record.jpg"
              alt="Institutional training in session"
              width={600}
              height={450}
              className="w-full aspect-[4/3] object-cover"
            />
          </figure>
        </div>
      </div>
    </section>
  );
}
