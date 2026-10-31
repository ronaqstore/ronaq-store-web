import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import sitemap from './sitemap.ts';

interface FetchMockState {
  limits: number[];
  originalFetch: typeof globalThis.fetch;
}

function setupBackendFetchMock(): FetchMockState {
  const originalFetch = globalThis.fetch;
  const limits: number[] = [];

  globalThis.fetch = async (input: RequestInfo | URL) => {
    const rawUrl = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
    const parsed = new URL(rawUrl);
    const limitParam = parsed.searchParams.get('limit');
    const limit = limitParam ? Number(limitParam) : null;

    if (limit !== null) {
      limits.push(limit);
    }

    if (limit !== null && limit > 50) {
      return new Response(
        JSON.stringify({
          statusCode: 400,
          error: 'Bad Request',
          message: ['limit must not be greater than 50']
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    if (parsed.pathname.includes('/public/stores') && !parsed.pathname.includes('/products')) {
      return new Response(
        JSON.stringify({
          success: true,
          data: {
            items: [
              {
                id: 'store-1',
                slug: 'demo-shop',
                name: 'Demo Shop',
                displayName: 'Demo Shop',
                city: 'Lahore',
                address: 'Main Boulevard',
                phoneNumber: '03001234567',
                whatsappNumber: null,
                description: null,
                logoUrl: null,
                heroBannerUrl: null,
                googleMapsUrl: null,
                openingHours: null
              }
            ],
            total: 1,
            page: 1,
            limit: limit ?? 50,
            totalPages: 1
          }
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    if (parsed.pathname.includes('/products')) {
      return new Response(
        JSON.stringify({
          success: true,
          data: {
            items: [
              {
                id: 'prod-1',
                name: 'Phone 1',
                sku: 'P1',
                categoryId: 'cat-1',
                categoryName: 'Phones',
                brandId: 'b-1',
                brandName: 'Brand',
                retailPrice: '50000',
                ptaStatus: 'PTA_APPROVED',
                authenticity: 'ORIGINAL',
                condition: 'NEW',
                warrantyType: 'OFFICIAL',
                images: [],
                availability: 'IN_STOCK',
                stockCount: 5,
                inStock: true,
                totalQuantity: 5
              }
            ],
            total: 1,
            page: 1,
            limit: limit ?? 50,
            totalPages: 1
          }
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    return new Response(JSON.stringify({ success: true, data: null }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  };

  return { limits, originalFetch };
}

describe('sitemap pagination limits', () => {
  it('requests public stores and products with limit <= 50 to prevent backend 400 crash', async () => {
    const { limits, originalFetch } = setupBackendFetchMock();

    try {
      const entries = await sitemap();
      const urls = entries.map((entry) => entry.url);

      assert.ok(limits.length > 0);
      for (const limit of limits) {
        assert.ok(limit <= 50, `Expected limit <= 50, but received ${limit}`);
        assert.notEqual(limit, 100);
      }

      assert.ok(urls.some((url) => url.includes('/shop/demo-shop')));
      assert.ok(urls.some((url) => url.includes('demo-shop') && url.includes('prod-1')));
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
});
