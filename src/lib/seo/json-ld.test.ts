import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { productJsonLd } from './json-ld.ts';
import type { StoreProductDetail } from '@/types/product';
import type { StoreProfile } from '@/types/store';

const mockStore: StoreProfile = {
  id: 'store-1',
  slug: 'test-shop',
  name: 'Test Shop',
  displayName: 'Test Shop Official',
  city: 'Lahore',
  address: 'Shop 12, Hall Road',
  phoneNumber: '03001234567',
  whatsappNumber: null,
  description: null,
  logoUrl: null,
  heroBannerUrl: null,
  googleMapsUrl: null,
  openingHours: null
};

function createMockProduct(retailPrice: string): StoreProductDetail {
  return {
    id: 'prod-101',
    name: 'Samsung Galaxy S24 Ultra',
    sku: 'S24-ULTRA-256',
    categoryId: 'cat-phones',
    categoryName: 'Smartphones',
    brandId: 'brand-samsung',
    brandName: 'Samsung',
    retailPrice,
    ptaStatus: 'PTA_APPROVED',
    authenticity: 'ORIGINAL',
    condition: 'NEW',
    warrantyType: 'OFFICIAL',
    description: 'Flagship phone with AI features',
    images: [],
    availability: 'IN_STOCK',
    stockCount: 10,
    inStock: true,
    totalQuantity: 10
  };
}

describe('productJsonLd price conversion', () => {
  it('converts integer paisa to rupees instead of inflating 100x', () => {
    const product = createMockProduct('5000000');
    const result = productJsonLd({
      locale: 'en',
      store: mockStore,
      product,
      productPath: '/shop/test-shop/samsung-galaxy-s24-ultra-prod-101'
    });

    const offer = result.offers as { price: number; priceCurrency: string };
    assert.equal(offer.priceCurrency, 'PKR');
    assert.equal(offer.price, 50000);
  });

  it('handles small rupee values and fractional paisa conversion', () => {
    const product = createMockProduct('250');
    const result = productJsonLd({
      locale: 'en',
      store: mockStore,
      product,
      productPath: '/shop/test-shop/item'
    });

    const offer = result.offers as { price: number };
    assert.equal(offer.price, 2.5);
  });

  it('handles zero price without inflating', () => {
    const product = createMockProduct('0');
    const result = productJsonLd({
      locale: 'en',
      store: mockStore,
      product,
      productPath: '/shop/test-shop/free'
    });

    const offer = result.offers as { price: number };
    assert.equal(offer.price, 0);
  });

  it('omits price when retailPrice is invalid or empty', () => {
    const invalidProduct = createMockProduct('not-a-number');
    const invalidResult = productJsonLd({
      locale: 'en',
      store: mockStore,
      product: invalidProduct,
      productPath: '/shop/test-shop/invalid'
    });
    const invalidOffer = invalidResult.offers as { price?: number };
    assert.equal(invalidOffer.price, undefined);

    const emptyProduct = createMockProduct('');
    const emptyResult = productJsonLd({
      locale: 'en',
      store: mockStore,
      product: emptyProduct,
      productPath: '/shop/test-shop/empty'
    });
    const emptyOffer = emptyResult.offers as { price?: number };
    assert.equal(emptyOffer.price, undefined);

    const negativeProduct = createMockProduct('-500');
    const negativeResult = productJsonLd({
      locale: 'en',
      store: mockStore,
      product: negativeProduct,
      productPath: '/shop/test-shop/negative'
    });
    const negativeOffer = negativeResult.offers as { price?: number };
    assert.equal(negativeOffer.price, undefined);
  });
});

describe('Content Security Policy headers', () => {
  it('includes frame-src for Google Maps embed', async () => {
    const nextConfigModule = await import('../../../next.config.ts');
    const nextConfig = await nextConfigModule.default;
    const headerConfigs = await nextConfig.headers();
    const rootHeader = headerConfigs.find((h: { source: string }) => h.source === '/:path*');
    const csp = rootHeader?.headers.find((h: { key: string }) => h.key === 'Content-Security-Policy');
    assert.ok(csp, 'Content-Security-Policy header must exist');
    assert.ok(
      csp.value.includes("frame-src 'self' https://www.google.com"),
      `Expected frame-src 'self' https://www.google.com in CSP, but got: ${csp.value}`
    );
  });
});

describe('json-ld component XSS protection', () => {
  it('escapes < characters to prevent script tag injection', async () => {
    const content = await readFile(
      resolve(process.cwd(), 'src/components/seo/json-ld.tsx'),
      'utf8'
    );
    assert.ok(
      content.includes('.replace(/</g,') && content.includes('\\\\u003c'),
      'JSON-LD script component must replace < characters with unicode escape to prevent XSS'
    );
  });

  it('replaces all raw < in serialized payloads with unicode escapes', () => {
    const maliciousPayload = {
      '@type': 'Product',
      name: '</script><script>alert("xss")</script><img src=x onerror=alert(1)>'
    };
    const serialized = JSON.stringify(maliciousPayload).replace(/</g, '\\u003c');
    assert.equal(serialized.includes('<'), false);
    assert.equal(serialized.includes('\\u003c/script>\\u003cscript>'), true);
  });
});
