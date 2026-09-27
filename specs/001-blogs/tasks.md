# Implementation Tasks: Blogs

## Phase 1: Foundational Database Setup
**Goal:** Establish the database schema required for the blogs feature.
- [x] T001 Create database migration for the `blogs` table in `e:\freelancing\Medlex System\medllex_admin_dashboard\prisma\migrations\...` (or equivalent schema folder). Ensure constraint: "slug must be globally unique across all blogs." and fields match data-model.md.

## Phase 2: User Story 1 (Admin Dashboard - Creating and Editing an Article)
**Goal:** Admins can manage articles with rich text editing and SEO data.
- [x] T002 [P] [US1] Install required dependencies (`@tiptap/react`, `@tiptap/starter-kit`, `slugify`) in `e:\freelancing\Medlex System\medllex_admin_dashboard\package.json`.
- [x] T003 [P] [US1] Create the API route for creating a blog article in `e:\freelancing\Medlex System\medllex_admin_dashboard\app\api\blogs\route.ts`. Apply validation: "title_en and title_ar must be between 5 and 100 characters" and "slug must match regex `^[a-z0-9]+(?:-[a-z0-9]+)*$`".
- [x] T004 [P] [US1] Create the API route for updating a blog article by ID in `e:\freelancing\Medlex System\medllex_admin_dashboard\app\api\blogs\[id]\route.ts`.
- [x] T005 [P] [US1] Create a reusable Rich Text Editor component using Tiptap in `e:\freelancing\Medlex System\medllex_admin_dashboard\components\ui\editor.tsx`.
- [x] T006 [US1] Create the unified Blog Form component utilizing the editor and SEO fields in `e:\freelancing\Medlex System\medllex_admin_dashboard\components\blogs\blog-form.tsx`.
- [x] T007 [US1] Create the "Create Article" page in `e:\freelancing\Medlex System\medllex_admin_dashboard\app\admin\blogs\create\page.tsx`.
- [x] T008 [US1] Create the "Edit Article" page in `e:\freelancing\Medlex System\medllex_admin_dashboard\app\admin\blogs\[id]\edit\page.tsx`.
- [x] T009 [US1] Update the admin sidebar to include the "Blogs" navigation link in `e:\freelancing\Medlex System\medllex_admin_dashboard\components\layout\sidebar.tsx`.

## Phase 3: User Story 2 (Main Website - Browsing Articles)
**Goal:** Public visitors can see a list of published articles.
- [x] T010 [P] [US2] Create the public backend API endpoint `GET /api/blogs` returning a paginated list as per `contracts/api.md` in `e:\freelancing\Medlex System\medlex\app\api\blogs\route.ts`.
- [x] T011 [US2] Implement the Blogs list page component in `e:\freelancing\Medlex System\medlex\app\[locale]\blogs\page.tsx` displaying the grid/list of articles.
- [x] T012 [US2] Update the main website header navigation to include the "Blogs" link in `e:\freelancing\Medlex System\medlex\components\layout\header.tsx`.

## Phase 4: User Story 3 (Main Website - Reading an Article and SEO)
**Goal:** Visitors can read individual articles which are fully SEO-optimized.
- [x] T013 [P] [US3] Create the public backend API endpoint `GET /api/blogs/:slug` returning a single blog as per `contracts/api.md` in `e:\freelancing\Medlex System\medlex\app\api\blogs\[slug]\route.ts`.
- [x] T014 [US3] Implement the Single Article page component in `e:\freelancing\Medlex System\medlex\app\[locale]\blogs\[slug]\page.tsx` to render the blog content beautifully.
- [x] T015 [US3] Implement Next.js `generateMetadata` in `e:\freelancing\Medlex System\medlex\app\[locale]\blogs\[slug]\page.tsx` to output dynamic SEO metadata (title, description, tags, og_image_url) and bilingual alternate tags.
- [x] T016 [US3] Add JSON-LD Article structured data `<script>` tag within `e:\freelancing\Medlex System\medlex\app\[locale]\blogs\[slug]\page.tsx`.
- [x] T017 [US3] Update the sitemap generator in `e:\freelancing\Medlex System\medlex\app\sitemap.ts` to dynamically include all published blog routes.

## Phase 5: Polish & Cross-Cutting
**Goal:** Ensure everything works seamlessly across languages and devices.
- [x] T018 Verify responsive design and bilingual RTL support in `e:\freelancing\Medlex System\medlex\app\[locale]\blogs\page.tsx` and the single article page.
- [x] T019 Run the SEO validation script on the main website using `npm run seo:check` in `e:\freelancing\Medlex System\medlex`.

## Dependencies
- Phase 1 (Database) must be completed before any API routes (T003, T004, T010, T013) can be tested.
- US1 (Admin creation) is the MVP scope. It must be completed to seed data for testing US2 and US3 realistically.
- T014 depends on T013.

## Parallel Execution Examples
- T002, T003, T004, and T005 can be executed in parallel during Phase 2.
- T010 and T013 (public APIs) can be built in parallel with admin frontend tasks once the database is set up.
