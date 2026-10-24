import { toPaisa } from '@/lib/money';
import type {
  MarketplaceFilterParseInput,
  MarketplaceListingFilters
} from '@/types/marketplace';

export const MARKETPLACE_PRICE_RS_MAX = 5_000_000;
export const MARKETPLACE_SEARCH_MAX_LEN = 100;

export function toPaisaFromRs(rupees: number): number {
  return toPaisa(rupees);
}

export function sanitizeMarketplaceText(
  value: string | undefined | null,
  maxLength = MARKETPLACE_SEARCH_MAX_LEN
): string {
  if (!value) return '';
  let cleaned = '';
  for (const char of value.normalize('NFKC')) {
    const code = char.codePointAt(0) ?? 0;
    if (code <= 8 || code === 11 || code === 12 || (code >= 14 && code <= 31) || code === 127) {
      continue;
    }
    cleaned += char;
  }
  return cleaned.trim().slice(0, maxLength);
}

export function parsePositiveInt(value: string | undefined | null): number | undefined {
  if (!value?.trim()) return undefined;
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) return undefined;
  const floored = Math.floor(n);
  if (floored > MARKETPLACE_PRICE_RS_MAX) return MARKETPLACE_PRICE_RS_MAX;
  return floored;
}

export function parseMarketplaceListingFilters(
  input: MarketplaceFilterParseInput
): MarketplaceListingFilters {
  const condition =
    input.condition === 'NEW' || input.condition === 'USED' ? input.condition : undefined;
  let minPriceRs = parsePositiveInt(input.minPrice);
  let maxPriceRs = parsePositiveInt(input.maxPrice);
  if (minPriceRs != null && maxPriceRs != null && maxPriceRs < minPriceRs) {
    const swap = minPriceRs;
    minPriceRs = maxPriceRs;
    maxPriceRs = swap;
  }
  const inStock =
    input.inStock === '1' || input.inStock === 'true'
      ? true
      : input.inStock === '0' || input.inStock === 'false'
        ? false
        : undefined;
  const ptaStatus = (
    ['PTA_APPROVED', 'NON_PTA', 'JV', 'BYPASS', 'MDM_BYPASS'] as const
  ).find((value) => value === input.pta?.toUpperCase());
  const authenticity = (['ORIGINAL', 'COPY'] as const).find(
    (value) => value === input.authenticity?.toUpperCase()
  );
  const sort = (['newest', 'price_asc', 'price_desc'] as const).find(
    (value) => value === input.sort?.toLowerCase()
  );

  return {
    condition,
    minPriceRs,
    maxPriceRs,
    inStock,
    ptaStatus,
    authenticity,
    sort: sort && sort !== 'newest' ? sort : undefined
  };
}

export function marketplaceFiltersToQuery(
  filters: MarketplaceListingFilters
): Record<string, string> {
  const query: Record<string, string> = {};
  if (filters.condition) query.condition = filters.condition;
  if (filters.minPriceRs != null) query.minPrice = String(filters.minPriceRs);
  if (filters.maxPriceRs != null) query.maxPrice = String(filters.maxPriceRs);
  if (filters.inStock === true) query.inStock = '1';
  if (filters.inStock === false) query.inStock = '0';
  if (filters.ptaStatus) query.pta = filters.ptaStatus;
  if (filters.authenticity) query.authenticity = filters.authenticity;
  if (filters.sort) query.sort = filters.sort;
  return query;
}

export function countActiveMarketplaceFilters(filters: MarketplaceListingFilters): number {
  let count = 0;
  if (filters.condition) count += 1;
  if (filters.minPriceRs != null || filters.maxPriceRs != null) count += 1;
  if (filters.inStock !== undefined) count += 1;
  if (filters.ptaStatus) count += 1;
  if (filters.authenticity) count += 1;
  return count;
}

export function formatMarketplacePriceRs(rupees: number): string {
  const safe = Math.max(0, Math.min(MARKETPLACE_PRICE_RS_MAX, Math.round(rupees)));
  return `Rs ${safe.toLocaleString('en-PK')}`;
}
