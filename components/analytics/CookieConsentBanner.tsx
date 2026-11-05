"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useLocale } from "next-intl";
import {
  CONSENT_CHANGED_EVENT,
  getTrackingConsent,
  setTrackingConsent,
  type TrackingConsent,
} from "@/lib/analytics/consent";

function subscribeToConsent(callback: () => void) {
  window.addEventListener(CONSENT_CHANGED_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(CONSENT_CHANGED_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export default function CookieConsentBanner() {
  const locale = useLocale();
  const isArabic = locale === "ar";
  const choice = useSyncExternalStore(subscribeToConsent, getTrackingConsent, () => undefined);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    const openSettings = () => setSettingsOpen(true);
    window.addEventListener("medlex:open-cookie-settings", openSettings);
    return () =>
      window.removeEventListener("medlex:open-cookie-settings", openSettings);
  }, []);

  function choose(value: TrackingConsent) {
    const state = value === "accepted" ? "granted" : "denied";
    window.gtag?.("consent", "update", {
      ad_storage: state,
      ad_user_data: state,
      ad_personalization: state,
      analytics_storage: state,
    });
    setTrackingConsent(value);
    setSettingsOpen(false);
  }

  if (!settingsOpen && choice !== null) return null;

  return (
    <section
      role="dialog"
      aria-label={isArabic ? "إعدادات الخصوصية" : "Privacy preferences"}
      aria-describedby="cookie-consent-description"
      dir={isArabic ? "rtl" : "ltr"}
      className="fixed inset-x-3 bottom-3 z-[100] mx-auto max-w-3xl rounded-2xl border border-[#c5a059]/50 bg-[#0e1d38] p-5 text-white shadow-2xl sm:bottom-6 sm:p-6"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-xl">
          <h2 className="text-base font-semibold">
            {isArabic ? "اختيارات الخصوصية" : "Your privacy choices"}
          </h2>
          <p
            id="cookie-consent-description"
            className="mt-2 text-sm leading-6 text-slate-200"
          >
            {isArabic
              ? "نستخدم التحليلات والإعلانات لقياس أداء الموقع والحملات. يمكنك الموافقة أو الرفض، وتغيير اختيارك لاحقًا من تذييل الموقع."
              : "We use analytics and advertising to measure site and campaign performance. You can accept or reject, and change your choice later in the footer."}
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:min-w-36">
          <button
            type="button"
            onClick={() => choose("accepted")}
            className="min-h-11 rounded-lg bg-[#c5a059] px-4 text-sm font-semibold text-[#0e1d38] hover:bg-[#ddba77] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {isArabic ? "موافق" : "Accept"}
          </button>
          <button
            type="button"
            onClick={() => choose("rejected")}
            className="min-h-11 rounded-lg border border-white/50 px-4 text-sm font-semibold text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {isArabic ? "رفض" : "Reject"}
          </button>
        </div>
      </div>
    </section>
  );
}
