# Search + Filter + Listing Audit — Ronaq Store Web

**Scope:** Home marketplace `/{locale}` (~700k products).  
**Method:** Static code trace of every products/models request path + state ownership. Runtime request counts below include **pre-fix baselines** and **post-fix expected** counts (production `next start`, excluding React StrictMode double-effects). Live verification: `trackMarketplaceProductsRequest` → stdout JSON lines when `NEXT_PUBLIC_MARKETPLACE_REQUEST_LOG=1` or in non-production.

---

## Phase 0 — Current flow

### A. What triggers a products request

| Trigger | Mechanism | File:line | Endpoint |
| --- | --- | --- | --- |
| First paint / SSR | `MarketplaceSection` → `getMarketplaceProducts` | `marketplace-section.tsx:13`, `page.tsx:86-92` | `GET /public/marketplace/products` |
| Debounced search → URL | `useDebouncedUrlSearch` 400ms → `router.replace` → RSC remount | `marketplace-shell.tsx:79-104`, `use-debounced-url-search.ts:6-29` | products (via RSC) |
| Enter / Search all | `navigateHome` → replace | `marketplace-shell.tsx:139-143`, `marketplace-search-bar.tsx:128-141` | products |
| Clear search (x) | `handleClearSearch` → replace | `marketplace-shell.tsx:145-149` | products |
| Model suggestion pick | `handleSelectModel` → replace + `model` | `marketplace-shell.tsx:132-137` | products (`modelKey`) |
| Filter sheet Apply | `applyFilters` → replace + **`rf=Date.now()`** + `router.refresh()` | `marketplace-shell.tsx:159-175` | products (forced fresh) |
| Clear all | same as apply with empty filters + `rf` | `marketplace-shell.tsx:177-193` | products |
| Quick-filter chips | immediate `onChange` → `applyFilters` (+ `rf`) | `quick-filter-chips.tsx:23-28`, `marketplace-shell.tsx:291-294` | products |
| Sort dropdown | `handleSortChange` → `applyFilters` | `marketplace-shell.tsx:195-200` | products |
| Active chip remove | `onChange` → `applyFilters` | `active-filter-chips.tsx` → shell | products |
| City picker save | cookie write + `router.refresh()` | `city-preference-gate.tsx` persist | products (SSR with new city) |
| Infinite scroll | client `fetchMarketplacePage` | `marketplace-product-feed.tsx:89-120` | products `page=N` |
| Autocomplete (not listing) | models search 450ms + AbortController | `marketplace-search-bar.tsx:62-98` | `GET /public/marketplace/models` |

**Does not fetch products:** locale switch (full navigation), theme toggle, opening filter sheet alone, typing before debounce fires, hubs list in city gate (hubs API only).

### B. Where filter / search state lives (multiple copies)

| Store | What | Source |
| --- | --- | --- |
| URL searchParams | `q`, `model`, `condition`, `minPrice`, `maxPrice`, `inStock`, `pta`, `authenticity`, `sort`, `category`, **`rf`** | `page.tsx` + `parseMarketplaceListingFilters` |
| Cookie | city hub id | `CITY_PREFERENCE_COOKIE` via `resolveCityPreferenceFromCookie` |
| Client local | typing buffer `searchQuery` | `useDebouncedUrlSearch` in shell |
| Client local | filter **draft** while sheet open | `filter-sheet.tsx` `draftFilters` |
| Client local | infinite-scroll product array (copy of SSR) | `marketplace-product-feed.tsx` `useState(initialProducts)` |
| Client local | city hubs list / search | `city-preference-gate.tsx` |

### C. Data-fetching approach

- **Page 1:** Next.js App Router **Server Component** (`MarketplaceSection`) → `publicApiRequest` with `{ cache: 'no-store' }` → Nest `GET /public/marketplace/products`.
- **Page 2+:** Client `fetch` same endpoint (`marketplace-product-feed.tsx`).
- **Models autocomplete:** Client fetch + AbortSignal.
- **No TanStack Query / SWR** in this package.
- Listing remount driven by `<Suspense key={suspenseKey}>` on `page.tsx:86` (includes `rf`).

---

## Phase 1 — Findings

| Finding | File:line | Severity | Evidence | Proposed fix |
| --- | --- | --- | --- | --- |
| Forced cache-bust `rf=Date.now()` on every Apply/chip/sort | `marketplace-shell.tsx:168-174` | **high** | Every apply changes URL + Suspense key even when filters unchanged → always remount + network | Drop `rf` unless params actually change; rely on URL key |
| `router.refresh()` after `replace` | `marketplace-shell.tsx:173` | **high** | Double work: navigation already re-runs RSC; refresh forces another round-trip | Remove refresh after replace |
| Suspense `key` includes `rf` → full-grid skeleton every filter change | `page.tsx:58-72,86` | **high** | Soft nav cannot keep previous UI; user sees skeleton flash | Key only on real filter tuple; omit `rf`; use `isPending` dim instead of remount |
| Search state owned by shell → typing re-renders chips/toolbar/children props | `marketplace-shell.tsx:59-65,243-251` | **high** | Any keystroke updates shell state → broad React tree update before URL commit | Local draft text inside search bar; commit only on debounce/Enter/clear |
| Price slider writes draft filters on every drag tick | `marketplace-filter-sidebar.tsx:161-166` | **med** | `onChange` → `commitPriceDraft` every `input` event → heavy draft re-renders | Local slider UI while dragging; commit on pointerup / blur / Enter |
| Quick chips fire apply immediately (no 150ms coalesce) | `quick-filter-chips.tsx:23-28` | **med** | Rapid taps → N navigations + N product fetches | Debounce chip commits 150ms |
| Infinite scroll `loadMore` has no AbortSignal | `marketplace-product-feed.tsx:89-120` | **med** | Fast filter change mid-load can append stale page | Abort previous loadMore; ignore aborted |
| Product `<Link>` defaults to prefetch | `product-card.tsx:227-232` | **med** | Scrolling hundreds of cards can prefetch many product RSC payloads | `prefetch={false}` on marketplace cards |
| Autocomplete effect omits `open` from deps | `marketplace-search-bar.tsx:62-98` | **med** | Opening dropdown with existing query ≥2 may not fetch | Include `open` in deps |
| Search max length 100 vs target 80 | `marketplace-filters.ts:8` | **low** | Spec asks 80 | Cap at 80 |
| No IME composition guards (Urdu/Pashto) | `marketplace-search-bar.tsx` | **med** | Committing mid-composition can corrupt query | `onCompositionStart/End`; skip debounce commit while composing |
| Arabic-script / digit normalization incomplete | `sanitizeMarketplaceText` | **med** | ي/ی ك/ک Eastern digits not normalized | Extend sanitizer |
| Server list copied into client state | `marketplace-product-feed.tsx:73,81-87` | **low** | Extra render on prop sync; needed for append | Keep but avoid redundant sort churn |
| Client re-sorts every page by stock | `marketplace-product-feed.tsx:144-150` | **low** | O(n log n) each append | Prefer server sort or stable partition |
| City hubs refetch every gate open | `city-preference-gate.tsx` open effect | **low** | Expected UX; cacheable | Optional short memory cache |
| Models + products both fire after debounce | search bar + shell | **low** | Intentional (suggestions vs listing) | Keep; ensure min 2 chars for both |

