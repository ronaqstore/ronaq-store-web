import { toPaisa } from '@/lib/money';
import type {
  MarketplaceFilterParseInput,
  MarketplaceListingFilters
} from '@/types/marketplace';

export const MARKETPLACE_PRICE_RS_MAX = 5_000_000;
export const MARKETPLACE_SEARCH_MAX_LEN = 80;
export const MARKETPLACE_SEARCH_MIN_LEN = 2;

export const MARKETPLACE_CATEGORY_VALUES = ['Mobile Phones', 'Accessories'] as const;
export type MarketplaceCategoryValue = (typeof MARKETPLACE_CATEGORY_VALUES)[number];

const ARABIC_YEH = /\u064A/g;
const ARABIC_KAF = /\u0643/g;
const ARABIC_INDIC_DIGITS = /[\u0660-\u0669]/g;
const EXTENDED_ARABIC_INDIC_DIGITS = /[\u06F0-\u06F9]/g;
const ZERO_WIDTH = /[\u200B-\u200D\uFEFF]/g;

function normalizeArabicScriptVariants(value: string): string {
  return value
    .replace(ARABIC_YEH, '\u06CC')
    .replace(ARABIC_KAF, '\u06A9')
    .replace(ARABIC_INDIC_DIGITS, (digit) => String(digit.charCodeAt(0) - 0x0660))
    .replace(EXTENDED_ARABIC_INDIC_DIGITS, (digit) =>
      String(digit.charCodeAt(0) - 0x06F0)
    )
    .replace(ZERO_WIDTH, '');
}

export function clampMarketplaceText(value: string, maxLength: number): string {
  const chars = Array.from(value);
  if (chars.length <= maxLength) return value;
  return chars.slice(0, maxLength).join('');
}

export function firstSearchParam(
  value: string | string[] | undefined | null
): string | undefined {
  if (value == null) return undefined;
  if (Array.isArray(value)) {
    const first = value.find((entry) => typeof entry === 'string' && entry.length > 0);
    return first;
  }
  return value;
}

export function toPaisaFromRs(rupees: number): number {
  return toPaisa(rupees);
}

export function sanitizeMarketplaceText(
  value: string | string[] | undefined | null,
  maxLength = MARKETPLACE_SEARCH_MAX_LEN
): string {
  const raw = firstSearchParam(value);
  if (!raw) return '';
  let cleaned = '';
  for (const char of raw.normalize('NFKC')) {
    const code = char.codePointAt(0) ?? 0;
    if (code <= 8 || code === 11 || code === 12 || (code >= 14 && code <= 31) || code === 127) {
      continue;
    }
    cleaned += char;
  }
  cleaned = normalizeArabicScriptVariants(cleaned).replace(/\s+/g, ' ').trim();
  return clampMarketplaceText(cleaned, maxLength);
}

export function commitMarketplaceSearchQuery(
  value: string | string[] | undefined | null
): string | null {
  const cleaned = sanitizeMarketplaceText(value);
  if (!cleaned) return '';
  if (cleaned.length < MARKETPLACE_SEARCH_MIN_LEN) return null;
  return cleaned;
}

export function parsePositiveInt(
  value: string | string[] | undefined | null
): number | undefined {
  const raw = firstSearchParam(value)?.trim();
  if (!raw) return undefined;
  if (!/^\+?\d+$/.test(raw)) return undefined;
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 0) return undefined;
  const floored = Math.floor(n);
  if (floored > MARKETPLACE_PRICE_RS_MAX) return MARKETPLACE_PRICE_RS_MAX;
  return floored;
}

function parseMarketplaceCategory(
  value: string | string[] | undefined | null
): MarketplaceCategoryValue | undefined {
  const cleaned = sanitizeMarketplaceText(value, 60);
  if (!cleaned) return undefined;
  return MARKETPLACE_CATEGORY_VALUES.find(
    (entry) => entry.toLowerCase() === cleaned.toLowerCase()
  );
}

