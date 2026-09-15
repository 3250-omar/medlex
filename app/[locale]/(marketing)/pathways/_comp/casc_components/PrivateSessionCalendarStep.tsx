"use client";

import React, { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import {
  Clock,
  Globe,
  AlertCircle,
  Loader2,
} from "lucide-react";
import type { SlotDTO } from "@/lib/private-sessions/types";
import { useSlotAvailability } from "../privateSessionQueries";
import { formatSlotTimes, CAIRO_TIMEZONE } from "@/lib/private-sessions/time";

interface PrivateSessionCalendarStepProps {
  courseSlug?: string;
  selectedSlot: SlotDTO | null;
  onSelectSlot: (slot: SlotDTO) => void;
  locale: string;
}

export function PrivateSessionCalendarStep({
  courseSlug = "casc-academy",
  selectedSlot,
  onSelectSlot,
  locale,
}: PrivateSessionCalendarStepProps) {
  const t = useTranslations("privateSessions");

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
      // Extract Cairo date string
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

  // Selected date defaults to first available date without an effect
  const [userSelectedDate, setUserSelectedDate] = useState<string | null>(null);
  const selectedDate =
    userSelectedDate && availableDates.includes(userSelectedDate)
      ? userSelectedDate
      : availableDates[0] || null;

  const activeDateSlots = selectedDate
    ? slotsByDate.get(selectedDate) || []
    : [];

  const formatDateDisplay = (dateStr: string) => {
    const [y, m, d] = dateStr.split("-").map(Number);
    const date = new Date(Date.UTC(y, m - 1, d));
    return new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-US", {
      timeZone: "UTC",
      weekday: "short",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-char/60 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-navy" />
        <p className="text-sm">{t("loadingSlots")}</p>
      </div>
    );
  }

  if (isError || availableDates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 px-4 text-center border border-dashed border-hair rounded-xl bg-tint/20">
        <AlertCircle className="w-10 h-10 text-char/40 mb-2" />
        <h4 className="font-serif font-bold text-navy text-base mb-1">
          {t("noSlotsAvailable")}
        </h4>
        <p className="text-xs text-char/60 max-w-sm mb-4">
          {t("cutoffNotice")}
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="min-h-[44px] px-4 py-2 rounded-lg bg-navy text-white text-xs font-medium cursor-pointer hover:bg-navy/90 transition-colors focus-visible:ring-2 focus-visible:ring-gold"
        >
          {t("tryAgain")}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5 py-2">
      {/* Timezone and cutoff banner */}
      <div className="flex items-start gap-2.5 p-3 rounded-lg bg-navy/5 border border-navy/15 text-xs text-navy/90">
        <Globe className="w-4 h-4 mt-0.5 shrink-0 text-navy" />
        <div className="space-y-0.5">
          <div className="font-semibold">{t("cairoTimeNotice")}</div>
          <div className="text-char/70">{t("cutoffNotice")}</div>
        </div>
      </div>

      {/* Date selector tabs */}
      <div>
        <label className="block text-xs font-semibold text-char/80 mb-2">
          {t("selectDate")}
        </label>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {availableDates.map((dateStr) => {
            const isSelected = selectedDate === dateStr;
            const count = slotsByDate.get(dateStr)?.length || 0;

            return (
              <button
                key={dateStr}
                type="button"
                onClick={() => setUserSelectedDate(dateStr)}
                className={`min-h-[44px] min-w-[100px] shrink-0 px-3 py-2 rounded-xl border text-center transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                  isSelected
                    ? "bg-navy text-white border-navy shadow-xs font-semibold"
                    : "bg-white text-char border-hair hover:border-navy/40 hover:bg-tint/30"
                }`}
              >
                <div className="text-xs">{formatDateDisplay(dateStr)}</div>
                <div
                  className={`text-[10px] mt-0.5 ${isSelected ? "text-gold" : "text-grey"}`}
                >
                  {count} {locale === "ar" ? "متاح" : "available"}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time slots for active date */}
      <div>
        <label className="block text-xs font-semibold text-char/80 mb-2">
          {t("selectTime")} ({activeDateSlots.length})
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[260px] overflow-y-auto pr-1">
          {activeDateSlots.map((slot) => {
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
                className={`flex flex-col p-3.5 rounded-xl border text-start transition-all min-h-[44px] cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                  isSelected
                    ? "border-navy bg-navy/10 ring-1 ring-navy font-medium"
                    : "border-hair bg-white hover:border-navy/40 hover:bg-tint/30"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 font-serif text-sm font-bold text-navy">
                    <Clock className="w-3.5 h-3.5 text-navy shrink-0" />
                    <span>{times.cairoTimeFormatted}</span>
                  </div>
                  <span className="text-[10px] text-grey font-sans uppercase">
                    {t("slotDuration")}
                  </span>
                </div>

                {times.localTimeFormatted && (
                  <div className="mt-1.5 text-xs text-char/70">
                    {times.localTimeFormatted}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
