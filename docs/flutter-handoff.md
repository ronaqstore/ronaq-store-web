# Flutter Design System Handoff — Ronaq Store

This document specifies the design tokens, component architecture, screen states, and API mapping implemented in `ronaq-store-web` for direct porting to Flutter.

---

## 1. Design Tokens

Source of truth: `src/design/tokens.ts`

### Color Palette

| Token Name | Light Value | Dark Value | Flutter `Color` Equivalent | Usage |
|---|---|---|---|---|
| `brand` | `#16a34a` (Emerald 600) | `#22c55e` (Emerald 500) | `Color(0xFF16A34A)` / `Color(0xFF22C55E)` | Primary brand accent, active tabs, buttons |
| `surface` | `#ffffff` | `#1c1f26` | `Colors.white` / `Color(0xFF1C1F26)` | Card backgrounds, dialogs, bottom sheets |
| `surfaceMuted` | `#f8fafc` | `#242933` | `Color(0xFFF8FAFC)` / `Color(0xFF242933)` | Pill badges, input backgrounds, table zebra rows |
| `border` | `#e2e8f0` | `#334155` | `Color(0xFFE2E8F0)` / `Color(0xFF334155)` | Card borders, dividers, chip outlines |
| `text` | `#0f172a` | `#f8fafc` | `Color(0xFF0F172A)` / `Color(0xFFF8FAFC)` | Primary headings, product titles, prices |
| `textMuted` | `#64748b` | `#94a3b8` | `Color(0xFF64748B)` / `Color(0xFF94A3B8)` | Secondary labels, shop location, captions |
| `danger` | `#dc2626` | `#ef4444` | `Color(0xFFDC2626)` / `Color(0xFFEF4444)` | Out of stock badge, error banners |
| `success` | `#16a34a` | `#22c55e` | `Color(0xFF16A34A)` / `Color(0xFF22C55E)` | In-stock indicator dot, PTA verified badge |
| `warning` | `#d97706` | `#f59e0b` | `Color(0xFFD97706)` / `Color(0xFFF59E0B)` | Low stock warnings, non-PTA badges |

### 8-Point Grid Spacing

| Token | Pixels | Flutter Value | Recommended Widget |
|---|---|---|---|
| `1` | 4px | `4.0` | `SizedBox(height: 4)` / micro-gap |
| `2` | 8px | `8.0` | `EdgeInsets.all(8.0)` / chip gap |
| `3` | 12px | `12.0` | `EdgeInsets.symmetric(horizontal: 12.0)` |
| `4` | 16px | `16.0` | Standard card padding, toolbar gaps |
| `6` | 24px | `24.0` | Dialog padding, section margins |
| `8` | 32px | `32.0` | Section vertical spacing |
| `12` | 48px | `48.0` | Minimum touch target size / hero spacing |

### Corner Radius

| Token | Radius | Flutter `BorderRadius` | Usage |
|---|---|---|---|
| `sm` | 8px | `BorderRadius.circular(8.0)` | Badges, small inputs |
| `md` | 12px | `BorderRadius.circular(12.0)` | Buttons, filter chips |
| `lg` | 16px | `BorderRadius.circular(16.0)` | Product cards, bottom sheets top corners |
| `full` | 9999px | `StadiumBorder()` / `BorderRadius.circular(9999)` | Action pills, quick filters, search bar |

### Elevation & Soft Shadows

| Level | CSS Definition | Flutter `BoxShadow` |
|---|---|---|
| Level 1 (Card) | `0 1px 3px 0 rgba(0,0,0,0.05)` | `BoxShadow(color: Color(0x0D000000), blurRadius: 3, offset: Offset(0, 1))` |
| Level 2 (Hover) | `0 4px 6px -1px rgba(0,0,0,0.07)` | `BoxShadow(color: Color(0x12000000), blurRadius: 6, offset: Offset(0, 4))` |
| Level 3 (Sheet) | `0 10px 15px -3px rgba(0,0,0,0.08)` | `BoxShadow(color: Color(0x14000000), blurRadius: 15, offset: Offset(0, 10))` |

