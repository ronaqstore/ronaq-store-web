'use client';

import { useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { TypeaheadSearchBar } from '@/components/search/typeahead-search-bar';
import { searchStoreProducts } from '@/features/products/api/service';
import type { ProductFiltersProps } from '@/types/product';
import type { ProductTypeaheadItem } from '@/types/typeahead-search';

export function ProductFilters({
  storeSlug,
  categories,
  selectedCategoryId,
  committedQuery,
  onCategorySelect,
  onCommitSearch,
  onSelectProduct,
  onClearSearch
}: ProductFiltersProps) {
  const t = useTranslations();

  const fetchSuggestions = useCallback(
    async (q: string) => {
      const result = await searchStoreProducts(storeSlug, {
        q,
        category: selectedCategoryId || undefined,
        page: 1,
        limit: 8
      });
      const items: ProductTypeaheadItem[] = (result?.items ?? []).map((product) => ({
        id: product.id,
        title: product.name,
        subtitle: [product.brandName, product.categoryName].filter(Boolean).join(' · '),
        imageUrl: product.primaryImageUrl,
        imageFit: 'contain',
        product
      }));
      return { items, total: result?.total ?? items.length };
    },
    [selectedCategoryId, storeSlug]
  );

  return (
    <div className='sticky top-[var(--app-bar-h)] z-20 -mx-4 space-y-3 border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8'>
      <div className='flex w-full justify-start'>
        <TypeaheadSearchBar<ProductTypeaheadItem>
          committedQuery={committedQuery}
          placeholder={t('catalog.searchInShop')}
          heading={t('catalog.searchProductsHeading')}
          emptyLabel={t('marketplace.noProductsFound')}
          searchAllLabel={t('catalog.searchAll')}
          headingIcon={<Icons.tag className='h-4 w-4 text-primary' />}
          rootClassName='max-w-md'
          inputClassName='h-9 ps-9 pe-10 text-sm'
          clearButtonClassName='inset-e-1.5 h-7 w-7'
          searchIconClassName='inset-s-3'
          onCommitSearch={onCommitSearch}
          onClearSearch={onClearSearch}
          onSelectItem={(item) => onSelectProduct(item.product)}
          fetchSuggestions={fetchSuggestions}
        />
      </div>

      <div className='-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
        <Button
          type='button'
          variant={!selectedCategoryId ? 'secondary' : 'ghost'}
          size='sm'
          className='h-8 shrink-0 rounded-full px-3.5 text-xs'
          onClick={() => onCategorySelect('')}
        >
          {t('catalog.allCategories')}
        </Button>
        {categories.map((category, index) => (
          <Button
            key={`${category.id}-${index}`}
            type='button'
            variant={selectedCategoryId === category.id ? 'secondary' : 'ghost'}
            size='sm'
            className='h-8 shrink-0 rounded-full px-3.5 text-xs'
            onClick={() =>
              onCategorySelect(selectedCategoryId === category.id ? '' : category.id)
            }
          >
            {category.name}
            {category.productCount > 0 ? (
              <span className='ms-1.5 text-[10px] text-muted-foreground'>
                ({category.productCount})
              </span>
            ) : null}
          </Button>
        ))}
      </div>
    </div>
  );
}
