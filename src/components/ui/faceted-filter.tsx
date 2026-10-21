'use client';

import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslations } from 'next-intl';
import { Icons } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { FacetedFilterProps } from '@/types/product';

interface MenuPosition {
  top: number;
  left: number;
  minWidth: number;
}

export function FacetedFilter({
  title,
  options,
  value,
  onChange,
  allLabel,
  open: openProp,
  onOpenChange
}: FacetedFilterProps) {
  const t = useTranslations('catalog');
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const open = openProp ?? uncontrolledOpen;
  const setOpen = onOpenChange ?? setUncontrolledOpen;
  const rootRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState<MenuPosition | null>(null);
  const selected = options.find((option) => option.value === value);
  const hasValue = Boolean(value);

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (!open) {
      setPosition(null);
      return;
    }

    const updatePosition = () => {
      const trigger = rootRef.current;
      if (!trigger) return;
      const rect = trigger.getBoundingClientRect();
      const menuWidth = Math.max(rect.width, 192);
      const viewportPadding = 8;
      const maxLeft = window.innerWidth - menuWidth - viewportPadding;
      const left = Math.max(viewportPadding, Math.min(rect.left, maxLeft));
      setPosition({
        top: rect.bottom + 6,
        left,
        minWidth: menuWidth
      });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (rootRef.current?.contains(target) || menuRef.current?.contains(target)) {
        return;
      }
      setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, setOpen]);

  const clearSelection = (event: React.SyntheticEvent) => {
    event.preventDefault();
    event.stopPropagation();
    onChange('');
    setOpen(false);
  };

  const menu =
    open && mounted && position
      ? createPortal(
          <div
            ref={menuRef}
            id={listId}
            role='listbox'
            style={{
              position: 'fixed',
              top: position.top,
              left: position.left,
              minWidth: position.minWidth,
              zIndex: 1000
            }}
            className='overflow-hidden rounded-lg border border-border bg-background p-1 shadow-xl'
          >
            <button
              type='button'
              role='option'
              aria-selected={!hasValue}
              className={cn(
                'flex w-full cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-start text-sm transition-colors hover:bg-muted',
                !hasValue && 'bg-muted'
              )}
              onClick={() => {
                onChange('');
                setOpen(false);
              }}
            >
              <span
                className={cn(
                  'flex size-4 shrink-0 items-center justify-center rounded-sm border border-primary',
                  !hasValue ? 'bg-primary text-primary-foreground' : 'opacity-40'
                )}
              >
                {!hasValue ? <Icons.check className='size-3' /> : null}
              </span>
              <span className='truncate'>{allLabel ?? t('filterAll')}</span>
            </button>

            <div className='bg-border my-1 h-px' />

            <div className='max-h-56 overflow-y-auto'>
              {options.map((option) => {
                const isSelected = option.value === value;
                return (
                  <button
                    key={option.value}
                    type='button'
                    role='option'
                    aria-selected={isSelected}
                    className={cn(
                      'flex w-full cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-start text-sm transition-colors hover:bg-muted',
                      isSelected && 'bg-muted'
                    )}
                    onClick={() => {
                      onChange(isSelected ? '' : option.value);
                      setOpen(false);
                    }}
                  >
                    <span
                      className={cn(
                        'flex size-4 shrink-0 items-center justify-center rounded-sm border border-primary',
                        isSelected ? 'bg-primary text-primary-foreground' : 'opacity-40'
                      )}
                    >
                      {isSelected ? <Icons.check className='size-3' /> : null}
                    </span>
                    <span className='truncate'>{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <div ref={rootRef} className='relative'>
      <Button
        type='button'
        variant='outline'
        size='sm'
        aria-expanded={open}
        aria-haspopup='listbox'
        aria-controls={open ? listId : undefined}
        className={cn(
          'h-8 gap-1.5 border-dashed bg-background font-normal shadow-none',
          hasValue && 'border-solid',
          open && 'border-foreground/40'
        )}
        onClick={() => setOpen(!open)}
      >
        {hasValue ? (
          <span
            role='button'
            tabIndex={0}
            className='text-muted-foreground hover:text-foreground -ms-0.5 rounded-sm'
            aria-label={t('clearFilter', { title })}
            onClick={clearSelection}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                clearSelection(event);
              }
            }}
          >
            <Icons.circleX className='size-4' />
          </span>
        ) : (
          <Icons.filter className='size-4 text-muted-foreground' />
        )}
        <span className='truncate'>{title}</span>
        {selected ? (
          <>
            <span className='bg-border mx-0.5 h-4 w-px shrink-0' aria-hidden />
            <Badge variant='secondary' className='rounded-sm px-1 font-normal'>
              {selected.label}
            </Badge>
          </>
        ) : null}
      </Button>
      {menu}
    </div>
  );
}
