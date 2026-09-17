"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export default function FoundationsWaitlistSection() {
  const t = useTranslations("pathwayPages.foundationsLanding.waitlist");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Doctor in training");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const defaultRoleOptions = [
    "Doctor in training",
    "Consultant / specialist",
    "Clinician in a management role",
    "Other clinician",
  ];

  const roleOptions = (t.raw("roleOptions") as string[]) || defaultRoleOptions;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

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
            <h2 className="text-navy!">{t("title")}</h2>
            <div className="rule"></div>
            <p className="lead">{t("lead")}</p>

            {submitted ? (
              <div
                style={{
                  marginTop: "28px",
                  padding: "18px 22px",
                  background: "#14284B",
                  color: "#fff",
                  borderRadius: "4px",
                  fontSize: "15.5px",
                  fontWeight: 500,
                  maxWidth: "560px",
                  lineHeight: 1.5,
                }}
              >
                <b>{t("successTitle")}</b>
                <p style={{ marginTop: "6px", color: "#dce1ea" }}>
                  {t("successDesc", { name: name || "there", email })}
                </p>
              </div>
            ) : (
              <form className="wl-form" onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder={
                    t.has("namePlaceholder")
                      ? t("namePlaceholder")
                      : "Full name"
                  }
                  aria-label="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <input
                  type="email"
                  placeholder={
                    t.has("emailPlaceholder")
                      ? t("emailPlaceholder")
                      : "Professional email"
                  }
                  aria-label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <select
                  aria-label="Role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  {roleOptions.map((opt, idx) => (
                    <option key={idx} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                <button type="submit" className="btn" disabled={submitting}>
                  {submitting
                    ? "..."
                    : t.has("buttonText")
                      ? t("buttonText")
                      : "Join the waitlist"}
                </button>
              </form>
            )}
          </div>
          <figure className="side-img">
            <img
              src="/images/foundations/waitlist_video_call.jpg"
              alt="A doctor joining a video call with colleagues across the region"
            />
          </figure>
        </div>
      </div>
    </section>
  );
}
