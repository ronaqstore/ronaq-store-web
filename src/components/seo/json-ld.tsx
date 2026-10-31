import { validateJsonLd } from '@/lib/seo/json-ld';
import type { JsonLdProps } from '@/types/seo';

export function JsonLd({ data, id }: JsonLdProps) {
  const safe = validateJsonLd(data);
  if (!safe) return null;

  return (
    <script
      id={id}
      type='application/ld+json'
      dangerouslySetInnerHTML={{ __html: JSON.stringify(safe).replace(/</g, '\\u003c') }}
    />
  );
}
