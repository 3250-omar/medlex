"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

type Props = {
  locale: string;
};

export default function MedicoLegalClosingBannerSection({ locale }: Props) {
  const t = useTranslations("pathwayPages.medicoLegalLanding.closing");

  return (
    <section className="final">
      <div className="wrap">
        <div className="inner">
          <h2>{t("title")}</h2>
          <p>{t("lead")}</p>
          <div className="links">
            <a href="#flagship">
              {t("links.flagshipTitle")}
              <span>{t("links.flagshipBadge")}</span>
            </a>
            <a href="#levels">
              {t("links.masterclassesTitle")}
              <span>{t("links.masterclassesBadge")}</span>
            </a>
            <Link href={`/${locale}/institutional`}>
              {t("links.institutionalTitle")}
              <span>{t("links.institutionalBadge")}</span>
            </Link>
          </div>
          <a className="btn gold" href="#waitlist">
            {t("buttonText")}
          </a>
        </div>
      </div>
    </section>
  );
}
