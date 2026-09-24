"use client";

import React, { useState, useCallback, useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
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
  features?: readonly string[];
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

export const DEFAULT_FEATURES: readonly string[] = [
  "Full access to 43 clinical stations across 8 exam domains",
  "Both Learn Mode with examiner thinking & timed 7-min Exam Mode",
  "Three-person Practice Packs (candidate, role-player & observer cards)",
  "Downloadable 12 Weeks to the CASC workbook (PDF)",
];

/* -------------------------------------------------------------------------- */
/*             EXTRACTED SUB-COMPONENTS (Outside the Render Loop)             */
/* -------------------------------------------------------------------------- */

interface CheckoutDialogHeaderProps {
  title?: string;
  subtitle?: string;
  defaultTitle: string;
  defaultSubtitle: string;
  isAr: boolean;
}

const CheckoutDialogHeader = React.memo(function CheckoutDialogHeader({
  title,
  subtitle,
  defaultTitle,
  defaultSubtitle,
}: CheckoutDialogHeaderProps) {
  const t = useTranslations("checkout");
  return (
    <div className="py-4 px-6 sm:px-7 border-b border-[#EAE4D8] bg-[#FAF8F5] shrink-0">
      <DialogHeader className="gap-1 text-start">
        <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#9B7629] uppercase tracking-wider">
          <ShieldCheck size={14} className="text-[#9B7629]" />
          <span>{t("secureEnrolment")}</span>
        </div>
        <DialogTitle className="text-xl sm:text-2xl font-bold font-serif !text-[#1A365D] leading-snug">
          {title || defaultTitle}
        </DialogTitle>
        <DialogDescription className="text-xs sm:text-[13px] font-sans !text-[#5C636C] leading-normal">
          {subtitle || defaultSubtitle}
        </DialogDescription>
      </DialogHeader>
    </div>
  );
});

interface CheckoutOrderSummaryCardProps {
  itemName: string;
  itemDescription: string;
  price: string;
  originalPrice?: string;
  priceBadge?: string;
  priceNote?: string;
  features?: readonly string[];
}

const CheckoutOrderSummaryCard = React.memo(function CheckoutOrderSummaryCard({
  itemName,
  itemDescription,
  price,
  originalPrice,
  priceBadge,
  priceNote,
  features,
}: CheckoutOrderSummaryCardProps) {
  return (
    <div className="rounded-2xl border border-[#E5DEC9] bg-[#FAF8F5] p-4 sm:p-4.5 space-y-3 shadow-xs">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-serif font-bold text-base sm:text-[17px] !text-[#1A365D]">
              {itemName}
            </h4>
            {priceBadge && (
              <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-white !text-[#1A365D] border border-[#E5DEC9] shadow-xs">
                {priceBadge}
              </span>
            )}
          </div>
          <p className="text-xs sm:text-[12.5px] text-[#5C636C] leading-relaxed">
            {itemDescription}
          </p>
        </div>

        <div className="text-right shrink-0">
          <div className="text-2xl sm:text-3xl font-bold !text-[#1A365D] font-serif tabular-nums">
            {price}
          </div>
          {originalPrice && (
            <div className="text-xs text-[#8C8577] line-through tabular-nums">
              {originalPrice}
            </div>
          )}
        </div>
      </div>

      {features && features.length > 0 && (
        <div className="pt-2.5 border-t border-[#EAE4D8] grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5">
          {features.map((feat, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2 text-xs sm:text-[12px] text-[#313538] leading-tight"
            >
              <CheckCircle2
                size={14}
                className="text-[#9B7629] shrink-0 mt-0.5"
              />
              <span>{feat}</span>
            </div>
          ))}
        </div>
      )}

      {priceNote && (
        <div className="text-[11px] text-[#7A828E] pt-0.5">{priceNote}</div>
      )}
    </div>
  );
});

interface CheckoutRefundPolicyCardProps {
  isAr: boolean;
}

const CheckoutRefundPolicyCard = React.memo(function CheckoutRefundPolicyCard({
  isAr: _isAr,
}: CheckoutRefundPolicyCardProps) {
  const t = useTranslations("checkout");
  return (
    <div className="rounded-xl border border-emerald-200/90 bg-[#F0FDF4] p-3 sm:p-3.5 flex items-start gap-2.5 text-xs shadow-xs">
      <ShieldCheck size={18} className="text-emerald-700 shrink-0 mt-0.5" />
      <div className="space-y-0.5">
        <strong className="font-semibold block text-emerald-950 text-xs sm:text-[12.5px]">
          {t("refundGuaranteeTitle")}
        </strong>
        <span className="text-[11px] sm:text-[11.5px] leading-relaxed block text-emerald-900/90">
          {t("refundGuaranteeDesc")}
        </span>
      </div>
    </div>
  );
});

interface CheckoutWaiverSectionProps {
  waiverAccepted: boolean;
  hasAttemptedSubmit: boolean;
  isProcessing: boolean;
  waiverText: string;
  isAr: boolean;
  onToggle: (checked: boolean) => void;
}

const CheckoutWaiverSection = React.memo(function CheckoutWaiverSection({
  waiverAccepted,
  hasAttemptedSubmit,
  isProcessing,
  waiverText,
  isAr: _isAr,
  onToggle,
}: CheckoutWaiverSectionProps) {
  const t = useTranslations("checkout");
  return (
    <div className="space-y-1.5">
      <label
        htmlFor="checkout-cancellation-waiver"
        className={`flex items-start gap-3 p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer select-none ${
          waiverAccepted
            ? "border-[#D4AF37] bg-[#FEFDF9] ring-2 ring-[#D4AF37]/25 shadow-xs"
            : hasAttemptedSubmit
              ? "border-rose-400 bg-rose-50/90 ring-2 ring-rose-300/60 shadow-xs"
              : "border-[#E5DEC9] bg-[#FAF8F5] hover:border-[#D4AF37]/70 hover:bg-[#FFFDF7]"
        }`}
      >
        <input
          type="checkbox"
          id="checkout-cancellation-waiver"
          required
          aria-required="true"
          checked={waiverAccepted}
          onChange={(e) => onToggle(e.target.checked)}
          disabled={isProcessing}
          className="mt-1 size-4.5 rounded border-[#C5A059] text-[#1A365D] focus:ring-[#D4AF37]/40 accent-[#D4AF37] cursor-pointer shrink-0"
        />
        <div className="space-y-1 min-w-0 flex-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-rose-600 font-extrabold leading-none text-xs">
              *
            </span>

            <span className="text-[11px] font-semibold text-[#8A6D2B]">
              {t("mandatoryAgreement")}
            </span>
          </div>

          <span className="text-xs sm:text-[12.5px] leading-relaxed text-[#1A365D] font-medium block">
            {waiverText}
          </span>
          <span className="text-[11px] text-[#7A828E] block flex items-center gap-1 pt-0.5">
            <HelpCircle size={11} className="inline shrink-0 text-[#8C939E]" />
            <span>
              {t("regulatoryRequirement")}
            </span>
          </span>
        </div>
      </label>

      {hasAttemptedSubmit && !waiverAccepted && (
        <div className="flex items-center gap-1.5 text-xs text-rose-600 px-1 font-medium animate-in fade-in">
          <AlertCircle size={13} className="shrink-0" />
          <span>
            {t("mustAcceptWaiver")}
          </span>
        </div>
      )}
    </div>
  );
});

interface CheckoutActionButtonsProps {
  canProceed: boolean;
  isProcessing: boolean;
  confirmLabel: string;
  isAr: boolean;
  onConfirm: () => void;
  waiverAccepted: boolean;
  customActions?: (state: {
    waiverAccepted: boolean;
    isProcessing: boolean;
    handleConfirm: () => void;
  }) => React.ReactNode;
}

const CheckoutActionButtons = React.memo(function CheckoutActionButtons({
  canProceed,
  isProcessing,
  confirmLabel,
  isAr,
  onConfirm,
  waiverAccepted,
  customActions,
}: CheckoutActionButtonsProps) {
  const t = useTranslations("checkout");

  if (customActions) {
    return (
      <>
        {customActions({
          waiverAccepted,
          isProcessing,
          handleConfirm: onConfirm,
        })}
      </>
    );
  }

  return (
    <div className="space-y-2.5 pt-1">
      <button
        type="button"
        onClick={onConfirm}
        disabled={!canProceed || isProcessing}
        className={`w-full min-h-12 px-6 rounded-full font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2 cursor-pointer ${
          canProceed && !isProcessing
            ? "bg-[#D4AF37] hover:bg-[#C9A22F] text-[#1A365D] shadow-md shadow-[#D4AF37]/20 hover:shadow-lg hover:shadow-[#D4AF37]/30 hover:-translate-y-0.5 active:translate-y-0"
            : "bg-[#EBE6DC] text-[#9A9385] border border-[#DCD5C5] cursor-not-allowed shadow-none"
        }`}
      >
        {isProcessing ? (
          <>
            <Loader2 size={18} className="animate-spin text-current" />
            <span>{t("processing")}</span>
          </>
        ) : (
          <>
            <Lock size={15} />
            <span>{confirmLabel}</span>
            <ArrowRight size={16} className={isAr ? "rotate-180" : ""} />
          </>
        )}
      </button>

      <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#7A828E] text-center">
        <Lock size={11} className="text-[#7A828E]/80" />
        <span>
          {t("paddleSecurity")}
        </span>
      </div>
    </div>
  );
});

/* -------------------------------------------------------------------------- */
/*                       MAIN CHECKOUT DIALOG COMPONENT                       */
/* -------------------------------------------------------------------------- */

export default function CheckoutDialog({
  open,
  onOpenChange,
  title,
  subtitle,
  itemName,
  itemDescription,
  price = "£147",
  originalPrice = "£297",
  priceBadge,
  priceNote,
  features,
  requireCancellationWaiver = true,
  waiverText,
  confirmLabel,
  isProcessing = false,
  onConfirm,
  customActions,
}: CheckoutDialogProps) {
  const locale = useLocale();
  const isAr = locale === "ar";
  const t = useTranslations("checkout");

  const resolvedItemName = itemName || t("defaultItemName");
  const resolvedItemDescription =
    itemDescription || t("defaultItemDescription");
  const resolvedPriceBadge =
    priceBadge !== undefined ? priceBadge : t("defaultPriceBadge");
  const resolvedPriceNote =
    priceNote !== undefined ? priceNote : t("defaultPriceNote");
  const resolvedWaiverText = waiverText || t("defaultWaiverText");
  const resolvedFeatures = useMemo(() => {
    if (features) return features;
    try {
      const defaultFeats = t.raw("defaultFeatures") as string[];
      if (Array.isArray(defaultFeats) && defaultFeats.length > 0) {
        return defaultFeats;
      }
    } catch {
      // fallback
    }
    return DEFAULT_FEATURES;
  }, [features, t]);

  // Checkbox MUST NOT be checked by default. User must check it explicitly.
  const [waiverAccepted, setWaiverAccepted] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  // Reset agreement state each time dialog opens without triggering cascading effect renders
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setWaiverAccepted(false);
      setHasAttemptedSubmit(false);
    }
  }

  const canProceed = !requireCancellationWaiver || waiverAccepted;

  const handleToggleWaiver = useCallback((checked: boolean) => {
    setWaiverAccepted(checked);
    if (checked) {
      setHasAttemptedSubmit(false);
    }
  }, []);

  const handleConfirm = useCallback(async () => {
    if (!canProceed) {
      setHasAttemptedSubmit(true);
      return;
    }

    await onConfirm({
      waiverAccepted,
      waiverText: resolvedWaiverText,
      acceptedAt: new Date().toISOString(),
    });
  }, [canProceed, onConfirm, waiverAccepted, resolvedWaiverText]);

  const defaultTitle = useMemo(
    () => t("reviewTitle"),
    [t],
  );

  const defaultSubtitle = useMemo(
    () => t("reviewSubtitle"),
    [t],
  );

  const resolvedConfirmLabel = useMemo(
    () =>
      confirmLabel ||
      t("enrolAndPay", { price }),
    [confirmLabel, t, price],
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={!isProcessing}
        className="!w-[94vw] !max-w-[620px] sm:!max-w-[620px] md:!max-w-[640px] !max-h-[92vh] !p-0 overflow-hidden flex flex-col !border !border-[#E5DEC9] !bg-white !text-[#23303F] shadow-2xl !rounded-3xl !ring-0 [&_[data-slot=dialog-close]]:text-[#5C636C] hover:[&_[data-slot=dialog-close]]:text-[#1A365D] hover:[&_[data-slot=dialog-close]]:!bg-[#F4EFE6] [&_[data-slot=dialog-close]]:top-4 [&_[data-slot=dialog-close]]:right-4 [&_[data-slot=dialog-close]]:size-8.5 [&_[data-slot=dialog-close]]:rounded-full transition-all"
      >
        {/* Memoized Header */}
        <CheckoutDialogHeader
          title={title}
          subtitle={subtitle}
          defaultTitle={defaultTitle}
          defaultSubtitle={defaultSubtitle}
          isAr={isAr}
        />

        {/* Scrollable body content */}
        <div className="p-5 sm:p-6 space-y-3.5 overflow-y-auto max-h-[calc(92vh-95px)] bg-white no-scrollbar">
          {/* Memoized Order Summary Card */}
          <CheckoutOrderSummaryCard
            itemName={resolvedItemName}
            itemDescription={resolvedItemDescription}
            price={price}
            originalPrice={originalPrice}
            priceBadge={resolvedPriceBadge}
            priceNote={resolvedPriceNote}
            features={resolvedFeatures}
          />

          {/* Memoized 14-Day Refund Guarantee Callout */}
          <CheckoutRefundPolicyCard isAr={isAr} />

          {/* Memoized Statutory Cancellation Waiver Checkbox */}
          {requireCancellationWaiver && (
            <CheckoutWaiverSection
              waiverAccepted={waiverAccepted}
              hasAttemptedSubmit={hasAttemptedSubmit}
              isProcessing={isProcessing}
              waiverText={resolvedWaiverText}
              isAr={isAr}
              onToggle={handleToggleWaiver}
            />
          )}

          {/* Memoized Action buttons */}
          <CheckoutActionButtons
            canProceed={canProceed}
            isProcessing={isProcessing}
            confirmLabel={resolvedConfirmLabel}
            isAr={isAr}
            onConfirm={handleConfirm}
            waiverAccepted={waiverAccepted}
            customActions={customActions}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
