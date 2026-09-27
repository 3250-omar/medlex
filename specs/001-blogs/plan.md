# Implementation Plan: Blogs

## 1. Technical Context
- **Frameworks**: Next.js 16 (App Router), React, Tailwind CSS v4, shadcn/ui.
- **State Management**: SWR / TanStack Query (as per standard).
- **Internationalization**: next-intl (`en` and `ar`).
- **Dependencies needed**: `tiptap` (or similar for rich text), `slugify`.

## 2. Constitution Check
- Must strictly adhere to the **Mandatory New-Page SEO Gate** from the React Frontend & SEO System.
- Must ensure strict TypeScript typing (no `any`).
- Bilingual support with RTL layout adherence.

## 3. Phase 0: Research & Foundation
- **Research Artifact**: [research.md](./research.md)
- Decisions resolved: Tiptap for Rich Text, Next.js metadata API for SEO, dedicated migration file for the database.

## 4. Phase 1: Design
- **Data Model**: [data-model.md](./data-model.md)
- **API Contracts**: [contracts/api.md](./contracts/api.md)
- **Validation**: [quickstart.md](./quickstart.md)

## 5. Next Steps
Run `/speckit-tasks` to generate a dependency-ordered list of actionable implementation tasks.
