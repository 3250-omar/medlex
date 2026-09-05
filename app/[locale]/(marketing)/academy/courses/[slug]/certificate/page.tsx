"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import {
  Award,
  Download,
  Lock,
  ArrowRight,
  ChevronLeft,
  CheckCircle2,
  Share2,
  Edit3,
  Loader2,
  Sparkles,
} from "lucide-react";
import Container from "@/components/layout/Container";
import {
  useCurrentUser,
  useCertificateStatus,
  useIssueCertificate,
} from "../../../../_apiCalls/academyQueries";

interface CertificatePageProps {
  params: Promise<{ slug: string }>;
}

export default function CourseCertificatePage({
  params,
}: CertificatePageProps) {
  const { slug } = use(params);
  const locale = useLocale();
  const isAr = locale === "ar";

  const { data: user, isLoading: isUserLoading } = useCurrentUser();
  const {
    data: status,
    isLoading: isStatusLoading,
    refetch,
  } = useCertificateStatus(slug, Boolean(user));
  const { mutate: updateName, isPending: isUpdatingName } =
    useIssueCertificate();

  const [isDownloading, setIsDownloading] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [customName, setCustomName] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);

  const handleStartEdit = () => {
    setCustomName(
      status?.certificate?.recipient_name || status?.user_name || "",
    );
    setIsEditingName(true);
  };

  if (isUserLoading || isStatusLoading) {
    return (
      <div className="min-h-screen bg-[#070e17] py-32 text-white">
        <Container>
          <div className="mx-auto max-w-2xl space-y-6">
            <div className="h-8 w-48 animate-pulse rounded bg-white/10" />
            <div className="h-64 animate-pulse rounded-xl border border-white/10 bg-white/5" />
          </div>
        </Container>
      </div>
    );
  }

  // Not enrolled state
  if (!status?.enrolled) {
    return (
      <div className="min-h-screen bg-[#070e17] py-32 text-white">
        <Container>
          <div className="mx-auto max-w-xl rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-md">
            <Lock className="mx-auto h-12 w-12 text-[#d4af37]" />
            <h1 className="mt-6 font-display text-3xl">
              {isAr ? "الكورس غير مفعل" : "Course Access Required"}
            </h1>
            <p className="mt-3 font-body text-sm text-white/60">
              {isAr
                ? "يجب أن تكون مسجلاً في هذا الكورس للحصول على شهادة إتمام."
                : "You must be enrolled in this course to view or claim a certificate of completion."}
            </p>
            <Link
              href={`/${locale}/courses`}
              className="mt-8 inline-flex items-center gap-2 rounded bg-[#d4af37] px-6 py-3 font-body text-sm font-semibold text-[#070e17] transition-all hover:bg-[#e0c068]"
            >
              <ChevronLeft className="h-4 w-4" />
              {isAr ? "العودة إلى دوراتي" : "Back to My Courses"}
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  const progress = status.progress_percent || 0;
  const isEligible = status.eligible; // >= 50%
  const displayName =
    status.certificate?.recipient_name || status.user_name || "Learner";
  const courseTitle = status.course_title || "The CASC Academy";

  // Format date
  const rawDate = status.certificate?.issued_at || status.completion_date;
  const completionDate = rawDate
    ? new Date(rawDate).toLocaleDateString(isAr ? "ar-EG" : "en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : new Date().toLocaleDateString(isAr ? "ar-EG" : "en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

  const handleDownloadPdf = async () => {
    try {
      setIsDownloading(true);
      const res = await fetch(`/api/academy/courses/${slug}/certificate/pdf`);
      if (!res.ok) {
        throw new Error("Failed to generate certificate PDF");
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `MedLex-Certificate-${slug}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert(
        isAr
          ? "تعذر تحميل الشهادة. يرجى المحاولة مرة أخرى."
          : "Could not download the certificate. Please try again.",
      );
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;
    updateName(
      { courseSlug: slug, recipientName: customName.trim() },
      {
        onSuccess: () => {
          setIsEditingName(false);
          void refetch();
        },
      },
    );
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      void navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-[#070e17] py-28 text-white">
      <Container>
        {/* Navigation Breadcrumb */}
        <div className="mb-10 flex items-center gap-3 font-body text-xs text-white/50">
          <Link
            href={`/${locale}/courses`}
            className="flex items-center gap-1 transition-colors hover:text-[#d4af37]"
          >
            <ChevronLeft className="h-4 w-4" />
            {isAr ? "دوراتي" : "My Courses"}
          </Link>
          <span>/</span>
          <span>{courseTitle}</span>
          <span>/</span>
          <span className="text-[#d4af37]">
            {isAr ? "شهادة الإتمام" : "Certificate of Completion"}
          </span>
        </div>

        {/* LOCKED STATE (< 50% Progress) */}
        {!isEligible ? (
          <div className="mx-auto max-w-2xl rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl md:p-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-amber-400/30 bg-amber-500/10 text-amber-400">
              <Lock className="h-8 w-8" />
            </div>

            <h1 className="mt-6 font-display text-3xl text-white md:text-4xl">
              {isAr ? "الشهادة مقفلة حالياً" : "Certificate Locked"}
            </h1>

            <p className="mt-3 font-body text-sm leading-relaxed text-white/70">
              {isAr
                ? `لقد أكملت ${status.completed_units} من أصل ${status.total_units} درساً (${progress}%). يتطلب الحصول على شهادة الإتمام إنهاء 50% على الأقل من محتوى الكورس.`
                : `You have completed ${status.completed_units} of ${status.total_units} lessons (${progress}%). A minimum of 50% course progress is required to unlock your official Certificate of Completion.`}
            </p>

            {/* Progress Bar */}
            <div className="mx-auto mt-8 max-w-md">
              <div className="flex items-center justify-between font-body text-xs text-white/70">
                <span>
                  {isAr ? `${progress}% منجزة` : `${progress}% completed`}
                </span>
                <span className="font-semibold text-[#d4af37]">
                  {isAr ? "المطلوب: 50%" : "Required: 50%"}
                </span>
              </div>
              <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full bg-amber-400 transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                />
              </div>
            </div>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                href={`/${locale}/academy/courses/${slug}/learn`}
                className="inline-flex items-center gap-2 rounded-lg bg-[#d4af37] px-6 py-3 font-body text-sm font-semibold text-[#070e17] transition-transform hover:-translate-y-0.5 hover:bg-[#e0c068]"
              >
                {isAr ? "مواصلة التعلم الآن" : "Continue Learning Now"}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={`/${locale}/courses`}
                className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-6 py-3 font-body text-sm text-white/80 transition-colors hover:bg-white/10"
              >
                {isAr ? "العودة إلى الدورات" : "Return to Courses"}
              </Link>
            </div>
          </div>
        ) : (
          /* ELIGIBLE / UNLOCKED STATE (>= 50% Progress) */
          <div className="space-y-12">
            {/* Header / Celebration */}
            <div className="flex flex-col items-start justify-between gap-6 border-b border-white/10 pb-8 md:flex-row md:items-end">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-body text-xs font-medium text-emerald-400">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {isAr
                    ? `مؤهل للحصول على الشهادة (${progress}% مكتمل)`
                    : `Certificate Earned (${progress}% Completed)`}
                </div>
                <h1 className="mt-4 font-display text-3xl md:text-5xl text-white">
                  {isAr ? "شهادة إتمام معتمدة" : "Certificate of Completion"}
                </h1>
                <p className="mt-2 font-body text-sm text-white/60">
                  {isAr
                    ? `تهانينا لك على استكمال متطلبات ${courseTitle}`
                    : `Congratulations on fulfilling the rigorous criteria for ${courseTitle}`}
                </p>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  disabled={isDownloading}
                  className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#d4af37] px-6 font-body text-sm font-semibold text-[#070e17] shadow-lg transition-all hover:bg-[#e0c068] active:scale-95 disabled:opacity-50"
                >
                  {isDownloading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {isAr ? "جارٍ التحميل..." : "Generating PDF..."}
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      {isAr
                        ? "تحميل الشهادة (PDF)"
                        : "Download Certificate (PDF)"}
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-4 font-body text-sm text-white/80 transition-colors hover:bg-white/10"
                >
                  <Share2 className="h-4 w-4" />
                  {copiedLink
                    ? isAr
                      ? "تم النسخ!"
                      : "Copied!"
                    : isAr
                      ? "مشاركة"
                      : "Share"}
                </button>
              </div>
            </div>

            {/* Recipient Name Customization Row */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/5 p-4 text-xs">
              <div className="flex items-center gap-3">
                <Sparkles className="h-4 w-4 text-[#d4af37]" />
                <span className="text-white/70">
                  {isAr ? "الاسم المطبوع على الشهادة:" : "Name on Certificate:"}
                </span>
                <span className="font-semibold text-white">{displayName}</span>
              </div>

              {isEditingName ? (
                <form
                  onSubmit={handleSaveName}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="Enter full name"
                    className="rounded border border-white/20 bg-[#0c1a2e] px-3 py-1 font-body text-xs text-white outline-none focus:border-[#d4af37]"
                    autoFocus
                  />
                  <button
                    type="submit"
                    disabled={isUpdatingName}
                    className="rounded bg-[#d4af37] px-3 py-1 font-body font-semibold text-[#070e17] transition-all hover:bg-[#e0c068]"
                  >
                    {isUpdatingName ? "..." : isAr ? "حفظ" : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingName(false)}
                    className="px-2 py-1 text-white/60 hover:text-white"
                  >
                    {isAr ? "إلغاء" : "Cancel"}
                  </button>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={handleStartEdit}
                  className="inline-flex items-center gap-1.5 text-[#d4af37] underline transition-colors hover:text-[#e0c068]"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  {isAr ? "تعديل الاسم" : "Edit Name"}
                </button>
              )}
            </div>

            {/* HIGH FIDELITY CERTIFICATE PREVIEW */}
            <div className="relative mx-auto max-w-4xl overflow-hidden rounded-2xl border-4 border-[#d4af37]/40 bg-[#0d1c31] p-6 shadow-2xl md:p-14">
              {/* Inner Ornamental Border */}
              <div className="relative flex min-h-[480px] flex-col justify-between border-2 border-[#d4af37]/60 p-8 text-center md:p-12">
                {/* Header MedLex Brand */}
                <div>
                  <div className="mx-auto flex w-fit items-center justify-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded border border-[#d4af37]/80 font-display text-lg font-bold text-[#d4af37]">
                      M
                    </div>
                    <div className="text-left">
                      <h3 className="font-display text-xl tracking-[0.2em] text-white">
                        MEDLEX
                      </h3>
                      <p className="font-body text-[9px] uppercase tracking-[0.3em] text-[#d4af37]">
                        FOUNDATIONS
                      </p>
                    </div>
                  </div>

                  <p className="mt-8 font-body text-[11px] font-semibold uppercase tracking-[0.35em] text-[#d4af37]">
                    CERTIFICATE OF COMPLETION
                  </p>
                  <p className="mt-4 font-body text-xs italic tracking-wider text-white/70">
                    This is to certify that
                  </p>
                </div>

                {/* Recipient Name Box */}
                <div className="my-6">
                  <div className="mx-auto max-w-xl border-b-2 border-[#d4af37] pb-2">
                    <h2 className="font-serif text-2xl font-bold tracking-wide text-white md:text-4xl">
                      {displayName}
                    </h2>
                  </div>
                  <p className="mt-2 font-body text-[9px] uppercase tracking-[0.25em] text-white/50">
                    FULL NAME
                  </p>
                </div>

                {/* Course Completion Details */}
                <div>
                  <p className="font-body text-xs italic tracking-wider text-white/70">
                    has completed
                  </p>
                  <h3 className="mt-2 font-serif text-2xl font-semibold text-[#d4af37] md:text-3xl">
                    {courseTitle}
                  </h3>
                  <p className="mt-1 font-body text-xs italic text-white/60">
                    Forty-three stations across eight domains of the MRCPsych
                    CASC
                  </p>
                </div>

                {/* Footer Signatures and Date */}
                <div className="mt-12 flex flex-col items-center justify-between gap-6 pt-6 border-t border-white/10 sm:flex-row">
                  {/* Date Box */}
                  <div className="text-left">
                    <div className="border-b border-[#d4af37]/80 pb-1">
                      <p className="font-body text-xs font-semibold text-white">
                        {completionDate}
                      </p>
                    </div>
                    <p className="mt-1 font-body text-[8px] uppercase tracking-[0.2em] text-white/50">
                      DATE OF COMPLETION
                    </p>
                  </div>

                  {/* Serial Number */}
                  {status.certificate?.certificate_number && (
                    <div className="text-center font-mono text-[9px] uppercase tracking-widest text-[#d4af37]/80">
                      ID: {status.certificate.certificate_number}
                    </div>
                  )}

                  {/* Signatory */}
                  <div className="text-right">
                    <p className="font-serif italic text-base text-white/90">
                      Ahmed Abouelghit
                    </p>
                    <p className="mt-1 font-body text-[10px] font-bold tracking-wider text-white">
                      DR AHMED ABOUELGHIT
                    </p>
                    <p className="font-body text-[8px] text-white/60">
                      Consultant Forensic Psychiatrist · former CASC examiner
                    </p>
                  </div>
                </div>

                {/* Disclaimer */}
                <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-white/10 pt-4 text-[8px] text-white/40 sm:flex-row">
                  <span>Where Medicine Meets Justice</span>
                  <span>
                    This certificate records completion of a private educational
                    programme.
                  </span>
                  <span>The CASC Academy · by MedLex Foundations</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-6">
              <button
                type="button"
                onClick={handleDownloadPdf}
                disabled={isDownloading}
                className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-[#d4af37] px-8 font-body text-sm font-semibold text-[#070e17] shadow-xl transition-transform hover:-translate-y-0.5 hover:bg-[#e0c068]"
              >
                <Download className="h-4 w-4" />
                {isAr ? "تحميل نسخة PDF الرسمية" : "Download Official PDF"}
              </button>
              <Link
                href={`/${locale}/courses`}
                className="inline-flex min-h-12 items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-6 font-body text-sm text-white/80 transition-colors hover:bg-white/10"
              >
                {isAr ? "العودة إلى دوراتي" : "Back to My Courses"}
              </Link>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
