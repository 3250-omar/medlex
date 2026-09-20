"use client";

import React, { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Loader2,
  AlertCircle,
  HelpCircle,
} from "lucide-react";

export interface CheckoutConfirmationData {
  waiverAccepted: boolean;
  waiverText: string;
  acceptedAt: string;
}

export interface CheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  subtitle?: string;
  itemName?: string;
  itemDescription?: string;
  price?: string;
  originalPrice?: string;
  priceBadge?: string;
  priceNote?: string;
  features?: string[];
  /**
   * Whether to mandate the statutory 14-day cancellation waiver checkbox before payment.
   * Default: true.
   */
  requireCancellationWaiver?: boolean;
  /**
   * The legal waiver text required before immediate digital supply.
   */
  waiverText?: string;
  confirmLabel?: string;
  isProcessing?: boolean;
  onConfirm: (data: CheckoutConfirmationData) => Promise<void> | void;
  /**
   * Optional custom action render function to pass custom actions from outside.
   */
  customActions?: (state: {
    waiverAccepted: boolean;
    isProcessing: boolean;
    handleConfirm: () => void;
  }) => React.ReactNode;
}

export const DEFAULT_CANCELLATION_WAIVER_TEXT =
  "I want immediate access and understand that I lose my statutory 14-day cancellation right, subject to MedLex's 14-day refund policy.";

