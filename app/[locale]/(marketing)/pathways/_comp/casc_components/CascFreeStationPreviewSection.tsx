"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

type Props = {
  locale: string;
};

export default function CascFreeStationPreviewSection({ locale }: Props) {
  const t = useTranslations("cascFreePreview");

  return (
    <section id="free" className="py-14 border-b border-hair bg-white">
      <div className="mx-auto w-full px-6 sm:px-8 lg:max-w-6xl lg:px-10">
        <div className="flex flex-col items-start gap-7 sm:gap-8 rounded-2xl border border-hair p-8 sm:p-10 bg-white shadow-sm">
          <div>
            <h3 className="font-serif text-2xl sm:text-3xl lg:text-[34px] font-bold text-navy! leading-tight">
              {t("titleLine1")} {t("titleLine2")}
            </h3>
            <p className="mt-3 text-base text-grey max-w-3xl leading-relaxed">
              {t("description")}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            <Link
              href={`/${locale}/academy/preview/station-7-2`}
              className="btn w-full border border-[#0E1D38]! bg-white! hover:bg-[#F5F7FA]! text-[#0E1D38]! font-semibold text-sm !min-h-12 !px-6 !rounded-lg transition-transform hover:-translate-y-0.5 shadow-xs text-center flex items-center justify-center"
            >
              {t("tryStationButton")}
            </Link>
            <a
              href="#enrol"
              className="btn w-full bg-navy! hover:bg-[#0E1D38]! border border-navy/20! text-white! font-semibold text-sm !min-h-12 !px-7 !rounded-lg transition-transform hover:-translate-y-0.5 shadow-xs text-center flex items-center justify-center"
            >
              {t("enrolButton")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
