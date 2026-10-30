import { APP_DESCRIPTION, APP_NAME } from '@/constants/site';
import { SOCIAL_URLS } from '@/constants/api';
import { fromPaisa } from '@/lib/money';
import { absoluteLocaleUrl, absoluteUrl, getSiteUrl } from '@/lib/seo/site-url';
import type { StoreProductDetail } from '@/types/product';
import type { StoreProfile } from '@/types/store';
import type {
  BreadcrumbItem,
  CollectionPageJsonLdInput,
  FaqEntry,
  JsonLdGraph,
  ProductJsonLdInput
} from '@/types/seo';

export type { BreadcrumbItem, JsonLdGraph } from '@/types/seo';

export function organizationJsonLd(): Record<string, unknown> {
  const siteUrl = getSiteUrl();
  return {
    '@type': 'Organization',
    '@id': `${siteUrl}/#organization`,
    name: APP_NAME,
    url: siteUrl,
    logo: absoluteUrl('/icons/icon-512.png'),
    sameAs: [
      SOCIAL_URLS.youtube,
      SOCIAL_URLS.instagram,
      SOCIAL_URLS.tiktok,
      SOCIAL_URLS.facebook
    ],
    description: APP_DESCRIPTION
  };
}

export function websiteJsonLd(locale: string): Record<string, unknown> {
  const siteUrl = getSiteUrl();
  const home = absoluteLocaleUrl(locale, '/');
  return {
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    name: APP_NAME,
    url: home,
    description: APP_DESCRIPTION,
    publisher: { '@id': `${siteUrl}/#organization` },
    inLanguage: locale,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${home}?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  };
}

export function homeGraphJsonLd(locale: string): JsonLdGraph {
  return {
    '@context': 'https://schema.org',
    '@graph': [organizationJsonLd(), websiteJsonLd(locale)]
  };
}

export function breadcrumbJsonLd(locale: string, items: BreadcrumbItem[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteLocaleUrl(locale, item.path)
    }))
  };
}

function schemaAvailability(availability: StoreProductDetail['availability']): string {
  if (availability === 'OUT_OF_STOCK') return 'https://schema.org/OutOfStock';
  if (availability === 'LOW_STOCK') return 'https://schema.org/LimitedAvailability';
  return 'https://schema.org/InStock';
}

function priceValidUntil(): string {
  const date = new Date();
  date.setMonth(date.getMonth() + 3);
  return date.toISOString().slice(0, 10);
}

export function productJsonLd(input: ProductJsonLdInput): Record<string, unknown> {
  const { locale, store, product, productPath: path } = input;
  const url = absoluteLocaleUrl(locale, path);
  const images = (product.images ?? [])
    .map((image) => image.url)
    .filter(Boolean)
    .map((urlValue) =>
      urlValue.startsWith('http')
        ? urlValue
        : absoluteUrl(urlValue.startsWith('/') ? urlValue : `/${urlValue}`)
    );

  const offer: Record<string, unknown> = {
    '@type': 'Offer',
    url,
    availability: schemaAvailability(product.availability),
    itemCondition: 'https://schema.org/NewCondition',
    priceCurrency: 'PKR',
    priceValidUntil: priceValidUntil(),
    seller: {
      '@type': 'Organization',
      name: store.displayName
    }
  };

  if (product.retailPrice) {
    const price = Number(product.retailPrice);
    if (Number.isFinite(price)) {
      offer.price = fromPaisa(price);
    }
  }

  const fallbackDescription = [product.name, store.displayName, APP_NAME].join(' · ');

  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description?.trim() || fallbackDescription,
    sku: product.sku || product.id,
    url,
    image: images.length > 0 ? images : [absoluteUrl('/placeholders/product.svg')],
    brand: product.brandName ? { '@type': 'Brand', name: product.brandName } : undefined,
    category: product.categoryName || undefined,
    offers: offer
  };

  return Object.fromEntries(Object.entries(data).filter(([, value]) => value !== undefined));
}

export function collectionPageJsonLd(input: CollectionPageJsonLdInput): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: input.name,
    description: input.description,
    url: absoluteLocaleUrl(input.locale, input.path),
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: input.items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        url: absoluteLocaleUrl(input.locale, item.path)
      }))
    }
  };
}

export function localBusinessJsonLd(
  locale: string,
  store: StoreProfile,
  path: string
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ElectronicsStore',
    name: store.displayName,
    description: store.description || store.about || undefined,
    url: absoluteLocaleUrl(locale, path),
    telephone: store.phoneNumber || undefined,
    image: store.logoUrl || undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: store.address || undefined,
      addressLocality: store.city || undefined,
      addressCountry: 'PK'
    },
    geo:
      store.latitude != null && store.longitude != null
        ? {
            '@type': 'GeoCoordinates',
            latitude: store.latitude,
            longitude: store.longitude
          }
        : undefined,
    openingHours: store.openingHours || undefined
  };
}

export function faqPageJsonLd(faqs: FaqEntry[]): Record<string, unknown> | null {
  if (faqs.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
}

export function validateJsonLd(data: JsonLdGraph): JsonLdGraph | null {
  try {
    const serialized = JSON.stringify(data);
    if (!serialized.includes('@type')) return null;
    return JSON.parse(serialized) as JsonLdGraph;
  } catch {
    return null;
  }
}
