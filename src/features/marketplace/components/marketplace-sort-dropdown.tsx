'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import type {
  MarketplaceSortDropdownProps,
  MarketplaceSortOption,
  MarketplaceSortValue
} from '@/types/marketplace';

export function MarketplaceSortDropdown({
  value = 'newest',
  onChange,
  className
}: MarketplaceSortDropdownProps) {
  const t = useTranslations('marketplace');
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const buttonId = useId();
  const listId = useId();

  const options: MarketplaceSortOption[] = [
    { value: 'newest', label: t('sortNewest') },
    { value: 'price_asc', label: t('sortPriceAsc') },
    { value: 'price_desc', label: t('sortPriceDesc') }
  ];

  const currentOption = options.find((opt) => opt.value === value) ?? options[0];

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [open]);

  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  const handleSelect = (val: MarketplaceSortValue) => {
    onChange(val);
    setOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      onKeyDown={handleKeyDown}
      className={cn('relative inline-block shrink-0 text-start', className)}
    >
      <button
        id={buttonId}
        type='button'
        onClick={handleToggle}
        aria-haspopup='listbox'
        aria-expanded={open}
        aria-controls={listId}
        aria-label={t('sortHeading')}
        className={cn(
          'h-12 min-h-[48px] rounded-xl border border-border/80 bg-card px-3.5 text-sm font-semibold text-foreground',
          'transition-all duration-150 inline-flex items-center justify-between gap-2.5 shadow-xs select-none',
          'hover:bg-muted/60 hover:border-border active:scale-[0.98]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
          open && 'border-primary ring-2 ring-primary/20'
        )}
      >
        <span className='truncate'>{currentOption.label}</span>
        <Icons.chevronDown
          className={cn(
            'h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200',
            open && 'rotate-180 text-primary'
          )}
        />
      </button>

      {open ? (
        <div
          id={listId}
          role='listbox'
          aria-labelledby={buttonId}
          className='absolute inset-e-0 top-[calc(100%+0.35rem)] z-50 min-w-[210px] overflow-hidden rounded-xl border border-border/80 bg-card/95 p-1.5 shadow-xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-150'
        >
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type='button'
                role='option'
                aria-selected={isSelected}
                onClick={() => handleSelect(option.value)}
                className={cn(
                  'flex w-full min-h-[42px] items-center justify-between gap-3 rounded-lg px-3 py-2 text-start text-sm transition-colors cursor-pointer select-none',
                  isSelected
                    ? 'bg-primary/10 font-semibold text-primary'
                    : 'font-medium text-foreground hover:bg-muted/70'
                )}
              >
                <span className='truncate'>{option.label}</span>
                {isSelected ? (
                  <Icons.check className='h-4 w-4 shrink-0 text-primary' />
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
