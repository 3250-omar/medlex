"use client";

import Script from "next/script";
import { Suspense, useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { captureUtmFromUrl } from "@/lib/analytics/utm";
import { VisitorTrackerInner } from "@/components/analytics/VisitorTracker";
import PurchaseConversionTracker from "@/components/analytics/PurchaseConversionTracker";
import MetaPixel from "@/components/analytics/MetaPixel";
import { CONSENT_CHANGED_EVENT, getTrackingConsent } from "@/lib/analytics/consent";

function UtmListener() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [consentVersion, setConsentVersion] = useState(0);

  useEffect(() => {
    const handleConsentChange = () => setConsentVersion((value) => value + 1);
    window.addEventListener(CONSENT_CHANGED_EVENT, handleConsentChange);
    return () => window.removeEventListener(CONSENT_CHANGED_EVENT, handleConsentChange);
  }, []);

  useEffect(() => {
    if (getTrackingConsent() === "accepted") captureUtmFromUrl(searchParams);
  }, [pathname, searchParams, consentVersion]);

  return null;
}

export function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const adsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
  const validGaId = gaId && /^G-[A-Z0-9]+$/.test(gaId) ? gaId : null;
  const validAdsId = adsId && /^AW-\d+$/.test(adsId) ? adsId : null;
  const tagId = validAdsId || validGaId;

  return (
    <>
      <Suspense fallback={null}>
        <UtmListener />
        <VisitorTrackerInner />
        <PurchaseConversionTracker />
        <MetaPixel />
      </Suspense>

      {tagId ? (
        <>
          <Script
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${tagId}`}
          />
          <Script
            id="google-analytics-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                gtag('js', new Date());
                ${validGaId ? `gtag('config', '${validGaId}', {
                  page_path: window.location.pathname,
                  send_page_view: true
                });` : ""}
                ${validAdsId ? `gtag('config', '${validAdsId}');` : ""}
              `,
            }}
          />
        </>
      ) : null}
    </>
  );
}

export default GoogleAnalytics;
