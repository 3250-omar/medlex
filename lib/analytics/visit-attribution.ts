export type VisitAttribution = {
  referrer: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  google_ads_click_detected: boolean;
  last_activity: number;
};

const KEY = "medlex_visit_attribution";
const SESSION_MS = 30 * 60 * 1000;

function externalOrigin(referrer: string, currentOrigin: string): string | null {
  try {
    const from = new URL(referrer);
    const current = new URL(currentOrigin);
    const host = (value: string) => value.replace(/^www\./, "").toLowerCase();
    if (!/^https?:$/.test(from.protocol) || host(from.hostname) === host(current.hostname)) return null;
    return from.origin;
  } catch {
    return null;
  }
}

export function resolveVisitAttribution(input: {
  search: URLSearchParams;
  referrer: string;
  origin: string;
  initialPage: boolean;
  previous: VisitAttribution | null;
  now: number;
}): VisitAttribution {
  const value = (key: string) => input.search.get(key)?.trim().slice(0, 100) || null;
  const utm_source = value("utm_source");
  const utm_medium = value("utm_medium");
  const utm_campaign = value("utm_campaign");
  const googleAdsClick = ["gclid", "gbraid", "wbraid"].some((key) => Boolean(value(key)));
  const external = input.initialPage ? externalOrigin(input.referrer, input.origin) : null;
  const newCampaign = Boolean(utm_source || utm_medium || utm_campaign || googleAdsClick);
  const previousFresh = input.previous && input.now >= input.previous.last_activity &&
    input.now - input.previous.last_activity <= SESSION_MS;

  if (!newCampaign && !external && previousFresh) {
    return { ...input.previous!, last_activity: input.now };
  }
  return {
    referrer: external,
    utm_source,
    utm_medium,
    utm_campaign,
    google_ads_click_detected: googleAdsClick,
    last_activity: input.now,
  };
}

export function getVisitAttribution(search: URLSearchParams, initialPage: boolean): VisitAttribution {
  let previous: VisitAttribution | null = null;
  try {
    const raw = window.sessionStorage.getItem(KEY);
    if (raw) previous = JSON.parse(raw) as VisitAttribution;
  } catch { /* Attribution remains usable for the current page. */ }
  const attribution = resolveVisitAttribution({
    search,
    referrer: document.referrer,
    origin: window.location.origin,
    initialPage,
    previous,
    now: Date.now(),
  });
  try { window.sessionStorage.setItem(KEY, JSON.stringify(attribution)); } catch { /* Storage is optional. */ }
  return attribution;
}
