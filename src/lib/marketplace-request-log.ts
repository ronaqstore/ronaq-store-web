import { env } from '@/config/env';

let requestSeq = 0;

export function trackMarketplaceProductsRequest(
  source: 'ssr' | 'client',
  params: Record<string, string>
): void {
  if (env.NEXT_PUBLIC_MARKETPLACE_REQUEST_LOG !== '1') return;

  requestSeq += 1;
  const sorted = Object.keys(params)
    .sort()
    .reduce<Record<string, string>>((acc, key) => {
      acc[key] = params[key] ?? '';
      return acc;
    }, {});

  if (typeof process !== 'undefined' && process.stdout?.write) {
    process.stdout.write(
      `${JSON.stringify({ tag: 'marketplace-products', n: requestSeq, source, t: Date.now(), params: sorted })}\n`
    );
  }
}
