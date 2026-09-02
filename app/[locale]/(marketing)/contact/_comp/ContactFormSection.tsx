"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

interface ContactFormSectionProps {
  locale: string;
}

export default function ContactFormSection({
  locale,
}: ContactFormSectionProps) {
  const t = useTranslations("contactPage.form");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const pathways: string[] = [
    t("pathways.0"),
    t("pathways.1"),
    t("pathways.2"),
    t("pathways.3"),
    t("pathways.4"),
  ];

  const audience: string[] = [
    t("sidebar.audience.0"),
    t("sidebar.audience.1"),
    t("sidebar.audience.2"),
  ];

  const isRtl = locale === "ar";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate async submission; replace with real API call later
    await new Promise((r) => setTimeout(r, 1000));
    setIsSubmitting(false);
    setSubmitted(true);
  }

  return (
    <section
      className="bg-ink py-20 lg:py-28 border-b border-white/10"
      aria-labelledby="contact-form-heading"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div
        className="mx-auto w-full px-6 md:px-8 lg:px-12"
        style={{ maxWidth: "var(--content-max)" }}
      >
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_280px] xl:grid-cols-[minmax(0,1fr)_300px]">
          {/* ── Left / Main Column ── */}
          <div>
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-6">
              <span
                className="h-0.5 w-6 shrink-0 bg-signal"
                aria-hidden="true"
              />
              <span className="font-body text-[11px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-white/60">
                {t("eyebrow")}
              </span>
            </div>

            {/* Title */}
            <h2
              id="contact-form-heading"
              className="font-display text-3xl sm:text-4xl lg:text-[42px] font-normal leading-[1.1] tracking-tight text-white"
            >
              {t("title")}
            </h2>

            {/* Intro */}
            <p className="mt-4 mb-10 font-body text-sm sm:text-base leading-relaxed text-white/65 max-w-xl">
              {t("intro")}
            </p>

            {/* ── Form ── */}
            {submitted ? (
              <div className="border border-white/15 bg-white/5 rounded px-8 py-12 text-center">
                <span
                  className="text-signal text-3xl mb-4 block"
                  aria-hidden="true"
                >
                  ✓
                </span>
                <p className="font-display text-xl text-white">
                  {isRtl
                    ? "شكرًا! سنتواصل معك قريبًا."
                    : "Thank you — we will be in touch."}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                {/* Row 1 – Full Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="contact-full-name"
                      className="font-body text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.18em] text-white/55"
                    >
                      {t("fields.fullName")}
                    </label>
                    <input
                      id="contact-full-name"
                      name="fullName"
                      type="text"
                      required
                      autoComplete="name"
                      className="w-full bg-transparent border-b border-white/20 focus:border-signal outline-none py-2.5 font-body text-sm text-white placeholder:text-white/30 transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="contact-email"
                      className="font-body text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.18em] text-white/55"
                    >
                      {t("fields.email")}
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      className="w-full bg-transparent border-b border-white/20 focus:border-signal outline-none py-2.5 font-body text-sm text-white placeholder:text-white/30 transition-colors"
                    />
                  </div>
                </div>

                {/* Row 2 – Professional Role & Organisation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="contact-role"
                      className="font-body text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.18em] text-white/55"
                    >
                      {t("fields.professionalRole")}
                    </label>
                    <input
                      id="contact-role"
                      name="professionalRole"
                      type="text"
                      required
                      className="w-full bg-transparent border-b border-white/20 focus:border-signal outline-none py-2.5 font-body text-sm text-white placeholder:text-white/30 transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="contact-organisation"
                      className="font-body text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.18em] text-white/55"
                    >
                      {t("fields.organisation")}
                    </label>
                    <input
                      id="contact-organisation"
                      name="organisation"
                      type="text"
                      className="w-full bg-transparent border-b border-white/20 focus:border-signal outline-none py-2.5 font-body text-sm text-white placeholder:text-white/30 transition-colors"
                    />
                  </div>
                </div>

                {/* Row 3 – Pathway Dropdown */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="contact-pathway"
                    className="font-body text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.18em] text-white/55"
                  >
                    {t("fields.pathway")}
                  </label>
                  <select
                    id="contact-pathway"
                    name="pathway"
                    required
                    defaultValue=""
                    className="w-full bg-transparent border-b border-white/20 focus:border-signal outline-none py-2.5 font-body text-sm text-white transition-colors appearance-none cursor-pointer"
                    style={{ background: "transparent" }}
                  >
                    <option value="" disabled className="bg-ink text-white/50">
                      {t("fields.pathwayPlaceholder")}
                    </option>
                    {pathways.map((p, i) => (
                      <option key={i} value={p} className="bg-ink text-white">
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Row 4 – Notes Textarea */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="contact-notes"
                    className="font-body text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.18em] text-white/55"
                  >
                    {t("fields.notes")}
                  </label>
                  <textarea
                    id="contact-notes"
                    name="notes"
                    rows={4}
                    className="w-full bg-transparent border-b border-white/20 focus:border-signal outline-none py-2.5 font-body text-sm text-white placeholder:text-white/30 transition-colors resize-none"
                  />
                </div>

                {/* Submit Row */}
                <div className="flex flex-col gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    id="contact-submit-btn"
                    className="inline-flex items-center gap-3 self-start bg-signal text-ink font-body text-sm font-semibold px-6 py-3 hover:bg-signal/90 active:scale-[0.98] transition-all disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="block h-4 w-4 rounded-full border-2 border-ink/30 border-t-ink animate-spin" />
                        {isRtl ? "جارٍ الإرسال..." : "Sending..."}
                      </>
                    ) : (
                      <>
                        {t("submit")}
                        <span aria-hidden="true">→</span>
                      </>
                    )}
                  </button>

                  <p className="font-body text-xs text-white/40 leading-relaxed max-w-sm">
                    {t("privacy")}
                  </p>
                </div>
              </form>
            )}
          </div>

          {/* ── Right / Sidebar Column ── */}
          <div className="flex flex-col gap-5 lg:pt-14">
            {/* Contact Info Card */}
            <div className="border border-white/12 bg-white/[0.03] p-6">
              <span className="font-body text-[10px] font-semibold uppercase tracking-[0.22em] text-white/50 block mb-4">
                {t("sidebar.contactTitle")}
              </span>

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-body text-xs text-white/50">
                    {t("sidebar.emailLabel")}
                  </span>
                  <a
                    href={`mailto:${t("sidebar.email")}`}
                    className="font-body text-sm text-signal hover:text-signal/80 transition-colors truncate"
                  >
                    {t("sidebar.email")}
                  </a>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="font-body text-xs text-white/50">
                    {t("sidebar.phoneLabel")}
                  </span>
                  <a
                    href={`tel:${t("sidebar.phone").replace(/\s/g, "")}`}
                    className="font-body text-sm text-signal hover:text-signal/80 transition-colors"
                  >
                    {t("sidebar.phone")}
                  </a>
                </div>
              </div>
            </div>

            {/* Audience Card */}
            <div className="border border-white/12 bg-white/[0.03] p-6">
              <span className="font-body text-[10px] font-semibold uppercase tracking-[0.22em] text-white/50 block mb-4">
                {t("sidebar.audienceTitle")}
              </span>

              <ul className="space-y-2.5">
                {audience.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span
                      className="text-signal text-[10px] mt-0.5 shrink-0"
                      aria-hidden="true"
                    >
                      ◆
                    </span>
                    <span className="font-body text-sm text-white/70 leading-snug">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
