import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import fs from "node:fs";
import path from "node:path";
import {
  SEO_ROUTES_REGISTRY,
  type SeoRouteKey,
  type Locale,
} from "@/lib/seo/metadata";

export const runtime = "nodejs";

let cachedCairo: Buffer | null = null;
let cachedInter: Buffer | null = null;

function loadFonts() {
  if (!cachedCairo) {
    try {
      cachedCairo = fs.readFileSync(
        path.join(process.cwd(), "public", "fonts", "cairo-bold.ttf"),
      );
    } catch {
      // ignore
    }
  }
  if (!cachedInter) {
    try {
      cachedInter = fs.readFileSync(
        path.join(process.cwd(), "public", "fonts", "inter-semi-bold.ttf"),
      );
    } catch {
      // ignore
    }
  }

  const fonts: Array<{
    name: string;
    data: Buffer;
    style: "normal";
    weight: 600 | 700;
  }> = [];

  if (cachedInter) {
    fonts.push({
      name: "Inter",
      data: cachedInter,
      style: "normal",
      weight: 600,
    });
  }
  if (cachedCairo) {
    fonts.push({
      name: "Cairo",
      data: cachedCairo,
      style: "normal",
      weight: 700,
    });
  }

  return fonts;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const paramTitle = searchParams.get("title");
    const paramDescription = searchParams.get("description");
    const paramType = searchParams.get("type"); // e.g. "article" | "page"
    const paramCategory = searchParams.get("category");
    const paramAuthor = searchParams.get("author");
    const routeKey = (searchParams.get("route") ?? "home") as SeoRouteKey;
    const locale = (searchParams.get("locale") ?? "en") as Locale;

    const isAr = locale === "ar";
    const isArticle = paramType === "article" || paramType === "blog";

    let title = paramTitle || "";
    let description = paramDescription || "";
    const category =
      paramCategory ||
      (isArticle
        ? isAr
          ? "مقال تحليلي متخصص"
          : "MEDLEX EDITORIAL INSIGHT"
        : "");

    const author =
      paramAuthor || (isAr ? "د. أحمد أبو الغيط" : "Dr. Ahmed Abouelghit");

    if (!title) {
      const config = SEO_ROUTES_REGISTRY[routeKey] ?? SEO_ROUTES_REGISTRY.home;
      const translationKey = config.translationKey;
      title = isAr ? "ميدليكس" : "MedLex";
      description = isAr
        ? "الطب النفسي الشرعي والتدريب السريري التخصصي"
        : "Forensic Psychiatry Education & CASC Training";

      try {
        const messages = (
          await import(`@/lib/i18n/translations/${locale}.json`)
        ).default;
        const seoData = messages?.seo?.[translationKey];
        if (seoData) {
          title = seoData.ogTitle || seoData.title || title;
          description =
            seoData.ogDescription || seoData.description || description;
        }
      } catch {
        // Fallback to default branding
      }
    }

    // Clean and clamp strings
    const displayTitle = title.length > 95 ? `${title.slice(0, 92)}...` : title;
    const displayDescription =
      description.length > 175
        ? `${description.slice(0, 172)}...`
        : description;

    const fonts = loadFonts();

    return new ImageResponse(
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#08121f",
          backgroundImage:
            "radial-gradient(circle at 50% 0%, rgba(197, 160, 89, 0.15) 0%, rgba(8, 18, 31, 0.98) 75%)",
          padding: "54px 64px",
          fontFamily: isAr ? "Cairo, sans-serif" : "Inter, sans-serif",
          direction: isAr ? "rtl" : "ltr",
          border: "8px solid #c5a059",
        }}
      >
        {/* Top Bar: Brand & Badges */}
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
                borderRadius: "12px",
                backgroundColor: "#11253e",
                border: "2px solid #c5a059",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#c5a059",
                fontSize: "26px",
                fontWeight: 800,
                boxShadow: "0 0 20px rgba(197, 160, 89, 0.2)",
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
                  fontSize: "13px",
                  fontWeight: 600,
                  letterSpacing: isAr ? "0" : "0.08em",
                  textTransform: "uppercase",
                }}
              >
                {isAr
                  ? "الطب النفسي الشرعي والتدريب السريري"
                  : "Forensic Psychiatry & CASC Education"}
              </span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {category && (
              <div
                style={{
                  display: "flex",
                  padding: "7px 16px",
                  borderRadius: "999px",
                  border: "1px solid rgba(197, 160, 89, 0.45)",
                  backgroundColor: "rgba(197, 160, 89, 0.12)",
                  color: "#c5a059",
                  fontSize: "13px",
                  fontWeight: 700,
                  letterSpacing: isAr ? "0" : "0.05em",
                }}
              >
                {category}
              </div>
            )}
            <div
              style={{
                display: "flex",
                padding: "7px 16px",
                borderRadius: "999px",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                color: "#e2e8f0",
                fontSize: "13px",
                fontWeight: 600,
              }}
            >
              medlexsolutions.com
            </div>
          </div>
        </div>

        {/* Center: Title & Description & Author */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "18px",
            maxWidth: "1060px",
            margin: "auto 0",
          }}
        >
          <div
            style={{
              color: "#ffffff",
              fontSize: displayTitle.length > 55 ? "42px" : "52px",
              fontWeight: 800,
              lineHeight: 1.25,
            }}
          >
            {displayTitle}
          </div>

          {displayDescription && (
            <div
              style={{
                color: "#c7d2de",
                fontSize: "20px",
                lineHeight: 1.45,
                maxWidth: "960px",
              }}
            >
              {displayDescription}
            </div>
          )}

          {isArticle && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginTop: "8px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "6px 14px",
                  borderRadius: "8px",
                  backgroundColor: "rgba(197, 160, 89, 0.1)",
                  border: "1px solid rgba(197, 160, 89, 0.25)",
                  color: "#c5a059",
                  fontSize: "15px",
                  fontWeight: 600,
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#c5a059"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
                <span>{author}</span>
                <span style={{ color: "rgba(255, 255, 255, 0.3)" }}>|</span>
                <span
                  style={{
                    color: "#94a3b8",
                    fontSize: "13px",
                    fontWeight: 500,
                  }}
                >
                  {isAr
                    ? "استشاري الطب النفسي الشرعي"
                    : "Consultant Forensic Psychiatrist"}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Bar: Regions & Motto */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            borderTop: "1px solid rgba(255, 255, 255, 0.15)",
            paddingTop: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "20px",
              color: "#c7d2de",
              fontSize: "14px",
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
              fontSize: "14px",
              fontWeight: 600,
              fontStyle: "italic",
            }}
          >
            {isAr
              ? "الدقة قبل الطمأنينة. الدليل قبل الادعاء."
              : "Rigour before reassurance. Evidence before assertion."}
          </div>
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
        fonts: fonts.length > 0 ? fonts : undefined,
      },
    );
  } catch (err) {
    console.error("OG generation error:", err);
    return new Response("Failed to generate OG image", { status: 500 });
  }
}
