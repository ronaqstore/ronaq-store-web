'use client';

import { useId, useState } from 'react';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import type {
  MarketplaceFilterOptionRowProps,
  MarketplaceFilterSectionProps
} from '@/types/marketplace';

export function FilterSection({
  title,
  open: controlledOpen,
  onToggle: controlledOnToggle,
  defaultOpen = false,
  children
}: MarketplaceFilterSectionProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const panelId = useId();

  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;

  const handleToggle = () => {
    if (controlledOnToggle) {
      controlledOnToggle();
    } else {
      setInternalOpen((value) => !value);
    }
  };

  return (
    <div className='border-b border-border/70 last:border-b-0'>
      <button
        type='button'
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={handleToggle}
        className='flex min-h-[48px] w-full items-center justify-between gap-2 px-1 py-3 text-start rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary'
      >
        <span className='text-sm font-semibold tracking-tight text-foreground'>{title}</span>
        <Icons.chevronDown
          className={cn(
            'h-4 w-4 shrink-0 text-muted-foreground transition-transform',
            isOpen && 'rotate-180'
          )}
        />
      </button>
      {isOpen ? (
        <div id={panelId} className='space-y-1.5 pb-3'>
          {children}
        </div>
      ) : null}
    </div>
  );
}

export function FilterOptionRow({
  active,
  label,
  onClick,
  shape = 'radio'
}: MarketplaceFilterOptionRowProps) {
  return (
    <button
      type='button'
      onClick={onClick}
      className={cn(
        'flex min-h-[48px] w-full items-center gap-3 rounded-xl px-3 py-2.5 text-start text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
        active
          ? 'bg-primary/10 font-semibold text-foreground'
          : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
      )}
    >
      <span
        className={cn(
          'flex h-5 w-5 shrink-0 items-center justify-center border',
          shape === 'radio' ? 'rounded-full' : 'rounded-md',
          active
            ? 'border-primary bg-primary text-primary-foreground'
            : 'border-border/80 bg-background'
        )}
      >
        {active ? <Icons.check className='h-3 w-3' /> : null}
      </span>
      <span className='truncate'>{label}</span>
    </button>
  );
}
