"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export default function MedicoLegalGiftSection() {
  const t = useTranslations("pathwayPages.medicoLegalLanding.gift");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    setSubmitting(false);
    setSubmitted(true);
  }

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
            {submitted ? (
              <div
                style={{
                  marginTop: "24px",
                  padding: "16px 20px",
                  background: "#14284B",
                  color: "#fff",
                  borderRadius: "4px",
                  fontSize: "15px",
                  fontWeight: 500,
                  maxWidth: "560px",
                }}
              >
                {t("successTitle")} — {t("successDesc", { email })}
              </div>
            ) : (
              <form className="gift-form" onSubmit={handleSubmit}>
                <input
                  type="email"
                  placeholder={t.has("inputPlaceholder") ? t("inputPlaceholder") : "Your professional email"}
                  aria-label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" disabled={submitting}>
                  {submitting ? "..." : (t.has("buttonText") ? t("buttonText") : "Send me the guide")}
                </button>
              </form>
            )}
            <p className="gift-note">{t("note")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
