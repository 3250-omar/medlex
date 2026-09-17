---
name: react-frontend-design
description: Design, implement, refactor, or review React and TypeScript UI in MedLex. Use for Next.js 16 App Router pages, Tailwind CSS v4 styling, SWR/TanStack Query state, Supabase auth/data, next-intl bilingual localization, and mandatory SEO compliance.
---

# MedLex React Frontend & SEO System

Use this skill for frontend engineering and new route creation in `MedLex`. Follow the repository's existing patterns before introducing a new abstraction. Keep code strictly typed, accessible, bilingual (`en` and `ar`), performant, and SEO-compliant.

## Working Rules

1. Inspect the relevant route, hooks, API helpers, shared components, locale messages, and package scripts before editing.
2. Follow Next.js 16 App Router best practices, Tailwind CSS v4 design tokens, and the dual typography setup (`Source Serif 4` / `Fraunces` for display and `Inter` / `Cairo` for body).
3. Search for reusable components before writing new UI:
   - `components/ui/`
   - `components/layout/`
   - `components/marketing/`
   - feature-specific `_comps/` and `_comp/`
4. Use imperative names for handlers and explicit types for public boundaries. Never add `any` to new or modified code.
5. All visible user text must be localized in both `lib/i18n/translations/en.json` and `lib/i18n/translations/ar.json`.
6. Enforce proper RTL layout and test both English (`en`) and Arabic (`ar`).

---

## Mandatory New-Page SEO Gate

Every new or modified route must satisfy the following 10-step SEO workflow before it is considered complete:

1. **Route Classification**:
   - Classify the route as **public/indexable** or **private/noindex** before implementation.
   - Public examples: marketing pages, pathway guides, public previews, institutional services, legal notices.
   - Private examples: `/auth`, `/login`, `/profile`, `/courses`, `/academy/dashboard`, learner routes.
2. **Registry & Dictionary Registration**:
   - Add every indexable route to the typed SEO registry in `lib/seo/metadata.ts` (`SeoRouteKey` and `SEO_ROUTES_REGISTRY`).
   - Add native English and Arabic entries to the `seo` namespace in `en.json` and `ar.json` (title, description, social text, image alt, breadcrumb label).
3. **Localized Metadata**:
   - Provide a unique localized title, intent-focused description, absolute canonical on `https://medlexsolutions.com`, reciprocal `hreflang` (`en`, `ar`), `x-default`, Open Graph card, and Twitter `summary_large_image`.
   - Never use relative canonicals or missing language alternates.
4. **Structured Data & Breadcrumbs**:
   - Emit truthful, page-specific JSON-LD schemas using `lib/seo/schema.ts` (e.g. `WebSite`, `Organization`, `ProfilePage`, `Course`, `FAQPage`, `BreadcrumbList`).
   - Add visible localized breadcrumbs to nested routes matching the `BreadcrumbList` schema.
   - Never fabricate ratings, credentials, review counts, prices, or claims absent from the visible page.
5. **Sitemap & Crawl Policy**:
   - Indexable routes must be registered for sitemap inclusion in `app/sitemap.ts` with maintained `lastModified` dates. Never emit `new Date()` per request.
   - Never add private, duplicate, redirect, parameterized, or account URLs to the sitemap.
6. **On-Page Semantics & Content**:
   - Render the correct document language and direction (`lang` and `dir`).
   - Ensure exactly one visible, meaningful `<h1>` per page. Maintain logical `<h2>`/`<h3>` hierarchy.
   - Avoid hidden "SEO copy" or keyword stuffing.
   - Ensure Arabic routes have fully localized visible body content, not Arabic metadata over English body text.
7. **Canonical Sanitation**:
   - Keep canonical URLs clean of query parameters, tracking tags, hashes, and session state.
8. **Next.js Server Metadata API**:
   - Use Next.js server metadata exports (`export const metadata` or `generateMetadata`); never add client-side `<Head>` tags or third-party SEO wrappers.
9. **Internal Linking & Accessibility**:
   - Use localized anchor links (e.g. `/${locale}/pathways/...`).
   - Provide meaningful anchor text (avoid generic "click here" or "learn more").
   - Give informative images localized `alt` attributes; decorative images use `alt=""`.
   - Reserve `priority` only for above-the-fold LCP images.
10. **Automated Verification**:
    - Run `npm run seo:check`, `npm run lint`, `npx tsc --noEmit`, and `npm run build` to verify correctness.

---

## Protected Learning Page Rule

Every new academy, lesson, assessment, completion, certificate, progress, or downloadable learning route must default to noindex, remain absent from the sitemap, enforce course authorization, avoid public schema and social previews, expose no assessment data through metadata, and receive localized browser metadata and accessible semantic structure.

A new public lesson synopsis is a separate route and must pass the complete public SEO checklist.

---

## Review Checklist

### SEO & Discovery
- [ ] Route is classified (public/indexable or private/noindex).
- [ ] Public routes are in `SEO_ROUTES_REGISTRY` and both translation dictionaries.
- [ ] Canonical URL is absolute on `https://medlexsolutions.com`.
- [ ] Reciprocal `en`, `ar`, and `x-default` alternate links are present.
- [ ] Page has exactly one visible `<h1>` and semantic heading structure.
- [ ] Visible body content is fully localized in Arabic on `ar` routes.
- [ ] Truthful JSON-LD schema is embedded and synchronized with visible content.
- [ ] OpenGraph image and metadata are set.
- [ ] Private routes emit `CASC_PRIVATE_ROBOTS` (`noindex, nofollow, noarchive, nosnippet, noimageindex`) and `X-Robots-Tag` header.

### Performance & Images
- [ ] Raster content images use `next/image` with width/height or sized `fill`.
- [ ] Only above-the-fold LCP images use `priority`.
- [ ] No external font `@import` rules (use `next/font`).

### Quality & Verification
- [ ] `npm run seo:check` passes with zero errors.
- [ ] `npx tsc --noEmit` passes with zero type errors.
- [ ] `npm run lint` passes without errors.
