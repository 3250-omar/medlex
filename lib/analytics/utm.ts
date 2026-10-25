export interface UtmParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  [key: string]: string | undefined;
}

const UTM_STORAGE_KEY = "medlex_utm_params";
const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

/**
 * Capture UTM parameters from URL search params and persist in sessionStorage.
 */
export function captureUtmFromUrl(
  searchParams?: URLSearchParams | string
): UtmParams | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    let params: URLSearchParams;
    if (!searchParams) {
      params = new URLSearchParams(window.location.search);
    } else if (typeof searchParams === "string") {
      params = new URLSearchParams(searchParams);
    } else {
      params = searchParams;
    }

    const captured: UtmParams = {};
    let hasUtm = false;

    for (const key of UTM_KEYS) {
      const value = params.get(key);
      if (value) {
        captured[key] = value.trim();
        hasUtm = true;
      }
    }

    if (hasUtm) {
      const existing = getStoredUtmParams();
      const merged = { ...existing, ...captured };
      window.sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(merged));
      return merged;
    }

    return getStoredUtmParams();
  } catch {
    return null;
  }
}

/**
 * Retrieve saved UTM parameters from sessionStorage.
 */
export function getStoredUtmParams(): UtmParams {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const raw = window.sessionStorage.getItem(UTM_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as UtmParams;
  } catch {
    return {};
  }
}
