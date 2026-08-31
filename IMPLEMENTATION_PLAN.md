# MedLex App Router Implementation Plan

## 1. Product and stack

MedLex is one platform with three connected surfaces:

- A public portfolio and institutional website.
- A course storefront and private learner Academy.
- A protected administration area for courses, learners, access, payments, and reporting.

### Agreed technology

- Next.js 16, React 19, TypeScript, and the **App Router**.
- React Server Components by default; Client Components only at interactive boundaries.
- App Router Route Handlers for backend HTTP APIs and webhooks.
- Tailwind CSS 4 for styling.
- shadcn/ui as accessible primitives, fully restyled for MedLex.
- React Bits only for selected, restrained animated components.
- TanStack Query v5 for interactive client-side server state, queries, mutations, polling, caching, and invalidation.
- Supabase Auth, PostgreSQL database, and Storage.
- Paymob Hosted/Unified Checkout with server-created payment intentions and HMAC-verified callbacks.
- Yarn 4 as the package manager declared by the repository.

## 2. App Router architecture

The App Router supports safe colocation. A route segment becomes public only through `page.tsx` or `route.ts`; underscore-prefixed folders are private implementation details and are excluded from routing. Every route can therefore own `_comp` and `_apiCalls` folders exactly as requested.

Route groups separate marketing, authentication, Academy, account, and admin layouts without changing their public URLs.

```text
./
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx
│   │   ├── loading.tsx
│   │   ├── error.tsx
│   │   ├── not-found.tsx
│   │   ├── (marketing)/
│   │   │   ├── page.tsx
│   │   │   ├── _comp/
│   │   │   ├── _apiCalls/
│   │   │   ├── founder/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── _comp/
│   │   │   │   └── _apiCalls/
│   │   │   ├── pathways/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── _comp/
│   │   │   │   ├── _apiCalls/
│   │   │   │   ├── medico-legal/page.tsx
│   │   │   │   ├── casc-academy/page.tsx
│   │   │   │   └── foundations/page.tsx
│   │   │   ├── courses/[slug]/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── loading.tsx
│   │   │   │   ├── _comp/
│   │   │   │   └── _apiCalls/
│   │   │   ├── institutional/
│   │   │   └── contact/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── forgot-password/
│   │   │   └── reset-password/
│   │   ├── (account)/account/
│   │   ├── (academy)/academy/
│   │   └── (admin)/admin/
│   ├── api/
│   │   ├── payments/create-intention/route.ts
│   │   ├── payments/status/[orderId]/route.ts
│   │   ├── webhooks/paymob/route.ts
│   │   └── health/route.ts
│   ├── layout.tsx
│   ├── providers.tsx
│   ├── globals.css
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   ├── ui/                 # shadcn primitives
│   ├── layout/             # global header, footer, navigation, shells
│   ├── shared/             # reusable product components
│   └── motion/             # reviewed React Bits wrappers
├── content/
│   ├── en/
│   └── ar/
├── lib/
│   ├── query/
│   ├── supabase/
│   ├── paymob/
│   ├── seo/
│   └── validation/
├── server/                 # server-only repositories and business services
├── hooks/
├── types/
└── utils/
```

### Responsibilities

- `page.tsx`: thin route composition and server-side initial reads.
- `layout.tsx`: route-family shells, providers, navigation, and metadata defaults.
- `loading.tsx`, `error.tsx`, and `not-found.tsx`: route-level loading and recovery states.
- `route.ts`: HTTP endpoints, webhooks, downloads, and external integrations.
- `_comp`: components private to the nearest route or route family.
- `_apiCalls`: TanStack query keys, client fetchers, mutation functions, and hooks owned by that route.
- `components`: components reused across multiple route families.
- `lib`: configured framework and third-party clients.
- `server`: repositories and business services marked with `import "server-only"` where appropriate.
- `utils`: small pure helpers with no feature ownership.

Recommended `_apiCalls` structure:

```text
_apiCalls/
├── keys.ts
├── queries.ts
├── mutations.ts
├── hooks.ts
└── types.ts
```

Server Components load read-heavy initial data directly through server-only repositories. Client Components use TanStack Query only when they require refetching, mutations, polling, optimistic UI, or cache invalidation. Privileged operations use validated Route Handlers or carefully scoped Server Actions. Paymob secrets and the Supabase service-role key never enter the browser bundle.

