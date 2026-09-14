"use client";

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
    <section className="flag" id="flagship">
      <div className="wrap grid">
        <figure>
          <img
            src="/images/medicolegal/img_2_mlc_100___the_train_fire_case_.jpg"
            alt="MLC-100 — The Train Fire Case, the flagship case file for Writing Psychiatric Evidence"
          />
        </figure>
        <div>
          <div className="eyebrow">{t("badge")}</div>
          <h2 className="text-navy!">{t("title")}</h2>
          <div className="rule"></div>
          <p className="lead">{t("lead")}</p>
          <ul className="facts">
            {facts.map((f, i) => (
              <li key={i}>
                <b>{f.title}</b> {f.body}
              </li>
            ))}
          </ul>
          <div className="ctas">
            <a className="btn" href="#waitlist">
              {t("joinWaitlist")}
            </a>
            <Link
              className="btn ghost"
              href={`/${locale}/programmes/writing-psychiatric-evidence`}
            >
              {t("brochure")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
