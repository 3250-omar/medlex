# CASC Educational and Lesson Pages SEO Plan

This document extends the main MedLex SEO plan to cover the protected CASC educational experience, including course pages, individual learning stations, assessments, completion, certificates, and supporting APIs.

## Covered Routes

- `/{locale}/academy/courses/casc-academy`
- `/{locale}/academy/courses/casc-academy/learn/{unitSlug}` for every published station
- `/{locale}/academy/courses/casc-academy/completion`
- `/{locale}/academy/courses/casc-academy/certificate`
- CASC course outline, dashboard, progress, assessment, and downloadable practice-pack endpoints

## Indexing Strategy

- Keep paid educational pages `noindex, nofollow, noarchive, nosnippet, noimageindex`.
- Exclude every lesson, completion, certificate, dashboard, and progress URL from the sitemap.
- Do not emit `hreflang`, public Open Graph cards, or JSON-LD for protected lesson content.
- Add an `X-Robots-Tag` header with the same restrictions to protected lesson HTML and academy API responses.
- Keep only these CASC acquisition pages indexable:
  - `/pathways/casc-academy`
  - `/academy/preview/station-7-2`
- If individual stations later need organic traffic, create separate public synopsis routes without questions, answers, assessments, or paid lesson material. Never make the authenticated lesson URL indexable.

## Dynamic Private Metadata

Add server-generated metadata to every lesson route.

### Authenticated and Enrolled Learner

- Title: `{Unit Code}: {Station Title} | CASC Academy | MedLex`
- Description: the unit summary, truncated safely for browser and history display
- Robots: complete noindex policy

### Unauthenticated or Unauthorized Visitor

- Title: `CASC Academy Lesson | MedLex`
- Do not expose the unit title, summary, assessment, or answer data.
- Robots: complete noindex policy.

### Supporting Pages

- Completion page: `Course Completion | CASC Academy | MedLex`
- Certificate page: `Certificate | CASC Academy | MedLex`
- Course learning dashboard: `CASC Academy Learning Dashboard | MedLex`

Use a server-only summary query that returns only `slug`, `title`, `summary`, `unitCode`, and sequence number. Metadata generation must never request or serialize `content_blocks`, assessments, answer options, feedback, or correct-answer keys.

## Access-Control Hardening

The current unit and outline APIs check authentication but do not visibly verify active course enrolment before returning course material. Add active-enrolment authorization to:

- `app/api/academy/courses/[slug]/units/[unitSlug]/route.ts`
- `app/api/academy/courses/[slug]/outline/route.ts`

Required behavior:

- No session returns `401`.
- A valid session without active CASC enrolment returns `403`.
- An invalid or unpublished unit returns `404`.
- An active enrolment returns the authorized content.
- Correct-answer keys remain server-controlled and are returned only where the assessment workflow requires them.
- Robots directives must not be treated as content protection; authorization is the security boundary.

## `LearningLesson.tsx` Improvements

Update `app/[locale]/(marketing)/academy/_comps/LearningLesson.tsx` as part of the CASC-page work:

- Render the lesson inside a semantic `<main>`.
- Ensure exactly one visible H1:
  - Reuse the database HTML H1 when present.
  - Otherwise render the unit title as the page H1.
  - Prevent duplicate H1 elements when injected content already supplies one.
- Preserve `lang="en" dir="ltr"` on English curriculum content, even inside the Arabic interface. Localize only the surrounding interface unless Arabic lesson content exists.
- Localize loading, error, retry, Previous, Next, locked, remaining-question, completion, navigation labels, and accessible announcements.
- Give lesson navigation a localized `aria-label` and meaningful accessible names.
- Sanitize or strictly validate database HTML before `dangerouslySetInnerHTML`; allow only the elements, attributes, IDs, and data attributes required by the lesson engine.
- Keep headings, sections, questions, tables, images, and form controls semantically accessible after injection.
- Give lesson images explicit dimensions and meaningful alt text where the stored content supports it.
- Preserve the interactive assessment, timer, progress, PDF, and navigation behavior while extracting reusable logic from the large component only where needed for safe rendering and testing.
- Avoid placing personalized progress, scores, answers, or learner information in metadata, URLs, analytics page names, or social previews.

## Public CASC Discovery Content

The indexable CASC landing page should act as the search entry point for all protected lessons:

- Describe the station domains and learning outcomes using visible localized content.
- Link prominently to the free station preview.
- List representative station topics without exposing questions or answers.
- Use `Course` structured data only on the public landing page.
- Reference the provider, audience, educational level, delivery mode, language, and verified instructor information.
- Keep all structured data consistent with visible content and actual availability.

## Permanent Skill Requirement

Add the following protected-learning-page rule to the MedLex frontend skill:

> Every new academy, lesson, assessment, completion, certificate, progress, or downloadable learning route must default to noindex, remain absent from the sitemap, enforce course authorization, avoid public schema and social previews, expose no assessment data through metadata, and receive localized browser metadata and accessible semantic structure.

A new public lesson synopsis is a separate route and must pass the complete public SEO checklist.

## Acceptance Tests

- Every published `unitSlug` returns noindex metadata and an `X-Robots-Tag` header.
- Lesson URLs never appear in `sitemap.xml`.
- Unauthenticated requests redirect or return `401` without exposing unit information.
- Authenticated users without enrolment receive `403`.
- Enrolled users receive the correct lesson and safe browser title.
- No response metadata contains questions, answers, feedback, scores, or learner data.
- Each successfully loaded lesson has one H1 and one main landmark.
- English lesson content retains the correct language direction; English and Arabic interface controls are localized.
- Invalid or unpublished units return a genuine 404.
- Completion and certificate pages remain noindex.
- The CASC landing page and public station preview remain indexable with canonical, bilingual metadata, social images, breadcrumbs, and validated structured data.

## Assumptions

- CASC lesson content is protected educational material and must not be indexed directly.
- English is currently the authored language of the lesson content unless an Arabic curriculum variant is explicitly stored.
- Public organic discovery is handled by the CASC pathway landing page and the free station preview.
- Course authorization is required independently of SEO and crawler directives.
