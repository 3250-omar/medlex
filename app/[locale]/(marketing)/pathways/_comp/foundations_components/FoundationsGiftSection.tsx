"use client";

import { useTranslations } from "next-intl";
import { AuthDownloadButton } from "@/components/ui/auth-download-button";

export default function FoundationsGiftSection() {
  const t = useTranslations("pathwayPages.foundationsLanding.gift");

  return (
    <section
      className="bg-[#ebe5d6] border-t-4 border-fd-gold py-20 lg:py-24 text-fd-body"
      id="gift"
    >
      <div className="max-w-[1120px] mx-auto px-7">
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-10 lg:gap-16 items-center">
          {/* 3D Realistic Book Cover */}
          <div
            className="w-full max-w-[280px] lg:max-w-[300px] aspect-[3/4] bg-gradient-to-br from-[#1b3766] to-fd-navy-deep rounded shadow-[0_30px_60px_rgba(20,40,75,0.35)] border-l-[10px] rtl:border-l-0 rtl:border-r-[10px] border-fd-gold p-7 transform -rotate-3 rtl:rotate-3 max-lg:rotate-0 mx-auto lg:mx-0 flex flex-col justify-between select-none"
            aria-hidden="true"
          >
            <div className="flex items-center gap-2.5 font-serif text-[16px] tracking-[0.1em] text-fd-gold-soft font-semibold">
              <img
                src="/images/foundations/book_cover_brand.png"
                alt=""
                className="h-[26px] w-auto"
              />
              <span>{t("bookBrand")}</span>
            </div>
            <div>
              <div className="text-[11px] tracking-[0.14em] text-fd-gold-soft font-semibold uppercase">
                {t("bookKicker")}
              </div>
              <div className="font-serif text-[26px] leading-[1.15] text-white my-2.5 font-medium">
                {t("bookTitle")}
              </div>
              <div className="font-serif italic text-[12px] text-fd-gold-soft">
                {t("bookFoot")}
              </div>
            </div>
          </div>

          <div>
            <div className="inline-block bg-fd-navy text-fd-gold-soft text-[12.5px] font-bold tracking-[0.12em] px-3 py-1.5 rounded-xs mb-4.5 uppercase">
              {t("tag")}
            </div>
            <h2 className="font-serif text-[clamp(30px,3.6vw,42px)] font-medium leading-[1.15] tracking-[-0.01em] text-fd-navy!">
              {t("title")}
            </h2>
            <p className="mt-4.5 text-[19px] leading-[1.6] text-fd-body max-w-[60ch]">
              {t.rich("lead", {
                em: (chunks) => <em className="italic">{chunks}</em>,
              })}
            </p>

            <div className="flex flex-col sm:flex-row gap-2.5 mt-7 max-w-[560px]">
              {/* <input
                type="email"
                placeholder={
                  t.has("inputPlaceholder")
                    ? t("inputPlaceholder")
                    : "Your professional email"
                }
                aria-label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 min-w-0 font-sans text-[16px] px-4 py-3.5 border-[1.5px] border-fd-navy rounded bg-white text-fd-ink placeholder:text-fd-muted focus:outline-none focus:ring-2 focus:ring-fd-gold"
                required
              /> */}
              <AuthDownloadButton
                fileUrl="/gifts/MedLex_Foundations_Pathway_Guide.pdf"
                resourceName={{
                  en: "Foundations Guide",
                  ar: "دليل مسار التأسيس",
                }}
                className="font-sans font-bold text-[15px] px-5.5 py-3.5 rounded bg-fd-navy hover:bg-fd-navy-deep text-white whitespace-nowrap transition-colors cursor-pointer border-0 inline-flex items-center justify-center text-center"
              />
            </div>
            <p className="mt-3 text-[13.5px] text-fd-muted">{t("note")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
