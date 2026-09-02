# MedLex Implementation Checklist

**Status key:** `[x]` completed and evidenced in the repository; `[ ]` pending or not yet verified.  This checklist was audited on 2 September 2026 against the current working tree. A completed task does not close its phase until its acceptance criteria and quality gate are also complete.
## Active Phase 1 update — 2 September 2026

- [x] Strengthened mobile navigation keyboard behavior: focus moves into the menu, cycles within it, Escape closes it, and focus returns to the menu trigger.
- [x] Ensured the mobile-menu close control meets the 44px minimum target and added horizontal overflow containment at the document level.
- [x] Verified the current build with `yarn.cmd lint` (0 errors, 5 existing theme-related warnings), `yarn.cmd exec tsc --noEmit`, and `yarn.cmd build`.
- [ ] Add the formatter: Prettier download is currently blocked by an npm registry TLS certificate-verification error.
- [x] Captured homepage browser screenshots at 320, 375, 414, 768, 1024, and 1440px in `artifacts/phase1-home-*.png`.
- [ ] Review the captures against the prototype and complete interactive responsive/keyboard QA.

## Phase 1 — Static website and visual system

- [x] Establish the `app/[locale]` route segment, marketing route group, route-private `_comp` folders, root providers, and TypeScript path aliases.
- [x] Configure Next.js App Router, Tailwind CSS 4, shadcn/ui primitives, Manrope/Ovo fonts, ESLint, and strict TypeScript.
- [ ] Add and document a formatting tool/configuration.
- [x] Define editorial design tokens for the prototype palette, typography, borders, motion, and content width.
- [x] Build the shared shell: header/navigation, mobile menu, footer, containers, buttons, dialogs, form styling, keyboard focus, and reduced-motion behavior.
- [x] Implement the Home, Founder, Pathways, three pathway-detail, course-detail, Institutional, Contact, Register, FAQ, Privacy, Terms, and Refund Policy public routes.
- [x] Provide static Academy, dashboard, and course-detail preview routes.
- [x] Add responsive layout rules for small, tablet, and desktop breakpoints.
- [x] Keep page composition server-first and isolate interactive UI in Client Components.
- [x] Add restrained reveal and hero motion with a reduced-motion fallback.
- [ ] Complete desktop and mobile visual comparison against the supplied prototype.

### Phase 1 acceptance and quality gate

- [ ] Confirm no starter UI remains.
- [ ] Sign off that all layout, palette, typography, spacing, borders, and motion match the prototype.
- [ ] Verify no horizontal overflow from 320px upward.
- [ ] Complete keyboard-navigation QA across menus, dialogs, forms, and accordions.
- [ ] Record Lighthouse targets: Performance 90+ and Accessibility/Best Practices 95+ for key public pages.
- [x] Lint completed successfully on 2 September 2026 (0 errors; 5 warnings remain).
- [x] TypeScript validation and the production build passed on 2 September 2026.

## Phase 2 — Translations, RTL, and themes

- [x] Implement `en` and `ar` locale routing through `app/[locale]`.
- [x] Add server-loaded English and Arabic translation dictionaries.
- [x] Set locale-aware document language and direction through the locale document component.
- [x] Add a persisted theme provider and theme toggle using semantic light/dark tokens.
- [ ] Ensure every visible interface string is owned by a message/content file.
- [ ] Add locale-aware links, metadata, dates, numbers, and validation messages.
- [ ] Test English course content inside Arabic application chrome.
- [x] Verify equivalent-route language switching.
- [ ] QA RTL navigation, directional icons, forms, tables, and all EN/AR/light/dark combinations.
- [ ] Verify contrast in both themes and eliminate first-paint theme flashing.

## Phase 3 — Supabase schema, Storage, and security foundation

- [x] Add Supabase browser, server, and server-only admin client utilities.
- [x] Add an initial migration for profiles, roles, courses, published-course access, profile policies, admin policies, and profile creation on signup.
- [x] Add a representative seed file and generated database type file.
- [ ] Create/record development, staging, and production Supabase projects.
- [ ] Extend migrations for course versions/pages/questions, enrolments/access periods, progress/attempts, orders/transactions/webhooks, points/coupons, certificates/gifts, feedback, enquiries, and audit logs.
- [ ] Create public-media and private course/gift/certificate Storage buckets.
- [ ] Add all required RLS policies and automated cross-learner RLS tests.
- [ ] Implement authorized short-lived signed URLs for private assets.
- [ ] Verify migrations and seeds reproduce a clean environment.

