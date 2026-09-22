# Comprehensive SEO Plan for MedLex

## Summary

Implement a centralized, bilingual SEO system for every English and Arabic route, using the native Next.js 16 Metadata API. The canonical production origin will be `https://medlexsolutions.com`, targeting UK and MENA search intent equally.

The implementation will cover technical SEO, localized metadata, structured data, social previews, crawl/index controls, on-page semantics, performance, automated validation, and a permanent SEO requirement in the project skill. Next.js supports metadata, social images, sitemap, robots, and locale-aware root layouts natively, so no SEO package is required. [Next.js metadata documentation](https://nextjs.org/docs/app/api-reference/functions/generate-metadata), [Next.js internationalization guide](https://nextjs.org/docs/app/guides/internationalization).

## 1. SEO Foundation and Public Interfaces

- Correct `.agents/skills/react-frontend-design/SKILL.md` so it describes MedLex instead of Bloom Admin, then add the mandatory new-page SEO workflow defined below.
- Make `app/[locale]/layout.tsx` the locale-aware root layout with server-rendered `<html lang="en|ar" dir="ltr|rtl">`; remove the client-only `LocaleDocument` workaround and the redundant root page/layout arrangement.
- Add `generateStaticParams()` for `en` and `ar`, while unsupported locales return a real 404.
- Make locale-less URLs permanently redirect with HTTP 308 to their English equivalent, such as `/` → `/en` and `/founder` → `/en/founder`.
- Standardize `NEXT_PUBLIC_SITE_URL=https://medlexsolutions.com` as the only SEO origin and reuse it for metadata, schema, sitemap, robots, and social images. Align production `APP_ORIGIN` with the same value.
- Extend the SEO utility into a typed route registry:
  - `SeoRouteKey`: finite union of every indexable public page.
  - `SeoRouteConfig`: path, translation key, indexing status, schema type, OG card key, optional content-modified date.
  - `createLocalizedMetadata(locale, routeKey)`: returns title, description, canonical, reciprocal `hreflang`, `x-default`, Open Graph, Twitter, and robots directives.
  - `createBreadcrumbSchema()` and schema builders that produce absolute URLs and sanitized JSON-LD.
- Add an `seo` namespace to both translation dictionaries. Every route receives native English and Arabic titles, descriptions, social text, image alt text, and breadcrumb labels.
- Keep the global title template `%s | MedLex`; use an absolute homepage title: `MedLex | Forensic Psychiatry Education & CASC Training`.
- Do not add obsolete `meta keywords`, fabricated ratings, unsupported credentials, or schema content that is not visibly present on the page.

## 2. Route-Level SEO and Indexing Matrix

All 14 public paths are indexable in both languages, producing 28 sitemap URLs.

| Public path                    | Primary search intent and title phrase                 | Structured data                                            |
| ------------------------------ | ------------------------------------------------------ | ---------------------------------------------------------- |
| `/`                            | Forensic Psychiatry Education & CASC Training          | `WebSite` and `Organization`                               |
| `/founder`                     | Dr Ahmed Abouelghit — Consultant Forensic Psychiatrist | `ProfilePage` with `Person`                                |
| `/pathways`                    | Psychiatry Education Pathways                          | `CollectionPage` and `ItemList` linking the three pathways |
| `/pathways/medico-legal`       | Medicolegal Psychiatry & Expert Report Writing         | `WebPage`/educational programme plus breadcrumbs           |
| `/pathways/casc-academy`       | MRCPsych CASC Preparation & Coaching                   | Truthful `Course` data plus breadcrumbs                    |
| `/pathways/foundations`        | Foundations of Medicolegal Psychiatry                  | Educational programme plus breadcrumbs                     |
| `/institutional`               | Forensic Psychiatry Services for Courts & Institutions | `Service` with MedLex as provider                          |
| `/contact`                     | Courses & Institutional Enquiries                      | `ContactPage` and verified contact points                  |
| `/faq`                         | Courses, CASC & Medicolegal Training FAQ               | `FAQPage`, matching only visible questions and answers     |
| `/academy/preview/station-7-2` | Free MRCPsych CASC Station Preview                     | `LearningResource` plus breadcrumbs                        |
| `/register`                    | Register Your Interest in MedLex Programmes            | `WebPage`                                                  |
| `/privacy-policy`              | Privacy Policy                                         | `WebPage`                                                  |
| `/terms`                       | Terms and Conditions                                   | `WebPage`                                                  |
| `/refund-policy`               | Refund Policy                                          | `WebPage`                                                  |

The following remain excluded from search and the sitemap:

- `/auth`, `/login`, `/profile`, `/courses`
- `/academy`, `/academy/dashboard`
- `/academy/courses/**`, including learning, completion, and certificate routes
- API, webhook, cron, checkout, authentication, generated-asset, error, and 404 endpoints

Private HTML routes will use explicit `noindex, follow`; authentication remains the actual privacy boundary. `robots.txt` will block non-page endpoints such as `/api/` without being used as a substitute for `noindex`. The public station preview will explicitly override the existing academy-wide `noindex`.

## 3. Metadata, Content, Schema, and Discovery

- Write a unique, intent-focused title and natural description for every route and locale:
  - English targets worldwide MRCPsych/CASC searches and UK forensic/medicolegal terminology.
  - Arabic targets Egypt, Qatar, Saudi Arabia, and the wider GCC using natural professional Arabic.
  - Avoid keyword repetition; descriptions summarize the visible page and its intended audience.
- Add self-referencing absolute canonicals and reciprocal `en`, `ar`, and `x-default` alternates to every public page. Google recommends separate language URLs with matching `hreflang` relationships. [Google multilingual-site guidance](https://developers.google.com/search/docs/specialty/international/localized-versions).
- Localize visible content on every indexable Arabic route. In particular, replace the current English-only pathway overview and remaining hardcoded CASC content rather than publishing Arabic metadata over English body content.
- Guarantee one descriptive, visible `<h1>` per public page, logical `<h2>/<h3>` hierarchy, semantic landmarks, and no hidden “SEO copy.”
- Add visible localized breadcrumbs to nested public routes and emit matching `BreadcrumbList` JSON-LD.
- Keep structured data synchronized with visible claims. Course schema will describe only real curricula; it will not claim accreditation, reviews, prices, availability, or institutional relationships absent from the page. [Google structured-data guidelines](https://developers.google.com/search/docs/appearance/structured-data/sd-policies).
- Strengthen internal linking:
  - Link the pathway overview to all three pathway pages.
  - Link CASC pages to the public station preview and back.
  - Add the refund-policy link to the legal footer group.
  - Fix non-localized links such as the founder link currently missing the locale prefix.
  - Use descriptive localized anchor text rather than generic “learn more” text.
- Audit public images for localized meaningful `alt`, explicit dimensions, responsive `sizes`, and appropriate formats. Decorative images use empty alt text.
- Remove the footer image’s global `priority`, reserve priority/preload for the actual page LCP image, and remove the external Google Fonts CSS import in favor of existing `next/font` assets.
- Add a generated 1200×630 branded social card system keyed by locale and route. Every public page gets an absolute OG image URL, localized image text/alt, `og:url`, locale, site name, and `summary_large_image` Twitter metadata. Next.js supports generated social images through its metadata conventions and `ImageResponse`. [Next.js social image documentation](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image).
- Add or derive proper favicon, app icon, and Apple touch icon assets from the approved MedLex emblem.
- Rebuild `sitemap.ts` from the typed registry:
  - Include exactly the 28 canonical public URLs.
  - Include reciprocal English, Arabic, and `x-default` alternates.
  - Exclude private/noindex routes.
  - Use maintained content-modification dates; never emit `new Date()` on every request.
  - Omit guessed priority and change-frequency values.
- Update `robots.ts` with the canonical host and sitemap URL, keep the public preview crawlable, and prevent non-production preview deployments from being indexed.
- Support optional `GOOGLE_SITE_VERIFICATION` and `BING_SITE_VERIFICATION` environment values through root metadata. After production deployment, submit the sitemap and inspect representative English and Arabic URLs in Search Console.

## 4. Permanent New-Page SEO Gate in the Skill

Add a mandatory “SEO for every new route” section to the MedLex frontend skill:

1. Classify the route as public/indexable or private/noindex before implementation.
2. Add every indexable page to the typed SEO registry and both locale dictionaries.
3. Provide a unique localized title, description, canonical, reciprocal `hreflang`, `x-default`, OG/Twitter card, and image alt.
4. Add truthful page-specific JSON-LD and breadcrumbs when applicable.
5. Add indexable routes to the generated sitemap; never add private, duplicate, redirect, filtered, or account URLs.
6. Render the correct document language/direction, exactly one meaningful H1, semantic heading order, localized content, descriptive internal links, and accessible image text.
7. Keep canonical URLs free of hashes, tracking parameters, and session state.
8. Use Next.js server metadata APIs; never add client-side `<Head>` management or an SEO dependency.
9. Never fabricate ratings, testimonials, prices, credentials, dates, availability, or schema properties.
10. Run lint, TypeScript, build, and the SEO validation command before considering a page complete.

The skill review checklist will fail a new page if its SEO classification or required metadata is absent.

## 5. Validation and Acceptance Tests

- Add `npm run seo:check`, implemented without a new dependency, to validate the route registry, dictionaries, sitemap membership, and indexing policy.
- Run `npm run lint`, `npx tsc --noEmit`, `npm run seo:check`, and `npm run build`.
- Against a production build, verify all 28 public URLs:
  - HTTP 200 with the correct server-rendered `lang` and `dir`.
  - Unique non-empty title and description.
  - Absolute canonical on `medlexsolutions.com`.
  - Reciprocal English/Arabic/`x-default` alternates.
  - Index/follow directives.
  - OG/Twitter image endpoint returns 200.
  - JSON-LD parses and references the canonical URL.
- Verify every private route is absent from the sitemap and resolves with `noindex` or an authentication redirect to a noindex page.
- Verify `/sitemap.xml` contains exactly the expected localized public URLs and `/robots.txt` references the production sitemap.
- Test homepage, CASC pathway, institutional page, and public station preview in English and Arabic using Lighthouse; require SEO score 100 and no material performance/accessibility regression.
- Validate representative schema with Google Rich Results Test and Schema.org Validator, including homepage organization, founder, FAQ, CASC, breadcrumbs, and station preview.
- After launch, submit the sitemap, inspect representative URLs in Google Search Console, confirm selected canonicals and language alternates, and monitor indexing, Core Web Vitals, crawl errors, rich-result errors, branded queries, and pathway impressions.

## Assumptions

- The canonical domain is `https://medlexsolutions.com`; `www`, HTTP, and legacy-domain traffic will permanently redirect to it at the hosting/CDN layer.
- English is the `x-default` language.
- The strategy balances worldwide/UK MRCPsych and forensic psychiatry intent with English and Arabic MENA demand.
- All genuine public pages—including the station preview, registration, and legal pages—are indexable; learner, authentication, account, progress, and certificate pages are not.
- Existing credentials and organization details may be reused only where already verified in site content. Unknown social profiles, addresses, accreditation, ratings, and legal organization identifiers remain omitted.
