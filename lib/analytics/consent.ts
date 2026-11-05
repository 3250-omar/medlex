export const CONSENT_STORAGE_KEY = "medlex_tracking_consent_v1";
export const CONSENT_CHANGED_EVENT = "medlex:tracking-consent-changed";

export type TrackingConsent = "accepted" | "rejected";
let sessionConsent: TrackingConsent | null = null;

export function getTrackingConsent(): TrackingConsent | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    return value === "accepted" || value === "rejected" ? value : sessionConsent;
  } catch {
    return sessionConsent;
  }
}

export function setTrackingConsent(value: TrackingConsent) {
  sessionConsent = value;
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, value);
  } catch {
    // The choice remains active until the page is closed.
  }
  window.dispatchEvent(new Event(CONSENT_CHANGED_EVENT));
}
