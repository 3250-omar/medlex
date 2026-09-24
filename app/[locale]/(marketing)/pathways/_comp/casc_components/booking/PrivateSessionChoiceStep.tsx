"use client";

import React, { useMemo, useCallback } from "react";
import { useTranslations } from "next-intl";
import {
  Calendar,
  Layers,
  ShieldCheck,
  Lock,
  Mail,
  Loader2,
} from "lucide-react";
import type { LocalizedOfferDTO } from "@/lib/private-sessions/types";
import type { BookingMode } from "./types";

interface PrivateSessionChoiceStepProps {
  isLoading: boolean;
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  totalRemainingCredits: number;
  offers: LocalizedOfferDTO[];
  locale: string;
  onStartSignIn: () => void;
  onSelectMode: (mode: BookingMode) => void;
  formatPrice?: (minor: number, currency: string) => string;
}

export const PrivateSessionChoiceStep = React.memo(
  function PrivateSessionChoiceStep({
    isLoading,
    isAuthenticated,
    isEmailVerified,
    totalRemainingCredits,
    offers,
    locale,
    onStartSignIn,
    onSelectMode,
    formatPrice,
  }: PrivateSessionChoiceStepProps) {
    const t = useTranslations("privateSessions");

    const directOffer = useMemo(
      () => offers.find((o) => o.code === "direct") ?? null,
      [offers],
    );

    const formattedDirectPrice = useMemo(() => {
      if (!directOffer) return null;
      if (formatPrice) {
        return formatPrice(directOffer.priceMinor, directOffer.currency);
      }
      try {
        return new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US", {
          style: "currency",
          currency: directOffer.currency,
          maximumFractionDigits: 0,
        }).format(directOffer.priceMinor / 100);
      } catch {
        return `${directOffer.priceMinor / 100} ${directOffer.currency}`;
      }
    }, [directOffer, formatPrice, locale]);

    const handleSelectRedeem = useCallback(() => {
      onSelectMode("redeem");
    }, [onSelectMode]);

    const handleSelectDirect = useCallback(() => {
      onSelectMode("direct");
    }, [onSelectMode]);

    const handleSelectPackage = useCallback(() => {
      onSelectMode("package");
    }, [onSelectMode]);

    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-navy!" />
        </div>
      );
    }

    if (!isAuthenticated) {
      return (
        <div className="flex flex-col items-center justify-center text-center p-6 border border-hair rounded-2xl bg-tint/30 space-y-3">
          <div className="w-12 h-12 rounded-full bg-navy/10 flex items-center justify-center text-navy mb-1">
            <Lock className="w-6 h-6" />
          </div>
          <h4 className="font-serif text-lg font-bold text-navy!">
            {t("signInRequiredTitle")}
          </h4>
          <p className="text-xs sm:text-sm text-char/70 max-w-md">
            {t("signInRequiredDesc")}
          </p>
          <button
            type="button"
            onClick={onStartSignIn}
            className="mt-2 min-h-[44px] px-6 py-2.5 rounded-xl bg-navy text-white text-sm font-semibold hover:bg-navy/90 transition-colors duration-150 shadow-sm cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            {t("signInButton")}
          </button>
        </div>
      );
    }

    if (!isEmailVerified) {
      return (
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
      );
    }

    return (
      <div className="space-y-3">
        {/* Option: Redeem existing credits if any */}
        {totalRemainingCredits > 0 && (
          <button
            type="button"
            onClick={handleSelectRedeem}
            className="w-full flex items-start justify-between p-4 rounded-xl border border-emerald-300 bg-emerald-50/40 hover:bg-emerald-50 text-start transition-[border-color,background-color] duration-150 ease-out min-h-[44px] cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-gold transform-gpu"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
                <span className="font-serif font-bold text-navy! text-base">
                  {t("choiceRedeemTitle")}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                  {t("availableCredits", { count: totalRemainingCredits })}
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
          onClick={handleSelectDirect}
          className="w-full flex items-start justify-between p-4 rounded-xl border border-gray-400 hover:border-navy/50 bg-white hover:bg-tint/20 text-start transition-[border-color,background-color] duration-150 ease-out min-h-[44px] cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-gold transform-gpu"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-navy!" />
              <span className="font-serif font-bold text-navy! text-base">
                {t("choiceDirectTitle")}
              </span>
            </div>
            <p className="text-xs text-char/70">{t("choiceDirectDesc")}</p>
          </div>
          {formattedDirectPrice && (
            <div className="text-end font-serif font-bold text-navy text-base shrink-0">
              {formattedDirectPrice}
            </div>
          )}
        </button>

        {/* Option 2: Buy a package */}
        <button
          type="button"
          onClick={handleSelectPackage}
          className="w-full flex items-start justify-between p-4 rounded-xl border border-gray-400 hover:border-navy/50 bg-white hover:bg-tint/20 text-start transition-[border-color,background-color] duration-150 ease-out min-h-[44px] cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-gold transform-gpu"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-gold" />
              <span className="font-serif font-bold text-navy! text-base">
                {t("choicePackageTitle")}
              </span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-gold/20 text-navy!">
                {t("saveUpToDiscount")}
              </span>
            </div>
            <p className="text-xs text-char/70">{t("choicePackageDesc")}</p>
          </div>
        </button>
      </div>
    );
  },
  (prev, next) => {
    return (
      prev.isLoading === next.isLoading &&
      prev.isAuthenticated === next.isAuthenticated &&
      prev.isEmailVerified === next.isEmailVerified &&
      prev.totalRemainingCredits === next.totalRemainingCredits &&
      prev.locale === next.locale &&
      prev.offers === next.offers &&
      prev.onStartSignIn === next.onStartSignIn &&
      prev.onSelectMode === next.onSelectMode &&
      prev.formatPrice === next.formatPrice
    );
  },
);
