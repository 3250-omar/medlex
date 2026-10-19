"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { getStoredUtmParams } from "@/lib/analytics/utm";

const VISITOR_ID_KEY = "medlex_visitor_id";

function getOrCreateVisitorId(): string {
  if (typeof window === "undefined") return "";
  try {
    let id = window.localStorage.getItem(VISITOR_ID_KEY);
    if (!id) {
      id =
        "vx_" +
        (typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : Math.random().toString(36).slice(2) + Date.now().toString(36));
      window.localStorage.setItem(VISITOR_ID_KEY, id);
    }
    return id;
  } catch {
    return "anon_" + Date.now().toString(36);
  }
}

export function VisitorTrackerInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastTrackedPathRef = useRef<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

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
  }, [pathname, searchParams]);

  return null;
}

export default VisitorTrackerInner;
