'use client';

import { useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Icons } from '@/components/icons';
import { TypeaheadSearchBar } from '@/components/search/typeahead-search-bar';
import { searchMarketplaceModels } from '@/features/marketplace/api/service';
import { sanitizeMarketplaceText } from '@/lib/marketplace-filters';
import type { MarketplaceSearchBarProps } from '@/types/marketplace';
import type { ModelTypeaheadItem } from '@/types/typeahead-search';

export function MarketplaceSearchBar({
  committedQuery,
  cityId,
  modelKey,
  onCommitSearch,
  onSelectModel,
  onClearSearch
}: MarketplaceSearchBarProps) {
  const t = useTranslations();

  const fetchSuggestions = useCallback(
    async (q: string) => {
      const result = await searchMarketplaceModels({ q, city: cityId, limit: 8 });
      const items: ModelTypeaheadItem[] = result.items.map((model) => ({
        id: model.modelKey,
        title: model.title,
        subtitle: t('marketplace.modelListingCount', { count: model.count }),
        imageUrl: model.imageUrl,
        imageFit: 'contain',
        model
      }));
      return { items, total: result.total };
    },
    [cityId, t]
  );

  return (
    <TypeaheadSearchBar<ModelTypeaheadItem>
      committedQuery={committedQuery}
      placeholder={t('marketplace.searchPlaceholder')}
      heading={t('marketplace.searchModelsHeading')}
      emptyLabel={t('marketplace.noProductsFound')}
      searchAllLabel={t('marketplace.searchAll')}
      headingIcon={<Icons.tag className='h-4 w-4 text-primary' />}
      disabled={Boolean(modelKey)}
      rootClassName='max-w-2xl'
      formClassName='border-border shadow-sm'
      searchIconClassName='sm:inset-s-4 sm:h-5 sm:w-5'
      inputClassName='sm:ps-12'
      onCommitSearch={onCommitSearch}
      onClearSearch={onClearSearch}
      onSelectItem={(item) => onSelectModel(item.model)}
      fetchSuggestions={fetchSuggestions}
      draftFromSelection={(item) => sanitizeMarketplaceText(item.title)}
    />
  );
}
