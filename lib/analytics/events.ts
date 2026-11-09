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

type VerifiedPurchase = {
  transactionId: string;
  value: number;
  currency: string;
  itemId: string;
  itemName: string;
};

const reportedPurchases = new Set<string>();

/** Report successful account creation; Ads sign-up conversion is optional. */
export function trackSignUp(userId: string): boolean {
  const tracked = trackEvent("sign_up", { method: "email" }, {
    dedupeKey: `sign_up_${userId}`,
  });
  if (!tracked || typeof window.gtag !== "function") return tracked;

  const adsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
  const label = process.env.NEXT_PUBLIC_GOOGLE_ADS_SIGNUP_LABEL;
  if (adsId && /^AW-\d+$/.test(adsId) && label && /^[A-Za-z0-9_-]+$/.test(label)) {
    const key = `medlex_ads_signup_${adsId}_${userId}`;
    try {
      if (window.localStorage.getItem(key) === "1") return tracked;
    } catch {
      // Continue without persistent deduplication when storage is disabled.
    }
    window.gtag("event", "conversion", { send_to: `${adsId}/${label}` });
    try { window.localStorage.setItem(key, "1"); } catch { /* Storage may be disabled. */ }
  }
  return tracked;
}

/** Report Free Guides sign-up conversion to Google Ads. */
export function trackFreeGuideSignUp(_resource?: string): boolean {
  if (typeof window === "undefined" || typeof window.gtag !== "function")
    return false;

  const adsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
  const label = process.env.NEXT_PUBLIC_GOOGLE_ADS_SIGNUP_LABEL;
  if (adsId && /^AW-\d+$/.test(adsId) && label && /^[A-Za-z0-9_-]+$/.test(label)) {
    window.gtag("event", "conversion", {
      send_to: `${adsId}/${label}`,
    });
    return true;
  }
  return false;
}

/** Report a server-confirmed CASC purchase once per destination and transaction. */
export function trackVerifiedPurchase(purchase: VerifiedPurchase): boolean {
  if (typeof window === "undefined" || typeof window.gtag !== "function")
    return false;
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const adsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
  const adsLabel = process.env.NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_LABEL;
  let reported = false;
  const hasReported = (key: string) => {
    if (reportedPurchases.has(key)) return true;
    try { return window.localStorage.getItem(key) === "1"; } catch { return false; }
  };
  const markReported = (key: string) => {
    reportedPurchases.add(key);
    try { window.localStorage.setItem(key, "1"); } catch { /* Storage may be disabled. */ }
  };

  if (gaId && /^G-[A-Z0-9]+$/.test(gaId)) {
    const key = `medlex_ga_purchase_${gaId}_${purchase.transactionId}`;
    if (!hasReported(key)) {
      window.gtag("event", "purchase", {
        transaction_id: purchase.transactionId,
        value: purchase.value,
        currency: purchase.currency,
        items: [
          {
            item_id: purchase.itemId,
            item_name: purchase.itemName,
            price: purchase.value,
            quantity: 1,
          },
        ],
      });
      markReported(key);
    }
    reported = true;
  }

  if (
    adsId &&
    /^AW-\d+$/.test(adsId) &&
    adsLabel &&
    /^[A-Za-z0-9_-]+$/.test(adsLabel)
  ) {
    const key = `medlex_ads_purchase_${adsId}_${purchase.transactionId}`;
    if (!hasReported(key)) {
      window.gtag("event", "conversion", {
        send_to: `${adsId}/${adsLabel}`,
        transaction_id: purchase.transactionId,
        value: purchase.value,
        currency: purchase.currency,
      });
      markReported(key);
    }
    reported = true;
  }

  return reported;
}

const DEDUPE_PREFIX = "medlex_dedupe_";

/**
 * Dispatches an event to GA4 with deduplication check and UTM enrichment.
 */
export function trackEvent(
  eventName: MedLexEventName,
  params?: BaseEventParams,
  options?: TrackEventOptions,
): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  if (typeof window.gtag !== "function") return false;

  // Deduplication check
  if (options?.dedupeKey) {
    const storageKey = `${DEDUPE_PREFIX}${options.dedupeKey}`;
    try {
      const alreadyFired = window.sessionStorage.getItem(storageKey);
      if (alreadyFired) {
        if (process.env.NODE_ENV === "development") {
          console.debug(
            `[GA4 Track] Deduplicated event skipped: ${eventName} (${options.dedupeKey})`,
          );
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
      console.debug(
        `[GA4 Track] gtag not found, simulated event: ${eventName}`,
        payload,
      );
    }
    return false;
  }
}
