import Script from 'next/script';
import { validateJsonLd } from '@/lib/seo/json-ld';
import type { JsonLdProps } from '@/types/seo';

export function JsonLd({ data, id }: JsonLdProps) {
  const safe = validateJsonLd(data);
  if (!safe) return null;

  return (
    <Script
      id={id}
      type='application/ld+json'
      strategy='afterInteractive'
      dangerouslySetInnerHTML={{ __html: JSON.stringify(safe) }}
    />
  );
}
