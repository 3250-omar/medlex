"use client";

import React from "react";
import { useTranslations } from "next-intl";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ExternalLink,
  Loader2,
} from "lucide-react";
import type { BookingDTO } from "@/lib/private-sessions/types";
import { useQueryClient } from "@tanstack/react-query";
import { usePurchaseStatus, privateSessionKeys } from "../../privateSessionQueries";
import type { BookingMode } from "./types";

interface PrivateSessionStatusStepProps {
  purchaseId: string | null;
  mode: BookingMode;
  directBooking: { sessionLink?: string | null } | null;
  redeemedBooking: BookingDTO | null;
  onClose: () => void;
  onContinueToCalendar: () => void;
  onRetry: () => void;
}

export const PrivateSessionStatusStep = React.memo(function PrivateSessionStatusStep({
  purchaseId,
  mode,
  directBooking,
  redeemedBooking,
  onClose,
  onContinueToCalendar,
  onRetry,
}: PrivateSessionStatusStepProps) {
  const t = useTranslations("privateSessions");
  const queryClient = useQueryClient();

  // Encapsulate status polling query here so polling updates don't re-render the parent dialog
  const { data: purchaseStatus, isLoading: statusLoading } = usePurchaseStatus(
    purchaseId,
    Boolean(purchaseId),
  );

  React.useEffect(() => {
    if (purchaseStatus?.status === "paid" || mode === "redeem") {
      queryClient.invalidateQueries({
        queryKey: privateSessionKeys.context("casc-academy"),
      });
      queryClient.refetchQueries({
        queryKey: privateSessionKeys.context("casc-academy"),
      });
    }
  }, [purchaseStatus?.status, mode, queryClient]);

  if (statusLoading || purchaseStatus?.status === "pending") {
    return (
      <div className="py-6 text-center space-y-4">
        <div className="flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-10 h-10 animate-spin text-navy" />
          <h4 className="font-serif text-lg font-bold text-navy">
            {t("processingPayment")}
          </h4>
          <p className="text-xs text-char/70 max-w-sm">
            {t("processingNotice")}
          </p>
        </div>
      </div>
    );
  }

  if (purchaseStatus?.status === "paid" || mode === "redeem") {
    const meetLink =
      directBooking?.sessionLink ||
      purchaseStatus?.booking?.joinUrl ||
      purchaseStatus?.booking?.sessionLink ||
      redeemedBooking?.joinUrl ||
      redeemedBooking?.sessionLink;

    return (
      <div className="py-6 text-center space-y-4">
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 mb-1">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h4 className="font-serif text-xl font-bold text-navy!">
            {mode === "package"
              ? t("packageSuccessTitle")
              : t("paymentSuccessTitle")}
          </h4>
          <p className="text-xs sm:text-sm text-char/75 max-w-md">
            {mode === "package"
              ? t("packageCreditsReady")
              : purchaseStatus?.booking?.emailStatus === "sent" ||
                  redeemedBooking?.emailStatus === "sent"
                ? t("confirmationEmailSent")
                : t("emailPendingNotice")}
          </p>

          {/* Google Meet join button if ready, or pending state */}
          {(() => {
            if (meetLink) {
              return (
                <a
                  href={meetLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-2 px-5 py-2.5 rounded-xl bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800 transition-colors shadow-xs"
                >
                  <span>{t("joinMeeting")}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              );
            }
            if (mode === "direct" || mode === "redeem") {
              return (
                <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>{t("meetingLinkPending")}</span>
                </div>
              );
            }
            return null;
          })()}

          <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
            {mode === "package" ? (
              <>
                <button
                  type="button"
                  onClick={onContinueToCalendar}
                  className="min-h-[44px] px-6 py-2 rounded-xl bg-navy text-white text-xs font-semibold hover:bg-navy/90 transition-colors shadow-xs"
                >
                  {t("continueToCalendar")}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="min-h-[44px] px-4 py-2 rounded-xl border border-hair text-xs font-semibold text-char hover:bg-tint/30 transition-colors"
                >
                  {t("scheduleLater")}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="min-h-[44px] px-6 py-2 rounded-xl bg-navy text-white text-xs font-semibold hover:bg-navy/90 transition-colors"
              >
                {t("close")}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (purchaseStatus?.status === "paid_unfulfilled") {
    return (
      <div className="py-6 text-center space-y-4">
        <div className="flex flex-col items-center justify-center space-y-3 text-amber-900">
          <AlertTriangle className="w-10 h-10 text-amber-600" />
          <h4 className="font-serif text-lg font-bold">
            {t("paidUnfulfilledTitle")}
          </h4>
          <p className="text-xs text-amber-800/80 max-w-md">
            {t("paidUnfulfilledDesc")}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="mt-3 min-h-[44px] px-5 py-2 rounded-xl bg-navy text-white text-xs font-semibold"
          >
            {t("contactSupport")}
          </button>
        </div>
      </div>
    );
  }

  // Failed state
  return (
    <div className="py-6 text-center space-y-4">
      <div className="flex flex-col items-center justify-center space-y-3 text-rose-800">
        <XCircle className="w-10 h-10 text-rose-600" />
        <h4 className="font-serif text-lg font-bold">
          {t("paymentFailedTitle")}
        </h4>
        <p className="text-xs text-char/70 max-w-md">
          {t("paymentFailedDesc")}
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 min-h-[44px] px-5 py-2 rounded-xl bg-navy text-white text-xs font-semibold"
        >
          {t("tryAgain")}
        </button>
      </div>
    </div>
  );
});
