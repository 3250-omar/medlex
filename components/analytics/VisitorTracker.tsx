"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { getStoredUtmParams } from "@/lib/analytics/utm";
import { getOrCreateVisitorId } from "@/lib/analytics/visitor-id";
import {
  CONSENT_CHANGED_EVENT,
  getTrackingConsent,
} from "@/lib/analytics/consent";

export function VisitorTrackerInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastTrackedPathRef = useRef<string | null>(null);
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

    // Prevent duplicate dispatch for same path in rapid succession
    if (lastTrackedPathRef.current === canonicalPath) {
      return;
    }
    lastTrackedPathRef.current = canonicalPath;

    const visitorId = getOrCreateVisitorId();
    const utm = getStoredUtmParams();

    const payload = {
      visitor_hash: visitorId,
      path: canonicalPath,
      referrer: document.referrer || null,
      utm_source: utm.utm_source || null,
      utm_medium: utm.utm_medium || null,
      utm_campaign: utm.utm_campaign || null,
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
