import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  clampMarketplaceText,
  commitMarketplaceSearchQuery,
  countActiveMarketplaceFilters,
  firstSearchParam,
  listingQueryRecordsEqual,
  marketplaceFiltersToQuery,
  mergeMarketplaceFilters,
  parseMarketplaceListingFilters,
  parsePositiveInt,
  sanitizeMarketplaceText,
  stableListingQueryKey,
  toPaisaFromRs
} from './marketplace-filters.ts';

describe('marketplace filters', () => {
  it('parses condition, stock, pta, authenticity, price, sort', () => {
    const filters = parseMarketplaceListingFilters({
      condition: 'USED',
      minPrice: '20000',
      maxPrice: '50000',
      inStock: '0',
      pta: 'mdm_bypass',
      authenticity: 'copy',
      sort: 'price_asc'
    });

    assert.deepEqual(filters, {
      condition: 'USED',
      minPriceRs: 20_000,
      maxPriceRs: 50_000,
      inStock: false,
      ptaStatus: 'MDM_BYPASS',
      authenticity: 'COPY',
      sort: 'price_asc',
      category: undefined
    });
  });

  it('ignores hostile / invalid filter values', () => {
    const filters = parseMarketplaceListingFilters({
      condition: 'HACKED',
      inStock: 'maybe',
      pta: 'DROP TABLE',
      authenticity: '<script>',
      sort: 'evil',
      minPrice: '-100',
      maxPrice: 'not-a-number',
      category: 'DROP TABLE products;--'
    });
    assert.deepEqual(filters, {
      condition: undefined,
      minPriceRs: undefined,
      maxPriceRs: undefined,
      inStock: undefined,
      ptaStatus: undefined,
      authenticity: undefined,
      sort: undefined,
      category: undefined
    });
    assert.equal(countActiveMarketplaceFilters(filters), 0);
  });

  it('swaps inverted price range and caps absurd prices', () => {
    const filters = parseMarketplaceListingFilters({
      minPrice: '90000',
      maxPrice: '1000'
    });
    assert.equal(filters.minPriceRs, 1000);
    assert.equal(filters.maxPriceRs, 90_000);
    assert.equal(parsePositiveInt('999999999'), 5_000_000);
  });

  it('rejects hex / scientific / decimal price junk', () => {
    assert.equal(parsePositiveInt('0x10'), undefined);
    assert.equal(parsePositiveInt('1e5'), undefined);
    assert.equal(parsePositiveInt('12.5'), undefined);
    assert.equal(parsePositiveInt('+2000'), 2000);
    assert.equal(parsePositiveInt(['9000', '1']), 9000);
  });

  it('sanitizes search text against null bytes and overflow', () => {
    assert.equal(sanitizeMarketplaceText('iphone\u0000 12'), 'iphone 12');
    assert.equal(sanitizeMarketplaceText(`<script>alert(1)</script>`), '<script>alert(1)</script>');
    assert.equal(sanitizeMarketplaceText('a'.repeat(500)).length, 80);
    assert.equal(sanitizeMarketplaceText('   '), '');
    assert.equal(sanitizeMarketplaceText(['ab', 'cd']), 'ab');
  });

  it('normalizes Arabic-script variants and Eastern digits', () => {
    assert.equal(sanitizeMarketplaceText('ك\u064A\u0661\u0662'), 'کی12');
    assert.equal(sanitizeMarketplaceText('iphone\u200B 13'), 'iphone 13');
  });

  it('commits search only when empty or >= 2 chars', () => {
    assert.equal(commitMarketplaceSearchQuery(''), '');
    assert.equal(commitMarketplaceSearchQuery('   '), '');
    assert.equal(commitMarketplaceSearchQuery('a'), null);
    assert.equal(commitMarketplaceSearchQuery('a '), null);
    assert.equal(commitMarketplaceSearchQuery('ab'), 'ab');
    assert.equal(commitMarketplaceSearchQuery(['x']), null);
    assert.equal(commitMarketplaceSearchQuery(['iphone']), 'iphone');
  });

  it('whitelists category and collapses whitespace', () => {
    assert.equal(
      parseMarketplaceListingFilters({ category: 'Mobile Phones' }).category,
      'Mobile Phones'
    );
    assert.equal(
      parseMarketplaceListingFilters({ category: 'accessories' }).category,
      'Accessories'
    );
    assert.equal(parseMarketplaceListingFilters({ category: 'Laptops' }).category, undefined);
    assert.equal(sanitizeMarketplaceText('  hello\n\nworld  '), 'hello world');
  });

  it('clamps unicode safely without splitting emoji', () => {
    const withEmoji = 'ab😀cd';
    assert.equal(clampMarketplaceText(withEmoji, 3), 'ab😀');
    assert.equal(firstSearchParam(undefined), undefined);
    assert.equal(firstSearchParam([]), undefined);
    assert.equal(firstSearchParam(['', 'ok']), 'ok');
  });

  it('merges filter patches without resurrecting deleted keys', () => {
    const merged = mergeMarketplaceFilters(
      { condition: 'NEW', inStock: true, category: 'Mobile Phones' },
      { condition: undefined, ptaStatus: 'JV' }
    );
    assert.equal(merged.condition, undefined);
    assert.equal(merged.inStock, true);
    assert.equal(merged.category, 'Mobile Phones');
    assert.equal(merged.ptaStatus, 'JV');
  });

  it('builds stable equal query keys regardless of key order', () => {
    assert.equal(
      stableListingQueryKey({ b: '2', a: '1' }),
      stableListingQueryKey({ a: '1', b: '2' })
    );
    assert.equal(
      listingQueryRecordsEqual({ q: 'phone', sort: 'price_asc' }, { sort: 'price_asc', q: 'phone' }),
      true
    );
  });

  it('round-trips query params for every filter', () => {
    const filters = parseMarketplaceListingFilters({
      condition: 'NEW',
      minPrice: '1000',
      maxPrice: '300000',
      inStock: '1',
      pta: 'JV',
      authenticity: 'ORIGINAL',
      sort: 'price_desc',
      category: 'Mobile Phones'
    });

    const query = marketplaceFiltersToQuery(filters);
    assert.deepEqual(query, {
      condition: 'NEW',
      minPrice: '1000',
      maxPrice: '300000',
      inStock: '1',
      pta: 'JV',
      authenticity: 'ORIGINAL',
      sort: 'price_desc',
      category: 'Mobile Phones'
    });

    assert.equal(countActiveMarketplaceFilters(filters), 6);
    assert.equal(toPaisaFromRs(20_000), 2_000_000);
  });
});