### Touch Targets & Motion
- **Minimum Tap Target**: `48x48dp` (`kMinInteractiveDimension` in Flutter).
- **Durations**:
  - Fast: `150ms` (press feedback, check toggles)
  - Normal: `200ms` (card hover, opacity changes)
  - Slow: `300ms` (modal bottom sheet slide, drawer transition)
- **Curves**: `Curves.easeOut` / `Curves.fastOutSlowIn`.

---

## 2. Component Mapping Table

| Web (React/Tailwind) Component | Flutter Equivalent Widget | Composition Notes |
|---|---|---|
| `ProductCard` | `ProductCard` (custom stateless) | `Card` -> `Column` -> `AspectRatio(1.0)` -> `SmartImage` + `Padding` (Brand, Title, Shop, Price/Stock) |
| `ProductCardSkeleton` | `ProductCardSkeleton` | `Shimmer.fromColors` wrapping placeholder boxes mirroring `ProductCard` layout |
| `FilterSheet` | `showModalBottomSheet` | `ModalBottomSheet` on phone (`isScrollControlled: true`), `NavigationDrawer` or `Dialog` on tablet |
| `CityPicker` | `showModalBottomSheet` | `DraggableScrollableSheet` with sticky search header and scrollable `ListView.builder` |
| `BottomNav` | `NavigationBar` | `NavigationBar` with 4 `NavigationDestination` items (Home, Shops, Search, Account) |
| `QuickFilterChips` | `SingleChildScrollView(scrollDirection: Axis.horizontal)` | Row of `FilterChip` / `InputChip` with `EdgeInsets.symmetric(horizontal: 16)` |
| `ActiveFilterChips` | `Wrap` | `InputChip` with `onDeleted` callback |
| `AppBar` (Mobile) | `SliverAppBar` | `SliverAppBar(pinned: true, toolbarHeight: 56)` with Logo, CityChip, ThemeToggle |
| `SearchBar` | `SearchAnchor` / `SearchBar` | Rounded search field with leading icon, suffix clear button, `textCapitalization` |
| `OfflineBanner` | `MaterialBanner` | Connectivity listener banner displaying offline cache status |
| `EmptyState` | `CustomScrollView` / `Center` | Icon + Title + Description + `FilledButton` ("Clear all filters") |
| `ErrorState` | `Center` | Error icon + Message + `OutlinedButton` ("Try again") |

---

## 3. Screen States

1. **Loading State**:
   - Initial load: Skeletons for top toolbar, filter chips, result count, and 6-card grid (`ProductGridSkeleton`).
   - Infinite scroll: Spinner + 4-card skeleton at bottom of list.
2. **Success State**:
   - Products listed in 2 columns (phone), 3 columns (tablet), 4-5 columns (desktop).
   - In-stock items sorted first.
   - Formatted count: `"704,000 products found"`.
3. **Empty State**:
   - No products matching filters or city.
   - Shows action to reset filters (`onClearFilters`).
4. **Error State**:
   - Network failure or server exception.
   - Shows retry button (`onRetry`).
5. **Offline State**:
   - Detected via connectivity stream.
   - Offline banner persists at top/bottom indicating cached mode.

---

## 4. API Field Mapping for `ProductCard`

From `GET /public/marketplace/products`:

| API Field | Type | Display Treatment |
|---|---|---|
| `id` | `string` | Unique widget key and navigation route identifier |
| `name` | `string` | Primary card title (`maxLines: 2, overflow: TextOverflow.ellipsis`) |
| `brand` | `string?` | Uppercase muted label (`TextStyle(fontSize: 11, fontWeight: FontWeight.bold)`) |
| `price` | `number` | Retail price in paisas (`price / 100` -> `"Rs 20,160"`) |
| `availability` | `'IN_STOCK' \| 'OUT_OF_STOCK'` | `OUT_OF_STOCK` displays top-start pill and applies 80% opacity grayscale |
| `images` | `string[]` | Index 0 used for aspect-ratio square thumbnail |
| `shop.displayName` | `string` | Shop name on subtitle line with store icon |
| `shop.city` | `string?` | City appended after shop name (`"Ronaq Mobile · Peshawar"`) |
| `shop.slug` | `string` | Target shop slug for navigation |
