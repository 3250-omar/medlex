export type PageCategory =
  | "blog_article"
  | "course_landing"
  | "station_preview"
  | "home"
  | "other";

export function classifyPath(path: string): {
  category: PageCategory;
  identifier?: string;
} {
  const clean = path.split("?")[0].replace(/^\/(en|ar)/, "");

  if (!clean || clean === "/") {
    return { category: "home" };
  }

  if (clean.startsWith("/blogs/")) {
    const slug = clean.replace("/blogs/", "").replace(/\/$/, "");
    return { category: "blog_article", identifier: slug };
  }

  if (clean.startsWith("/pathways/")) {
    const pathway = clean.replace("/pathways/", "").replace(/\/$/, "");
    return { category: "course_landing", identifier: pathway };
  }

  if (clean.includes("/academy/preview/")) {
    return { category: "station_preview", identifier: "station-7-2" };
  }

  return { category: "other", identifier: clean };
}

export function extractReferrerDomain(referrer?: string | null): string {
  if (!referrer) return "Direct / None";
  try {
    const url = new URL(referrer);
    return url.hostname.replace(/^www\./, "");
  } catch {
    return referrer.slice(0, 50);
  }
}
