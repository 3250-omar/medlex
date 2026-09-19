"use client";

import { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { CheckCircle2, AlertCircle, ChevronDown } from "lucide-react";
import { useCurrentUser } from "@/app/[locale]/(marketing)/_apiCalls/academyQueries";

interface InstitutionalEnquiryProps {
  locale: string;
}

export default function InstitutionalEnquiry({
  locale,
}: InstitutionalEnquiryProps) {
  const t = useTranslations("institutionalPage.enquiry");
  const formRef = useRef<HTMLFormElement>(null);

  const { data: user } = useCurrentUser();
  const isLoggedIn = Boolean(user);

  const userFullName = (user?.fullName || user?.username || "").trim();
  const userEmail = (user?.email || "").trim();
  const userPhone = (user?.phone || "").trim();

  const hasStoredName = isLoggedIn && Boolean(userFullName);
  const hasStoredEmail = isLoggedIn && Boolean(userEmail);
  const hasStoredPhone = isLoggedIn && Boolean(userPhone);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const steps = [
    {
      num: t("nextSteps.step1Num"),
      title: t("nextSteps.step1Title"),
      desc: t("nextSteps.step1Desc"),
    },
    {
      num: t("nextSteps.step2Num"),
      title: t("nextSteps.step2Title"),
      desc: t("nextSteps.step2Desc"),
    },
    {
      num: t("nextSteps.step3Num"),
      title: t("nextSteps.step3Title"),
      desc: t("nextSteps.step3Desc"),
    },
    {
      num: t("nextSteps.step4Num"),
      title: t("nextSteps.step4Title"),
      desc: t("nextSteps.step4Desc"),
    },
  ];

  const typeOptions = [
    t("form.typeOptions.0"),
    t("form.typeOptions.1"),
    t("form.typeOptions.2"),
    t("form.typeOptions.3"),
    t("form.typeOptions.4"),
    t("form.typeOptions.5"),
    t("form.typeOptions.6"),
    t("form.typeOptions.7"),
  ];

  const needOptions = [
    t("form.needOptions.0"),
    t("form.needOptions.1"),
    t("form.needOptions.2"),
    t("form.needOptions.3"),
  ];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const formData = new FormData(e.currentTarget);
    const resolvedFullName = (
      hasStoredName ? userFullName : String(formData.get("fullName") || "")
    ).trim();
    const resolvedEmail = (
      hasStoredEmail ? userEmail : String(formData.get("email") || "")
    ).trim();
    const resolvedPhone =
      (hasStoredPhone
        ? userPhone
        : String(formData.get("phone") || "")
      ).trim() || "N/A";
    const resolvedRole =
      String(formData.get("role") || "").trim() ||
      "Institutional Representative";
    const resolvedOrg = String(formData.get("institution") || "").trim();
    const resolvedType = String(formData.get("institutionType") || "").trim();
    const resolvedNeed = String(formData.get("need") || "").trim();
    const resolvedDetails = String(formData.get("details") || "").trim();
    const hp = String(formData.get("_hp") || "").trim();

    if (!resolvedOrg || !resolvedFullName || !resolvedEmail) {
      setErrorMessage(t("form.errorGeneric"));
      setIsSubmitting(false);
      return;
    }

    const payload = {
      fullName: resolvedFullName,
      email: resolvedEmail,
      phone: resolvedPhone,
      professionalRole: resolvedRole,
      organisation: resolvedOrg,
      pathway: `Institutional — ${resolvedNeed || "General"}`,
      notes: `[Institution Type]: ${resolvedType}\n[Requirement]: ${resolvedNeed}\n\n[Details]:\n${resolvedDetails}`,
      _hp: hp,
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
        let msg = t("form.errorGeneric");
        if (response.status === 503) {
          msg = t("form.errorConfig");
        } else if (data?.error) {
          msg = data.error;
        }
        throw new Error(msg);
      }

      setSubmitted(true);
      formRef.current?.reset();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t("form.errorGeneric");
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
      id="enquiry"
      className="py-24 bg-fd-parchment border-t border-fd-stone text-char scroll-mt-20"
    >
      <div className="mx-auto max-w-[1120px] px-7">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
          {/* Left Column: Form */}
          <div>
            <h2 className="font-serif font-medium text-[clamp(30px,3.6vw,42px)] leading-[1.12] tracking-[-0.01em] text-navy! [text-wrap:balance]">
              {t("title")}
            </h2>
            <div className="w-14 h-0.5 bg-gold my-6" />
            <p className="font-sans text-[18px] leading-relaxed text-char/85 max-w-[50ch]">
              {t("lead")}
            </p>

            {submitted ? (
              <div
                role="status"
                aria-live="polite"
                className="mt-8 p-8 rounded-md bg-white border border-gold/40 shadow-xs animate-fade-in"
              >
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold">
                    <CheckCircle2 className="size-6 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-navy!">
                      {t("form.success")}
                    </h3>
                    <p className="text-sm text-char/80 mt-0.5">
                      {t("nextSteps.step1Desc")}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleReset}
                  className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold hover:text-goldd transition-colors cursor-pointer"
                >
                  {t("form.submitAnother")}
                </button>
              </div>
            ) : (
              <form
                ref={formRef}
                onSubmit={handleSubmit}
                className="mt-7 space-y-3.5"
                noValidate
                aria-busy={isSubmitting}
              >
                {/* Honeypot field for bot spam prevention */}
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="inst-hp">Leave this field blank</label>
                  <input
                    id="inst-hp"
                    type="text"
                    name="_hp"
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                {/* Logged-in User Account Banner */}
                {isLoggedIn && (
                  <div className="rounded-md border border-gold/30 bg-gold/5 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy text-gold font-serif font-bold text-base shadow-xs">
                        {userFullName?.[0]?.toUpperCase() ||
                          userEmail?.[0]?.toUpperCase() ||
                          "U"}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-gold">
                          {t("form.loggedInAs")}
                        </span>
                        <span className="text-sm font-bold text-navy! truncate">
                          {userFullName || userEmail}
                        </span>
                        <div
                          className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-fd-muted mt-0.5"
                          dir="ltr"
                        >
                          {userEmail && <span>{userEmail}</span>}
                          {userPhone && (
                            <>
                              <span>•</span>
                              <span>{userPhone}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-fd-muted max-w-xs sm:text-end leading-relaxed">
                      {t("form.autoContactInfo")}
                    </span>
                  </div>
                )}

                {/* Institution Name */}
                <input
                  type="text"
                  name="institution"
                  required
                  disabled={isSubmitting}
                  placeholder={t("form.institution")}
                  aria-label={t("form.institution")}
                  className="w-full font-sans text-[15px] p-3.5 border border-fd-stone rounded bg-white text-navy! placeholder:text-fd-muted focus:outline-hidden focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all disabled:opacity-60"
                />

                {/* Full Name (Only if not stored in account) */}
                {!hasStoredName && (
                  <input
                    type="text"
                    name="fullName"
                    required
                    disabled={isSubmitting}
                    placeholder={t("form.fullName")}
                    aria-label={t("form.fullName")}
                    className="w-full font-sans text-[15px] p-3.5 border border-fd-stone rounded bg-white text-navy! placeholder:text-fd-muted focus:outline-hidden focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all disabled:opacity-60"
                  />
                )}

                {/* Professional Role / Position */}
                <input
                  type="text"
                  name="role"
                  required
                  disabled={isSubmitting}
                  placeholder={t("form.role")}
                  aria-label={t("form.role")}
                  className="w-full font-sans text-[15px] p-3.5 border border-fd-stone rounded bg-white text-navy! placeholder:text-fd-muted focus:outline-hidden focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all disabled:opacity-60"
                />

                {/* Official Email (Only if not stored in account) */}
                {!hasStoredEmail && (
                  <input
                    type="email"
                    name="email"
                    required
                    disabled={isSubmitting}
                    placeholder={t("form.email")}
                    aria-label={t("form.email")}
                    className="w-full font-sans text-[15px] p-3.5 border border-fd-stone rounded bg-white text-navy! placeholder:text-fd-muted focus:outline-hidden focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all disabled:opacity-60"
                  />
                )}

                {/* Phone (Only if not stored in account) */}
                {!hasStoredPhone && (
                  <input
                    type="tel"
                    name="phone"
                    disabled={isSubmitting}
                    placeholder={t("form.phone")}
                    aria-label={t("form.phone")}
                    dir="ltr"
                    className="w-full font-sans text-[15px] p-3.5 border border-fd-stone rounded bg-white text-navy! placeholder:text-fd-muted focus:outline-hidden focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all disabled:opacity-60 text-start"
                  />
                )}

                {/* Institution Type Dropdown */}
                <div className="relative">
                  <select
                    name="institutionType"
                    aria-label={t("form.typeLabel")}
                    defaultValue=""
                    required
                    disabled={isSubmitting}
                    className="w-full appearance-none font-sans text-[15px] p-3.5 pe-10 border border-fd-stone rounded bg-white text-char/90 focus:outline-hidden focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all cursor-pointer disabled:opacity-60"
                  >
                    <option value="" disabled className="text-fd-muted">
                      {t("form.typePlaceholder")}
                    </option>
                    {typeOptions.map((opt, i) => (
                      <option key={i} value={opt} className="text-navy!">
                        {opt}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute end-4 top-1/2 -translate-y-1/2 size-4 text-fd-muted" />
                </div>

                {/* What You Need Dropdown */}
                <div className="relative">
                  <select
                    name="need"
                    aria-label={t("form.needLabel")}
                    defaultValue=""
                    required
                    disabled={isSubmitting}
                    className="w-full appearance-none font-sans text-[15px] p-3.5 pe-10 border border-fd-stone rounded bg-white text-char/90 focus:outline-hidden focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all cursor-pointer disabled:opacity-60"
                  >
                    <option value="" disabled className="text-fd-muted">
                      {t("form.needPlaceholder")}
                    </option>
                    {needOptions.map((opt, i) => (
                      <option key={i} value={opt} className="text-navy!">
                        {opt}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute end-4 top-1/2 -translate-y-1/2 size-4 text-fd-muted" />
                </div>

                {/* Details Textarea */}
                <textarea
                  name="details"
                  required
                  disabled={isSubmitting}
                  placeholder={t("form.detailsPlaceholder")}
                  aria-label={t("form.detailsPlaceholder")}
                  className="w-full font-sans text-[15px] p-3.5 border border-fd-stone rounded bg-white text-navy! placeholder:text-fd-muted min-h-[110px] resize-y focus:outline-hidden focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all disabled:opacity-60"
                />

                {/* Error Banner */}
                {errorMessage && (
                  <div
                    role="alert"
                    aria-live="assertive"
                    className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800 flex items-start gap-3 animate-fade-in"
                  >
                    <AlertCircle
                      className="text-red-500 shrink-0 size-5 mt-0.5"
                      aria-hidden="true"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-red-900">
                        {t("form.errorTitle")}
                      </p>
                      <p className="mt-0.5 text-xs text-red-700 leading-relaxed">
                        {errorMessage}
                      </p>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-navy !py-3.5 !px-8 text-[15px] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="block size-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      {t("form.submitting")}
                    </span>
                  ) : (
                    t("form.submit")
                  )}
                </button>
              </form>
            )}

            <p className="mt-4 font-sans text-[13.5px] text-fd-muted leading-relaxed">
              {t("form.disclaimer")}
            </p>
          </div>

          {/* Right Column: Next Steps Box */}
          <div className="bg-white border border-fd-stone border-l-4 border-l-gold rtl:border-l-0 rtl:border-r-4 rtl:border-r-gold rounded-md p-7 sm:p-8 shadow-2xs">
            <b className="block font-serif text-[21px] font-semibold text-navy! mb-3.5">
              {t("nextSteps.title")}
            </b>

            <div className="divide-y divide-fd-stone">
              {steps.map((s, idx) => (
                <div
                  key={idx}
                  className="py-3.5 text-[15px] grid grid-cols-[26px_1fr] gap-3 items-baseline"
                >
                  <i className="not-italic font-serif text-[19px] font-medium text-gold">
                    {s.num}
                  </i>
                  <div>
                    <b className="font-sans font-semibold text-navy! block mb-0.5">
                      {s.title}
                    </b>
                    <span className="text-char/80 leading-snug">{s.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
