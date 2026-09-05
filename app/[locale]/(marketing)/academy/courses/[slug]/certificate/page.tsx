"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import {
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

  // Official English date matching the certificate template (e.g. 5 September 2026)
  const rawDate = status.certificate?.issued_at || status.completion_date;
  const completionDate = rawDate
    ? new Date(rawDate).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : new Date().toLocaleDateString("en-GB", {
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

        <div className="space-y-10">
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

          {/* AUTHENTIC CERTIFICATE TEMPLATE PREVIEW WITH USER NAME AND DAY DATE */}
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-2xl border-2 border-[#d4af37]/40 bg-[#070e17] p-2 sm:p-4 shadow-2xl shadow-black/80">
            <div
              className="relative aspect-[2526/1786] w-full overflow-hidden rounded-xl select-none"
              style={{ containerType: "inline-size" }}
            >
              {/* Certificate Background Template */}
              <img
                src="/certificates/casc-academy-template.png"
                alt="MedLex Certificate of Completion"
                className="h-full w-full object-cover pointer-events-none"
              />

              {/* Recipient Full Name (Centered above the gold line) */}
              <div
                className="absolute inset-x-[20%] top-[38.4%] flex h-[6.2%] items-end justify-center pointer-events-none"
                style={{ textAlign: "center" }}
              >
                <span
                  className="font-serif font-bold tracking-wide text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]"
                  style={{
                    fontSize: "clamp(13px, 2.7cqw, 36px)",
                    lineHeight: 1.15,
                  }}
                >
                  {displayName}
                </span>
              </div>

              {/* Day Date (Centered above Date of Completion line) */}
              <div
                className="absolute left-[23.1%] top-[70.8%] flex h-[4.2%] w-[21.2%] items-end justify-center pointer-events-none"
                style={{ textAlign: "center" }}
              >
                <span
                  className="font-sans font-bold tracking-normal text-[#ebf0fa] drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]"
                  style={{
                    fontSize: "clamp(8px, 1.45cqw, 18px)",
                    lineHeight: 1.15,
                  }}
                >
                  {completionDate}
                </span>
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

        {/* LOCKED STATE (< 50% Progress) */}
      </Container>
    </div>
  );
}
// {!isEligible ? (
//   <div className="mx-auto max-w-2xl rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl md:p-12">
//     <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-amber-400/30 bg-amber-500/10 text-amber-400">
//       <Lock className="h-8 w-8" />
//     </div>

//     <h1 className="mt-6 font-display text-3xl text-white md:text-4xl">
//       {isAr ? "الشهادة مقفلة حالياً" : "Certificate Locked"}
//     </h1>

//     <p className="mt-3 font-body text-sm leading-relaxed text-white/70">
//       {isAr
//         ? `لقد أكملت ${status.completed_units} من أصل ${status.total_units} درساً (${progress}%). يتطلب الحصول على شهادة الإتمام إنهاء 50% على الأقل من محتوى الكورس.`
//         : `You have completed ${status.completed_units} of ${status.total_units} lessons (${progress}%). A minimum of 50% course progress is required to unlock your official Certificate of Completion.`}
//     </p>

//     {/* Progress Bar */}
//     <div className="mx-auto mt-8 max-w-md">
//       <div className="flex items-center justify-between font-body text-xs text-white/70">
//         <span>
//           {isAr ? `${progress}% منجزة` : `${progress}% completed`}
//         </span>
//         <span className="font-semibold text-[#d4af37]">
//           {isAr ? "المطلوب: 50%" : "Required: 50%"}
//         </span>
//       </div>
//       <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-white/10">
//         <div
//           className="h-full bg-amber-400 transition-all duration-500"
//           style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
//         />
//       </div>
//     </div>

//     <div className="mt-10 flex flex-wrap justify-center gap-4">
//       <Link
//         href={`/${locale}/academy/courses/${slug}/learn`}
//         className="inline-flex items-center gap-2 rounded-lg bg-[#d4af37] px-6 py-3 font-body text-sm font-semibold text-[#070e17] transition-transform hover:-translate-y-0.5 hover:bg-[#e0c068]"
//       >
//         {isAr ? "مواصلة التعلم الآن" : "Continue Learning Now"}
//         <ArrowRight className="h-4 w-4" />
//       </Link>
//       <Link
//         href={`/${locale}/courses`}
//         className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-6 py-3 font-body text-sm text-white/80 transition-colors hover:bg-white/10"
//       >
//         {isAr ? "العودة إلى الدورات" : "Return to Courses"}
//       </Link>
//     </div>
//   </div>
// ) : (
//   /* ELIGIBLE / UNLOCKED STATE (>= 50% Progress) */
//   <div className="space-y-10">
//     {/* Header / Celebration */}
//     <div className="flex flex-col items-start justify-between gap-6 border-b border-white/10 pb-8 md:flex-row md:items-end">
//       <div>
//         <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-body text-xs font-medium text-emerald-400">
//           <CheckCircle2 className="h-3.5 w-3.5" />
//           {isAr
//             ? `مؤهل للحصول على الشهادة (${progress}% مكتمل)`
//             : `Certificate Earned (${progress}% Completed)`}
//         </div>
//         <h1 className="mt-4 font-display text-3xl md:text-5xl text-white">
//           {isAr ? "شهادة إتمام معتمدة" : "Certificate of Completion"}
//         </h1>
//         <p className="mt-2 font-body text-sm text-white/60">
//           {isAr
//             ? `تهانينا لك على استكمال متطلبات ${courseTitle}`
//             : `Congratulations on fulfilling the rigorous criteria for ${courseTitle}`}
//         </p>
//       </div>

//       {/* Quick Actions */}
//       <div className="flex flex-wrap items-center gap-3">
//         <button
//           type="button"
//           onClick={handleDownloadPdf}
//           disabled={isDownloading}
//           className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#d4af37] px-6 font-body text-sm font-semibold text-[#070e17] shadow-lg transition-all hover:bg-[#e0c068] active:scale-95 disabled:opacity-50"
//         >
//           {isDownloading ? (
//             <>
//               <Loader2 className="h-4 w-4 animate-spin" />
//               {isAr ? "جارٍ التحميل..." : "Generating PDF..."}
//             </>
//           ) : (
//             <>
//               <Download className="h-4 w-4" />
//               {isAr
//                 ? "تحميل الشهادة (PDF)"
//                 : "Download Certificate (PDF)"}
//             </>
//           )}
//         </button>

//         <button
//           type="button"
//           onClick={handleCopyLink}
//           className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-4 font-body text-sm text-white/80 transition-colors hover:bg-white/10"
//         >
//           <Share2 className="h-4 w-4" />
//           {copiedLink
//             ? isAr
//               ? "تم النسخ!"
//               : "Copied!"
//             : isAr
//               ? "مشاركة"
//               : "Share"}
//         </button>
//       </div>
//     </div>

//     {/* Recipient Name Customization Row */}
//     <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/5 p-4 text-xs">
//       <div className="flex items-center gap-3">
//         <Sparkles className="h-4 w-4 text-[#d4af37]" />
//         <span className="text-white/70">
//           {isAr ? "الاسم المطبوع على الشهادة:" : "Name on Certificate:"}
//         </span>
//         <span className="font-semibold text-white">{displayName}</span>
//       </div>

//       {isEditingName ? (
//         <form
//           onSubmit={handleSaveName}
//           className="flex items-center gap-2"
//         >
//           <input
//             type="text"
//             value={customName}
//             onChange={(e) => setCustomName(e.target.value)}
//             placeholder="Enter full name"
//             className="rounded border border-white/20 bg-[#0c1a2e] px-3 py-1 font-body text-xs text-white outline-none focus:border-[#d4af37]"
//             autoFocus
//           />
//           <button
//             type="submit"
//             disabled={isUpdatingName}
//             className="rounded bg-[#d4af37] px-3 py-1 font-body font-semibold text-[#070e17] transition-all hover:bg-[#e0c068]"
//           >
//             {isUpdatingName ? "..." : isAr ? "حفظ" : "Save"}
//           </button>
//           <button
//             type="button"
//             onClick={() => setIsEditingName(false)}
//             className="px-2 py-1 text-white/60 hover:text-white"
//           >
//             {isAr ? "إلغاء" : "Cancel"}
//           </button>
//         </form>
//       ) : (
//         <button
//           type="button"
//           onClick={handleStartEdit}
//           className="inline-flex items-center gap-1.5 text-[#d4af37] underline transition-colors hover:text-[#e0c068]"
//         >
//           <Edit3 className="h-3.5 w-3.5" />
//           {isAr ? "تعديل الاسم" : "Edit Name"}
//         </button>
//       )}
//     </div>

//     {/* AUTHENTIC CERTIFICATE TEMPLATE PREVIEW WITH USER NAME AND DAY DATE */}
//     <div className="relative mx-auto max-w-5xl overflow-hidden rounded-2xl border-2 border-[#d4af37]/40 bg-[#070e17] p-2 sm:p-4 shadow-2xl shadow-black/80">
//       <div
//         className="relative aspect-[2526/1786] w-full overflow-hidden rounded-xl select-none"
//         style={{ containerType: "inline-size" }}
//       >
//         {/* Certificate Background Template */}
//         <img
//           src="/certificates/casc-academy-template.png"
//           alt="MedLex Certificate of Completion"
//           className="h-full w-full object-cover pointer-events-none"
//         />

//         {/* Recipient Full Name (Centered above the gold line) */}
//         <div
//           className="absolute inset-x-[20%] top-[38.4%] flex h-[6.2%] items-end justify-center pointer-events-none"
//           style={{ textAlign: "center" }}
//         >
//           <span
//             className="font-serif font-bold tracking-wide text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]"
//             style={{
//               fontSize: "clamp(13px, 2.7cqw, 36px)",
//               lineHeight: 1.15,
//             }}
//           >
//             {displayName}
//           </span>
//         </div>

//         {/* Day Date (Centered above Date of Completion line) */}
//         <div
//           className="absolute left-[23.1%] top-[70.8%] flex h-[4.2%] w-[21.2%] items-end justify-center pointer-events-none"
//           style={{ textAlign: "center" }}
//         >
//           <span
//             className="font-sans font-bold tracking-normal text-[#ebf0fa] drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]"
//             style={{
//               fontSize: "clamp(8px, 1.45cqw, 18px)",
//               lineHeight: 1.15,
//             }}
//           >
//             {completionDate}
//           </span>
//         </div>
//       </div>
//     </div>

//     {/* Bottom Actions */}
//     <div className="flex flex-wrap items-center justify-center gap-4 pt-6">
//       <button
//         type="button"
//         onClick={handleDownloadPdf}
//         disabled={isDownloading}
//         className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-[#d4af37] px-8 font-body text-sm font-semibold text-[#070e17] shadow-xl transition-transform hover:-translate-y-0.5 hover:bg-[#e0c068]"
//       >
//         <Download className="h-4 w-4" />
//         {isAr ? "تحميل نسخة PDF الرسمية" : "Download Official PDF"}
//       </button>
//       <Link
//         href={`/${locale}/courses`}
//         className="inline-flex min-h-12 items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-6 font-body text-sm text-white/80 transition-colors hover:bg-white/10"
//       >
//         {isAr ? "العودة إلى دوراتي" : "Back to My Courses"}
//       </Link>
//     </div>
//   </div>
// )}
