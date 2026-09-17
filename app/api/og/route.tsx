import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { SEO_ROUTES_REGISTRY, type SeoRouteKey, type Locale } from "@/lib/seo/metadata";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const routeKey = (searchParams.get("route") ?? "home") as SeoRouteKey;
    const locale = (searchParams.get("locale") ?? "en") as Locale;

    const config = SEO_ROUTES_REGISTRY[routeKey] ?? SEO_ROUTES_REGISTRY.home;
    const translationKey = config.translationKey;

    let title = "MedLex";
    let description = "Forensic Psychiatry Education & CASC Training";

    try {
      const messages = (await import(`@/lib/i18n/translations/${locale}.json`)).default;
      const seoData = messages?.seo?.[translationKey];
      if (seoData) {
        title = seoData.ogTitle || seoData.title || title;
        description = seoData.ogDescription || seoData.description || description;
      }
    } catch {
      // Fallback to default branding
    }

    const isAr = locale === "ar";

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            backgroundColor: "#0b1726",
            padding: "60px 70px",
            fontFamily: "sans-serif",
            direction: isAr ? "rtl" : "ltr",
            border: "8px solid #c5a059",
          }}
        >
          {/* Top Bar: Brand */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "8px",
                  backgroundColor: "#1b375c",
                  border: "2px solid #c5a059",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#c5a059",
                  fontSize: "28px",
                  fontWeight: 700,
                }}
              >
                ML
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span
                  style={{
                    color: "#ffffff",
                    fontSize: "26px",
                    fontWeight: 800,
                    letterSpacing: isAr ? "0" : "0.15em",
                  }}
                >
                  {isAr ? "ميدليكس" : "MEDLEX"}
                </span>
                <span
                  style={{
                    color: "#c5a059",
                    fontSize: "14px",
                    fontWeight: 600,
                    letterSpacing: isAr ? "0" : "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  {isAr
                    ? "الطب النفسي الشرعي والتدريب السريري"
                    : "Forensic Psychiatry & CASC Education"}
                </span>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                padding: "8px 18px",
                borderRadius: "999px",
                border: "1px solid rgba(197, 160, 89, 0.4)",
                backgroundColor: "rgba(197, 160, 89, 0.1)",
                color: "#c5a059",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              medlexsolutions.com
            </div>
          </div>

          {/* Center: Title & Description */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              maxWidth: "1020px",
            }}
          >
            <div
              style={{
                color: "#ffffff",
                fontSize: title.length > 50 ? "46px" : "56px",
                fontWeight: 800,
                lineHeight: 1.15,
              }}
            >
              {title}
            </div>
            <div
              style={{
                color: "#c7d2de",
                fontSize: "22px",
                lineHeight: 1.4,
                maxWidth: "920px",
              }}
            >
              {description}
            </div>
          </div>

          {/* Bottom Bar: Accents */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              borderTop: "1px solid rgba(255, 255, 255, 0.15)",
              paddingTop: "24px",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "24px",
                color: "#c7d2de",
                fontSize: "15px",
              }}
            >
              <span>{isAr ? "المملكة المتحدة" : "United Kingdom"}</span>
              <span style={{ color: "#c5a059" }}>•</span>
              <span>{isAr ? "مصر" : "Egypt"}</span>
              <span style={{ color: "#c5a059" }}>•</span>
              <span>{isAr ? "قطر" : "Qatar"}</span>
            </div>

            <div
              style={{
                color: "#c5a059",
                fontSize: "15px",
                fontWeight: 600,
                fontStyle: "italic",
              }}
            >
              {isAr
                ? "الدقة قبل الطمأنينة. الدليل قبل الادعاء."
                : "Rigour before reassurance. Evidence before assertion."}
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (err) {
    console.error("OG generation error:", err);
    return new Response("Failed to generate OG image", { status: 500 });
  }
}
