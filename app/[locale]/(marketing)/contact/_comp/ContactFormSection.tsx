"use client";

import { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown, CheckCircle2, AlertCircle } from "lucide-react";

interface ContactFormSectionProps {
  locale: string;
}

export default function ContactFormSection({
  locale,
}: ContactFormSectionProps) {
  const t = useTranslations("contactPage.form");
  const formRef = useRef<HTMLFormElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
    setErrorMessage(null);

    const formData = new FormData(e.currentTarget);
    const payload = {
      fullName: String(formData.get("fullName") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      professionalRole: String(formData.get("professionalRole") || "").trim(),
      organisation: String(formData.get("organisation") || "").trim(),
      pathway: String(formData.get("pathway") || "").trim(),
      notes: String(formData.get("notes") || "").trim(),
      _hp: String(formData.get("_hp") || "").trim(),
      locale,
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        let msg = t("errorGeneric");
        if (response.status === 503) {
          msg = t("errorConfig");
        } else if (data?.error) {
          msg = data.error;
        }
        throw new Error(msg);
      }

      setSubmitted(true);
      formRef.current?.reset();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : t("errorGeneric");
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleReset() {
    setSubmitted(false);
    setErrorMessage(null);
  }

  return (
    <section
      className="bg-[#FAF8F5] py-20 lg:py-28 text-char border-b border-slate-200/80"
      aria-labelledby="contact-form-heading"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_360px]">
          {/* ── Left / Main Column ── */}
          <div>
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-5">
              <span className="h-0.5 w-7 shrink-0 bg-gold" aria-hidden="true" />
              <span className="font-sans text-[11px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-gold">
                {t("eyebrow")}
              </span>
            </div>

            {/* Title */}
            <h2
              id="contact-form-heading"
              className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.12] tracking-tight text-navy!"
            >
              {t("title")}
            </h2>

            {/* Intro */}
            <p className="mt-4 mb-10 font-sans text-base leading-relaxed text-slate-600 max-w-xl">
              {t("intro")}
            </p>

            {/* ── Form or Success State ── */}
            {submitted ? (
              <div
                role="status"
                aria-live="polite"
                className="rounded-2xl border border-gold/30 bg-white p-8 sm:p-12 text-center shadow-lg shadow-navy/5 animate-fade-in"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold/10 text-gold mb-5">
                  <CheckCircle2 className="size-8" />
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-navy">
                  {t("successTitle")}
                </h3>
                <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-md mx-auto leading-relaxed">
                  {t("successSubtitle")}
                </p>
                <button
                  type="button"
                  onClick={handleReset}
                  className="mt-8 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold hover:text-gold/80 transition-colors cursor-pointer"
                >
                  {t("submitAnother")}
                </button>
              </div>
            ) : (
              <form
                ref={formRef}
                onSubmit={handleSubmit}
                className="space-y-6"
                noValidate
                aria-busy={isSubmitting}
              >
                {/* Honeypot field for bot prevention */}
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="contact-hp">Leave this field blank</label>
                  <input
                    id="contact-hp"
                    type="text"
                    name="_hp"
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                {/* Row 1 – Full Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="contact-full-name"
                      className="font-sans text-xs font-bold uppercase tracking-wider text-navy"
                    >
                      {t("fields.fullName")}
                    </label>
                    <input
                      id="contact-full-name"
                      name="fullName"
                      type="text"
                      required
                      disabled={isSubmitting}
                      autoComplete="name"
                      placeholder={
                        isRtl ? "مثال: د. أحمد محمد" : "e.g. Dr. Ahmed Mostafa"
                      }
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-navy placeholder:text-slate-400 focus:border-gold focus:ring-2 focus:ring-gold/20 shadow-sm transition-all outline-none disabled:opacity-60 disabled:bg-slate-50"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="contact-email"
                      className="font-sans text-xs font-bold uppercase tracking-wider text-navy"
                    >
                      {t("fields.email")}
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      required
                      disabled={isSubmitting}
                      autoComplete="email"
                      placeholder="name@example.com"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-navy placeholder:text-slate-400 focus:border-gold focus:ring-2 focus:ring-gold/20 shadow-sm transition-all outline-none disabled:opacity-60 disabled:bg-slate-50"
                    />
                  </div>
                </div>

                {/* Row 2 – Professional Role & Organisation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="contact-role"
                      className="font-sans text-xs font-bold uppercase tracking-wider text-navy"
                    >
                      {t("fields.professionalRole")}
                    </label>
                    <input
                      id="contact-role"
                      name="professionalRole"
                      type="text"
                      required
                      disabled={isSubmitting}
                      placeholder={
                        isRtl
                          ? "مثال: استشاري طب نفسي"
                          : "e.g. Consultant Psychiatrist"
                      }
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-navy placeholder:text-slate-400 focus:border-gold focus:ring-2 focus:ring-gold/20 shadow-sm transition-all outline-none disabled:opacity-60 disabled:bg-slate-50"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="contact-organisation"
                      className="font-sans text-xs font-bold uppercase tracking-wider text-navy"
                    >
                      {t("fields.organisation")}
                    </label>
                    <input
                      id="contact-organisation"
                      name="organisation"
                      type="text"
                      disabled={isSubmitting}
                      placeholder={
                        isRtl
                          ? "مثال: وزارة العدل / جهة العمل"
                          : "e.g. Ministry of Justice / Hospital Group"
                      }
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-navy placeholder:text-slate-400 focus:border-gold focus:ring-2 focus:ring-gold/20 shadow-sm transition-all outline-none disabled:opacity-60 disabled:bg-slate-50"
                    />
                  </div>
                </div>

                {/* Row 3 – Pathway Dropdown */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="contact-pathway"
                    className="font-sans text-xs font-bold uppercase tracking-wider text-navy"
                  >
                    {t("fields.pathway")}
                  </label>
                  <div className="relative">
                    <select
                      id="contact-pathway"
                      name="pathway"
                      required
                      disabled={isSubmitting}
                      defaultValue=""
                      className="w-full appearance-none rounded-xl border border-slate-300 bg-white px-4 py-3 pe-11 text-sm text-navy focus:border-gold focus:ring-2 focus:ring-gold/20 shadow-sm transition-all outline-none cursor-pointer disabled:opacity-60 disabled:bg-slate-50"
                    >
                      <option value="" disabled className="text-slate-400">
                        {t("fields.pathwayPlaceholder")}
                      </option>
                      {pathways.map((p, i) => (
                        <option key={i} value={p} className="text-navy">
                          {p}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute end-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  </div>
                </div>

                {/* Row 4 – Notes Textarea */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="contact-notes"
                    className="font-sans text-xs font-bold uppercase tracking-wider text-navy"
                  >
                    {t("fields.notes")}
                  </label>
                  <textarea
                    id="contact-notes"
                    name="notes"
                    rows={4}
                    disabled={isSubmitting}
                    placeholder={
                      isRtl
                        ? "اكتب أي تفاصيل أو استفسارات إضافية هنا..."
                        : "Add any questions, cohort timing, or notes..."
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white p-4 text-sm text-navy placeholder:text-slate-400 focus:border-gold focus:ring-2 focus:ring-gold/20 shadow-sm transition-all outline-none resize-none disabled:opacity-60 disabled:bg-slate-50"
                  />
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div
                    role="alert"
                    aria-live="assertive"
                    className="rounded-xl border border-red-200 bg-red-50/95 p-4 text-sm text-red-800 flex items-start gap-3 animate-fade-in"
                  >
                    <AlertCircle
                      className="text-red-500 shrink-0 size-5 mt-0.5"
                      aria-hidden="true"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-red-900">
                        {t("errorTitle")}
                      </p>
                      <p className="mt-0.5 text-xs text-red-700 leading-relaxed">
                        {errorMessage}
                      </p>
                    </div>
                  </div>
                )}

                {/* Submit Row */}
                <div className="flex flex-col gap-3 pt-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    id="contact-submit-btn"
                    className="btn btn-navy text-sm font-semibold !py-3.5 !px-8 self-start gap-2 shadow-lg shadow-navy/15 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="block h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        {t("submitting")}
                      </>
                    ) : (
                      <>
                        {t("submit")}
                        <span aria-hidden="true" className="rtl:rotate-180">
                          →
                        </span>
                      </>
                    )}
                  </button>

                  <p className="font-sans text-xs text-slate-500 leading-relaxed max-w-md">
                    {t("privacy")}
                  </p>
                </div>
              </form>
            )}
          </div>

          {/* ── Right / Sidebar Column ── */}
          <div className="flex flex-col gap-6 lg:pt-2">
            {/* Contact Info Card */}
            <div className="rounded-2xl border border-gold/25 bg-white p-6 sm:p-7 shadow-md shadow-navy/5">
              <span className="font-sans text-[11px] font-bold uppercase tracking-[0.22em] text-gold block mb-4">
                {t("sidebar.contactTitle")}
              </span>

              <div className="space-y-4 divide-y divide-slate-100">
                <div className="flex flex-col gap-1 pt-3 first:pt-0">
                  <span className="font-sans text-xs text-slate-500">
                    {t("sidebar.emailLabel")}
                  </span>
                  <a
                    href={`mailto:${t("sidebar.email")}`}
                    className="font-sans text-sm text-navy font-semibold hover:text-gold transition-colors break-all"
                  >
                    {t("sidebar.email")}
                  </a>
                </div>

                <div className="flex flex-col gap-1 pt-3">
                  <span className="font-sans text-xs text-slate-500">
                    {t("sidebar.phoneLabel")}
                  </span>
                  <a
                    href={`tel:${t("sidebar.phone").replace(/\s/g, "")}`}
                    className="font-sans text-sm text-navy font-semibold hover:text-gold transition-colors"
                    dir="ltr"
                  >
                    {t("sidebar.phone")}
                  </a>
                </div>
              </div>
            </div>

            {/* Audience Card */}
            <div className="rounded-2xl border border-gold/25 bg-white p-6 sm:p-7 shadow-md shadow-navy/5">
              <span className="font-sans text-[11px] font-bold uppercase tracking-[0.22em] text-gold block mb-4">
                {t("sidebar.audienceTitle")}
              </span>

              <ul className="space-y-3">
                {audience.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span
                      className="text-gold text-xs mt-1 shrink-0"
                      aria-hidden="true"
                    >
                      ◆
                    </span>
                    <span className="font-sans text-sm text-slate-700 leading-snug">
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
