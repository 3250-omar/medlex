/**
 * Strict HTML Sanitizer for CASC Lesson Content
 * Removes dangerous tags, inline javascript event handlers, and unsafe URI protocols
 * while preserving valid semantic tags, CSS classes, IDs, data attributes, and layout.
 */
export function sanitizeLessonHtml(rawHtml: string): string {
  if (!rawHtml) return "";

  if (typeof window !== "undefined" && typeof DOMParser !== "undefined") {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(rawHtml, "text/html");

      // 1. Remove dangerous or non-content tags
      const dangerousTags = [
        "script",
        "iframe",
        "object",
        "embed",
        "link",
        "meta",
        "base",
        "applet",
      ];
      doc.querySelectorAll(dangerousTags.join(",")).forEach((el) => el.remove());

      // 2. Strip inline event handlers and unsafe URI schemes
      const allElements = doc.querySelectorAll("*");
      allElements.forEach((el) => {
        // Remove on* attributes (onclick, onload, onerror, etc.)
        const attrs = Array.from(el.attributes);
        for (const attr of attrs) {
          const name = attr.name.toLowerCase();
          if (name.startsWith("on")) {
            el.removeAttribute(attr.name);
          } else if (name === "href" || name === "src" || name === "action") {
            const val = attr.value.trim().toLowerCase();
            if (
              val.startsWith("javascript:") ||
              val.startsWith("vbscript:") ||
              val.startsWith("data:text/html")
            ) {
              el.removeAttribute(attr.name);
            }
          }
        }

        // Ensure image accessibility
        if (el.tagName.toLowerCase() === "img") {
          const img = el as HTMLImageElement;
          if (!img.hasAttribute("alt")) {
            img.setAttribute("alt", "Clinical station illustration");
          }
          if (!img.hasAttribute("loading")) {
            img.setAttribute("loading", "lazy");
          }
        }
      });

      return doc.body.innerHTML;
    } catch {
      // Fall through to regex sanitizer if DOMParser fails
    }
  }

  // Fallback regex sanitizer
  return rawHtml
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "")
    .replace(/<embed\b[^>]*>/gi, "")
    .replace(/\son[a-zA-Z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/(href|src)\s*=\s*["']\s*javascript:[^"']*["']/gi, '$1="#"');
}
