/**
 * Time and timezone utilities for CASC One-to-One Private Sessions.
 *
 * Requirements:
 * - Native Intl.DateTimeFormat only (no external timezone libraries).
 * - Cairo (Africa/Cairo) is the primary civil-time zone for session slots.
 * - Suppress duplicate local output when learner timezone matches Africa/Cairo.
 * - Cutoff authorization MUST NEVER be enforced client-side; server/PostgreSQL RPCs
 *   are the exclusive authority on slot eligibility and cutoff (strict > 24 hours).
 */

export const CAIRO_TIMEZONE = "Africa/Cairo";
export const SESSION_DURATION_HOURS = 1;

/**
 * Parses Cairo local civil date and 24h start-time (e.g. "2026-09-20", "14:00")
 * into authoritative UTC Date objects using native Intl.
 */
export function cairoCivilToUtc(cairoDate: string, cairoStartTime: string): {
  startsAt: Date;
  endsAt: Date;
  startsAtIso: string;
  endsAtIso: string;
} {
  const [yearStr, monthStr, dayStr] = cairoDate.split("-");
  const [hourStr, minuteStr] = cairoStartTime.split(":");

  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);
  const hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);

  // Derive offset for Africa/Cairo at the given date/time
  // We approximate UTC instant then refine using Intl formatToParts
  const approxUtc = new Date(Date.UTC(year, month - 1, day, hour, minute, 0));

  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: CAIRO_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });

  // Calculate the difference between Cairo representation and UTC
  const parts = dtf.formatToParts(approxUtc);
  const getPart = (type: string) => parseInt(parts.find((p) => p.type === type)?.value || "0", 10);

  const cairoYear = getPart("year");
  const cairoMonth = getPart("month");
  const cairoDay = getPart("day");
  const cairoHour = getPart("hour");
  const cairoMinute = getPart("minute");

  const cairoEpochEquivalent = Date.UTC(cairoYear, cairoMonth - 1, cairoDay, cairoHour, cairoMinute, 0);
  const offsetMs = cairoEpochEquivalent - approxUtc.getTime();

  // The actual UTC time for when Cairo local clock reads (year, month, day, hour, minute):
  const targetUtcMs = approxUtc.getTime() - offsetMs;
  const startsAt = new Date(targetUtcMs);
  const endsAt = new Date(targetUtcMs + SESSION_DURATION_HOURS * 60 * 60 * 1000);

  return {
    startsAt,
    endsAt,
    startsAtIso: startsAt.toISOString(),
    endsAtIso: endsAt.toISOString(),
  };
}

/**
 * Formats an ISO UTC timestamp in Cairo time.
 */
export function formatCairoDateTime(
  isoString: string,
  locale: string = "en",
  options?: Intl.DateTimeFormatOptions
): string {
  const date = new Date(isoString);
  const defaultOptions: Intl.DateTimeFormatOptions = {
    timeZone: CAIRO_TIMEZONE,
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    ...options,
  };

  return new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-US", defaultOptions).format(date);
}

/**
 * Returns formatted Cairo time and optional learner-local equivalent.
 * Suppresses local output if learner timezone resolves to Africa/Cairo.
 */
export function formatSlotTimes(
  startsAtIso: string,
  endsAtIso: string,
  userTimezone?: string,
  locale: string = "en"
): {
  cairoTimeFormatted: string;
  localTimeFormatted: string | null;
  isSameZone: boolean;
} {
  const startDate = new Date(startsAtIso);
  const endDate = new Date(endsAtIso);

  const activeLocale = locale === "ar" ? "ar-EG" : "en-US";

  const timeOnlyOptions: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  const cairoStart = new Intl.DateTimeFormat(activeLocale, {
    ...timeOnlyOptions,
    timeZone: CAIRO_TIMEZONE,
  }).format(startDate);

  const cairoEnd = new Intl.DateTimeFormat(activeLocale, {
    ...timeOnlyOptions,
    timeZone: CAIRO_TIMEZONE,
  }).format(endDate);

  const cairoLabel = locale === "ar" ? "توقيت القاهرة" : "Cairo time";
  const cairoTimeFormatted = `${cairoStart} – ${cairoEnd} (${cairoLabel})`;

  // Determine user timezone
  let resolvedUserTz = userTimezone;
  if (!resolvedUserTz && typeof Intl !== "undefined" && typeof Intl.DateTimeFormat === "function") {
    try {
      resolvedUserTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
      resolvedUserTz = undefined;
    }
  }

  // Check if learner timezone matches Cairo
  const isSameZone =
    !resolvedUserTz ||
    resolvedUserTz === CAIRO_TIMEZONE ||
    resolvedUserTz === "Egypt";

  if (isSameZone) {
    return {
      cairoTimeFormatted,
      localTimeFormatted: null,
      isSameZone: true,
    };
  }

  // Format in user's local timezone
  try {
    const localStart = new Intl.DateTimeFormat(activeLocale, {
      ...timeOnlyOptions,
      timeZone: resolvedUserTz,
    }).format(startDate);

    const localEnd = new Intl.DateTimeFormat(activeLocale, {
      ...timeOnlyOptions,
      timeZone: resolvedUserTz,
    }).format(endDate);

    const localLabel = locale === "ar" ? "توقيتك المحلي" : "Your local time";
    const localTimeFormatted = `${localStart} – ${localEnd} (${localLabel})`;

    return {
      cairoTimeFormatted,
      localTimeFormatted,
      isSameZone: false,
    };
  } catch {
    // If timezone is invalid, fallback to cairo only
    return {
      cairoTimeFormatted,
      localTimeFormatted: null,
      isSameZone: true,
    };
  }
}
