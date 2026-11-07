"use client";

import { useEffect } from "react";
import { trackVerifiedPurchase } from "@/lib/analytics/events";

export const PENDING_CASC_PURCHASE_KEY = "medlex_pending_casc_purchase";
export const PENDING_CASC_PURCHASE_EVENT = "medlex:pending-casc-purchase";

export function rememberPendingCascPurchase(purchaseId: string): void {
  try { window.sessionStorage.setItem(PENDING_CASC_PURCHASE_KEY, purchaseId); } catch { /* Optional storage. */ }
  try { window.localStorage.setItem(PENDING_CASC_PURCHASE_KEY, purchaseId); } catch { /* Optional storage. */ }
}

function getPendingCascPurchase(): string | null {
  try {
    const persisted = window.localStorage.getItem(PENDING_CASC_PURCHASE_KEY);
    if (persisted) return persisted;
  } catch { /* Optional storage. */ }
  try {
    return window.sessionStorage.getItem(PENDING_CASC_PURCHASE_KEY);
  } catch {
    return null;
  }
}

function clearPendingCascPurchase(): void {
  try { window.localStorage.removeItem(PENDING_CASC_PURCHASE_KEY); } catch { /* Optional storage. */ }
  try { window.sessionStorage.removeItem(PENDING_CASC_PURCHASE_KEY); } catch { /* Optional storage. */ }
}

type PurchaseStatus = {
  status: string;
  transaction_id?: string;
  value?: number;
  currency?: string;
  item_id?: string;
  item_name?: string;
};

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
          if (purchase.status === "failed" || purchase.status === "cancelled" || purchase.status === "refunded") {
            clearPendingCascPurchase();
            return;
          }
          if (
            purchase.status === "paid" &&
            purchase.transaction_id &&
            typeof purchase.value === "number" &&
            purchase.currency
          ) {
            if (trackVerifiedPurchase({
              transactionId: purchase.transaction_id,
              value: purchase.value,
              currency: purchase.currency,
              itemId: purchase.item_id || "casc-academy",
              itemName: purchase.item_name || "The CASC Academy",
            })) {
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
