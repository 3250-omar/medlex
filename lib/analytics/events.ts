import { getStoredUtmParams } from "./utm";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export interface BaseEventParams {
  [key: string]: string | number | boolean | undefined | null;
}

export interface GiftDownloadEventParams extends BaseEventParams {
  gift_id: string;
  file_name?: string;
  pathway?: string;
}

export interface StationPreviewEventParams extends BaseEventParams {
  station_slug?: string;
  locale?: string;
}

export interface CtaClickEventParams extends BaseEventParams {
  cta_name?: string;
  pathway?: string;
  placement?: string;
  price?: string | number;
}

export interface EnrollmentSuccessEventParams extends BaseEventParams {
  course_id?: string;
  pathway?: string;
  value?: number;
  currency?: string;
}

export type MedLexEventName =
  | "download_examiner_briefing"
  | "download_examiner_error_log"
  | "view_station_7_2_preview"
  | "click_cta_subscription"
  | "course_enrollment_success"
  | (string & {});

export interface TrackEventOptions {
  /**
   * If provided, the event will only fire once per session for this specific dedupe key.
   */
  dedupeKey?: string;
}

const DEDUPE_PREFIX = "medlex_dedupe_";

/**
 * Dispatches an event to GA4 with deduplication check and UTM enrichment.
 */
export function trackEvent(
  eventName: MedLexEventName,
  params?: BaseEventParams,
  options?: TrackEventOptions
): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  // Deduplication check
  if (options?.dedupeKey) {
    const storageKey = `${DEDUPE_PREFIX}${options.dedupeKey}`;
    try {
      const alreadyFired = window.sessionStorage.getItem(storageKey);
      if (alreadyFired) {
        if (process.env.NODE_ENV === "development") {
          console.debug(`[GA4 Track] Deduplicated event skipped: ${eventName} (${options.dedupeKey})`);
        }
        return false;
      }
      window.sessionStorage.setItem(storageKey, Date.now().toString());
    } catch {
      // Ignore sessionStorage errors (e.g. storage disabled)
    }
  }

  // Merge stored UTM parameters
  const utm = getStoredUtmParams();
  const payload = {
    ...utm,
    ...params,
  };

  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, payload);
    if (process.env.NODE_ENV === "development") {
      console.debug(`[GA4 Track] Dispatched: ${eventName}`, payload);
    }
    return true;
  } else {
    if (process.env.NODE_ENV === "development") {
      console.debug(`[GA4 Track] gtag not found, simulated event: ${eventName}`, payload);
    }
    return false;
  }
}
