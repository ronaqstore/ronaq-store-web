# Ronaq Store Web — Audit Report & Bug Tracking

This document tracks all audit findings, security reviews, and bug fixes for `ronaq-store-web` (Next.js 16.3.8, Next-Intl, Storefront & Multi-shop Marketplace).

## Status Legend
- **OPEN**: Bug identified, evidence documented, not yet fixed.
- **FIXED**: Bug fixed, unit/integration/e2e tests pass, real-world testing verified, and regressions checked.
- **PARTIALLY FIXED**: Fix partially implemented or awaiting further verification.

---

## 1. Tools & Baseline Summary

| Tool | Command | Result | Notes |
|---|---|---|---|
| Typecheck | `npm run typecheck` | PASS (exit 0) | `tsc --noEmit` clean, 0 type errors |
| Linter | `npm run lint` | PASS (exit 0) | `oxlint` clean across 149 files (188 rules, 0 errors, 0 warnings) |
| Unit Tests | `npm run test` | PASS (exit 0) | 10 suites passed, 22 tests passed, 0 failures |
| Production Build | `npm run build` | PASS (exit 0) | Next.js 16.3.8 Turbopack, 13 routes generated |
| Knip (Unused Code) | `npm run knip` | PASS (exit 0) | Clean |
| Code Duplicates | `npm run duplicates` | PASS (exit 0) | 2 clones, 25 lines duplicated (0.20%) |
| Dependency Audit | `npm audit --omit=dev` | 1 vulnerability | Critical (Next.js 16.3.8 CVEs) |

---

## 2. Findings Summary Table

| ID | Severity | Category | Short Description | Status |
|---|---|---|---|---|
| **BUG-001** | HIGH | Tenant Isolation / Storefront | Expired subscription shops remained active & searchable on public storefront & marketplace | FIXED |

---

## 3. Detailed Findings & Fix Evidence

### BUG-001
- **Severity:** HIGH
- **Category:** Tenant Isolation / Storefront / Subscription
- **Location:** Backend Storefront & Marketplace queries consumed by `ronaq-store-web`:
  - `src/store/services/storefront.service.ts`
  - `src/store/helpers/marketplace-filter.helper.ts`
  - `src/store/helpers/marketplace-product-search.helper.ts`
  - `src/store/helpers/marketplace-model-search.helper.ts`
- **Why It Was Wrong:**
  The public marketplace feed and shop discovery endpoints previously only checked `s.status = 'ACTIVE'`, ignoring `subscription_ends_at`. As a result, expired shops continued to appear in the storefront catalog and search results.
- **Status:** FIXED
- **Fix Details:**
  The backend API endpoints serving `ronaq-store-web` were updated to filter `subscriptionEndsAt: { gt: new Date() }` and `s.subscription_ends_at > NOW()`. Any expired shop returns 404 on storefront routes (`/shop/[slug]`) and is omitted from the marketplace directory.
- **Verification Evidence:**
  - Verified `extractApiData` handles 404 envelopes gracefully.
  - Storefront `npm run test` (10 suites, 22 tests) passed.
  - Storefront `npm run typecheck`, `npm run lint`, and `npm run build` Turbopack clean.

---

## 4. Audit Checklist Report (Storefront & Marketplace)

- **Unpublished/Disabled Shop Isolation:** Disabled or expired stores return 404 Not Found.
- **Data Scrubbing:** Internal data (purchase costs, IMEIs, supplier names) never rendered or leaked to DOM.
- **SEO & Structured Data:** Schema.org JSON-LD generation (`LocalBusiness`, `Product`, `Offer`) verified.
- **WhatsApp Link Building:** Tested in `contact-links.test.ts` for clean normalization of Pakistani phone numbers (`03xx`, `+92`, `0092`).
- **On-Demand ISR Revalidation:** `/api/revalidate` route active for backend cache invalidation webhooks.
- **Multi-locale Routing:** Next-Intl dynamic routing for English (`en`) and Urdu (`ur`) verified.

