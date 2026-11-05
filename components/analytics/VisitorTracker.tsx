"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { getVisitAttribution } from "@/lib/analytics/visit-attribution";
import { getOrCreateVisitorId } from "@/lib/analytics/visitor-id";
import {
  CONSENT_CHANGED_EVENT,
  getTrackingConsent,
} from "@/lib/analytics/consent";

export function VisitorTrackerInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastTrackedPathRef = useRef<string | null>(null);
  const lastTrackedUrlRef = useRef<string | null>(null);
  const [consentVersion, setConsentVersion] = useState(0);

  useEffect(() => {
    const handleConsentChange = () => setConsentVersion((value) => value + 1);
    window.addEventListener(CONSENT_CHANGED_EVENT, handleConsentChange);
    return () =>
      window.removeEventListener(CONSENT_CHANGED_EVENT, handleConsentChange);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (getTrackingConsent() !== "accepted") return;

    const canonicalPath = pathname || "/";
    const previousPath = lastTrackedPathRef.current;
    const trackingKey = `${canonicalPath}?${searchParams.toString()}`;

    // Prevent duplicate dispatch for same path in rapid succession
    if (lastTrackedUrlRef.current === trackingKey) {
      return;
    }
    lastTrackedPathRef.current = canonicalPath;
    lastTrackedUrlRef.current = trackingKey;

    const visitorId = getOrCreateVisitorId();
    const attribution = getVisitAttribution(searchParams, previousPath === null);

    const payload = {
      visitor_hash: visitorId,
      path: canonicalPath,
      referrer: attribution.referrer,
      utm_source: attribution.utm_source,
      utm_medium: attribution.utm_medium,
      utm_campaign: attribution.utm_campaign,
      google_ads_click_detected: attribution.google_ads_click_detected,
    };

    try {
      const json = JSON.stringify(payload);
      if (
        typeof navigator !== "undefined" &&
        typeof navigator.sendBeacon === "function"
      ) {
        const blob = new Blob([json], { type: "application/json" });
        const sent = navigator.sendBeacon("/api/analytics/visit", blob);
        if (!sent) {
          fetch("/api/analytics/visit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: json,
            keepalive: true,
          }).catch(() => {});
        }
      } else {
        fetch("/api/analytics/visit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: json,
          keepalive: true,
        }).catch(() => {});
      }
    } catch {
      // Non-blocking catch
    }
  }, [pathname, searchParams, consentVersion]);

  return null;
}

export default VisitorTrackerInner;
