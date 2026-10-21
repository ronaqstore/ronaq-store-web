import { useTranslations } from 'next-intl';
import { Icons } from '@/components/icons';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { ProductFiltersProps } from '@/types/product';

export function ProductFilters({
  categories,
  selectedCategoryId,
  searchQuery,
  onCategorySelect,
  onSearchChange
}: ProductFiltersProps) {
  const t = useTranslations();

  return (
    <div className='sticky top-14 z-20 -mx-4 space-y-3 border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-md min-[390px]:top-16 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8'>
      <div className='relative w-full max-w-md'>
        <Icons.search className='absolute inset-s-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
        <Input
          type='text'
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t('common.search')}
          className='h-9 bg-card ps-9 text-sm'
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
        {categories.map((category) => (
          <Button
            key={category.id}
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