## 3. Prototype design system

Phase 1 must reproduce the supplied prototype rather than replace its identity.

```css
--ink: #0b1a2e;
--paper: #f7f5f0;
--surface: #ffffff;
--surface-2: #eee9df;
--line: #d7d0c3;
--text: #10233d;
--muted: #617086;
--accent: #1a365d;
--accent-2: #284a78;
--accent-soft: #e8e0d1;
--signal: #b08d2a;
--font-display: "Ovo", Georgia, serif;
--font-body: "Manrope", system-ui, sans-serif;
--content-max: 1200px;
```

### Design rules

- Preserve the serious editorial and institutional character.
- Use legal-document hierarchy, numbered sections, fine rules, serif statements, and restrained gold details.
- Avoid generic SaaS gradients, playful LMS styling, excessive pills, and floating glass cards.
- shadcn/ui supplies behavior and accessibility, not the visible design identity.
- React Bits is introduced only after static layout approval and must respect `prefers-reduced-motion`.
- Meet 4.5:1 text contrast, visible keyboard focus, semantic landmarks, and 44x44px minimum targets.

## 4. Delivery phases

## Phase 1 — Static website and complete visual system

### Goal

Convert the supplied HTML prototype into a production-quality responsive App Router website with the same design, colors, typography, hierarchy, content, and interaction character. No authentication, database, payment, or private Academy logic is connected yet.

### Work

1. Establish the root-level `app` locale segment, route groups, private route folders, global providers, and aliases.
2. Configure Tailwind CSS 4, shadcn/ui, fonts, linting, formatting, and strict TypeScript.
3. Build semantic design tokens for colors, typography, spacing, borders, shadows, motion, and breakpoints.
4. Build the global shell: skip link, header, navigation, mobile menu, footer, containers, buttons, forms, dialogs, and section primitives.
5. Rebuild Home, Founder, Pathways, the three pathway pages, course detail, institutional services, contact, register-interest, privacy, and terms routes.
6. Recreate static Academy, dashboard, and course-page previews where needed for design approval.
7. Add responsive behavior at 375px, 768px, 1024px, and 1440px.
8. Use Server Components for static page composition and isolate navigation, forms, dialogs, and animation into small Client Components.
9. Add selected React Bits motion only after the non-animated layouts are correct.
10. Perform visual comparisons with the original prototype at desktop and mobile sizes.

### Acceptance criteria

- No starter UI remains.
- Layout, palette, typography, spacing, borders, and motion match the prototype.
- No horizontal overflow from 320px upward.
- Keyboard navigation works across menus, dialogs, forms, and accordions.
- Key public pages target Lighthouse 90+ Performance and 95+ Accessibility/Best Practices before production analytics and payments.
- Lint, TypeScript, and the production build pass.

### Skills

- `ui-ux-pro-max`: design tokens, hierarchy, accessibility, responsive behavior, and visual QA.
- `react-nextjs-patterns`: Server/Client boundaries, component structure, Suspense, state locality, and performance.

## Phase 2 — Translations, RTL, and light/dark themes

### Goal

Provide complete English/Arabic, RTL/LTR, and theme support.

### Work

1. Implement locale routing through `app/[locale]` for `en` and `ar`.
2. Load locale dictionaries on the server instead of duplicating pages.
3. Add locale-aware links, metadata, dates, numbers, and validation messages.
4. Set document language/direction and test English course content inside Arabic application chrome.
5. Add persisted system/light/dark themes through semantic tokens without first-paint flashing.
6. Verify all routes in EN/LTR, AR/RTL, light, and dark combinations.

### Acceptance criteria

- Visible interface strings are owned by content/message files.
- Language switching keeps the equivalent route.
- RTL layout, directional icons, forms, tables, and navigation are correct.
- Both themes meet contrast requirements.

## Phase 3 — Supabase schema, Storage, and security foundation

### Goal

Create the secure backend foundation before exposing dynamic account or course state.

### Work

1. Create development, staging, and production Supabase projects.
2. Configure `@supabase/supabase-js` and `@supabase/ssr` browser/server clients.
3. Create typed browser, cookie-aware server, and server-only service-role utilities.
4. Add migrations for profiles/roles, courses/versions/pages/questions, enrolments/access periods, progress/attempts, orders/transactions/webhook events, points/coupons, certificates/gifts, feedback, enquiries, and audit logs.
5. Create public-media and private course/gift/certificate Storage buckets.
6. Write RLS policies for public catalogue reads, learner ownership, active enrolment access, and admin roles.
7. Generate TypeScript database types and seed representative courses.

