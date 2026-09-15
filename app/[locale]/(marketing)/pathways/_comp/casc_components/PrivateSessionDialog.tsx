"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Layers,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ExternalLink,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
} from "lucide-react";
import type { LocalizedOfferDTO, SlotDTO } from "@/lib/private-sessions/types";
import {
  usePrivateSessionContext,
  useDirectCheckoutMutation,
  usePackageCheckoutMutation,
  useRedeemCreditMutation,
  usePurchaseStatus,
} from "../privateSessionQueries";
import { PrivateSessionCalendarStep } from "./PrivateSessionCalendarStep";
import { PrivateSessionPackageStep } from "./PrivateSessionPackageStep";
import { formatSlotTimes } from "@/lib/private-sessions/time";

export type DialogStep =
  | "choice"
  | "calendar"
  | "package"
  | "summary"
  | "status";
export type BookingMode = "direct" | "package" | "redeem";

interface PrivateSessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  locale: string;
  courseSlug?: string;
  initialMode?: BookingMode;
  initialPurchaseId?: string | null;
}

export default function PrivateSessionDialog({
  open,
  onOpenChange,
  locale,
  courseSlug = "casc-academy",
  initialMode = "direct",
  initialPurchaseId = null,
}: PrivateSessionDialogProps) {
  const t = useTranslations("privateSessions");
  const router = useRouter();
  const isRtl = locale === "ar";
  const BackIcon = isRtl ? ArrowRight : ArrowLeft;

  const { data: contextData, isLoading: contextLoading } =
    usePrivateSessionContext(courseSlug);
  const offers = contextData?.offers || [];
  const isAuthenticated = contextData?.authenticated ?? false;
  const isEmailVerified = contextData?.emailVerified ?? false;
  const activeEntitlements = contextData?.entitlements || [];
  const totalRemainingCredits = activeEntitlements.reduce(
    (sum, e) => sum + e.remaining,
    0,
  );

  // State machine
  const [step, setStep] = useState<DialogStep>(
    initialPurchaseId ? "status" : "choice",
  );
  const [mode, setMode] = useState<BookingMode>(initialMode);
  const [selectedOffer, setSelectedOffer] = useState<LocalizedOfferDTO | null>(
    null,
  );
  const [selectedSlot, setSelectedSlot] = useState<SlotDTO | null>(null);
  const [purchaseId, setPurchaseId] = useState<string | null>(
    initialPurchaseId,
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Mutations
  const directCheckout = useDirectCheckoutMutation();
  const packageCheckout = usePackageCheckoutMutation();
  const redeemCredit = useRedeemCreditMutation();

  // Status polling for purchase
  const { data: purchaseStatus, isLoading: statusLoading } = usePurchaseStatus(
    purchaseId,
    step === "status" && Boolean(purchaseId),
  );

  // Generate unique idempotency key for mutations
  const generateIdempotencyKey = (prefix: string) => {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
  };

  const handleClose = () => {
    onOpenChange(false);
    // Safe reset with no mutation
    setSelectedSlot(null);
    setErrorMessage(null);
  };

  const handleBack = () => {
    setErrorMessage(null);
    if (step === "summary") {
      setStep(mode === "package" ? "package" : "calendar");
    } else if (step === "calendar" || step === "package") {
      setStep("choice");
    }
  };

  const handleStartSignIn = () => {
    const returnPath = `/${locale}/pathways/casc-academy?oneToOne=open#one-to-one-sessions`;
    router.push(
      `/${locale}/auth/login?redirectTo=${encodeURIComponent(returnPath)}`,
    );
  };

  const handleSelectMode = (chosenMode: BookingMode) => {
    setMode(chosenMode);
    setErrorMessage(null);

    if (chosenMode === "package") {
      setStep("package");
    } else {
      // direct or redeem
      if (chosenMode === "direct") {
        const directOffer = offers.find((o) => o.code === "direct") || null;
        setSelectedOffer(directOffer);
      }
      setStep("calendar");
    }
  };

  const handleProceedToSummaryFromSlot = (slot: SlotDTO) => {
    setSelectedSlot(slot);
    setStep("summary");
  };

  const handleProceedToSummaryFromOffer = (offer: LocalizedOfferDTO) => {
    setSelectedOffer(offer);
    setStep("summary");
  };

  // Execution: Checkout or Redemption
  const handleExecute = async () => {
    setErrorMessage(null);
    try {
      if (mode === "direct") {
        if (!selectedSlot || !selectedOffer) return;
        const result = await directCheckout.mutateAsync({
          input: {
            courseSlug: "casc-academy",
            mode: "direct",
            offerId: selectedOffer.id,
            slotId: selectedSlot.id,
          },
          idempotencyKey: generateIdempotencyKey("checkout-direct"),
        });

        // Set purchase ID and transition to status directly
        // TODO: Add Paymob payment integration soon. Currently disabled for direct subscription without routing to payment page.
        /*
        setPurchaseId(result.purchaseId);
        window.location.href = result.checkoutUrl;
        */
        setPurchaseId(result.purchaseId);
        setStep("status");
      } else if (mode === "package") {
        if (!selectedOffer) return;
        const result = await packageCheckout.mutateAsync({
          input: {
            courseSlug: "casc-academy",
            mode: "package",
            offerId: selectedOffer.id,
          },
          idempotencyKey: generateIdempotencyKey("checkout-pkg"),
        });

        // Set purchase ID and transition to status directly
        // TODO: Add Paymob payment integration soon. Currently disabled for direct subscription without routing to payment page.
        /*
        setPurchaseId(result.purchaseId);
        window.location.href = result.checkoutUrl;
        */
        setPurchaseId(result.purchaseId);
        setStep("status");
      } else if (mode === "redeem") {
        if (!selectedSlot) return;
        const activeEntitlement = activeEntitlements.find(
          (e) => e.remaining > 0,
        );
        if (!activeEntitlement) {
          setErrorMessage("No active session credits available");
          return;
        }

        await redeemCredit.mutateAsync({
          input: {
            courseSlug: "casc-academy",
            entitlementId: activeEntitlement.id,
            slotId: selectedSlot.id,
          },
          idempotencyKey: generateIdempotencyKey("redeem-credit"),
        });

        setStep("status");
      }
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "An error occurred while processing your request",
      );
    }
  };

  const formatPrice = (minor: number, currency: string) => {
    return new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(minor / 100);
  };

  const isSubmitting =
    directCheckout.isPending ||
    packageCheckout.isPending ||
    redeemCredit.isPending;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 bg-white border border-hair rounded-2xl shadow-xl text-char"
        showCloseButton={true}
      >
        <DialogHeader className="space-y-1 text-start">
          <div className="flex items-center justify-between gap-4">
            {step !== "choice" && step !== "status" ? (
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy hover:text-navy/70 transition-colors min-h-[44px] min-w-[44px] cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-lg px-2"
                aria-label={t("back")}
              >
                <BackIcon className="w-4 h-4" />
                <span>{t("back")}</span>
              </button>
            ) : (
              <div />
            )}

            {/* Step breadcrumb */}
            <div className="text-[11px] font-mono text-grey uppercase tracking-wider">
              {step === "choice" && t("stepEntry")}
              {step === "calendar" && t("stepCalendar")}
              {step === "package" && t("stepPackage")}
              {step === "summary" && t("stepSummary")}
              {step === "status" && t("stepStatus")}
            </div>
          </div>

          <DialogTitle className="font-serif text-2xl font-bold !text-navy">
            {t("dialogTitle")}
          </DialogTitle>
          <DialogDescription className="font-sans text-xs sm:text-sm text-char/70">
            {t("dialogDescription")}
          </DialogDescription>
        </DialogHeader>

        {errorMessage && (
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* STEP 1: CHOICE / ENTRY */}
        {/* ------------------------------------------------------------------ */}
        {step === "choice" && (
          <div className="space-y-4 py-3">
            {contextLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-navy" />
              </div>
            ) : !isAuthenticated ? (
              /* Signed-out state with secure redirect */
              <div className="flex flex-col items-center justify-center text-center p-6 border border-hair rounded-2xl bg-tint/30 space-y-3">
                <div className="w-12 h-12 rounded-full bg-navy/10 flex items-center justify-center text-navy mb-1">
                  <Lock className="w-6 h-6" />
                </div>
                <h4 className="font-serif text-lg font-bold text-navy">
                  {t("signInRequiredTitle")}
                </h4>
                <p className="text-xs sm:text-sm text-char/70 max-w-md">
                  {t("signInRequiredDesc")}
                </p>
                <button
                  type="button"
                  onClick={handleStartSignIn}
                  className="mt-2 min-h-[44px] px-6 py-2.5 rounded-xl bg-navy text-white text-sm font-semibold hover:bg-navy/90 transition-all shadow-sm cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-gold"
                >
                  {t("signInButton")}
                </button>
              </div>
            ) : !isEmailVerified ? (
              /* Unverified email guard */
              <div className="flex flex-col items-center justify-center text-center p-6 border border-amber-200 rounded-2xl bg-amber-50/50 space-y-3">
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 mb-1">
                  <Mail className="w-6 h-6" />
                </div>
                <h4 className="font-serif text-lg font-bold text-amber-900">
                  {t("verifyEmailTitle")}
                </h4>
                <p className="text-xs sm:text-sm text-amber-900/80 max-w-md">
                  {t("verifyEmailDesc")}
                </p>
              </div>
            ) : (
              /* Authenticated choice options */
              <div className="space-y-3">
                {/* Option: Redeem existing credits if any */}
                {totalRemainingCredits > 0 && (
                  <button
                    type="button"
                    onClick={() => handleSelectMode("redeem")}
                    className="w-full flex items-start justify-between p-4 rounded-xl border border-emerald-300 bg-emerald-50/40 hover:bg-emerald-50 text-start transition-all min-h-[44px] cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-emerald-700" />
                        <span className="font-serif font-bold text-navy text-base">
                          {t("choiceRedeemTitle")}
                        </span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                          {totalRemainingCredits}{" "}
                          {locale === "ar" ? "رصيد متاح" : "credits"}
                        </span>
                      </div>
                      <p className="text-xs text-char/75">
                        {t("choiceRedeemDesc", {
                          count: totalRemainingCredits,
                        })}
                      </p>
                    </div>
                  </button>
                )}

                {/* Option 1: Direct 1-on-1 booking */}
                <button
                  type="button"
                  onClick={() => handleSelectMode("direct")}
                  className="w-full flex items-start justify-between p-4 rounded-xl border border-hair hover:border-navy/50 bg-white hover:bg-tint/20 text-start transition-all min-h-[44px] cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-gold"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-navy" />
                      <span className="font-serif font-bold text-navy text-base">
                        {t("choiceDirectTitle")}
                      </span>
                    </div>
                    <p className="text-xs text-char/70">
                      {t("choiceDirectDesc")}
                    </p>
                  </div>
                  {offers.find((o) => o.code === "direct") && (
                    <div className="text-end font-serif font-bold text-navy text-base shrink-0">
                      {formatPrice(
                        offers.find((o) => o.code === "direct")!.priceMinor,
                        offers.find((o) => o.code === "direct")!.currency,
                      )}
                    </div>
                  )}
                </button>

                {/* Option 2: Buy a package */}
                <button
                  type="button"
                  onClick={() => handleSelectMode("package")}
                  className="w-full flex items-start justify-between p-4 rounded-xl border border-hair hover:border-navy/50 bg-white hover:bg-tint/20 text-start transition-all min-h-[44px] cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-gold"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Layers className="w-5 h-5 text-gold" />
                      <span className="font-serif font-bold text-navy text-base">
                        {t("choicePackageTitle")}
                      </span>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-gold/20 text-navy">
                        {locale === "ar" ? "خصم يصل 20%" : "Save up to 20%"}
                      </span>
                    </div>
                    <p className="text-xs text-char/70">
                      {t("choicePackageDesc")}
                    </p>
                  </div>
                </button>
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* STEP 2: PACKAGE SELECTION */}
        {/* ------------------------------------------------------------------ */}
        {step === "package" && (
          <div className="space-y-4">
            <PrivateSessionPackageStep
              offers={offers}
              selectedOfferId={selectedOffer?.id || null}
              onSelectOffer={handleProceedToSummaryFromOffer}
              locale={locale}
            />
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* STEP 3: CALENDAR & TIME SELECTION */}
        {/* ------------------------------------------------------------------ */}
        {step === "calendar" && (
          <div className="space-y-4">
            <PrivateSessionCalendarStep
              courseSlug={courseSlug}
              selectedSlot={selectedSlot}
              onSelectSlot={handleProceedToSummaryFromSlot}
              locale={locale}
            />
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* STEP 4: REVIEW & CONFIRMATION */}
        {/* ------------------------------------------------------------------ */}
        {step === "summary" && (
          <div className="space-y-5 py-2">
            <div className="border border-hair rounded-xl p-5 bg-tint/20 space-y-3">
              <h4 className="font-serif font-bold text-navy text-base">
                {mode === "direct" && t("directSummaryTitle")}
                {mode === "package" && t("packageSummaryTitle")}
                {mode === "redeem" && t("redeemSummaryTitle")}
              </h4>

              <div className="space-y-2 text-xs divide-y divide-hair/50">
                {selectedSlot && (
                  <>
                    <div className="flex justify-between pt-2">
                      <span className="text-char/60">{t("time")}</span>
                      <span className="font-semibold text-navy">
                        {
                          formatSlotTimes(
                            selectedSlot.startsAt,
                            selectedSlot.endsAt,
                            undefined,
                            locale,
                          ).cairoTimeFormatted
                        }
                      </span>
                    </div>
                    <div className="flex justify-between pt-2">
                      <span className="text-char/60">{t("duration")}</span>
                      <span className="font-semibold text-navy">
                        {t("slotDuration")}
                      </span>
                    </div>
                  </>
                )}

                {selectedOffer && mode === "package" && (
                  <div className="flex justify-between pt-2">
                    <span className="text-char/60">{t("packageQuantity")}</span>
                    <span className="font-semibold text-navy">
                      {selectedOffer.sessionCount}{" "}
                      {locale === "ar" ? "جلسات" : "sessions"}
                    </span>
                  </div>
                )}

                {mode !== "redeem" && selectedOffer && (
                  <div className="flex justify-between pt-2 text-sm font-bold text-navy">
                    <span>{t("totalPrice")}</span>
                    <span>
                      {formatPrice(
                        selectedOffer.priceMinor,
                        selectedOffer.currency,
                      )}
                    </span>
                  </div>
                )}

                {mode === "redeem" && (
                  <div className="flex justify-between pt-2 text-sm font-bold text-emerald-800">
                    <span>{t("totalPrice")}</span>
                    <span>
                      {locale === "ar" ? "1 رصيد جلسة" : "1 session credit"}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleBack}
                disabled={isSubmitting}
                className="min-h-[44px] px-4 py-2 rounded-xl border border-hair text-xs font-semibold text-char hover:bg-tint/30 transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                {t("back")}
              </button>
              <button
                type="button"
                onClick={handleExecute}
                disabled={isSubmitting}
                className="min-h-[44px] px-6 py-2.5 rounded-xl bg-navy text-white text-xs sm:text-sm font-semibold hover:bg-navy/90 transition-all shadow-sm flex items-center gap-2 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-gold disabled:opacity-60"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {mode === "redeem"
                  ? t("confirmRedemption")
                  : locale === "ar"
                    ? "تأكيد الاشتراك في الجلسة"
                    : "Confirm Session Subscription"}
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* STEP 5: STATUS & FULFILLMENT */}
        {/* ------------------------------------------------------------------ */}
        {step === "status" && (
          <div className="py-6 text-center space-y-4">
            {statusLoading || purchaseStatus?.status === "pending" ? (
              <div className="flex flex-col items-center justify-center space-y-3">
                <Loader2 className="w-10 h-10 animate-spin text-navy" />
                <h4 className="font-serif text-lg font-bold text-navy">
                  {t("processingPayment")}
                </h4>
                <p className="text-xs text-char/70 max-w-sm">
                  {t("processingNotice")}
                </p>
              </div>
            ) : purchaseStatus?.status === "paid" || mode === "redeem" ? (
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 mb-1">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="font-serif text-xl font-bold text-navy">
                  {mode === "package"
                    ? t("packageSuccessTitle")
                    : t("paymentSuccessTitle")}
                </h4>
                <p className="text-xs sm:text-sm text-char/75 max-w-md">
                  {t("confirmationEmailSent")}
                </p>

                {/* Google Meet join button if ready, or pending state */}
                {purchaseStatus?.booking?.joinUrl ||
                purchaseStatus?.booking?.sessionLink ? (
                  <a
                    href={
                      (purchaseStatus.booking.joinUrl ||
                        purchaseStatus.booking.sessionLink) ??
                      undefined
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-2 px-5 py-2.5 rounded-xl bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800 transition-colors shadow-xs"
                  >
                    <span>{t("joinMeeting")}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  mode === "direct" && (
                    <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>{t("meetingLinkPending")}</span>
                    </div>
                  )
                )}

                <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                  {mode === "package" ? (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setMode("redeem");
                          setStep("calendar");
                        }}
                        className="min-h-[44px] px-6 py-2 rounded-xl bg-navy text-white text-xs font-semibold hover:bg-navy/90 transition-colors shadow-xs"
                      >
                        {t("continueToCalendar")}
                      </button>
                      <button
                        type="button"
                        onClick={handleClose}
                        className="min-h-[44px] px-4 py-2 rounded-xl border border-hair text-xs font-semibold text-char hover:bg-tint/30 transition-colors"
                      >
                        {t("scheduleLater")}
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={handleClose}
                      className="min-h-[44px] px-6 py-2 rounded-xl bg-navy text-white text-xs font-semibold hover:bg-navy/90 transition-colors"
                    >
                      {t("close")}
                    </button>
                  )}
                </div>
              </div>
            ) : purchaseStatus?.status === "paid_unfulfilled" ? (
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
                  onClick={handleClose}
                  className="mt-3 min-h-[44px] px-5 py-2 rounded-xl bg-navy text-white text-xs font-semibold"
                >
                  {t("contactSupport")}
                </button>
              </div>
            ) : (
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
                  onClick={() => setStep("choice")}
                  className="mt-3 min-h-[44px] px-5 py-2 rounded-xl bg-navy text-white text-xs font-semibold"
                >
                  {t("tryAgain")}
                </button>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
