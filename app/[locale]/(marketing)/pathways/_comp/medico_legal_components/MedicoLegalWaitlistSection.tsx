"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export default function MedicoLegalWaitlistSection() {
  const t = useTranslations("pathwayPages.medicoLegalLanding.waitlist");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profession, setProfession] = useState("Psychiatrist");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !name) return;

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    setSubmitting(false);
    setSubmitted(true);
  }

  return (
    <section className="resources" id="waitlist">
      <div className="wrap">
        <div className="wl-grid">
          <div>
            <h2>{t("title")}</h2>
            <div className="rule"></div>
            <p className="lead">{t("lead")}</p>
            {submitted ? (
              <div
                style={{
                  marginTop: "28px",
                  padding: "24px 28px",
                  background: "#F4F0E6",
                  border: "1.5px solid #D9C08A",
                  borderRadius: "4px",
                  color: "#14284B",
                }}
              >
                <b style={{ display: "block", fontSize: "18px", marginBottom: "6px" }}>
                  {t("successTitle")}
                </b>
                <p style={{ margin: 0, fontSize: "15px" }}>
                  {t("successDesc", { name, profession, email })}
                </p>
              </div>
            ) : (
              <form className="wl-form" onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder={t("namePlaceholder")}
                  aria-label={t("nameLabel")}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <input
                  type="email"
                  placeholder={t("emailPlaceholder")}
                  aria-label={t("emailLabel")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <select
                  aria-label={t("professionLabel")}
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                >
                  <option value="Psychiatrist">{t("professions.psychiatrist")}</option>
                  <option value="Psychologist">{t("professions.psychologist")}</option>
                  <option value="Psychiatry trainee">{t("professions.trainee")}</option>
                  <option value="Legal professional">{t("professions.legal")}</option>
                  <option value="Other">{t("professions.other")}</option>
                </select>
                <button type="submit" className="btn" disabled={submitting}>
                  {submitting ? "..." : (t.has("buttonText") ? t("buttonText") : "Join the waitlist")}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
