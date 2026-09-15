"use client";

import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Calendar, Layers, ShieldCheck, Sparkles } from "lucide-react";
import { usePrivateSessionContext } from "../privateSessionQueries";
import type { BookingMode } from "./PrivateSessionDialog";

type Props = {
  locale: string;
  onOpenBooking: (mode: BookingMode) => void;
};

export default function CascCoachingSection({ locale, onOpenBooking }: Props) {
  const t = useTranslations("privateSessions");
  const { data: contextData, isLoading } = usePrivateSessionContext("casc-academy");

  const offers = contextData?.offers || [];
  const directOffer = offers.find((o) => o.code === "direct");
  const pkg5Offer = offers.find((o) => o.code === "package_5");

  const activeEntitlements = contextData?.entitlements || [];
  const remainingCredits = activeEntitlements.reduce((sum, e) => sum + e.remaining, 0);

  const formatPrice = (minor?: number, currency = "EGP") => {
    if (minor === undefined) return "—";
    return new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(minor / 100);
  };

  return (
    <section
      id="one-to-one-sessions"
      className="py-20 lg:py-24 border-b border-hair bg-white text-char scroll-mt-20"
    >
      <div className="mx-auto w-full max-w-[1720px] px-6 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-12 xl:gap-16 max-w-6xl mx-auto">
          {/* Coaching Information Card */}
          <div className="w-full lg:w-1/2 max-w-xl border border-hair rounded-2xl p-8 sm:p-10 bg-white shadow-sm flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-navy/5 border border-navy/10 text-xs font-semibold text-navy mb-3">
                <Sparkles className="w-3.5 h-3.5 text-gold" />
                <span>{t("sectionTitle")}</span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl font-bold !text-navy">
                {t("sectionSubtitle")}
              </h3>
              <p className="mt-3 font-sans text-sm sm:text-base leading-relaxed text-char/80">
                {t("sectionDescription")}
              </p>

              {/* Dynamic Server-Fed Offer Grid */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 py-5 border-y border-hair">
                <div className="p-3 rounded-xl bg-tint/20 border border-hair/50">
                  <div className="flex items-center gap-1.5 mb-1 text-navy font-semibold font-serif text-sm">
                    <Calendar className="w-4 h-4 text-navy shrink-0" />
                    <span>{directOffer?.title || (locale === "ar" ? "جلسة فردية" : "Single Session")}</span>
                  </div>
                  <div className="font-serif text-lg font-bold text-navy">
                    {isLoading ? (
                      <span className="inline-block w-20 h-5 bg-char/10 rounded animate-pulse" />
                    ) : (
                      formatPrice(directOffer?.priceMinor, directOffer?.currency)
                    )}
                  </div>
                  <div className="text-[11px] text-grey mt-0.5">
                    {locale === "ar" ? "60 دقيقة عبر الإنترنت" : "60 minutes online"}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-tint/20 border border-hair/50">
                  <div className="flex items-center gap-1.5 mb-1 text-navy font-semibold font-serif text-sm">
                    <Layers className="w-4 h-4 text-gold shrink-0" />
                    <span>{pkg5Offer?.title || (locale === "ar" ? "باقات الجلسات" : "Session Packages")}</span>
                  </div>
                  <div className="font-serif text-lg font-bold text-navy">
                    {isLoading ? (
                      <span className="inline-block w-24 h-5 bg-char/10 rounded animate-pulse" />
                    ) : (
                      `${formatPrice(pkg5Offer?.priceMinor, pkg5Offer?.currency)}`
                    )}
                  </div>
                  <div className="text-[11px] text-emerald-700 font-medium mt-0.5">
                    {locale === "ar" ? "وفر حتى 20% عند شراء 10" : "Save up to 20% on 10"}
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Controls */}
            <div className="mt-6 space-y-3">
              {remainingCredits > 0 && (
                <button
                  type="button"
                  onClick={() => onOpenBooking("redeem")}
                  className="w-full min-h-[44px] px-5 py-2.5 rounded-xl bg-emerald-700 text-white text-sm font-semibold hover:bg-emerald-800 transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-gold"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{t("redeemSessionCta")} ({remainingCredits})</span>
                </button>
              )}

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  type="button"
                  onClick={() => onOpenBooking("direct")}
                  className="flex-1 min-h-[44px] px-5 py-2.5 rounded-xl bg-navy text-white text-sm font-semibold hover:bg-navy/90 transition-all shadow-xs text-center cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-gold"
                >
                  {t("bookDirectCta")}
                </button>
                <button
                  type="button"
                  onClick={() => onOpenBooking("package")}
                  className="flex-1 min-h-[44px] px-5 py-2.5 rounded-xl border border-navy/30 bg-white text-navy text-sm font-semibold hover:bg-tint/30 transition-all text-center cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-gold"
                >
                  {t("buyPackageCta")}
                </button>
              </div>

              <span className="block text-xs text-grey text-center">
                {t("sectionDisclaimer")}
              </span>
            </div>
          </div>

          {/* Coaching Image */}
          <div className="w-full lg:w-1/2 max-w-xl">
            <div className="group relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-hair shadow-xl bg-tint">
              <Image
                src="/images/sectionImages/coaching_section.jpg"
                alt="One-to-one CASC coaching session"
                fill
                className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