### Acceptance criteria

- Migrations and seeds reproduce the environment.
- RLS tests prevent cross-learner access.
- Service-role credentials remain server-only.
- Private assets use short-lived signed URLs after authorization.

## Phase 4 — Authentication, profiles, and protected route groups

### Goal

Implement secure Supabase authentication and role-based access.

### Work

1. Registration, email verification, login, logout, forgotten password, and reset password.
2. Refresh cookie sessions with `@supabase/ssr` and the current Next.js `proxy.ts` convention.
3. Add profile onboarding and account settings.
4. Protect Academy/account/admin layouts on the server.
5. Enforce `user` and `admin` roles in UI, server services, Route Handlers, and RLS.
6. Preserve validated return URLs and reject open redirects.
7. Add loading, unauthorized, expired-session, and recovery states.

### Acceptance criteria

- Protected routes retain valid sessions after refresh.
- Protected data never renders before authorization.
- Learners cannot access admin data through URLs, server actions, API calls, or direct Supabase queries.

## Phase 5 — Server data layer, Route Handlers, and TanStack Query

### Goal

Create predictable server-side services and client-side interactive server state.

### Work

1. Add a client-only Query provider in `app/providers.tsx` with one browser QueryClient.
2. Define feature-owned query-key factories.
3. Add typed internal fetchers and consistent error envelopes.
4. Validate Route Handler and Server Action inputs with Zod.
5. Add reusable auth, admin, rate-limit, request-ID, and error-mapping helpers.
6. Prefer Server Components for initial reads and parallelize independent requests.
7. Add TanStack prefetch/hydration only when an interactive Client Component benefits from an immediately populated cache.
8. Use targeted invalidation and optimistic updates only where rollback is safe.
9. Add structured logs without credentials, tokens, personal case material, or payment secrets.

### Acceptance criteria

- Dynamic screens define loading, empty, error, retry, and success states.
- Server operations validate and authorize independently of the UI.
- No server QueryClient or sensitive cache is shared across requests.
- Privileged business rules cannot be bypassed with direct browser writes.

## Phase 6 — Courses, enrolments, and learner Academy

### Goal

Implement the complete learning workflow.

### Work

1. Dynamic catalogue and public course pages with `generateStaticParams`/revalidation where appropriate.
2. Course state machine: visitor, signed-in/not-enrolled, active, expired, and completed.
3. My Courses dashboard with progress, next action, points, and expiry.
4. Sequential, resumable learning pages.
5. Server-side answer validation without shipping correct answers in initial data.
6. Page completion and next-page unlock rules.
7. Learn Mode, Exam Mode, timers, and review where required.
8. Atomic completion that grants points and issues a certificate only once.
9. Authorized certificate/gift downloads and tracked feedback/social actions.

### Acceptance criteria

- Progress resumes across devices.
- Expired learners retain history but cannot fetch protected content.
- Repeated requests cannot duplicate points, completion, or certificates.
- End-to-end tests cover the complete learner journey.

## Phase 7 — Paymob integration

### Goal

Sell time-limited course access securely through Paymob.

### Work

1. Configure separate Paymob test/live credentials and integration IDs.
2. Create `app/api/payments/create-intention/route.ts` to validate the course/coupon, calculate the authoritative total, create a pending internal order, and create the Paymob intention.
3. Redirect to Hosted/Unified Checkout; MedLex never collects card details.
4. Implement `app/api/webhooks/paymob/route.ts`, read the unmodified request payload, and verify HMAC before processing.
5. Store provider event IDs and process callbacks idempotently.
6. Activate enrolment only from a verified successful backend callback.
7. Handle pending, failed, retried, duplicate, refunded, and voided states.
8. Poll internal payment status after the checkout return while waiting for the callback.
9. Add payment history and admin reconciliation.
10. Test invalid HMAC, duplicate/delayed callbacks, sandbox methods, and amount mismatches.

### Acceptance criteria

- The browser cannot choose the authoritative price or grant access.
- Redirect parameters never mark an order paid.
- Duplicate callbacks never create duplicate enrolments.
- Secrets remain outside client bundles, logs, and committed files.

