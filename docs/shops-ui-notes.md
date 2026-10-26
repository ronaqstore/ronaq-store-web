# Shops UI redesign notes

Phase 0 audit (read-only). Updated as phases land.

## 1. File inventory

### Explore Shops (`/[locale]/shops`)

| Role | Path |
|------|------|
| Route | `src/app/[locale]/shops/page.tsx` |
| Shell | `src/features/stores/components/store-discovery-shell.tsx` |
| Hero | `src/features/stores/components/store-hero.tsx` |
| Section | `src/features/stores/components/store-discovery-section.tsx` |
| Feed | `src/features/stores/components/store-discovery-feed.tsx` |
| Card | `src/features/stores/components/store-card.tsx` |
| Search | `src/features/stores/components/store-search-bar.tsx` |
| Skeleton | `src/features/stores/components/store-discovery-skeleton.tsx` |
| API | `src/features/stores/api/service.ts` |
| Types | `src/types/store.ts` |
| Mappers | `src/lib/api/mappers.ts` |

### Shop detail (`/[locale]/shop/[slug]`)

| Role | Path |
|------|------|
| Route | `src/app/[locale]/shop/[slug]/page.tsx` |
| View | `src/features/stores/components/shop-page-view.tsx` |
| Header | `src/features/stores/components/store-header.tsx` |
| Map | `src/features/stores/components/store-map-embed.tsx` |
| Catalog shell | `src/features/stores/components/store-catalog-client.tsx` |
| Catalog feed | `src/features/stores/components/store-catalog-feed.tsx` |
| Breadcrumbs | `src/components/seo/breadcrumbs.tsx` |
| Product card | `src/components/products/product-card.tsx` |
| Model card | `src/components/products/model-card.tsx` |

### Shared

| Role | Path |
|------|------|
| Navbar | `src/components/navbar.tsx` |
| City gate | `src/components/city/city-preference-gate.tsx` |
| Hours | `src/lib/opening-hours.ts` |
| Geo / map URLs | `src/lib/geo.ts`, `src/constants/api.ts` |
| Tokens | `src/design/tokens.ts` |
| Flutter handoff | `docs/flutter-handoff.md` |
| CSP | `next.config.ts` |

## 2. Confirmed problems (file:line)

| Problem | Evidence |
|---------|----------|
| Hero “Browse shops” CTA on Explore Shops | `store-hero.tsx:33–37` (`hero.ctaExplore`), scrolls to `#shops` |
| Hero style diverges from marketplace products page | `store-hero.tsx` vs `marketplace-shell.tsx` hero section |
| Dense shop card; city/address repetition; weak description | `store-card.tsx` location + about lines |
| No open/closed status | Hours only via `formatOpeningHoursDisplay`; no open-now util |
| Action targets overlapping full-card link | `store-card.tsx:45–49` overlay `Link` + `128–149` WhatsApp/map (`pointer-events` pattern, not nested HTML) |
| Shop count not `Intl` formatted | `store-discovery-feed.tsx` uses raw `{count}` |
| Nav “Explore Shops” heavy focus outline / no active style | `navbar.tsx` shop links lack `focus-visible:ring-*` and `aria-current` |
| Breadcrumb “Products > shop” | `shop-page-view.tsx` breadcrumbs — must become Explore Shops → shop name |
| Blank map | See §4 |
| Sticky toolbar bleed / z-index | Catalog sticky bar lacks shared `--app-bar-h` |
| Dual product card shells on shop page | Phones → `ModelCard`; accessories → `ProductCard` |
| Authenticity in card body | Move to image badge (Copy = neutral) |
| Hours format inconsistency | Seed uses `10:00-21:00`; display util converts some to 12h |

## 3. Available fields

### Shop list / profile (mapped)

`id`, `slug`, `displayName`/`name`, `about`/`description`, `logoUrl`, `bannerUrl`/`heroBannerUrl`, `city`, `address`, `latitude`, `longitude`, `phoneNumber`, `whatsappNumber`, `openingHours`, `googleMapsUrl` (mapped, barely used), list-only `totalProducts`/`productCount`.

### Not mapped on web (API has them)

`mapPlaceName`, `facebookUrl`, `instagramUrl`.

### Product

`id`, `name`, `brand`, `category`, `price`, `availability`, `stockCount`, `ptaStatus`, `authenticity`, `condition`, `trackingType`, `modelKey`, `images`, etc.

### Model group

`key`, `brand`, `model`, `variantCount`, `coverImage`, `fromPrice`, `availability`.

## 4. Blank map — root cause

**Primary (coords present, gray box):** CSP in `next.config.ts` sets `default-src 'self'` and **no `frame-src`**. Google Maps iframe (`maps.google.com` / embed URL) is blocked by CSP → empty muted box with iframe that never paints.

**Secondary:** If `latitude`/`longitude` missing, `StoreMapEmbed` returns `null` (`store-map-embed.tsx:49`) — no section at all (not a blank box).

**Unused:** `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` exists in env but is **never read** in `src/`; embed uses keyless legacy URL.

**Fix plan (Phase 3):** Add `frame-src 'self' https://www.google.com https://maps.google.com https://www.google.com/maps/`; lazy-load + skeleton; address-card fallback + “Open in Google Maps”; optionally prefer `googleMapsUrl` when present.

## 5. Count verification

| UI | Source |
|----|--------|
| “X shops found” | `GET /stores` pagination `total` (enabled storefronts) |
| Card “N products listed” | List DTO `totalProducts` = published+active product `_count` per shop |
| Shop page product total | `GET /stores/:slug/products` `total` (accessories path); models via separate models endpoint |

**Why 5,800×~64 ≠ 704k:** List shop count is **enabled public shops**, not all DB shops. Product totals on marketplace were **indexable/published across shops** (and earlier seed had ~10.5k shops with mixed publish flags). Card product counts are per-shop published products only. Numbers can diverge from “all products in Postgres” and from Meili indexable counts. **Do not assume 5800×avg = marketplace total.**

## 6. Unsupported / skipped UI (safest skip)

| Requested | Status |
|-----------|--------|
| “Verified” shop filter / badge | No API field → skip filter & badge (or style-only if we invent — **skip**) |
| “Open now” filter | Client-side only possible from `openingHours` string; inaccurate → optional client filter with note, or skip until structured hours |
| “Most products” sort | Only if API supports `sort` — verify in Phase 2; else skip |
| Social links | API exists but unmapped — map optional later, not required for redesign |
| Category product counts on chips | Mapper often forces `0` — hide counts unless API returns real values |
| Meilisearch for shops | **Do not add** — keep Postgres `stores?q=` |

## 7. Shop name / city search

Shops search uses existing backend `GET stores` query (Postgres). Not Meilisearch. If `q` is weak/unindexed server-side, note after Phase 2 smoke test.

## 8. Decisions (safest)

- Reuse/extend `src/design/tokens.ts` and `docs/flutter-handoff.md`.
- Stretched-link card pattern with `relative z-10` actions (no nested `<a>`).
- Unify ModelCard into ProductCard “from price / N variants” mode rather than two visual systems.
- Copy authenticity badge: muted/neutral, never danger red.
- Timezone for open status: `Asia/Karachi`.
