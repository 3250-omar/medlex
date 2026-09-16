"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Check, Sparkles } from "lucide-react";
import type { LocalizedOfferDTO } from "@/lib/private-sessions/types";

interface PrivateSessionPackageStepProps {
  offers: LocalizedOfferDTO[];
  selectedOfferId: string | null;
  onSelectOffer: (offer: LocalizedOfferDTO) => void;
  locale: string;
}

export const PrivateSessionPackageStep = React.memo(
  function PrivateSessionPackageStep({
    offers,
    selectedOfferId,
    onSelectOffer,
    locale,
  }: PrivateSessionPackageStepProps) {
    const t = useTranslations("privateSessions");
    const packageOffers = offers.filter((o) => o.kind === "package");

    const formatPrice = (minor: number, currency: string) => {
      const major = minor / 100;
      return new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US", {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
      }).format(major);
    };

    return (
      <div className="space-y-4 py-2">
        <div className="text-sm text-char/70">{t("choicePackageDesc")}</div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {packageOffers.map((offer) => {
            const isSelected = selectedOfferId === offer.id;
            const isTen = offer.sessionCount === 10;
            const savingsLabel = isTen ? "Save 20%" : "Save 10%";
            const perSessionMinor = Math.round(
              offer.priceMinor / offer.sessionCount,
            );

            return (
              <button
                key={offer.id}
                type="button"
                onClick={() => onSelectOffer(offer)}
                className={`relative flex flex-col p-5 rounded-xl border text-start transition-[border-color,background-color] duration-150 ease-out min-h-[44px] cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-gold transform-gpu ${
                  isSelected
                    ? "border-navy bg-navy/5 shadow-sm ring-1 ring-navy"
                    : "border-hair bg-white hover:border-navy/40 hover:bg-tint/30"
                }`}
              >
                {isTen && (
                  <span className="absolute -top-2.5 end-3 inline-flex items-center gap-1 rounded-full bg-gold px-2.5 py-0.5 text-xs font-semibold text-navy shadow-xs">
                    <Sparkles className="w-3 h-3" />
                    {locale === "ar" ? "أفضل قيمة" : "Best Value"}
                  </span>
                )}

                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-serif font-bold text-navy! text-lg">
                      {offer.title}
                    </h4>
                    <span className="inline-block mt-1 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md px-2 py-0.5">
                      {savingsLabel}
                    </span>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center border transition-colors ${
                      isSelected
                        ? "bg-navy border-navy text-white"
                        : "border-hair bg-white text-transparent"
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-hair/60">
                  <div className="text-2xl font-serif font-bold text-navy">
                    {formatPrice(offer.priceMinor, offer.currency)}
                  </div>
                  <div className="text-xs text-char/60 mt-0.5">
                    {formatPrice(perSessionMinor, offer.currency)}{" "}
                    {locale === "ar" ? "لكل جلسة" : "per session"}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  },
);