## Phase 8 — Admin management

### Goal

Give MedLex staff safe control over operations.

### Work

1. Dashboard for enrolment, revenue, completion, expiry, and feedback metrics.
2. Learner table with server-side filters, sorting, and pagination.
3. Learner details with enrolments, progress, payments, points, downloads, and audit history.
4. Course metadata, price, access duration, points, visibility, and gift management.
5. Versioned course content/question management if included in MVP.
6. Coupon and feedback-template management.
7. Payment reconciliation and controlled manual access adjustments.
8. Audit every material admin action.

### Acceptance criteria

- Admin access is enforced through layout checks, services, Route Handlers, and RLS.
- Published course versions remain stable for active learners.
- Financial/destructive operations are confirmed and auditable.

## Phase 9 — SEO, accessibility, performance, analytics, and security

### Goal

Make the public site discoverable and the entire platform safe, measurable, and usable.

### Work

1. Static/dynamic Metadata API output for titles, descriptions, canonicals, Open Graph, and social images.
2. Valid Course, Person, Organization, Breadcrumb, and FAQ structured data.
3. Localized `sitemap.ts`, `robots.ts`, and `hreflang` alternates.
4. Prevent indexing of auth, Academy, checkout, account, and admin routes.
5. Keyboard, screen-reader, contrast, form-error, and reduced-motion audits.
6. Image/font/bundle optimization, dynamic imports, caching, revalidation, and Core Web Vitals review.
7. Privacy-respecting analytics and conversion events.
8. Monitoring, CSP/security headers, rate limiting, dependency audit, and secret scanning.
9. Final privacy, terms, access-expiry, payment, and refund/no-refund policies.

### Acceptance criteria

- Public routes have correct metadata and structured data.
- Private routes are excluded from indexing.
- Critical journeys work without a mouse.
- No critical/high security findings remain.

## Phase 10 — Testing, staging, deployment, and launch

### Goal

Launch with repeatable deployment and recovery procedures.

### Work

1. Unit tests for validation, pricing, access, HMAC, points, and completion.
2. Integration tests for Supabase RLS, repositories, Route Handlers, and Server Actions.
3. End-to-end tests for auth, purchase, callback, Academy, completion, certificate, expiry, and reconciliation.
4. Browser, responsive, EN/AR, RTL, theme, and accessibility QA.
5. Staging with Paymob sandbox and production-equivalent Supabase policies.
6. Production environment variables, DNS, email, Storage, backups, monitoring, and alerts.
7. Migration, rollback, restore, launch, and smoke-test runbooks.

### Acceptance criteria

- CI blocks lint, type, test, and build failures.
- A clean environment deploys from documented steps.
- Backups and a tested restore process exist before launch.
- The production purchase-to-access flow receives an approved smoke test.

## 5. Cross-phase engineering rules

- Use strict TypeScript and avoid `any` in product code.
- Keep `page.tsx`, `layout.tsx`, and `route.ts` thin.
- Components are Server Components by default; add `"use client"` at the smallest interactive boundary.
- Fetch independent server data in parallel and use Suspense/loading boundaries for slower sections.
- Keep business rules in server services and database constraints/transactions.
- Validate every trust boundary, not only browser forms.
- Treat money, access, progress, points, and certificates as server-authoritative state.
- Push client state to the lowest component that owns it and memoize only after measurement.
- Every async experience needs loading, empty, error, retry, and success behavior.
- Do not add animation before semantic structure, responsiveness, and reduced-motion fallback are complete.
- Never collect sensitive case material through general public enquiry forms.

## 6. Quality gate for every phase

A phase closes only when:

1. Its acceptance criteria are complete.
2. Lint, type check, tests, and production build pass.
3. Desktop/mobile QA passes.
4. EN/AR and light/dark QA passes once those systems exist.
5. Accessibility checks pass for changed journeys.
6. Security and privacy impacts are reviewed.
7. Documentation and environment examples are current.
8. No secrets or real personal/payment data are committed.

## 7. Immediate next action

Begin Phase 1 only. Establish the App Router route groups, `[locale]` segment, route-private folders, root providers, and prototype design tokens. Then implement the global shell and homepage as the visual reference. After desktop/mobile approval, reuse those patterns across the other static public routes.

