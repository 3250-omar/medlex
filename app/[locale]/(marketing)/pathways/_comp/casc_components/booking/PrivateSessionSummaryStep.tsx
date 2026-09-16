"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
import type { LocalizedOfferDTO, SlotDTO } from "@/lib/private-sessions/types";
import { formatSlotTimes } from "@/lib/private-sessions/time";
import type { BookingMode } from "./types";

interface PrivateSessionSummaryStepProps {
  mode: BookingMode;
  selectedSlot: SlotDTO | null;
  selectedOffer: LocalizedOfferDTO | null;
  locale: string;
  isSubmitting: boolean;
  onBack: () => void;
  onConfirm: () => void;
  formatPrice: (minor: number, currency: string) => string;
}

export const PrivateSessionSummaryStep = React.memo(function PrivateSessionSummaryStep({
  mode,
  selectedSlot,
  selectedOffer,
  locale,
  isSubmitting,
  onBack,
  onConfirm,
  formatPrice,
}: PrivateSessionSummaryStepProps) {
  const t = useTranslations("privateSessions");

  return (
    <div className="space-y-5 py-2">
      <div className="border border-hair rounded-xl p-5 bg-tint/20 space-y-3">
        <h4 className="font-serif font-bold text-navy! text-base">
          {mode === "direct" && t("directSummaryTitle")}
          {mode === "package" && t("packageSummaryTitle")}
          {mode === "redeem" && t("redeemSummaryTitle")}
        </h4>

        <div className="space-y-2 text-xs divide-y divide-hair/50">
          {selectedSlot &&
            (() => {
              const times = formatSlotTimes(
                selectedSlot.startsAt,
                selectedSlot.endsAt,
                undefined,
                locale,
              );
              const cairoDate = new Intl.DateTimeFormat(
                locale === "ar" ? "ar-EG" : "en-US",
                {
                  timeZone: "Africa/Cairo",
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                },
              ).format(new Date(selectedSlot.startsAt));
              return (
                <>
                  <div className="flex justify-between pt-2">
                    <span className="text-char/60">{t("date")}</span>
                    <span className="font-semibold text-navy!">{cairoDate}</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-char/60">{t("time")}</span>
                    <span className="font-semibold text-navy!">
                      {times.cairoTimeFormatted}
                    </span>
                  </div>
                  {times.localTimeFormatted && (
                    <div className="flex justify-between pt-2 text-char/50">
                      <span>{t("localTime")}</span>
                      <span className="font-medium">
                        {times.localTimeFormatted}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2">
                    <span className="text-char/60">{t("duration")}</span>
                    <span className="font-semibold text-navy">{t("slotDuration")}</span>
                  </div>
                </>
              );
            })()}

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
                {formatPrice(selectedOffer.priceMinor, selectedOffer.currency)}
              </span>
            </div>
          )}

          {mode === "redeem" && (
            <div className="flex justify-between pt-2 text-sm font-bold text-emerald-800">
              <span>{t("totalPrice")}</span>
              <span>{locale === "ar" ? "1 رصيد جلسة" : "1 session credit"}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="min-h-[44px] px-4 py-2 rounded-xl border border-hair text-xs font-semibold text-char hover:bg-tint/30 transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          {t("back")}
        </button>
        <button
          type="button"
          onClick={onConfirm}
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
  );
});
