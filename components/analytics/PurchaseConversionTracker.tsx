"use client";

import { useEffect } from "react";
import { trackVerifiedPurchase } from "@/lib/analytics/events";
import { getTrackingConsent } from "@/lib/analytics/consent";

export const PENDING_CASC_PURCHASE_KEY = "medlex_pending_casc_purchase";
export const PENDING_CASC_PURCHASE_EVENT = "medlex:pending-casc-purchase";

export function rememberPendingCascPurchase(purchaseId: string): void {
  try {
    window.sessionStorage.setItem(PENDING_CASC_PURCHASE_KEY, purchaseId);
  } catch {
    /* Optional storage. */
  }
  try {
    window.localStorage.setItem(PENDING_CASC_PURCHASE_KEY, purchaseId);
  } catch {
    /* Optional storage. */
  }
}

function getPendingCascPurchase(): string | null {
  try {
    const persisted = window.localStorage.getItem(PENDING_CASC_PURCHASE_KEY);
    if (persisted) return persisted;
  } catch {
    /* Optional storage. */
  }
  try {
    return window.sessionStorage.getItem(PENDING_CASC_PURCHASE_KEY);
  } catch {
    return null;
  }
}

function clearPendingCascPurchase(): void {
  try {
    window.localStorage.removeItem(PENDING_CASC_PURCHASE_KEY);
  } catch {
    /* Optional storage. */
  }
  try {
    window.sessionStorage.removeItem(PENDING_CASC_PURCHASE_KEY);
  } catch {
    /* Optional storage. */
  }
}

type PurchaseStatus = {
  status: string;
  transaction_id?: string;
  value?: number;
  currency?: string;
  item_id?: string;
  item_name?: string;
};

function trackMetaBrowserPurchase(
  purchaseId: string,
  purchase: PurchaseStatus,
): boolean {
  if (
    getTrackingConsent() !== "accepted" ||
    !window.fbq ||
    !process.env.NEXT_PUBLIC_META_PIXEL_ID
  )
    return false;
  const key = `medlex_meta_browser_purchase_${purchaseId}`;
  try {
    if (window.localStorage.getItem(key) === "1") return true;
  } catch {
    /* Storage unavailable. */
  }
  window.fbq(
    "track",
    "Purchase",
    {
      value: purchase.value,
      currency: purchase.currency,
      content_ids: ["casc-academy"],
      content_type: "product",
    },
    { eventID: `casc-${purchaseId}` },
  );
  try {
    window.localStorage.setItem(key, "1");
  } catch {
    /* Storage unavailable. */
  }
  return true;
}

async function trackMetaServerPurchase(purchaseId: string): Promise<boolean> {
  if (
    getTrackingConsent() !== "accepted" ||
    !process.env.NEXT_PUBLIC_META_PIXEL_ID
  )
    return false;
  const key = `medlex_meta_server_purchase_${purchaseId}`;
  try {
    if (window.localStorage.getItem(key) === "1") return true;
  } catch {
    /* Storage unavailable. */
  }
  const cookies = Object.fromEntries(
    document.cookie.split("; ").map((item) => {
      const index = item.indexOf("=");
      return [item.slice(0, index), item.slice(index + 1)];
    }),
  );
  const response = await fetch(
    `/api/courses/casc-academy/purchase-conversion/${encodeURIComponent(purchaseId)}/meta`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        consent: true,
        fbp: cookies._fbp,
        fbc: cookies._fbc,
      }),
    },
  );
  if (!response.ok) return false;
  try {
    window.localStorage.setItem(key, "1");
  } catch {
    /* Storage unavailable. */
  }
  return true;
}
export default function PurchaseConversionTracker() {
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    let attempts = 0;
    let running = false;

    async function check() {
      if (running) return;
      const purchaseId = getPendingCascPurchase();
      if (!purchaseId) return;
      running = true;
      try {
        const response = await fetch(
          `/api/courses/casc-academy/purchase-conversion/${encodeURIComponent(purchaseId)}`,
          { cache: "no-store" },
        );
        if (response.status === 401 || response.status === 404) {
          clearPendingCascPurchase();
          return;
        }
        if (response.ok) {
          const purchase = (await response.json()) as PurchaseStatus;
          if (
            purchase.status === "failed" ||
            purchase.status === "cancelled" ||
            purchase.status === "refunded"
          ) {
            clearPendingCascPurchase();
            return;
          }
          if (
            purchase.status === "paid" &&
            purchase.transaction_id &&
            typeof purchase.value === "number" &&
            purchase.currency
          ) {
            const googleTracked = trackVerifiedPurchase({
              transactionId: purchase.transaction_id,
              value: purchase.value,
              currency: purchase.currency,
              itemId: purchase.item_id || "casc-academy",
              itemName: purchase.item_name || "The CASC Academy",
            });
            trackMetaBrowserPurchase(purchaseId, purchase);
            const serverTracked = await trackMetaServerPurchase(purchaseId);
            if (
              serverTracked ||
              (googleTracked &&
                (!process.env.NEXT_PUBLIC_META_PIXEL_ID ||
                  getTrackingConsent() !== "accepted"))
            ) {
              clearPendingCascPurchase();
              return;
            }
          }
        }
      } catch {
        // A temporary network failure can be retried while the page remains open.
      } finally {
        running = false;
      }
      if (++attempts < 40) timer = setTimeout(check, 3000);
    }

    function start() {
      if (timer) clearTimeout(timer);
      attempts = 0;
      void check();
    }

    start();
    window.addEventListener(PENDING_CASC_PURCHASE_EVENT, start);
    return () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener(PENDING_CASC_PURCHASE_EVENT, start);
    };
  }, []);

  return null;
}