export default function CheckoutDialog({
  open,
  onOpenChange,
  title,
  subtitle,
  itemName = "The CASC Academy — Complete Access",
  itemDescription = "Instant access to 43 interactive psychiatric stations, Learn Mode & 7-min Exam Mode, and practice cards.",
  price = "£147",
  originalPrice = "£297",
  priceBadge = "Founding Cohort",
  priceNote = "One-time payment · 12 months full access",
  features = [
    "Full access to 43 clinical stations across 8 exam domains",
    "Both Learn Mode with examiner thinking & timed 7-min Exam Mode",
    "Three-person Practice Packs (candidate, role-player & observer cards)",
    "Downloadable 12 Weeks to the CASC workbook (PDF)",
  ],
  requireCancellationWaiver = true,
  waiverText = DEFAULT_CANCELLATION_WAIVER_TEXT,
  confirmLabel,
  isProcessing = false,
  onConfirm,
  customActions,
}: CheckoutDialogProps) {
  const locale = useLocale();
  const isAr = locale === "ar";

  // Checkbox MUST NOT be checked by default. User must check it explicitly.
  const [waiverAccepted, setWaiverAccepted] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  // Reset agreement state each time dialog opens
  useEffect(() => {
    if (open) {
      setWaiverAccepted(false);
      setHasAttemptedSubmit(false);
    }
  }, [open]);

  const canProceed = !requireCancellationWaiver || waiverAccepted;

  const handleConfirm = async () => {
    if (!canProceed) {
      setHasAttemptedSubmit(true);
      return;
    }

    await onConfirm({
      waiverAccepted,
      waiverText,
      acceptedAt: new Date().toISOString(),
    });
  };

  const defaultTitle = isAr
    ? "مراجعة وإتمام الاشتراك"
    : "Review & Complete Enrolment";
  const defaultSubtitle = isAr
    ? "تحصل على وصول فوري لجميع محطات ومواد الدورة التدريبية."
    : "You are seconds away from full immediate access to the Academy.";
  const defaultConfirmLabel = isAr
    ? `تأكيد الاشتراك — ${price}`
    : `Enrol & Pay ${price}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={!isProcessing}
        className="max-w-[540px]! p-0 overflow-hidden border border-[#DFD5C0] bg-white text-[#1A2536] shadow-2xl shadow-black/15 rounded-2xl"
      >
        {/* Header with warm editorial parchment background */}
        <div className="p-6 pb-4.5 border-b border-[#EAE3D5] bg-[#FAF7F2]">
          <DialogHeader className="gap-1.5 text-start">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#8C6B28] uppercase tracking-wider mb-0.5">
              <ShieldCheck size={14} className="text-[#8C6B28]" />
              <span>{isAr ? "دفع آمن ومعتمد" : "Secure Enrolment"}</span>
            </div>
            <DialogTitle className="text-xl sm:text-2xl font-bold font-serif text-[#071326]">
              {title || defaultTitle}
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-[13.5px] text-[#4A5568] leading-relaxed">
              {subtitle || defaultSubtitle}
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Body content */}
        <div className="p-6 space-y-5 max-h-[calc(85vh-140px)] overflow-y-auto no-scrollbar bg-white">
          {/* Order Summary Card */}
          <div className="rounded-xl border border-[#DFD5C0] bg-[#FDFBF7] p-4 sm:p-5 space-y-3.5 shadow-xs">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-serif font-bold text-base sm:text-[17px] text-[#071326]">
                    {itemName}
                  </h4>
                  {priceBadge && (
                    <span className="text-[10.5px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-[#F5EFE3] text-[#071326] border border-[#DFD5C0]">
                      {priceBadge}
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-[12.5px] text-[#4A5568] leading-relaxed">
                  {itemDescription}
                </p>
              </div>

              <div className="text-right shrink-0">
                <div className="text-2xl sm:text-3xl font-bold text-[#071326] font-serif tabular-nums">
                  {price}
                </div>
                {originalPrice && (
                  <div className="text-xs text-[#718096] line-through tabular-nums">
                    {originalPrice}
                  </div>
                )}
              </div>
            </div>

            {features && features.length > 0 && (
              <div className="pt-3 border-t border-[#EAE3D5] space-y-2">
                {features.map((feat, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 text-xs sm:text-[12.5px] text-[#2D3748]"
                  >
                    <CheckCircle2
                      size={14}
                      className="text-[#8C6B28] shrink-0 mt-0.5"
                    />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            )}

            {priceNote && (
              <div className="text-[11.5px] text-[#718096] pt-1">
                {priceNote}
              </div>
            )}
          </div>

          {/* 14-Day Refund Guarantee Callout */}
          <div className="rounded-xl border border-emerald-200 bg-[#F0FDF4] p-3.5 flex items-start gap-3 text-xs shadow-xs">
            <ShieldCheck size={18} className="text-emerald-700 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <strong className="font-semibold block text-emerald-950 text-xs sm:text-[12.5px]">
                {isAr
                  ? "ضمان استرداد لمدة 14 يوماً وفق سياستنا العادلة"
                  : "MedLex 14-Day Fair Refund Policy"}
              </strong>
              <span className="text-[11.5px] sm:text-[12px] leading-relaxed block text-emerald-900/90">
                {isAr
                  ? "يحق لك طلب استرداد كامل للمبلغ خلال 14 يوماً من الشراء بشرط ألا تكون قد أتممت أكثر من 3 محطات في وضع الامتحان (Exam Mode)."
                  : "Full refund available within 14 days of purchase, provided you have completed no more than 3 stations in Exam Mode."}
              </span>
            </div>
          </div>

          {/* Mandatory Statutory Cancellation Waiver Checkbox */}
          {requireCancellationWaiver && (
            <div className="space-y-2">
              <label
                htmlFor="checkout-cancellation-waiver"
                className={`flex items-start gap-3 p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer select-none ${
                  waiverAccepted
                    ? "border-[#C5A059] bg-[#FFFDF7] ring-2 ring-[#C5A059]/30 shadow-xs"
                    : hasAttemptedSubmit
                      ? "border-red-400 bg-red-50/70 ring-1 ring-red-300"
                      : "border-[#DFD5C0] bg-[#FAF7F0] hover:border-[#C5A059] hover:bg-[#FCF9F2]"
                }`}
              >
                <input
                  type="checkbox"
                  id="checkout-cancellation-waiver"
                  checked={waiverAccepted}
                  onChange={(e) => {
                    setWaiverAccepted(e.target.checked);
                    if (e.target.checked) setHasAttemptedSubmit(false);
                  }}
                  disabled={isProcessing}
                  className="mt-0.5 size-4.5 rounded border-[#C5A059] text-[#071326] focus:ring-[#C5A059]/40 accent-[#071326] cursor-pointer shrink-0"
                />
                <div className="space-y-1">
                  <span className="text-xs sm:text-[13px] leading-relaxed text-[#071326] font-medium block">
                    {waiverText}
                  </span>
                  <span className="text-[11px] text-[#718096] block flex items-center gap-1">
                    <HelpCircle size={12} className="inline shrink-0" />
                    <span>
                      {isAr
                        ? "مطلوب قانونياً لتفعيل الوصول الفوري للمحتوى الرقمي."
                        : "Required by consumer regulations for immediate supply of digital content."}
                    </span>
                  </span>
                </div>
              </label>

              {hasAttemptedSubmit && !waiverAccepted && (
                <div className="flex items-center gap-1.5 text-xs text-red-600 px-1 animate-in fade-in">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>
                    {isAr
                      ? "يرجى تحديد المربع أعلاه للموافقة على شروط الوصول الفوري والاستمرار."
                      : "Please check the box above to acknowledge immediate access terms before proceeding."}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Action buttons (Custom or Default) */}
          {customActions ? (
            customActions({
              waiverAccepted,
              isProcessing,
              handleConfirm,
            })
          ) : (
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={handleConfirm}
                disabled={!canProceed || isProcessing}
                className={`w-full min-h-12 px-6 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
                  canProceed && !isProcessing
                    ? "bg-[#071326] text-white hover:bg-[#0E1D38] hover:shadow-md active:scale-[0.99]"
                    : "bg-[#F1F5F9] text-[#94A3B8] border border-[#E2E8F0] cursor-not-allowed"
                }`}
              >
                {isProcessing ? (
                  <>
                    <Loader2 size={18} className="animate-spin text-current" />
                    <span>{isAr ? "جارِ المعالجة..." : "Processing..."}</span>
                  </>
                ) : (
                  <>
                    <Lock size={14} />
                    <span>{confirmLabel || defaultConfirmLabel}</span>
                    <ArrowRight size={15} className={isAr ? "rotate-180" : ""} />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11.5px] text-[#718096] text-center">
                <Lock size={12} className="text-[#94A3B8]" />
                <span>
                  {isAr
                    ? "معالجة الدفع تتم بأمان عبر Paddle (التاجر المعتمد للفواتير والضرائب)"
                    : "Payments processed securely by Paddle (Merchant of Record)"}
                </span>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
