---
name: react-frontend-design
description: Design, implement, refactor, or review React and TypeScript UI in Bloom Admin. Use for Next.js 14 App Router pages, Ant Design components, SWR/Zustand state, reusable feature architecture, accessibility, localization, and frontend performance work.
---

# Bloom Admin React frontend

Use this skill for frontend changes in `E:\Bloom\bloom-admin`. Follow the repository's existing patterns before introducing a new abstraction. Keep code readable, typed, localized, and easy to remove or extend.

## Working rules

1. Inspect the relevant route, hooks, API helpers, shared components, locale messages, and package scripts before editing.
2. Read the current feature plan when `AGENTS.md` or the user points to one. Preserve its API, UX, and verification constraints.
3. Before building any UI, search for reusable components that already achieve the needed behavior or a close variation. Search in this order:
   - `app/[locale]/_comps/ui/`
   - `app/[locale]/_comps/shared/`
   - the feature's `_comps/` and `_hooks/`
   - Ant Design itself
4. Reuse the matching component when it satisfies the requirement. If it is close, extend it with a backward-compatible optional prop or composition slot. If no reusable component can achieve the requirement after this search, create a new component at the narrowest appropriate scope. Do not copy a component for a small visual variation.
5. Keep a change focused. Do not add packages, rename unrelated files, or redesign adjacent flows without a requirement.
6. Use imperative names for handlers and explicit types for public boundaries. Never add `any` to new or modified code.

## Architecture

Use a three-layer feature structure:

```text
feature/
├── page.tsx                 # server entry when possible
├── type.ts                  # domain/API types and unions
├── _api/                    # query and mutation adapters
├── _hooks/                  # data, filter, form, and action logic
└── _comps/                  # presentational components
```

Separate responsibilities as follows:

- **API adapters** call the existing Axios/SWR helpers and normalize response shapes.
- **Hooks** own server state, local state, filters, side effects, and action handlers. Give each hook one clear responsibility and a stable return type.
- **Containers** compose hooks and components, coordinate page-level state, and choose loading/error/empty states.
- **Presenters** receive typed props and render UI. They do not call SWR, Axios, Zustand, routing, or mutation APIs.
- **Utilities** handle pure formatting or mapping only; keep them outside render functions.

Prefer files below about 150 lines. Split a file when it has multiple reasons to change, not merely to hit an arbitrary line count. Never define a named React component inside another component's render function; hoist it to module scope or extract it.

### Client boundaries

- Keep `page.tsx` server-side unless it needs hooks, browser APIs, or event handlers.
- Place `"use client"` at the deepest practical boundary.
- Do not turn a whole route into a client component to support one interactive child.
- Keep server components free of client-only imports.

### Types

- Model finite states with discriminated unions, for example `"idle" | "loading" | "success" | "error"`.
- Use domain types at API boundaries; normalize nullable or inconsistent API data once.
- Derive wrapper props with `ComponentProps`, `Pick`, and `Omit` rather than duplicating Ant Design types.
- Use `unknown` plus a type guard for untrusted data instead of `any`.
- Keep API names and display names distinct when the backend contract uses different terms.
- Type callbacks at the boundary: `onSubmit`, `onChange`, `onOpen`, and `onDelete`.

### Backend contract gaps

When a backend response does not provide data for a specific UI part:

- Keep that part static and presentational. Render the approved label, layout, placeholder, disabled state, or explanatory notice without inventing data.
- Do not calculate, aggregate, convert, estimate, or derive financial values on the client to fill a missing backend field.
- Use `-`, an existing empty state, or a localized “unavailable/not supported” message for missing values.
- Use a fixed display value only when it is explicitly required by the product specification; mark it as temporary/display-only and never include it in mutation payloads.
- Do not infer unsupported actions or call another entity’s mutation as a substitute. Disable submission and explain the limitation when no valid endpoint exists.
- Record every missing field, endpoint, mutation, or contract ambiguity in the final implementation response under **Backend requirements**. Include the expected data/action and the affected UI area.

## Data fetching and state

Use the existing SWR-backed `useQuery`, `usePagination`, and `useMutation` helpers where available. Do not fetch in a component or add a `useEffect` that mirrors remote data into local state.

### API method-to-hook convention

Every new API integration must follow the existing typed hook structure:

- **GET/read endpoint** → add or extend a query hook in the feature's `_api/query.ts` or query-hook module. Use `useQuery` for a single resource and `usePagination` for a paginated resource.
- **POST, PUT, PATCH, or DELETE endpoint** → add or extend an action/mutation hook in `_api/actions.ts` or the feature's action-hook module. Use `useMutation` and return a typed action function with loading/error state.
- Keep request construction and response normalization in the hook/API adapter; components call the hook and never call Axios, `fetch`, or raw endpoints directly.
- Match the existing hook naming and return shape for the resource. Do not create a one-off request pattern when an existing query/action helper can be extended.

- Use array SWR keys for parameterized requests and `null` to disable a request.
- Include every request-affecting value in the key or helper parameters.
- Do not request data for inactive tabs/sections. Mount only the active section when the feature requires this.
- Delay detail/drawer requests until the drawer is open and has a valid target.
- Return normalized data, loading, error, and `refetch`/`mutate` behavior from hooks.
- Use `usePagination` for paginated resources and preserve server pagination metadata.
- Reset to page 1 before applying a filter that changes result scope.
- Keep server data in SWR; keep ephemeral UI state in `useState` or the smallest relevant Zustand store.
- Use Zustand only for genuinely shared client state. Select individual fields, not the whole store.
- Avoid optimistic updates for financial, permission-sensitive, or otherwise irreversible mutations unless the API contract explicitly supports rollback.
- After a successful mutation, revalidate the affected list and dependent statistics. On failure, preserve safe user inputs and show a localized error.

Example request shape:

```ts
interface UseItemsReturn {
  items: Item[];
  pagination: Pagination;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<unknown>;
}

export function useItems(filters: ItemFilters): UseItemsReturn {
  const key = filters.enabled ? ["/items", filters] : null;
  const { data, error, isLoading, mutate } = useQuery<ItemResponse>(key);

  return {
    items: data?.items ?? [],
    pagination: data?.pagination ?? emptyPagination,
    loading: isLoading,
    error: error ?? null,
    refetch: mutate,
  };
}
```

## Components and rendering

Build components as small, composable units with focused props. Prefer composition (`children`, slots, render props) over a growing matrix of boolean variant props.

- Keep business decisions in hooks or containers, not inside table cell JSX.
- Keep repeated mapping/formatting in module-scope functions or utilities.
- Memoize list rows and expensive presenters when their props are stable and the parent updates frequently.
- Stabilize callbacks passed to memoized children with `useCallback` only when it has a measurable or obvious identity benefit.
- Use `useMemo` only for expensive derived data, column factories, or stable descriptors; do not memoize primitive strings or trivial expressions.
- Do not memoize by default. A memo with always-changing props adds complexity without reducing work.
- Give every list item a stable domain key, never an array index.
- Use `loading`, skeleton, empty, error, and retry states deliberately. Do not hide request failures behind an empty list.
- Preserve focus and input state by avoiding conditional remounts and unstable component types.

### Ant Design

- Prefer existing Bloom primitives and Ant Design controls over custom controls.
- Use `theme.useToken()` or existing design tokens; do not hard-code theme colors.
- Use `Form` and its validation for structured forms. Keep submit logic in the container or action hook.
- Use `Table` with a stable `rowKey`, typed `ColumnsType<T>`, server pagination when applicable, and horizontal scrolling for wide data.
- Define static columns at module scope. Use a memoized column factory when callbacks or translations are dependencies.
- Use `Modal`/`Drawer` with `destroyOnClose` when stale form state or detail data would be unsafe.
- Keep destructive or financial actions explicit, disabled while submitting, and protected against duplicate submission.
- Use semantic `Tag` colors and accessible labels; do not encode meaning by color alone.

Example column factory:

```tsx
const makeColumns = (
  t: (key: string) => string,
  onOpen: (id: string) => void,
): ColumnsType<Item> => [
  { key: "name", dataIndex: "name", title: t("name") },
  {
    key: "actions",
    title: t("actions"),
    render: (_, item) => (
      <Button type="link" onClick={() => onOpen(item.id)}>
        {t("open")}
      </Button>
    ),
  },
];
```

## Performance

Optimize request volume and rendered work before adding memoization:

1. Render the active route/section immediately with a lightweight shell.
2. Prevent inactive or invalid requests with `null` SWR keys and conditional mounting.
3. Debounce only high-frequency submitted/search inputs when the product behavior requires it; do not debounce ordinary select changes without a reason.
4. Fetch detail data on demand, especially for drawers and expandable rows.
5. Normalize data once and avoid sorting/filtering the same collection on every render.
6. Keep table columns, static options, and style objects stable when their identity matters.
7. Use pagination or virtualization for large lists; do not render an unbounded collection.
8. Lazy-load genuinely heavy client-only features with `next/dynamic` and an appropriate loading state.
9. Avoid copying server data into state, repeated derived state, unnecessary effects, and broad Zustand subscriptions.
10. Verify with repository checks and, when useful, browser/network inspection: request count, duplicate requests, active-section behavior, and render responsiveness.