export function parseMarketplaceListingFilters(
  input: MarketplaceFilterParseInput
): MarketplaceListingFilters {
  const conditionRaw = firstSearchParam(input.condition);
  const condition =
    conditionRaw === 'NEW' || conditionRaw === 'USED' ? conditionRaw : undefined;
  let minPriceRs = parsePositiveInt(input.minPrice);
  let maxPriceRs = parsePositiveInt(input.maxPrice);
  if (minPriceRs === 0) minPriceRs = undefined;
  if (maxPriceRs === 0) maxPriceRs = undefined;
  if (minPriceRs != null && maxPriceRs != null && maxPriceRs < minPriceRs) {
    const swap = minPriceRs;
    minPriceRs = maxPriceRs;
    maxPriceRs = swap;
  }
  const inStockRaw = firstSearchParam(input.inStock)?.toLowerCase();
  const inStock =
    inStockRaw === '1' || inStockRaw === 'true'
      ? true
      : inStockRaw === '0' || inStockRaw === 'false'
        ? false
        : undefined;
  const ptaRaw = firstSearchParam(input.pta)?.toUpperCase();
  const ptaStatus = (
    ['PTA_APPROVED', 'NON_PTA', 'JV', 'BYPASS', 'MDM_BYPASS'] as const
  ).find((value) => value === ptaRaw);
  const authenticityRaw = firstSearchParam(input.authenticity)?.toUpperCase();
  const authenticity = (['ORIGINAL', 'COPY'] as const).find(
    (value) => value === authenticityRaw
  );
  const sortRaw = firstSearchParam(input.sort)?.toLowerCase();
  const sort = (['newest', 'price_asc', 'price_desc'] as const).find(
    (value) => value === sortRaw
  );
  const category = parseMarketplaceCategory(input.category);

  return {
    condition,
    minPriceRs,
    maxPriceRs,
    inStock,
    ptaStatus,
    authenticity,
    sort: sort && sort !== 'newest' ? sort : undefined,
    category
  };
}

export function marketplaceFiltersToQuery(
  filters: MarketplaceListingFilters
): Record<string, string> {
  const query: Record<string, string> = {};
  if (filters.condition) query.condition = filters.condition;
  if (filters.minPriceRs != null && filters.minPriceRs > 0) {
    query.minPrice = String(filters.minPriceRs);
  }
  if (filters.maxPriceRs != null && filters.maxPriceRs > 0) {
    query.maxPrice = String(filters.maxPriceRs);
  }
  if (filters.inStock === true) query.inStock = '1';
  if (filters.inStock === false) query.inStock = '0';
  if (filters.ptaStatus) query.pta = filters.ptaStatus;
  if (filters.authenticity) query.authenticity = filters.authenticity;
  if (filters.sort) query.sort = filters.sort;
  if (filters.category) query.category = filters.category;
  return query;
}

export function stableListingQueryKey(
  params: Record<string, string | undefined | null>
): string {
  return Object.keys(params)
    .filter((key) => {
      const value = params[key];
      return value != null && String(value).length > 0;
    })
    .sort()
    .map((key) => `${key}=${String(params[key])}`)
    .join('&');
}

export function listingQueryRecordsEqual(
  a: Record<string, string>,
  b: Record<string, string>
): boolean {
  return stableListingQueryKey(a) === stableListingQueryKey(b);
}

export function countActiveMarketplaceFilters(filters: MarketplaceListingFilters): number {
  let count = 0;
  if (filters.condition) count += 1;
  if (
    (filters.minPriceRs != null && filters.minPriceRs > 0) ||
    (filters.maxPriceRs != null && filters.maxPriceRs > 0)
  ) {
    count += 1;
  }
  if (filters.inStock !== undefined) count += 1;
  if (filters.ptaStatus) count += 1;
  if (filters.authenticity) count += 1;
  if (filters.category) count += 1;
  return count;
}

export function formatMarketplacePriceRs(rupees: number): string {
  const safe = Math.max(0, Math.min(MARKETPLACE_PRICE_RS_MAX, Math.round(rupees)));
  return `Rs ${safe.toLocaleString('en-PK')}`;
}

export function mergeMarketplaceFilters(
  base: MarketplaceListingFilters,
  patch: Partial<MarketplaceListingFilters>
): MarketplaceListingFilters {
  const next: MarketplaceListingFilters = { ...base, ...patch };
  (Object.keys(patch) as Array<keyof MarketplaceListingFilters>).forEach((key) => {
    if (patch[key] === undefined) {
      delete next[key];
    }
  });
  return next;
}
