import { getTrackingConsent } from "./consent";
import { getVisitAttribution } from "./visit-attribution";
import { getOrCreateVisitorId } from "./visitor-id";

// Link this browser to the signed-in buyer before the payment attempt is created.
export async function recordCheckoutVisit(): Promise<void> {
  if (getTrackingConsent() !== "accepted") return;
  try {
    const attribution = getVisitAttribution(new URLSearchParams(window.location.search), false);
    await fetch("/api/analytics/visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(2000),
      body: JSON.stringify({
        visitor_hash: getOrCreateVisitorId(),
        path: window.location.pathname,
        ...attribution,
      }),
    });
  } catch {
    // Analytics must never block checkout.
  }
}
