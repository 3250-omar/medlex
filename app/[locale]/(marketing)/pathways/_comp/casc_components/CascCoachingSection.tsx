"use client";

import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Sparkles } from "lucide-react";
/*
import {
  Calendar,
  Layers,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { useCurrentUser } from "../../../_apiCalls/academyQueries";
import { usePrivateSessionContext } from "../privateSessionQueries";
import { formatCairoDateTime } from "@/lib/private-sessions/time";
*/
import type { BookingMode } from "./booking/types";

type Props = {
  locale: string;
  onOpenBooking?: (mode: BookingMode) => void;
};

export default function CascCoachingSection({ locale }: Props) {
  const t = useTranslations("privateSessions");

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
              {/* Large Coming Soon Badge */}
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-navy to-[#182C52] text-white text-sm sm:text-base font-extrabold tracking-wide uppercase shadow-md border-2 border-gold/60">
                  <Sparkles className="w-4 h-4 text-gold shrink-0 animate-pulse" />
                  <span>
                    {locale === "ar" ? "قريباً — Coming Soon" : "Coming Soon"}
                  </span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gold/15 border border-gold/40 text-xs sm:text-[13px] font-bold text-navy">
                  <span>{t("sectionTitle")}</span>
                </div>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl font-bold !text-navy">
                {t("sectionSubtitle")}
              </h3>
              <p className="mt-3 font-sans text-sm sm:text-base leading-relaxed text-char/80">
                {t("sectionDescription")}
              </p>
            </div>

            {/* Coming Soon Notice Card */}
            <div className="mt-6 p-6 rounded-2xl border border-[#DFD5C0] bg-[#FAF7F2] text-start space-y-3.5 shadow-xs">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-gold"></span>
                </span>
                <span className="font-serif font-bold text-base sm:text-lg text-navy">
                  {locale === "ar"
                    ? "جلسات التدريب الفردي والمحاكاة قادمة قريباً"
                    : "1-on-1 Practice & Coaching Coming Soon"}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-char/80 leading-relaxed">
                {locale === "ar"
                  ? "سيتم إطلاق جلسات التدريب والمحاكاة الفردية المباشرة مع الدكتور أحمد أبو الغيط قريباً كخدمة مستقلة ومخصصة عبر مزود حجز مستقل ومنفصل تماماً عن اشتراك الدورة."
                  : "Dedicated 1-on-1 private practice and mock exam sessions with Dr Ahmed Abouelghit will launch soon as an independent service with dedicated scheduling and a separate booking provider."}
              </p>
              <div className="pt-1 flex items-center gap-2 text-xs font-semibold text-navy/75">
                <Sparkles className="w-3.5 h-3.5 text-gold shrink-0" />
                <span>
                  {locale === "ar"
                    ? "خدمة تدريب مستقلة — حجز ومواعيد مخصصة قريباً"
                    : "Independent coaching service — dedicated booking launching soon"}
                </span>
              </div>
            </div>

            <span className="block text-xs text-grey text-center mt-5">
              {locale === "ar"
                ? "خدمة تدريب مستقلة عن اشتراك الدورة — ستتاح قريباً عبر مزود حجز منفصل."
                : "Independent coaching service separate from course enrolment — launching soon via a dedicated provider."}
            </span>

            {/*
              Old bundled booking & quota controls commented out:
              Private coaching will be provided separately in another provider.
              All original hooks and logic preserved below:

              const [isMounted, setIsMounted] = useState(false);
              useEffect(() => {
                setIsMounted(true);
              }, []);

              const { data: user } = useCurrentUser();
              const { data: sessionContext, isLoading } = usePrivateSessionContext(
                "casc-academy",
                !!user,
              );
              const remainingCredits = sessionContext?.entitlements?.remainingCredits ?? 0;
              const hasPackageCredits = remainingCredits > 0;
              const nextBooking = sessionContext?.bookings?.[0];
            */}
            {/*
            <div className="mt-6 space-y-4">
              {!isMounted || isLoading ? (
                <div className="space-y-3">
                  <div className="h-14 w-full bg-char/5 rounded-xl animate-pulse" />
                  <div className="h-11 w-full bg-char/5 rounded-xl animate-pulse" />
                </div>
              ) : (
                <div className="space-y-4">
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

                  {hasPackageCredits ? (
                    <div className="p-4 rounded-xl border border-gold/40 bg-gold/5 space-y-3 text-start">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-navy font-semibold text-sm">
                          <Layers className="w-4 h-4 text-gold shrink-0" />
                          <span>
                            {locale === "ar"
                              ? `الرصيد المتاح: ${remainingCredits} جلسة`
                              : `Available Quota: ${remainingCredits} sessions`}
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
                          ? "لا يوجد لديك رصيد جلسات متبقٍ حالياً."
                          : "You currently have no remaining private session quota."}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
            */}
          </div>

          {/* Coaching Image */}
          <div className="w-full lg:w-1/2 max-w-xl">
            <div className="group relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-hair shadow-xl bg-tint">
              {/* Image Overlay Badge */}
              <div className="absolute top-4 start-4 z-10">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-navy/90 backdrop-blur-md text-white text-xs sm:text-sm font-bold uppercase tracking-wider shadow-lg border border-gold/50">
                  <Sparkles className="w-3.5 h-3.5 text-gold" />
                  <span>
                    {locale === "ar" ? "قريباً — Coming Soon" : "Coming Soon"}
                  </span>
                </span>
              </div>
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