## Phase 4 — Authentication, profiles, and protected route groups

- [x] Sign-in and registration tabs in the interest modal, backed by TanStack Query mutations and Supabase Auth Route Handlers.
- [x] Redirect successful authenticated sessions to the localized courses page.
- [x] Protect Academy routes in `proxy.ts`; unauthenticated users are redirected to the localized sign-in modal.
- [x] Cookie session refresh with `@supabase/ssr` and `proxy.ts`.
- [ ] Verify a real sign-up/sign-in and email-confirmation flow against the configured Supabase project.

- [ ] Registration, verification, login/logout, and password recovery/reset flows.
- [ ] Cookie session refresh with `@supabase/ssr` and `proxy.ts`.
- [ ] Profile onboarding and account settings.
- [ ] Server protection for Academy, account, and admin layouts.
- [ ] Role enforcement in UI, server services, Route Handlers, and RLS.
- [ ] Validated return URLs and open-redirect protection.
- [ ] Loading, unauthorized, expired-session, and recovery states.
- [ ] Complete Phase 4 acceptance criteria.

## Phase 5 — Server data layer, Route Handlers, and TanStack Query

- [x] Add the TanStack Query dependency and a root providers component.
- [x] Add an initial course API route and marketing course query module.
- [ ] Verify the providers component owns one browser QueryClient.
- [ ] Add feature-owned query-key factories, typed fetchers, and consistent error envelopes.
- [ ] Validate every Route Handler/Server Action with Zod.
- [ ] Add shared auth, admin, rate-limit, request-ID, and error-mapping helpers.
- [ ] Add safe prefetch/hydration, targeted invalidation, and optimistic-update conventions.
- [ ] Add structured, secret-safe logs and complete Phase 5 acceptance criteria.

## Phase 6 — Courses, enrolments, and learner Academy

- [ ] Dynamic catalogue/public course data with revalidation.
- [ ] Course access state machine and learner dashboard.
- [ ] Sequential, resumable learning pages, completion rules, Exam/Learn modes, and server-side answer validation.
- [ ] Atomic completion, points, certificates, authorized downloads, feedback, and social actions.
- [ ] Complete learner journey end-to-end tests and acceptance criteria.

## Phase 7 — Paymob integration

- [ ] Test/live credentials and integration IDs.
- [ ] Authoritative server-side payment-intention creation and pending order creation.
- [ ] Hosted/Unified Checkout redirect.
- [ ] HMAC-verified, idempotent Paymob webhook handling.
- [ ] Verified-callback-only enrolment activation and internal status polling.
- [ ] Payment history, reconciliation, and sandbox/error-path testing.
- [ ] Complete Phase 7 acceptance criteria.

## Phase 8 — Admin management

- [ ] Operations dashboard and learner table/details.
- [ ] Course, versioned content/questions, coupon, feedback-template, gift, and payment-reconciliation management.
- [ ] Controlled manual access adjustments and audit trail for every material admin action.
- [ ] Complete Phase 8 acceptance criteria.

## Phase 9 — SEO, accessibility, performance, analytics, and security

- [ ] Metadata, canonicals, Open Graph, social images, and structured data.
- [ ] Localized sitemap, robots, hreflang, and private-route noindex controls.
- [ ] Accessibility and reduced-motion audit.
- [ ] Image/font/bundle optimization, caching, revalidation, and Core Web Vitals review.
- [ ] Privacy-respecting analytics, monitoring, CSP/security headers, rate limiting, dependency audit, and secret scanning.
- [ ] Final policy review and Phase 9 acceptance criteria.

## Phase 10 — Testing, staging, deployment, and launch

- [ ] Unit, integration/RLS, and end-to-end coverage for all critical flows.
- [ ] Browser, responsive, EN/AR, RTL, theme, and accessibility QA.
- [ ] Staging environment with Paymob sandbox and production-equivalent policies.
- [ ] Production environment, DNS/email/Storage/backups/monitoring/alerts.
- [ ] Migration, rollback, restore, launch, and smoke-test runbooks.
- [ ] CI quality gates and all Phase 10 acceptance criteria.

## Cross-phase engineering rules

- [x] Strict TypeScript is enabled.
- [x] The project uses server-first App Router pages and route-private component folders.
- [x] Global reduced-motion and visible focus treatment are present.
- [ ] Audit product code for `any`, thin route files, server-authoritative business rules, complete async states, and trust-boundary validation.
- [ ] Complete all phase quality gates: type check, tests, production build, responsive QA, accessibility, security/privacy review, documentation, and secret-data review.
