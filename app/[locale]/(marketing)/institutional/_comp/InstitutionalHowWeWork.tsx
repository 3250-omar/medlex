"use client";

import { useTranslations } from "next-intl";

interface InstitutionalHowWeWorkProps {
  locale: string;
}

export default function InstitutionalHowWeWork({
  locale,
}: InstitutionalHowWeWorkProps) {
  const t = useTranslations("institutionalPage.howWeWork");

  const ways = [
    {
      num: t("way1Num"),
      title: t("way1Title"),
      desc: t("way1Desc"),
      meta: t("way1Meta"),
    },
    {
      num: t("way2Num"),
      title: t("way2Title"),
      desc: t("way2Desc"),
      meta: t("way2Meta"),
    },
    {
      num: t("way3Num"),
      title: t("way3Title"),
      desc: t("way3Desc"),
      meta: t("way3Meta"),
    },
  ];

  return (
    <section className="py-24 bg-white text-char">
      <div className="mx-auto max-w-[1120px] px-7">
        <div className="mb-11">
          <h2 className="font-serif font-medium text-[clamp(30px,3.6vw,42px)] leading-[1.12] tracking-[-0.01em] text-navy! [text-wrap:balance]">
            {t("title")}
          </h2>
          <div className="w-14 h-0.5 bg-gold my-6" />
          <p className="font-sans text-[19px] leading-relaxed text-char/85 max-w-[64ch]">
            {t("lead")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {ways.map((way, idx) => (
            <article
              key={idx}
              className="bg-fd-parchment border border-fd-stone rounded-md p-6.5 sm:p-7 flex flex-col justify-between hover:border-gold/50 transition-colors"
            >
              <div>
                <span className="font-serif text-[30px] font-medium text-gold leading-none block mb-2.5">
                  {way.num}
                </span>
                <h3 className="font-serif font-semibold text-[20px] text-navy! mb-2">
                  {way.title}
                </h3>
                <p className="font-sans text-[15px] leading-relaxed text-char/80">
                  {way.desc}
                </p>
              </div>

              <div className="mt-4.5 pt-3.5 border-t border-fd-stone font-sans text-[13.5px] font-semibold text-gold leading-snug">
                {way.meta}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
