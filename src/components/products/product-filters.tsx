import { useTranslations } from 'next-intl';
import { Icons } from '@/components/icons';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { ProductFiltersProps } from '@/types/product';

export function ProductFilters({
  categories,
  selectedCategoryId,
  inStockOnly,
  searchQuery,
  onCategorySelect,
  onInStockToggle,
  onSearchChange
}: ProductFiltersProps) {
  const t = useTranslations();

  return (
    <div className='space-y-4 py-4 border-b border-border/60'>
      <div className='flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3'>
        <div className='relative flex-1 max-w-md'>
          <Icons.search className='absolute inset-s-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
          <Input
            type='text'
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t('catalog.searchInShop')}
            className='ps-9 text-sm h-9 bg-card'
          />
        </div>

        <div className='flex items-center gap-2'>
          <Button
            type='button'
            variant={inStockOnly ? 'secondary' : 'outline'}
            size='sm'
            onClick={() => onInStockToggle(!inStockOnly)}
            className='gap-1.5 text-xs h-9'
          >
            <Icons.check className={`h-3.5 w-3.5 ${inStockOnly ? 'text-primary' : 'text-muted-foreground'}`} />
            {t('catalog.inStockOnly')}
          </Button>
        </div>
      </div>

      <div className='flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1'>
        <Button
          type='button'
          variant={!selectedCategoryId ? 'secondary' : 'ghost'}
          size='sm'
          className='rounded-full text-xs h-8 px-3.5'
          onClick={() => onCategorySelect('')}
        >
          {t('catalog.allCategories')}
        </Button>
        {categories.map((category) => (
          <Button
            key={category.id}
            type='button'
            variant={selectedCategoryId === category.id ? 'secondary' : 'ghost'}
            size='sm'
            className='rounded-full text-xs h-8 px-3.5'
            onClick={() =>
              onCategorySelect(
                selectedCategoryId === category.id ? '' : category.id
              )
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
