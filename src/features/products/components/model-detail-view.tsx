import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { resolveStoreWhatsAppNumber } from '@/lib/formatters';
import { ModelVariantsClient } from './model-variants-client';
import type { ModelDetailViewProps } from '@/types/product';

export async function ModelDetailView({ locale, slug, store, model }: ModelDetailViewProps) {
  const tNav = await getTranslations({ locale, namespace: 'nav' });
  const tCatalog = await getTranslations({ locale, namespace: 'catalog' });
  const phone = resolveStoreWhatsAppNumber(store);
  const isAppleBrand = model.brand.trim().toLowerCase() === 'apple';

  const crumbs = [
    { name: tNav('home'), path: '/' },
    { name: store.displayName, path: `/shop/${slug}` },
    {
      name: `${model.brand} ${model.model}`,
      path: `/shop/${slug}/model/${encodeURIComponent(model.key)}`
    }
  ];

  return (
    <article className='mx-auto max-w-[1600px] space-y-6 px-4 py-6 sm:px-6 lg:px-8'>
      <Breadcrumbs items={crumbs} />

      <div className='space-y-2'>
        <p className='text-sm text-muted-foreground'>{model.brand}</p>
        <h1 className='text-2xl font-extrabold tracking-tight sm:text-3xl'>{model.model}</h1>
        <p className='max-w-2xl text-sm text-muted-foreground'>
          {tCatalog('modelPageHelp', { count: model.variants.length })}
        </p>
        <Link
          href={`/shop/${slug}`}
          className='inline-block text-sm font-medium text-primary underline-offset-4 hover:underline'
        >
          {tCatalog('backToShop', { store: store.displayName })}
        </Link>
      </div>

      {model.variants.length === 0 ? (
        <p className='text-muted-foreground text-sm'>{tCatalog('noProducts')}</p>
      ) : (
        <ModelVariantsClient
          variants={model.variants}
          storeSlug={slug}
          storeName={store.displayName}
          storePhone={phone}
          isAppleBrand={isAppleBrand}
        />
      )}
    </article>
  );
}
