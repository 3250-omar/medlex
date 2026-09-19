"use client";

import { useTranslations } from "next-intl";

interface InstitutionalServicesProps {
  locale: string;
}

export default function InstitutionalServices({
  locale,
}: InstitutionalServicesProps) {
  const t = useTranslations("institutionalPage.services");

  const services = [
    {
      title: t("trainingTitle"),
      desc: t("trainingDesc"),
      items: [
        t("trainingItems.0"),
        t("trainingItems.1"),
        t("trainingItems.2"),
        t("trainingItems.3"),
        t("trainingItems.4"),
      ],
      icon: (
        <svg
          viewBox="0 0 24 24"
          className="size-6 stroke-fd-gold-soft fill-none"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 3v18M5 7l7-2 7 2M5 7l-3 7a3 3 0 0 0 6 0L5 7zM19 7l-3 7a3 3 0 0 0 6 0l-3-7zM8 21h8" />
        </svg>
      ),
    },
    {
      title: t("policyTitle"),
      desc: t("policyDesc"),
      items: [
        t("policyItems.0"),
        t("policyItems.1"),
        t("policyItems.2"),
        t("policyItems.3"),
        t("policyItems.4"),
      ],
      icon: (
        <svg
          viewBox="0 0 24 24"
          className="size-6 stroke-fd-gold-soft fill-none"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 3h9l4 4v14H6z" />
          <path d="M15 3v4h4M9 12h6M9 16h6" />
        </svg>
      ),
    },
    {
      title: t("advisoryTitle"),
      desc: t("advisoryDesc"),
      items: [
        t("advisoryItems.0"),
        t("advisoryItems.1"),
        t("advisoryItems.2"),
        t("advisoryItems.3"),
        t("advisoryItems.4"),
      ],
      icon: (
        <svg
          viewBox="0 0 24 24"
          className="size-6 stroke-fd-gold-soft fill-none"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="9" cy="8" r="3" />
          <path d="M3 20c0-3 2.7-5 6-5s6 2 6 5M16 11a3 3 0 1 0-1-5.8M21 20c0-2.4-1.6-4.2-4-4.8" />
        </svg>
      ),
    },
  ];

  return (
    <section id="services" className="py-24 bg-fd-paper text-char scroll-mt-20">
      <div className="mx-auto max-w-[1120px] px-7">
        {/* Section Header */}
        <div className="mb-11">
          <h2 className="font-serif font-medium text-[clamp(30px,3.6vw,42px)] leading-[1.12] tracking-[-0.01em] text-navy! [text-wrap:balance]">
            {t("title")}
          </h2>
          <div className="w-14 h-0.5 bg-gold my-6" />
          <p className="font-sans text-[19px] leading-relaxed text-char/85 max-w-[64ch]">
            {t("lead")}
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5.5">
          {services.map((svc, idx) => (
            <article
              key={idx}
              className="bg-white border border-fd-stone border-t-3 border-t-gold rounded-md p-7 sm:p-8 flex flex-col justify-between shadow-2xs hover:shadow-xs transition-shadow"
            >
              <div>
                <div className="size-12 rounded-full bg-navy flex items-center justify-center mb-4.5">
                  {svc.icon}
                </div>
                <h3 className="font-serif font-semibold text-[22px] text-navy! mb-2.5">
                  {svc.title}
                </h3>
                <p className="font-sans text-[15.5px] leading-relaxed text-char/80">
                  {svc.desc}
                </p>
              </div>

              <ul className="mt-5 pt-4 border-t border-fd-stone list-none space-y-2 text-[14.5px] text-fd-muted">
                {svc.items.map((item, itemIdx) => (
                  <li key={itemIdx} className="flex items-baseline gap-2.5">
                    <span className="text-gold font-bold shrink-0">—</span>
                    <span className="leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
