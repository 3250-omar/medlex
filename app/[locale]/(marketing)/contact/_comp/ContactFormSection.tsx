"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";

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

            {/* ── Form ── */}
            {submitted ? (
              <div className="rounded-2xl border border-gold/30 bg-white p-8 sm:p-12 text-center shadow-lg shadow-navy/5">
                <span
                  className="text-gold text-4xl mb-4 block"
                  aria-hidden="true"
                >
                  ✓
                </span>
                <p className="font-serif text-2xl font-bold text-navy">
                  {isRtl
                    ? "شكرًا لك — سنتواصل معك قريبًا."
                    : "Thank you — we will be in touch."}
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  {isRtl
                    ? "تم استلام اهتمامك وسيقوم فريقنا بمشاركتك تفاصيل المسار."
                    : "Your details have been received and we will share pathway updates."}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
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
                      autoComplete="name"
                      placeholder={
                        isRtl ? "مثال: د. أحمد محمد" : "e.g. Dr. Ahmed Mostafa"
                      }
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-navy placeholder:text-slate-400 focus:border-gold focus:ring-2 focus:ring-gold/20 shadow-sm transition-all outline-none"
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
                      autoComplete="email"
                      placeholder="name@example.com"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-navy placeholder:text-slate-400 focus:border-gold focus:ring-2 focus:ring-gold/20 shadow-sm transition-all outline-none"
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
                      placeholder={
                        isRtl
                          ? "مثال: استشاري طب نفسي"
                          : "e.g. Consultant Psychiatrist"
                      }
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-navy placeholder:text-slate-400 focus:border-gold focus:ring-2 focus:ring-gold/20 shadow-sm transition-all outline-none"
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
                      placeholder={
                        isRtl
                          ? "مثال: وزارة العدل / جهة العمل"
                          : "e.g. Ministry of Justice / Hospital Group"
                      }
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-navy placeholder:text-slate-400 focus:border-gold focus:ring-2 focus:ring-gold/20 shadow-sm transition-all outline-none"
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
                      defaultValue=""
                      className="w-full appearance-none rounded-xl border border-slate-300 bg-white px-4 py-3 pe-11 text-sm text-navy focus:border-gold focus:ring-2 focus:ring-gold/20 shadow-sm transition-all outline-none cursor-pointer"
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
                    placeholder={
                      isRtl
                        ? "اكتب أي تفاصيل أو استفسارات إضافية هنا..."
                        : "Add any questions, cohort timing, or notes..."
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white p-4 text-sm text-navy placeholder:text-slate-400 focus:border-gold focus:ring-2 focus:ring-gold/20 shadow-sm transition-all outline-none resize-none"
                  />
                </div>

                {/* Submit Row */}
                <div className="flex flex-col gap-3 pt-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    id="contact-submit-btn"
                    className="btn btn-navy text-sm font-semibold !py-3.5 !px-8 self-start gap-2 shadow-lg shadow-navy/15 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="block h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        {isRtl ? "جارٍ الإرسال..." : "Sending..."}
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