### Baseline request matrix (production build, expected)

| Scenario | Products requests | Models requests | Notes |
| --- | --- | --- | --- |
| Cold load, city cookie set | **1** | 0 | SSR with city from cookie — no All-cities flash if cookie present |
| Cold load, no city cookie | **1** (+ gate UI) | 0 | Gate open; list still loads (all cities) until user picks |
| Type 6 chars then pause | **1** (after 400ms) | **1** (after 450ms if dropdown open) | Should be 1+1, not per keystroke |
| Type with Enter mid-word | **1** immediate | 0–1 | Enter commits URL |
| Open filter sheet, toggle 5 radios, close without Apply | **0** | 0 | Draft only — already correct |
| Apply sheet once | **1** (was 1–2 with refresh+rf) | 0 | After fix: single navigation |
| Tap 3 quick chips rapidly | **3** today → **1** after 150ms debounce | 0 | |
| Scroll load more twice | **2** client | 0 | pages 2–3 |
| Same filters Apply again | **1** today (rf) → **0** after fix | 0 | Identical URL = no-op |

---

## Phase 2 — Fixes applied

| Fix | Status |
| --- | --- |
| Drop `rf` + `router.refresh()`; identical-URL no-op | Done (`marketplace-shell.tsx`) |
| Remove Suspense remount key; dim grid + thin progress while `isPending` | Done (`page.tsx`, shell) |
| Search draft isolated in `MarketplaceSearchBar`; shell only gets commits | Done |
| Debounce ~350ms; Enter/clear immediate; Escape clears; IME composition guards | Done |
| Min 2 chars; empty clears; whitespace ignored; max 80; Arabic normalize | Done (client + backend `sanitizeQueryText`) |
| Price slider: local drag, commit on `onValueCommit` / blur / Enter | Done |
| Quick chips: 150ms debounce coalesce | Done |
| AbortController on infinite-scroll `loadMore` | Done |
| `prefetch={false}` on marketplace product cards | Done |
| Models autocomplete depends on `open` | Done |
| Dev request logger `trackMarketplaceProductsRequest` | Done (`marketplace-request-log.ts`) |
| `parseListingParams` / `serializeListingParams` / stable query key | Done |

**Verify live:** set `NEXT_PUBLIC_MARKETPLACE_REQUEST_LOG=1`, run `next build && next start`, watch console for `[marketplace-products]` lines while exercising the matrix above.

Out of scope for this pass (needs TanStack Query or full client listing rewrite): true `placeholderData` across hard remounts, cursor-based pagination API, approximate count endpoint, recent-searches / autocomplete cache.

## Phase 3 — Negative testing (hostile / wrong user behavior)

| Abuse / mistake | Before | After |
| --- | --- | --- |
| Type while a **model** result is active | Every keystroke called `onClearSearch` → request storm | Draft stays local; model cleared only on commit |
| Debounce blocked while `modelKey` set | Typing never updated URL until Enter | Commit effect no longer bails on `activeModel` |
| Rapid chip taps (Mobiles then In Stock) | Second tap read stale URL filters → dropped first tap | Optimistic chip state accumulates patches |
| Pending chip timer + sheet Apply | Stale chip apply could overwrite sheet | Apply/clear cancels chip debounce |
| URL `?q=a` or `?q=%20` | 1-char / whitespace hit the API | `commitMarketplaceSearchQuery` drops them on the page |
| URL `?category=DROP%20TABLE` | Passed through as category | Category whitelist only |
| `?minPrice=0x10` / `1e5` / `12.5` | Parsed as numbers | Digits-only parser rejects |
| Duplicate Next params (`q=a&q=b`) | Untyped / fragile | `firstSearchParam` takes first non-empty |
| Price inputs cleared then blur | `Number('') === 0` committed | Snap back to last valid draft |
| Emoji past max length | `slice` could split surrogates | `Array.from` / `clampMarketplaceText` |
| loadMore aborted mid-flight | Could leave `loadingRef` stuck | Owner-check + reset on AbortError |
| Backend `q` max 100 vs web 80 | Mismatch | Nest DTO capped at 80 |

Adversarial unit coverage: `src/lib/marketplace-filters.test.ts` (12 cases).
