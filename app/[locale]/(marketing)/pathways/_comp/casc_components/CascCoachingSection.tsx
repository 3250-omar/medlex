"use client";

import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  Calendar,
  Layers,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { useCurrentUser } from "../../../_apiCalls/academyQueries";
import { usePrivateSessionContext } from "../privateSessionQueries";
import { formatCairoDateTime } from "@/lib/private-sessions/time";
import type { BookingMode } from "./booking/types";

type Props = {
  locale: string;
  onOpenBooking: (mode: BookingMode) => void;
};

const emptySubscribe = () => () => {};

export default function CascCoachingSection({ locale, onOpenBooking }: Props) {
  const t = useTranslations("privateSessions");
  const isMounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const { data: user, isLoading: isUserLoading } = useCurrentUser();
  const { data: contextData, isLoading: isContextLoading } =
    usePrivateSessionContext("casc-academy");

  const isLoading = isUserLoading && isContextLoading;

  const offers = contextData?.offers || [];
  const directOffer = offers.find((o) => o.code === "direct");
  const pkg5Offer = offers.find((o) => o.code === "package_5");
  const pkg10Offer = offers.find((o) => o.code === "package_10");

  const userPrivateSessions = user?.privateSessions;

  const upcomingBookings =
    userPrivateSessions?.upcomingBookings ??
    contextData?.upcomingBookings ??
    [];
  const nextBooking =
    userPrivateSessions?.nextBooking ?? upcomingBookings[0] ?? null;
  const hasUpcomingBooking = Boolean(nextBooking);

  const activeEntitlements = contextData?.entitlements || [];
  const remainingCredits =
    userPrivateSessions?.totalRemainingCredits ??
    activeEntitlements.reduce((sum, e) => sum + e.remaining, 0);
  const hasPackageCredits = remainingCredits > 0;
  const isSubscribedOrBooked = hasUpcomingBooking || hasPackageCredits;

  const formatPrice = (minor?: number, currency = "GBP") => {
    if (minor === undefined) return "—";
    return new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-GB", {
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
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/40 text-sm sm:text-[15px] font-bold text-navy mb-4 animate-pulse">
                <Sparkles className="w-4 h-4 text-gold shrink-0" />
                <span>{t("sectionTitle")}</span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl font-bold !text-navy">
                {t("sectionSubtitle")}
              </h3>
              <p className="mt-3 font-sans text-sm sm:text-base leading-relaxed text-char/80">
                {t("sectionDescription")}
              </p>
            </div>

            {/* Quota, Booking, and Meeting Link Controls */}
            <div className="mt-6 space-y-4">
              {!isMounted || isLoading ? (
                /* Skeleton loader while mounting and query is loading */
                <div className="space-y-3">
                  <div className="h-14 w-full bg-char/5 rounded-xl animate-pulse" />
                  <div className="h-11 w-full bg-char/5 rounded-xl animate-pulse" />
                </div>
              ) : (
                <div className="space-y-4">
                  {/* 1. Upcoming confirmed booking with Google Meet Link */}
                  {nextBooking && (
                    <div className="p-4 rounded-xl border border-emerald-300 bg-emerald-50/60 space-y-2.5 text-start">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                          <span className="font-serif font-bold text-navy text-sm">
                            {t("upcomingConfirmed")}
                          </span>
                        </div>
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                          {t("confirmed")}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-char/80">
                        <Calendar className="w-3.5 h-3.5 text-navy shrink-0" />
                        <span>
                          {formatCairoDateTime(nextBooking.startsAt, locale)}
                        </span>
                      </div>

                      {(nextBooking.joinUrl || nextBooking.sessionLink) && (
                        <a
                          href={
                            nextBooking.joinUrl ||
                            nextBooking.sessionLink ||
                            "#"
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 w-full min-h-[42px] px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold transition-colors shadow-xs mt-1"
                        >
                          <span>{t("joinMeeting")}</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  )}

                  {/* 2. Available Quota / Remaining Credits */}
                  {hasPackageCredits ? (
                    <div className="p-4 rounded-xl border border-gold/40 bg-gold/5 space-y-3 text-start">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-navy font-semibold text-sm">
                          <Layers className="w-4 h-4 text-gold shrink-0" />
                          <span>
                            {locale === "ar"
                              ? `الرصيد المتاح: ${remainingCredits} ${
                                  remainingCredits === 1
                                    ? "جلسة"
                                    : remainingCredits === 2
                                      ? "جلستان"
                                      : remainingCredits <= 10
                                        ? "جلسات"
                                        : "جلسة"
                                }`
                              : `Available Quota: ${remainingCredits} ${
                                  remainingCredits === 1
                                    ? "session"
                                    : "sessions"
                                }`}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-navy px-2.5 py-0.5 rounded-full bg-gold/20">
                          {remainingCredits}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => onOpenBooking("redeem")}
                        className="w-full min-h-[44px] px-5 py-2.5 rounded-xl bg-navy text-white text-sm font-semibold hover:bg-navy/90 transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-gold"
                      >
                        <ShieldCheck className="w-4 h-4 text-gold" />
                        <span>
                          {t("redeemSessionCta")} ({remainingCredits})
                        </span>
                      </button>
                    </div>
                  ) : (
                    /* 3. Quota Finished / None Remaining */
                    <div className="p-5 rounded-xl border border-hair bg-tint/25 text-start space-y-2.5">
                      <div className="flex items-center gap-2 text-char/90 font-semibold text-sm">
                        <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                        <span className="font-serif font-bold text-navy">
                          {locale === "ar"
                            ? "انتهت الجلسات المتاحة"
                            : "Session Quota Completed"}
                        </span>
                      </div>
                      <p className="text-xs sm:text-[13px] text-char/75 leading-relaxed">
                        {locale === "ar"
                          ? "لا يوجد لديك رصيد جلسات متبقٍ حالياً. تُضاف الجلسات الخاصة مباشرةً مع باقة اشتراك الدورة."
                          : "You currently have no remaining private session quota. Private coaching sessions are bundled when enrolling in the academy."}
                      </p>
                      <a
                        href="#top"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy hover:text-gold transition-colors pt-1"
                      >
                        <span>
                          {locale === "ar"
                            ? "تخصيص باقة الدورة والجلسات"
                            : "Customise your course & coaching bundle"}
                        </span>
                        <span aria-hidden="true">↑</span>
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>

            <span className="block text-xs text-grey text-center">
              {t("sectionDisclaimer")}
            </span>
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
