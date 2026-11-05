import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getPublicStoreProfile } from '@/features/stores/api/service';
import { getStoreModelDetail } from '@/features/products/api/service';
import { ModelDetailView } from '@/features/products/components/model-detail-view';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { modelPath } from '@/lib/seo/slug';
import type { ModelPageProps } from '@/types/common';

export const revalidate = 30;

export async function generateMetadata({ params }: ModelPageProps): Promise<Metadata> {
  const { locale, slug, modelKey } = await params;
  const decoded = decodeURIComponent(modelKey);
  const [store, model, t] = await Promise.all([
    getPublicStoreProfile(slug),
    getStoreModelDetail(slug, decoded),
    getTranslations({ locale, namespace: 'metadata' })
  ]);
  const path = modelPath(slug, decoded);
  if (!store || !model) {
    return buildPageMetadata({
      locale,
      title: t('notFoundTitle'),
      description: t('homeDescription'),
      path,
      noIndex: true
    });
  }
  const title = `${model.brand} ${model.model} · ${store.displayName}`;
  const description = t('modelDescription', {
    model: `${model.brand} ${model.model}`,
    store: store.displayName,
    count: model.variants.length
  });
  return buildPageMetadata({
    locale,
    title,
    description,
    path,
    canonicalPath: path,
    type: 'website'
  });
}

export default async function ModelPage({ params }: ModelPageProps) {
  const { locale, slug, modelKey } = await params;
  setRequestLocale(locale);
  if (!slug || !modelKey) notFound();

  const decoded = decodeURIComponent(modelKey);
  const [store, model] = await Promise.all([
    getPublicStoreProfile(slug),
    getStoreModelDetail(slug, decoded)
  ]);
  if (!store || !model) notFound();

  return <ModelDetailView locale={locale} slug={slug} store={store} model={model} />;
}
