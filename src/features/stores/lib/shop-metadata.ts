import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getPublicStoreProfile } from '@/features/stores/api/service';
import { buildPageMetadata, isSearchNoIndex } from '@/lib/seo/metadata';
import { absoluteProductImageUrl } from '@/constants/placeholders';
import type { CatalogSearchParams } from '@/types/common';

export async function buildShopMetadata(
  locale: string,
  slug: string,
  searchParams: CatalogSearchParams
): Promise<Metadata> {
  const store = await getPublicStoreProfile(slug);
  const t = await getTranslations({ locale, namespace: 'metadata' });

  if (!store) {
    return buildPageMetadata({
      locale,
      title: t('shopFallbackTitle'),
      description: t('shopFallbackDescription'),
      path: `/shop/${slug}`,
      noIndex: true
    });
  }

  const title = t('shopTitle', { store: store.displayName, city: store.city });
  const description =
    store.description?.trim() ||
    t('shopDescription', { store: store.displayName, city: store.city });

  return buildPageMetadata({
    locale,
    title,
    description,
    path: `/shop/${slug}`,
    canonicalPath: `/shop/${slug}`,
    noIndex: isSearchNoIndex(searchParams),
    images: store.logoUrl
      ? [{ url: absoluteProductImageUrl(store.logoUrl), alt: store.displayName }]
      : undefined
  });
}
