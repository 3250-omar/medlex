# Research & Decisions: Blogs Feature

## 1. Rich Text Editor
**Decision**: Use `Tiptap` as the core rich text editor component for the admin dashboard.
**Rationale**: Tiptap is a headless wrapper around ProseMirror, which is highly customizable, modern, and works extremely well with React and Tailwind CSS. It allows us to build a reusable, beautiful editor component that seamlessly fits into the shadcn/ui design system.
**Alternatives Considered**: 
- *React-Quill*: Older, less customizable styling, potential issues with React 18 / Next.js SSR.
- *Draft.js*: Deprecated.

## 2. Slug Generation
**Decision**: Use `slugify` package on the backend during creation/update.
**Rationale**: Reliable, handles multiple languages (including Arabic if needed), and standardizes URLs without complex custom regex.
**Alternatives Considered**: Custom regex replace function (prone to edge case errors with international characters).

## 3. SEO Implementation (Next.js 16 App Router)
**Decision**: Utilize Next.js `generateMetadata` API for dynamic blog routes, and embed structured JSON-LD script tags directly in the page component.
**Rationale**: This aligns directly with the project's strict SEO guidelines (dual language support `en`/`ar`, exact canonical links, reciprocal hreflang, openGraph tags, and Twitter summary images).

## 4. Database Migrations
**Decision**: A completely separate database migration file will be created specifically for the `blogs` table.
**Rationale**: Specifically requested as a technical constraint. Keeps deployment history clean and ensures safe rollback/upgrade processes.
