"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { CONSENT_CHANGED_EVENT, getTrackingConsent } from "@/lib/analytics/consent";

type MetaQueue = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  push?: (...args: unknown[]) => void;
  queue?: unknown[][];
  loaded?: boolean;
  version?: string;
};

declare global {
  interface Window {
    fbq?: MetaQueue;
    _fbq?: MetaQueue;
  }
}

const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const scriptUrl = "https://connect.facebook.net/en_US/fbevents.js";

export default function MetaPixel() {
  const pathname = usePathname();
  const [consentVersion, setConsentVersion] = useState(0);
  const lastPageView = useRef<string | null>(null);

  useEffect(() => {
    const update = () => setConsentVersion((value) => value + 1);
    window.addEventListener(CONSENT_CHANGED_EVENT, update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener(CONSENT_CHANGED_EVENT, update);
      window.removeEventListener("storage", update);
    };
  }, []);

  useEffect(() => {
    if (!pixelId || !/^\d+$/.test(pixelId) || getTrackingConsent() !== "accepted") {
      lastPageView.current = null;
      return;
    }

    if (!window.fbq) {
      const queue: MetaQueue = function (...args) {
        if (queue.callMethod) queue.callMethod(...args);
        else queue.queue?.push(args);
      };
      queue.push = queue;
      queue.loaded = true;
      queue.version = "2.0";
      queue.queue = [];
      window.fbq = queue;
      window._fbq = queue;
      queue("init", pixelId);

      if (!document.querySelector(`script[src="${scriptUrl}"]`)) {
        const script = document.createElement("script");
        script.async = true;
        script.src = scriptUrl;
        document.head.appendChild(script);
      }
    }

    const publicPage = /^\/(en|ar)(?:\/(?:pathways|about|contact|articles|privacy-policy|terms|refund-policy))?(?:\/|$)/.test(pathname);
    if (publicPage && lastPageView.current !== pathname) {
      window.fbq?.("track", "PageView");
      lastPageView.current = pathname;
    } else if (!publicPage) {
      lastPageView.current = null;
    }
  }, [pathname, consentVersion]);

  return null;
}
