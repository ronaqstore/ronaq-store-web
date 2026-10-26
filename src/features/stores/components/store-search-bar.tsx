'use client';

import { useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Icons } from '@/components/icons';
import { TypeaheadSearchBar } from '@/components/search/typeahead-search-bar';
import { searchPublicStores } from '@/features/stores/api/service';
import { PLACEHOLDER_SHOP_LOGO } from '@/constants/placeholders';
import { marketplaceCityQueryParam } from '@/lib/city-preference';
import type { StoreSearchBarProps } from '@/types/store';
import type { ShopTypeaheadItem } from '@/types/typeahead-search';

export function StoreSearchBar({
  committedQuery,
  cityId,
  onCommitSearch,
  onSelectStore,
  onClearSearch
}: StoreSearchBarProps) {
  const t = useTranslations();

  const fetchSuggestions = useCallback(
    async (q: string) => {
      const result = await searchPublicStores({
        q,
        city: marketplaceCityQueryParam(cityId),
        page: 1,
        limit: 8
      });
      const items: ShopTypeaheadItem[] = (result?.items ?? []).map((store) => {
        const name = store.displayName || store.name || store.slug;
        const productCount = store.productCount ?? store.totalProducts ?? 0;
        return {
          id: store.id || store.slug,
          title: name,
          subtitle: [store.city, productCount > 0 ? t('stores.productsAvailable', { count: productCount }) : null]
            .filter(Boolean)
            .join(' · '),
          imageUrl: store.logoUrl || PLACEHOLDER_SHOP_LOGO,
          imageFit: 'cover',
          store
        };
      });
      return { items, total: result?.total ?? items.length };
    },
    [cityId, t]
  );

  return (
    <TypeaheadSearchBar<ShopTypeaheadItem>
      committedQuery={committedQuery}
      placeholder={t('stores.search')}
      heading={t('stores.searchShopsHeading')}
      emptyLabel={t('stores.noShopsFound')}
      searchAllLabel={t('stores.searchAll')}
      headingIcon={<Icons.store className='h-4 w-4 text-primary' />}
      onCommitSearch={onCommitSearch}
      onClearSearch={onClearSearch}
      onSelectItem={(item) => onSelectStore(item.store)}
      fetchSuggestions={fetchSuggestions}
    />
  );
}
