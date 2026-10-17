# Ronaq Store Web — SEO Guide

App Router Next.js storefront (`ronaq-store-web`) with locale prefix (`/en`, `/ur`, `/ps`).

## What was implemented

### Metadata
- Global `metadataBase`, title template `%s | Ronaq Store`, description, keywords, authors, robots, Open Graph, Twitter.
- Per-page `generateMetadata` for home, shop, and product pages.
- Canonical URLs always point to the clean path (search/filter query params do not become canonical).
- Search/filter result pages are `noindex, nofollow`.
- Google Search Console verification via `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`.

### Structured data (JSON-LD)
- Home: Organization + WebSite (SearchAction) + FAQPage.
- Shop: LocalBusiness + CollectionPage/ItemList + BreadcrumbList.
- Product: Product + Offer + BreadcrumbList (ratings/reviews only if real data exists — currently omitted).
- Reusable `JsonLd` component + typed helpers in `src/lib/seo/json-ld.ts`.

### Sitemap & robots
- `src/app/sitemap.ts` — locales, online shops, products (ISR).
- `src/app/robots.ts` — allow public pages; disallow `/api`, `/cart`, `/checkout`, `/account`, `/login`.

### Rendering
- Public pages use ISR (`revalidate = 120`).
- `generateStaticParams` for shops and products; `dynamicParams = true`.
- Product URLs are slugified: `/shop/{store}/product/{name-slug}--{id}` with 301 from raw id.
- Crawlable product links from catalog cards (not modal-only).
- Visible breadcrumbs on shop and product pages.
- Custom locale `not-found` with helpful links.

### Performance
- `next/image` via `SmartImage` (AVIF/WebP).
- `next/font` Poppins with `display: swap`.
- Compression, security headers, long-cache static assets.
- Optional Vercel Analytics + Speed Insights.
- Dynamic OG images via `opengraph-image.tsx`.

## Required environment variables (Vercel)

| Variable | Example | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://ronaq-store-web.vercel.app` | **Canonical base URL** (single source of truth) |
| `NEXT_PUBLIC_APP_URL` | same as site URL | Backward-compatible fallback |
| `NEXT_PUBLIC_API_URL` | `https://ronaq-store-backend.vercel.app` | Public API |
| `NEXT_PUBLIC_ADMIN_URL` | `https://ronaq-store-admin.vercel.app` | Owner portal links (`rel=nofollow`) |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | token from Search Console | Optional verification meta |

## Post-deploy checklist

1. Set `NEXT_PUBLIC_SITE_URL` on Vercel to the production origin (no trailing slash).
2. Redeploy after env changes.
3. Open `https://YOUR_DOMAIN/robots.txt` and `https://YOUR_DOMAIN/sitemap.xml`.
4. In Google Search Console: add property → verify with `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` → submit sitemap.
5. Inspect a shop and product URL with Rich Results Test.
6. Confirm filtered URLs (`?q=`, `?category=`) are noindex and canonicalize to the clean path.
7. Run Lighthouse mobile on home + shop + product (target 95+ SEO).
8. Prefer one host (www vs apex) with Vercel redirects; keep `trailingSlash: false`.

## Admin note

`ronaq-store-admin` is fully noindex (`robots`, `X-Robots-Tag`, metadata). It is not listed in the public sitemap. Auth guard remains in `src/proxy.ts`.
