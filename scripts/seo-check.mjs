#!/usr/bin/env node

/**
 * MedLex Automated SEO Validation Suite
 * Validates route registry, dictionaries, sitemap membership, and indexing policies.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const CANONICAL_HOST = "https://medlexsolutions.com";

const EXPECTED_ROUTES = [
  { key: "home", path: "" },
  { key: "founder", path: "/founder" },
  { key: "pathways", path: "/pathways" },
  { key: "pathwayMedicoLegal", path: "/pathways/medico-legal" },
  { key: "pathwayCascAcademy", path: "/pathways/casc-academy" },
  { key: "pathwayFoundations", path: "/pathways/foundations" },
  { key: "institutional", path: "/institutional" },
  { key: "contact", path: "/contact" },
  { key: "faq", path: "/faq" },
  { key: "stationPreview", path: "/academy/preview/station-7-2" },
  { key: "register", path: "/register" },
  { key: "privacy", path: "/privacy-policy" },
  { key: "terms", path: "/terms" },
  { key: "refundPolicy", path: "/refund-policy" },
];

let failed = false;

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    failed = true;
  } else {
    console.log(`✅ PASS: ${message}`);
  }
}

console.log("=== MedLex SEO Validation Suite ===\n");

// 1. Validate Route Registry in lib/seo/metadata.ts
console.log("--- 1. Checking SEO Route Registry ---");
const metadataFilePath = path.join(rootDir, "lib", "seo", "metadata.ts");
assert(fs.existsSync(metadataFilePath), "lib/seo/metadata.ts exists");

const metadataContent = fs.readFileSync(metadataFilePath, "utf8");
assert(
  metadataContent.includes(CANONICAL_HOST),
  `Canonical host ${CANONICAL_HOST} defined in metadata.ts`,
);

for (const route of EXPECTED_ROUTES) {
  assert(
    metadataContent.includes(`key: "${route.key}"`) ||
      metadataContent.includes(`${route.key}:`),
    `Route '${route.key}' is present in SEO_ROUTES_REGISTRY`,
  );
  assert(
    metadataContent.includes(`path: "${route.path}"`),
    `Route '${route.key}' has expected path '${route.path}' in SEO_ROUTES_REGISTRY`,
  );
}

// 2. Validate Translation Dictionaries (en.json and ar.json)
console.log("\n--- 2. Checking Localized SEO Dictionaries ---");
const enPath = path.join(rootDir, "lib", "i18n", "translations", "en.json");
const arPath = path.join(rootDir, "lib", "i18n", "translations", "ar.json");

assert(fs.existsSync(enPath), "en.json exists");
assert(fs.existsSync(arPath), "ar.json exists");

const en = JSON.parse(fs.readFileSync(enPath, "utf8"));
const ar = JSON.parse(fs.readFileSync(arPath, "utf8"));

assert(typeof en.seo === "object" && en.seo !== null, "en.json has 'seo' namespace");
assert(typeof ar.seo === "object" && ar.seo !== null, "ar.json has 'seo' namespace");

for (const route of EXPECTED_ROUTES) {
  const enEntry = en.seo?.[route.key];
  const arEntry = ar.seo?.[route.key];

  assert(
    Boolean(enEntry && enEntry.title && enEntry.title.trim().length > 0),
    `[EN] Route '${route.key}' has valid non-empty title`,
  );
  assert(
    Boolean(enEntry && enEntry.description && enEntry.description.trim().length > 0),
    `[EN] Route '${route.key}' has valid non-empty description`,
  );
  assert(
    Boolean(arEntry && arEntry.title && arEntry.title.trim().length > 0),
    `[AR] Route '${route.key}' has valid non-empty title`,
  );
  assert(
    Boolean(arEntry && arEntry.description && arEntry.description.trim().length > 0),
    `[AR] Route '${route.key}' has valid non-empty description`,
  );
}

// 3. Validate Sitemap Implementation
console.log("\n--- 3. Checking Sitemap Structure ---");
const sitemapFilePath = path.join(rootDir, "app", "sitemap.ts");
assert(fs.existsSync(sitemapFilePath), "app/sitemap.ts exists");

const sitemapContent = fs.readFileSync(sitemapFilePath, "utf8");
assert(
  sitemapContent.includes("SEO_ROUTES_REGISTRY"),
  "sitemap.ts imports and maps over SEO_ROUTES_REGISTRY",
);
assert(
  !sitemapContent.includes("new Date()"),
  "sitemap.ts uses maintained dates and does NOT call dynamic new Date()",
);
assert(
  !sitemapContent.includes("priority:"),
  "sitemap.ts omits guessed priority attributes",
);
assert(
  !sitemapContent.includes("changeFrequency:"),
  "sitemap.ts omits guessed changeFrequency attributes",
);

// 4. Validate Robots Implementation
console.log("\n--- 4. Checking Robots Directives ---");
const robotsFilePath = path.join(rootDir, "app", "robots.ts");
assert(fs.existsSync(robotsFilePath), "app/robots.ts exists");

const robotsContent = fs.readFileSync(robotsFilePath, "utf8");
assert(
  robotsContent.includes("/sitemap.xml"),
  "robots.ts references canonical sitemap.xml",
);
assert(
  robotsContent.includes("/en/academy/preview/station-7-2") &&
    robotsContent.includes("/ar/academy/preview/station-7-2"),
  "robots.ts explicitly keeps the public station preview crawlable",
);
assert(
  robotsContent.includes("/api/"),
  "robots.ts disallows /api/ endpoint",
);

// 5. Validate Root Layout and Clean Architecture
console.log("\n--- 5. Checking Root Layout Architecture ---");
const rootLayoutPath = path.join(rootDir, "app", "layout.tsx");
const localeLayoutPath = path.join(rootDir, "app", "[locale]", "layout.tsx");
const rootPagePath = path.join(rootDir, "app", "page.tsx");
const localeDocPath = path.join(rootDir, "components", "i18n", "LocaleDocument.tsx");

assert(!fs.existsSync(rootLayoutPath), "Redundant app/layout.tsx has been removed");
assert(!fs.existsSync(rootPagePath), "Redundant app/page.tsx has been removed");
assert(!fs.existsSync(localeDocPath), "Client-only LocaleDocument.tsx workaround removed");
assert(fs.existsSync(localeLayoutPath), "app/[locale]/layout.tsx is the sole root layout");

const localeLayoutContent = fs.readFileSync(localeLayoutPath, "utf8");
assert(
  localeLayoutContent.includes("<html") &&
    localeLayoutContent.includes("lang={locale}") &&
    localeLayoutContent.includes("dir={locale === \"ar\" ? \"rtl\" : \"ltr\"}"),
  "app/[locale]/layout.tsx server-renders <html lang=... dir=...>",
);
assert(
  localeLayoutContent.includes("generateStaticParams"),
  "app/[locale]/layout.tsx exports generateStaticParams for 'en' and 'ar'",
);

// 6. Validate Proxy Redirects (HTTP 308)
console.log("\n--- 6. Checking Middleware Redirect Policy ---");
const proxyPath = path.join(rootDir, "proxy.ts");
const proxyContent = fs.readFileSync(proxyPath, "utf8");
assert(
  proxyContent.includes("308"),
  "proxy.ts uses HTTP 308 permanent redirect for locale-less URLs",
);

// 7. Validate Station Preview Indexing Override
console.log("\n--- 7. Checking Station Preview Override ---");
const stationPreviewPath = path.join(
  rootDir,
  "app",
  "[locale]",
  "(marketing)",
  "academy",
  "preview",
  "station-7-2",
  "page.tsx",
);
const stationPreviewContent = fs.readFileSync(stationPreviewPath, "utf8");
assert(
  stationPreviewContent.includes("createLocalizedMetadata") &&
    stationPreviewContent.includes("stationPreview"),
  "Station preview explicitly overrides parent academy noindex with localized metadata",
);

// 8. Validate OpenGraph Card API Route
console.log("\n--- 8. Checking OG Social Card Generator ---");
const ogRoutePath = path.join(rootDir, "app", "api", "og", "route.tsx");
assert(fs.existsSync(ogRoutePath), "app/api/og/route.tsx exists");
const ogContent = fs.readFileSync(ogRoutePath, "utf8");
assert(
  ogContent.includes("ImageResponse"),
  "app/api/og/route.tsx uses Next.js ImageResponse for 1200x630 card generation",
);

// 9. Validate CASC Educational SEO & Private Indexing
console.log("\n--- 9. Checking CASC Educational SEO Hardening ---");
assert(
  metadataContent.includes("CASC_PRIVATE_ROBOTS"),
  "metadata.ts exports CASC_PRIVATE_ROBOTS policy",
);
assert(
  metadataContent.includes("noarchive: true") &&
    metadataContent.includes("nosnippet: true") &&
    metadataContent.includes("noimageindex: true"),
  "CASC_PRIVATE_ROBOTS enforces noarchive, nosnippet, and noimageindex",
);

const certLayoutPath = path.join(
  rootDir,
  "app",
  "[locale]",
  "(marketing)",
  "academy",
  "courses",
  "[slug]",
  "certificate",
  "layout.tsx",
);
assert(
  fs.existsSync(certLayoutPath),
  "Certificate layout exists for private metadata generation",
);
const certLayoutContent = fs.readFileSync(certLayoutPath, "utf8");
assert(
  certLayoutContent.includes("generateMetadata") &&
    certLayoutContent.includes("CASC_PRIVATE_ROBOTS"),
  "Certificate layout exports generateMetadata with CASC_PRIVATE_ROBOTS",
);

const apiRoutesToCheck = [
  path.join(
    rootDir,
    "app",
    "api",
    "academy",
    "courses",
    "[slug]",
    "units",
    "[unitSlug]",
    "route.ts",
  ),
  path.join(
    rootDir,
    "app",
    "api",
    "academy",
    "courses",
    "[slug]",
    "outline",
    "route.ts",
  ),
  path.join(
    rootDir,
    "app",
    "api",
    "academy",
    "courses",
    "[slug]",
    "certificate",
    "route.ts",
  ),
  path.join(
    rootDir,
    "app",
    "api",
    "academy",
    "courses",
    "[slug]",
    "certificate",
    "pdf",
    "route.ts",
  ),
  path.join(
    rootDir,
    "app",
    "api",
    "academy",
    "courses",
    "[slug]",
    "feedback",
    "route.ts",
  ),
  path.join(
    rootDir,
    "app",
    "api",
    "academy",
    "courses",
    "[slug]",
    "units",
    "[unitSlug]",
    "complete",
    "route.ts",
  ),
  path.join(
    rootDir,
    "app",
    "api",
    "academy",
    "courses",
    "[slug]",
    "units",
    "[unitSlug]",
    "open",
    "route.ts",
  ),
];

for (const apiPath of apiRoutesToCheck) {
  const relName = path.relative(rootDir, apiPath);
  assert(fs.existsSync(apiPath), `${relName} exists`);
  const content = fs.readFileSync(apiPath, "utf8");
  assert(
    content.includes("X-Robots-Tag") &&
      content.includes("noindex, nofollow, noarchive, nosnippet, noimageindex"),
    `${relName} emits complete X-Robots-Tag`,
  );
}

const skillPath = path.join(
  rootDir,
  ".agents",
  "skills",
  "react-frontend-design",
  "SKILL.md",
);
const skillContent = fs.readFileSync(skillPath, "utf8");
assert(
  skillContent.includes("Protected Learning Page Rule"),
  "SKILL.md contains the permanent protected learning page rule",
);

console.log("\n=================================");
if (failed) {
  console.error("❌ SEO Verification Failed with errors.");
  process.exit(1);
} else {
  console.log("🎉 All MedLex SEO validations passed successfully!");
  process.exit(0);
}