Do not apply performance rules mechanically. An inline callback in a small, non-memoized component is acceptable; a `useCallback` chain that obscures simple code is not.

### Images

- Use Next.js `Image` from `next/image` for raster content images instead of a regular `<img>` element. This enables responsive image delivery, automatic sizing support, and lazy loading by default.
- Provide an accurate `width` and `height`, or use `fill` only when the parent has a deliberate positioned container and explicit dimensions. This prevents layout shift.
- Set `sizes` whenever an image is responsive or uses `fill`, matching its rendered breakpoints so the browser does not download an unnecessarily large source.
- Use `priority` only for an image that is visibly above the fold and contributes to the page's LCP. Do not mark list, avatar, or below-the-fold images as priority.
- Give every informative image meaningful localized `alt` text. Use `alt=""` only for truly decorative images.
- For remote image URLs, use the repository's approved Next image remote-pattern configuration. Do not bypass optimization with `unoptimized` unless the source format or a documented integration requires it.
- Use a regular `<img>` only where `next/image` is unsuitable, such as an inline SVG or a third-party component that requires the native element; keep the exception intentional and preserve explicit dimensions where applicable.

## Localization, accessibility, and styling

- Put all user-visible text in the appropriate `messages/en.json` and `messages/ar.json` namespace.
- Use `useTranslations` in client components and the server equivalent where appropriate.
- Test Arabic/RTL layout when changing spacing, icons, tables, drawers, or directional controls.
- Use localized date, number, and currency formatting consistent with existing utilities. Never perform client currency conversion unless the product contract requires it.
- Provide labels for icon-only buttons, meaningful `alt` text, keyboard-accessible controls, visible focus states, and useful error messages.
- Preserve dark/light theme tokens and responsive behavior. Avoid fixed widths that break narrow screens; for wide tables, contain horizontal scrolling.
- Do not use color as the only status signal, and do not expose backend statuses that the UI contract excludes.

## Reuse and file conventions

- Components: PascalCase (`CampaignTable.tsx`)
- Hooks: camelCase with `use` prefix (`useCampaignData.ts`)
- Utilities/types/stores: camelCase (`formatCurrency.ts`, `campaignTypes.ts`)
- Keep feature-local code under the feature route; put cross-feature primitives in the global shared folders.
- Before creating a component, search with `rg` rather than relying on memory:

```powershell
rg -n "StatusBadge|EmptyState|PageSkeleton" app
rg --files app | rg "(_comps|_hooks|messages)"
```

If a new component is justified, place it at the narrowest reuse scope and make the reason clear in the change description or code review—not with noisy comments in production files.

## Review checklist

### Correctness

- [ ] Existing API contracts and mutation payloads are preserved.
- [ ] No new `any`, unsafe casts, fabricated fields, or client-side financial aggregation.
- [ ] Loading, empty, validation, authorization, server error, retry, and success states are handled.
- [ ] Pagination and filter-reset behavior are correct.
- [ ] Mutations cannot submit twice and refresh all affected views.

### Architecture/readability

- [ ] Server/client boundaries are as deep as practical.
- [ ] Presenters are free of fetching, stores, and side effects.
- [ ] Hooks have one responsibility and typed stable returns.
- [ ] Components are focused; helper components are not declared during render.
- [ ] Existing primitives were searched and reused where appropriate.

### Performance

- [ ] Inactive sections and unopened detail panels make no requests.
- [ ] SWR keys include request inputs and avoid duplicate fetches.
- [ ] Large lists are paginated or virtualized.
- [ ] Memoization is limited to stable, high-value boundaries.
- [ ] No unnecessary server-data copies, effects, or broad store subscriptions.
- [ ] Raster content images use `next/image` with an appropriate `alt`, dimensions (or a sized `fill` container), and responsive `sizes` where needed.
- [ ] Only the above-the-fold LCP image uses `priority`; noncritical images retain lazy loading.

### UX and verification

- [ ] English and Arabic messages exist for every new user-visible string.
- [ ] RTL, dark/light themes, keyboard access, and responsive widths were considered.
- [ ] Run the smallest relevant checks, then project checks such as `yarn lint`, `yarn tsc --noEmit`, and `yarn build` when applicable.
- [ ] Report any unverified behavior or environment limitation explicitly.
