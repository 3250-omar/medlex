"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ArrowLeft, ArrowRight, AlertTriangle } from "lucide-react";
import type {
  LocalizedOfferDTO,
  SlotDTO,
  BookingDTO,
  EntitlementSummaryDTO,
} from "@/lib/private-sessions/types";
import { useQueryClient } from "@tanstack/react-query";
import {
  usePrivateSessionContext,
  useDirectCheckoutMutation,
  usePackageCheckoutMutation,
  useRedeemCreditMutation,
  privateSessionKeys,
} from "../../privateSessionQueries";
import { PrivateSessionChoiceStep } from "./PrivateSessionChoiceStep";
import { PrivateSessionPackageStep } from "./PrivateSessionPackageStep";
import { PrivateSessionCalendarStep } from "./PrivateSessionCalendarStep";
import { PrivateSessionSummaryStep } from "./PrivateSessionSummaryStep";
import { PrivateSessionStatusStep } from "./PrivateSessionStatusStep";

import type { DialogStep, BookingMode } from "./types";

interface PrivateSessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  locale: string;
  courseSlug?: string;
  initialMode?: BookingMode;
  initialPurchaseId?: string | null;
}

const EMPTY_OFFERS: LocalizedOfferDTO[] = [];
const EMPTY_ENTITLEMENTS: EntitlementSummaryDTO[] = [];

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
  const offers = contextData?.offers ?? EMPTY_OFFERS;
  const isAuthenticated = contextData?.authenticated ?? false;
  const isEmailVerified = contextData?.emailVerified ?? false;
  const activeEntitlements = contextData?.entitlements ?? EMPTY_ENTITLEMENTS;
  const totalRemainingCredits = React.useMemo(
    () => activeEntitlements.reduce((sum, e) => sum + e.remaining, 0),
    [activeEntitlements],
  );

  // State machine
  const [step, setStep] = useState<DialogStep>(
    initialPurchaseId
      ? "status"
      : initialMode === "redeem"
        ? "calendar"
        : "choice",
  );
  const [mode, setMode] = useState<BookingMode>(initialMode);
  const [selectedOffer, setSelectedOffer] = useState<LocalizedOfferDTO | null>(
    null,
  );
  const [selectedSlot, setSelectedSlot] = useState<SlotDTO | null>(null);
  const [purchaseId, setPurchaseId] = useState<string | null>(
    initialPurchaseId,
  );
  const [redeemedBooking, setRedeemedBooking] = useState<BookingDTO | null>(
    null,
  );
  const [directBooking, setDirectBooking] = useState<{
    sessionLink?: string | null;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Mutations
  const directCheckout = useDirectCheckoutMutation();
  const packageCheckout = usePackageCheckoutMutation();
  const redeemCredit = useRedeemCreditMutation();

  // Generate unique idempotency key for mutations
  const generateIdempotencyKey = useCallback((prefix: string) => {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
  }, []);

  const queryClient = useQueryClient();

  const handleClose = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: privateSessionKeys.context(courseSlug),
    });
    queryClient.refetchQueries({
      queryKey: privateSessionKeys.context(courseSlug),
    });
    onOpenChange(false);
    setSelectedSlot(null);
    setRedeemedBooking(null);
    setDirectBooking(null);
    setErrorMessage(null);
  }, [onOpenChange, queryClient, courseSlug]);

  const handleBack = useCallback(() => {
    setErrorMessage(null);
    if (step === "summary") {
      setStep(mode === "package" ? "package" : "calendar");
    } else if (step === "calendar" || step === "package") {
      setStep("choice");
    }
  }, [step, mode]);

  const handleStartSignIn = useCallback(() => {
    const returnPath = `/${locale}/pathways/casc-academy?oneToOne=open#one-to-one-sessions`;
    router.push(
      `/${locale}/auth/login?redirectTo=${encodeURIComponent(returnPath)}`,
    );
  }, [locale, router]);

  const handleSelectMode = useCallback(
    (chosenMode: BookingMode) => {
      setMode(chosenMode);
      setErrorMessage(null);

      if (chosenMode === "package") {
        setStep("package");
      } else {
        if (chosenMode === "direct") {
          const directOffer = offers.find((o) => o.code === "direct") || null;
          setSelectedOffer(directOffer);
        }
        setStep("calendar");
      }
    },
    [offers],
  );

  const handleProceedToSummaryFromSlot = useCallback((slot: SlotDTO) => {
    setSelectedSlot(slot);
    setStep("summary");
  }, []);

  const handleProceedToSummaryFromOffer = useCallback(
    (offer: LocalizedOfferDTO) => {
      setSelectedOffer(offer);
      setStep("summary");
    },
    [],
  );

  // Execution: Checkout or Redemption
  const handleExecute = useCallback(async () => {
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

        setPurchaseId(result.purchaseId);
        setDirectBooking(result);
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

        const redeemResult = await redeemCredit.mutateAsync({
          input: {
            courseSlug: "casc-academy",
            entitlementId: activeEntitlement.id,
            slotId: selectedSlot.id,
          },
          idempotencyKey: generateIdempotencyKey("redeem-credit"),
        });

        setRedeemedBooking(redeemResult);
        setStep("status");
      }
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "An error occurred while processing your request",
      );
    }
  }, [
    mode,
    selectedSlot,
    selectedOffer,
    activeEntitlements,
    directCheckout,
    packageCheckout,
    redeemCredit,
    generateIdempotencyKey,
  ]);

  const formatPrice = useCallback(
    (minor: number, currency: string) => {
      return new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US", {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
      }).format(minor / 100);
    },
    [locale],
  );

  const isSubmitting =
    directCheckout.isPending ||
    packageCheckout.isPending ||
    redeemCredit.isPending;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="max-w-3xl lg:max-w-xl w-full max-h-[92vh] min-h-[560px] overflow-y-auto p-6 sm:p-8 md:p-9 bg-white border border-hair rounded-3xl shadow-2xl text-char"
        showCloseButton={true}
      >
        <DialogHeader className="space-y-1 text-start">
          <div className="flex items-center justify-between gap-4">
            {step !== "choice" && step !== "status" ? (
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy! hover:text-navy/70 transition-colors min-h-[44px] min-w-[44px] cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-lg px-2"
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

        {/* Step progress indicator */}
        <div className="flex items-center justify-center gap-1.5 pt-1">
          {[1, 2, 3, 4].map((n) => {
            const currentStep =
              step === "choice"
                ? 1
                : step === "calendar" || step === "package"
                  ? 2
                  : step === "summary"
                    ? 3
                    : 4;
            return (
              <div
                key={n}
                className={`h-1.5 rounded-full transition-[width,background-color] duration-200 ${
                  n === currentStep
                    ? "w-6 bg-navy"
                    : n < currentStep
                      ? "w-1.5 bg-navy/40"
                      : "w-1.5 bg-char/15"
                }`}
              />
            );
          })}
        </div>

        {errorMessage && (
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* STEP 1: CHOICE / ENTRY */}
        {step === "choice" && (
          <div className="space-y-4 py-3">
            <PrivateSessionChoiceStep
              isLoading={contextLoading}
              isAuthenticated={isAuthenticated}
              isEmailVerified={isEmailVerified}
              totalRemainingCredits={totalRemainingCredits}
              offers={offers}
              locale={locale}
              onStartSignIn={handleStartSignIn}
              onSelectMode={handleSelectMode}
              formatPrice={formatPrice}
            />
          </div>
        )}

        {/* STEP 2: PACKAGE SELECTION */}
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

        {/* STEP 3: CALENDAR & TIME SELECTION */}
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

        {/* STEP 4: REVIEW & CONFIRMATION */}
        {step === "summary" && (
          <PrivateSessionSummaryStep
            mode={mode}
            selectedSlot={selectedSlot}
            selectedOffer={selectedOffer}
            locale={locale}
            isSubmitting={isSubmitting}
            onBack={handleBack}
            onConfirm={handleExecute}
            formatPrice={formatPrice}
          />
        )}

        {/* STEP 5: STATUS & FULFILLMENT */}
        {step === "status" && (
          <PrivateSessionStatusStep
            purchaseId={purchaseId}
            mode={mode}
            directBooking={directBooking}
            redeemedBooking={redeemedBooking}
            onClose={handleClose}
            onContinueToCalendar={() => {
              setMode("redeem");
              setStep("calendar");
            }}
            onRetry={() => setStep("choice")}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
