import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  countActiveMarketplaceFilters,
  marketplaceFiltersToQuery,
  parseMarketplaceListingFilters,
  parsePositiveInt,
  sanitizeMarketplaceText,
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
      sort: 'price_asc'
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
      maxPrice: 'not-a-number'
    });
    assert.deepEqual(filters, {
      condition: undefined,
      minPriceRs: undefined,
      maxPriceRs: undefined,
      inStock: undefined,
      ptaStatus: undefined,
      authenticity: undefined,
      sort: undefined
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

  it('sanitizes search text against null bytes and overflow', () => {
    assert.equal(sanitizeMarketplaceText('iphone\u0000 12'), 'iphone 12');
    assert.equal(sanitizeMarketplaceText(`<script>alert(1)</script>`), '<script>alert(1)</script>');
    assert.equal(sanitizeMarketplaceText('a'.repeat(500)).length, 100);
    assert.equal(sanitizeMarketplaceText('   '), '');
  });

  it('round-trips query params for every filter', () => {
    const filters = parseMarketplaceListingFilters({
      condition: 'NEW',
      minPrice: '1000',
      maxPrice: '300000',
      inStock: '1',
      pta: 'JV',
      authenticity: 'ORIGINAL',
      sort: 'price_desc'
    });

    const query = marketplaceFiltersToQuery(filters);
    assert.deepEqual(query, {
      condition: 'NEW',
      minPrice: '1000',
      maxPrice: '300000',
      inStock: '1',
      pta: 'JV',
      authenticity: 'ORIGINAL',
      sort: 'price_desc'
    });

    assert.equal(countActiveMarketplaceFilters(filters), 5);
    assert.equal(toPaisaFromRs(20_000), 2_000_000);
  });
});
