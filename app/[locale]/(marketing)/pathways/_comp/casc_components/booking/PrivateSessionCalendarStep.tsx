"use client";

import React, { useState, useMemo, useRef } from "react";
import { useTranslations } from "next-intl";
import {
  Clock,
  Globe,
  AlertCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Check,
  Sunrise,
  Sun,
  Sunset,
  ArrowRight,
  ArrowLeft,
  CalendarCheck2,
} from "lucide-react";
import type { SlotDTO } from "@/lib/private-sessions/types";
import { useSlotAvailability } from "../../privateSessionQueries";
import { formatSlotTimes, CAIRO_TIMEZONE } from "@/lib/private-sessions/time";

interface PrivateSessionCalendarStepProps {
  courseSlug?: string;
  selectedSlot: SlotDTO | null;
  onSelectSlot: (slot: SlotDTO) => void;
  locale: string;
}

export const PrivateSessionCalendarStep = React.memo(
  function PrivateSessionCalendarStep({
    courseSlug = "casc-academy",
    selectedSlot,
    onSelectSlot,
    locale,
  }: PrivateSessionCalendarStepProps) {
    const t = useTranslations("privateSessions");
    const isRtl = locale === "ar";
    const datesScrollRef = useRef<HTMLDivElement>(null);
    const NextIcon = isRtl ? ArrowLeft : ArrowRight;

    // Query window: next 30 days starting from tomorrow
    const { fromDateStr, toDateStr } = useMemo(() => {
      const start = new Date();
      start.setDate(start.getDate() + 1); // Start 24h ahead
      const end = new Date();
      end.setDate(end.getDate() + 30);

      const fmt = (d: Date) => d.toISOString().split("T")[0];
      return { fromDateStr: fmt(start), toDateStr: fmt(end) };
    }, []);

    const {
      data: slots,
      isLoading,
      isError,
      refetch,
    } = useSlotAvailability({
      courseSlug,
      from: fromDateStr,
      to: toDateStr,
    });

    // Group slots by Cairo civil date (YYYY-MM-DD)
    const slotsByDate = useMemo(() => {
      const map = new Map<string, SlotDTO[]>();
      if (!slots) return map;

      for (const slot of slots) {
        const cairoDate = new Intl.DateTimeFormat("en-CA", {
          timeZone: CAIRO_TIMEZONE,
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }).format(new Date(slot.startsAt));

        if (!map.has(cairoDate)) {
          map.set(cairoDate, []);
        }
        map.get(cairoDate)!.push(slot);
      }
      return map;
    }, [slots]);

    const availableDates = useMemo(
      () => Array.from(slotsByDate.keys()).sort(),
      [slotsByDate],
    );

    // Selected date defaults to first available date
    const [userSelectedDate, setUserSelectedDate] = useState<string | null>(
      null,
    );
    const selectedDate =
      userSelectedDate && availableDates.includes(userSelectedDate)
        ? userSelectedDate
        : availableDates[0] || null;

    const activeDateSlots = useMemo(() => {
      return selectedDate ? slotsByDate.get(selectedDate) || [] : [];
    }, [selectedDate, slotsByDate]);

    // Group active date slots by period of day (Cairo hour)
    const groupedSlots = useMemo(() => {
      const morning: SlotDTO[] = [];
      const afternoon: SlotDTO[] = [];
      const evening: SlotDTO[] = [];

      for (const slot of activeDateSlots) {
        const d = new Date(slot.startsAt);
        const parts = new Intl.DateTimeFormat("en-US", {
          timeZone: CAIRO_TIMEZONE,
          hour: "numeric",
          hourCycle: "h23",
        }).formatToParts(d);
        const hour = parseInt(
          parts.find((p) => p.type === "hour")?.value || "0",
          10,
        );

        if (hour < 12) {
          morning.push(slot);
        } else if (hour < 17) {
          afternoon.push(slot);
        } else {
          evening.push(slot);
        }
      }

      return { morning, afternoon, evening };
    }, [activeDateSlots]);

    const scrollDates = (direction: "left" | "right") => {
      if (!datesScrollRef.current) return;
      const offset = direction === "left" ? -240 : 240;
      datesScrollRef.current.scrollBy({
        left: isRtl ? -offset : offset,
        behavior: "smooth",
      });
    };

    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-char/60 gap-3">
          <Loader2 className="w-9 h-9 animate-spin text-navy" />
          <p className="text-sm font-medium">{t("loadingSlots")}</p>
        </div>
      );
    }

    if (isError || availableDates.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 px-6 text-center border border-dashed border-hair rounded-2xl bg-tint/15">
          <AlertCircle className="w-12 h-12 text-char/40 mb-3" />
          <h4 className="font-serif font-bold text-navy! text-lg mb-1.5">
            {t("noSlotsAvailable")}
          </h4>
          <p className="text-xs sm:text-sm text-char/65 max-w-md mb-5 leading-relaxed">
            {t("cutoffNotice")}
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="min-h-[44px] px-6 py-2.5 rounded-xl bg-navy text-white text-xs font-semibold hover:bg-navy/90 transition-all shadow-xs"
          >
            {t("tryAgain")}
          </button>
        </div>
      );
    }

    const periods = [
      {
        id: "morning",
        label: t("morningSessions"),
        icon: Sunrise,
        slots: groupedSlots.morning,
      },
      {
        id: "afternoon",
        label: t("afternoonSessions"),
        icon: Sun,
        slots: groupedSlots.afternoon,
      },
      {
        id: "evening",
        label: t("eveningSessions"),
        icon: Sunset,
        slots: groupedSlots.evening,
      },
    ].filter((p) => p.slots.length > 0);

    return (
      <div className="space-y-6 py-1">
        {/* Timezone and cutoff banner */}
        <div className="flex items-center justify-between flex-wrap gap-3 p-3.5 rounded-2xl bg-navy/5 border border-navy/10 text-xs">
          <div className="flex items-center gap-2.5 text-navy font-semibold">
            <Globe className="w-4 h-4 text-navy shrink-0" />
            <span>{t("cairoTimeNotice")}</span>
          </div>
          <div className="text-char/70 text-[11px] font-medium">
            {t("cutoffNotice")}
          </div>
        </div>

        {/* Date selector header & horizontal slider */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-navy uppercase tracking-wider">
              {t("selectDate")} ({availableDates.length}{" "}
              {t("daysAvailable")})
            </label>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => scrollDates("left")}
                className="p-1.5 rounded-lg border border-hair hover:bg-tint/30 text-char/70 transition-colors"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollDates("right")}
                className="p-1.5 rounded-lg border border-hair hover:bg-tint/30 text-char/70 transition-colors"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div
            ref={datesScrollRef}
            className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin scroll-smooth"
          >
            {availableDates.map((dateStr) => {
              const isSelected = selectedDate === dateStr;
              const [y, m, d] = dateStr.split("-").map(Number);
              const dateObj = new Date(Date.UTC(y, m - 1, d));

              const weekday = new Intl.DateTimeFormat(
                locale === "ar" ? "ar-EG" : "en-US",
                {
                  timeZone: "UTC",
                  weekday: "short",
                },
              ).format(dateObj);

              const dayNum = new Intl.DateTimeFormat(
                locale === "ar" ? "ar-EG" : "en-US",
                {
                  timeZone: "UTC",
                  day: "numeric",
                },
              ).format(dateObj);

              const monthName = new Intl.DateTimeFormat(
                locale === "ar" ? "ar-EG" : "en-US",
                {
                  timeZone: "UTC",
                  month: "short",
                },
              ).format(dateObj);

              return (
                <button
                  key={dateStr}
                  type="button"
                  onClick={() => setUserSelectedDate(dateStr)}
                  className={`min-h-[82px] min-w-[96px] sm:min-w-[104px] shrink-0 p-2.5 rounded-2xl border text-center transition-all cursor-pointer outline-none flex flex-col justify-between items-center ${
                    isSelected
                      ? "bg-navy text-white border-navy shadow-md ring-2 ring-gold/40 scale-[1.02]"
                      : "bg-white text-char border-hair hover:border-navy/40 hover:bg-navy/[0.02] hover:shadow-2xs"
                  }`}
                >
                  <span
                    className={`text-[11px] font-medium ${isSelected ? "text-white/80" : "text-char/60"}`}
                  >
                    {weekday}
                  </span>
                  <span className="text-xl sm:text-2xl font-bold font-serif my-0.5 leading-none">
                    {dayNum}
                  </span>
                  <div className="flex items-center gap-1">
                    <span
                      className={`text-[11px] font-semibold ${isSelected ? "text-gold" : "text-char/80"}`}
                    >
                      {monthName}
                    </span>
                    <span
                      className={`inline-block w-1.5 h-1.5 rounded-full ${
                        isSelected ? "bg-gold" : "bg-emerald-500"
                      }`}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Available Slots grouped by period of the day */}
        <div className="space-y-6 pt-1">
          <div className="flex items-center justify-between border-b border-hair/60 pb-2">
            <label className="text-xs font-bold text-navy uppercase tracking-wider">
              {t("selectTime")}
            </label>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-navy/10 text-navy">
              {activeDateSlots.length}{" "}
              {t("slotsAvailable")}
            </span>
          </div>

          {periods.map((period) => {
            const PeriodIcon = period.icon;
            return (
              <div key={period.id} className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-navy/80">
                  <PeriodIcon className="w-4 h-4 text-gold" />
                  <span>{period.label}</span>
                  <span className="text-[11px] text-char/50 font-normal">
                    ({period.slots.length})
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {period.slots.map((slot) => {
                    const isSelected = selectedSlot?.id === slot.id;
                    const times = formatSlotTimes(
                      slot.startsAt,
                      slot.endsAt,
                      undefined,
                      locale,
                    );

                    return (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => onSelectSlot(slot)}
                        className={`relative flex flex-col justify-between p-4 rounded-2xl border text-start transition-all min-h-[74px] cursor-pointer outline-none ${
                          isSelected
                            ? "border-navy bg-navy text-white shadow-lg ring-2 ring-gold/60 scale-[1.02]"
                            : "border-hair bg-white hover:border-navy/40 hover:bg-navy/[0.02] hover:shadow-xs text-char"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 w-full ">
                          <div className="flex items-center gap-2">
                            <Clock
                              className={`w-4 h-4 shrink-0 ${isSelected ? "text-gold" : "text-navy"}`}
                            />
                            <span
                              className={`font-serif text-sm font-bold ${isSelected ? "text-white" : "text-navy"}`}
                            >
                              {times.cairoTimeFormatted.split("(")[0].trim()}
                            </span>
                          </div>

                          {
                            isSelected ? (
                              <div className="w-5 h-5 rounded-full bg-gold text-navy flex items-center justify-center shrink-0">
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                              </div>
                            ) : null
                            // <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md bg-tint/60 text-char/60">
                            //   {t("slotDuration")}
                            // </span>
                          }
                        </div>

                        {times.localTimeFormatted && (
                          <div
                            className={`mt-2 flex items-center gap-1.5 text-[11px] ${
                              isSelected ? "text-white/80" : "text-char/65"
                            }`}
                          >
                            <Globe className="w-3 h-3 shrink-0" />
                            <span>{times.localTimeFormatted}</span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Slot Floating / Bottom Bar confirmation */}
        {selectedSlot && (
          <div className="p-4 rounded-2xl bg-navy/5 border border-navy/15 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="w-10 h-10 rounded-xl bg-navy text-white flex items-center justify-center shrink-0 shadow-xs">
                <CalendarCheck2 className="w-5 h-5 text-gold" />
              </div>
              <div>
                <div className="text-xs text-char/60 font-medium">
                  {t("selectedSlotLabel")}
                </div>
                <div className="text-sm font-bold text-navy font-serif">
                  {
                    formatSlotTimes(
                      selectedSlot.startsAt,
                      selectedSlot.endsAt,
                      undefined,
                      locale,
                    ).cairoTimeFormatted
                  }
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onSelectSlot(selectedSlot)}
              className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 rounded-xl bg-navy text-white text-xs sm:text-sm font-semibold hover:bg-navy/90 transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              <span>{t("continueToConfirmation")}</span>
              <NextIcon className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    );
  },
);
