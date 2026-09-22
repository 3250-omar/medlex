"use client";

import { useTranslations } from "next-intl";
import { AuthDownloadButton } from "@/components/ui/auth-download-button";

export default function MedicoLegalGiftSection() {
  const t = useTranslations("pathwayPages.medicoLegalLanding.gift");

  return (
    <section className="gift" id="gift">
      <div className="wrap">
        <div className="gift-grid">
          <div className="cover" aria-hidden="true">
            <div className="cover-in">
              <div className="cover-brand">
                <img src="/images/medicolegal/img_4_.png" alt="" />
                <span>{t("bookBrand")}</span>
              </div>
              <div className="cover-kicker">{t("bookKicker")}</div>
              <div className="cover-title">{t("bookTitle")}</div>
              <div className="cover-foot">{t("bookFoot")}</div>
            </div>
          </div>
          <div>
            <div className="gift-tag">{t("tag")}</div>
            <h2>{t("title")}</h2>
            <p className="lead">{t("lead")}</p>
            <div
              className="gift-form"
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
                marginTop: "20px",
              }}
            >
              {/* <input
                type="email"
                placeholder={t.has("inputPlaceholder") ? t("inputPlaceholder") : "Your professional email"}
                aria-label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              /> */}
              <AuthDownloadButton
                fileUrl="/gifts/MedLex_Medico-Legal_Pathway_Guide.pdf"
                resourceName={{
                  en: "Medico-Legal Guide",
                  ar: "دليل الطب النفسي القانوني",
                }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: "15px",
                  padding: "15px 24px",
                  borderRadius: "4px",
                  background: "var(--navy, #14284B)",
                  color: "#fff",
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                  cursor: "pointer",
                  transition: "opacity 0.2s",
                }}
              />
            </div>
            <p className="gift-note">{t("note")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
