'use client';

import {
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type CompositionEvent,
  type FormEvent,
  type KeyboardEvent
} from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Icons } from '@/components/icons';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { searchMarketplaceModels } from '@/features/marketplace/api/service';
import { PLACEHOLDER_PRODUCT_IMAGE } from '@/constants/placeholders';
import {
  commitMarketplaceSearchQuery,
  MARKETPLACE_SEARCH_MAX_LEN,
  MARKETPLACE_SEARCH_MIN_LEN,
  sanitizeMarketplaceText
} from '@/lib/marketplace-filters';
import { cn } from '@/lib/utils';
import type {
  MarketplaceModelSuggestion,
  MarketplaceSearchBarProps
} from '@/types/marketplace';

function ModelSuggestionsSkeleton() {
  return (
    <>
      {Array.from({ length: 4 }).map((_, index) => (
        <li key={index} className='flex items-center gap-3 px-3.5 py-2.5' aria-hidden>
          <Skeleton className='h-11 w-11 shrink-0 rounded-lg' />
          <div className='min-w-0 flex-1 space-y-2'>
            <Skeleton className='h-4 w-3/4' />
            <Skeleton className='h-3 w-1/3' />
          </div>
          <Skeleton className='h-4 w-4 shrink-0 rounded' />
        </li>
      ))}
    </>
  );
}

export function MarketplaceSearchBar({
  committedQuery,
  cityId,
  modelKey,
  onCommitSearch,
  onSelectModel,
  onClearSearch
}: MarketplaceSearchBarProps) {
  const t = useTranslations();
  const listId = useId();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const focusedRef = useRef(false);
  const lastCommittedRef = useRef(committedQuery);
  const [draft, setDraft] = useState(committedQuery);
  const [composing, setComposing] = useState(false);
  const [composeFreeze, setComposeFreeze] = useState(committedQuery);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<MarketplaceModelSuggestion[]>([]);
  const [totalGroups, setTotalGroups] = useState(0);
  const modelsRequestIdRef = useRef(0);

  useEffect(() => {
    if (focusedRef.current) return;
    if (committedQuery === lastCommittedRef.current) return;
    lastCommittedRef.current = committedQuery;
    setDraft(committedQuery);
  }, [committedQuery]);

  const draftForDebounce = composing ? composeFreeze : draft;
  const debouncedDraft = useDebouncedValue(draftForDebounce, 400);
  const activeModel = Boolean(modelKey);

  useEffect(() => {
    if (composing) return;
    const next = commitMarketplaceSearchQuery(debouncedDraft);
    if (next == null) return;
    if (next === lastCommittedRef.current) return;
    lastCommittedRef.current = next;
    onCommitSearch(next);
  }, [composing, debouncedDraft, onCommitSearch]);

  useEffect(() => {
    if (!open || activeModel || debouncedDraft.trim().length < MARKETPLACE_SEARCH_MIN_LEN) {
      modelsRequestIdRef.current += 1;
      setSuggestions([]);
      setTotalGroups(0);
      setLoading(false);
      return;
    }

    const requestId = modelsRequestIdRef.current + 1;
    modelsRequestIdRef.current = requestId;
    setSuggestions([]);
    setTotalGroups(0);
    setLoading(true);

    const q = sanitizeMarketplaceText(debouncedDraft);
    void searchMarketplaceModels({
      q,
      city: cityId,
      limit: 8
    })
      .then((result) => {
        if (modelsRequestIdRef.current !== requestId) return;
        setSuggestions(result.items);
        setTotalGroups(result.total);
        setLoading(false);
      })
      .catch(() => {
        if (modelsRequestIdRef.current !== requestId) return;
        setSuggestions([]);
        setTotalGroups(0);
        setLoading(false);
      });
  }, [activeModel, cityId, debouncedDraft, open]);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, []);

  const commitImmediate = (raw: string) => {
    const next = commitMarketplaceSearchQuery(raw);
    if (next == null) {
      setOpen(false);
      inputRef.current?.blur();
      return;
    }
    lastCommittedRef.current = next;
    setDraft(next);
    onCommitSearch(next);
    setOpen(false);
    inputRef.current?.blur();
  };

  const clearSearch = () => {
    focusedRef.current = false;
    lastCommittedRef.current = '';
    setDraft('');
    onClearSearch();
    setSuggestions([]);
    setOpen(false);
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const next = Array.from(e.target.value)
      .slice(0, MARKETPLACE_SEARCH_MAX_LEN)
      .join('');
    setDraft(next);
    setOpen(true);
  };

  const handleSelect = (item: MarketplaceModelSuggestion) => {
    const title = sanitizeMarketplaceText(item.title);
    focusedRef.current = false;
    lastCommittedRef.current = title;
    setDraft(title);
    onSelectModel(item);
    setOpen(false);
    inputRef.current?.blur();
  };

  const handleSearchAll = () => {
    commitImmediate(draft);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      if (draft) {
        clearSearch();
      }
      setOpen(false);
      inputRef.current?.blur();
      return;
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSearchAll();
    }
  };

  const handleCompositionStart = () => {
    setComposeFreeze(draft);
    setComposing(true);
  };

  const handleCompositionEnd = (event: CompositionEvent<HTMLInputElement>) => {
    setComposing(false);
    setDraft(
      Array.from(event.currentTarget.value)
        .slice(0, MARKETPLACE_SEARCH_MAX_LEN)
        .join('')
    );
  };

  const handleFormSubmit = (event: FormEvent) => {
    event.preventDefault();
    handleSearchAll();
  };

  const handleFocus = () => {
    focusedRef.current = true;
    if (
      sanitizeMarketplaceText(draft).length >= MARKETPLACE_SEARCH_MIN_LEN &&
      !activeModel
    ) {
      setOpen(true);
    }
  };

  const handleBlur = () => {
    window.setTimeout(() => {
      if (rootRef.current?.contains(document.activeElement)) return;
      focusedRef.current = false;
    }, 0);
  };

  const showDropdown =
    open && !activeModel && sanitizeMarketplaceText(draft).length >= MARKETPLACE_SEARCH_MIN_LEN;

  return (
    <div ref={rootRef} className='relative w-full max-w-2xl'>
      <form
        className='relative flex w-full items-center overflow-hidden rounded-xl border border-border bg-card shadow-sm'
        onSubmit={handleFormSubmit}
        role='search'
      >
        <Icons.search className='pointer-events-none absolute inset-s-3.5 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground sm:inset-s-4 sm:h-5 sm:w-5' />
        <Input
          ref={inputRef}
          id='marketplace-search-input'
          type='search'
          inputMode='search'
          enterKeyHint='search'
          autoCapitalize='off'
          value={draft}
          onChange={handleSearchChange}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={t('marketplace.searchPlaceholder')}
          role='combobox'
          aria-expanded={showDropdown}
          aria-controls={listId}
          autoComplete='off'
          maxLength={MARKETPLACE_SEARCH_MAX_LEN}
          spellCheck={false}
          className='h-12 w-full rounded-none border-0 bg-transparent ps-10 pe-11 text-base shadow-none outline-none ring-0 ring-offset-0 appearance-none focus-visible:border-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 sm:ps-12 [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden'
        />
        {draft ? (
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={clearSearch}
            className='absolute inset-e-2 top-1/2 z-10 h-8 w-8 -translate-y-1/2 rounded-full p-0'
            aria-label={t('aria.clearSearch')}
          >
            <Icons.close className='h-4 w-4' />
          </Button>
        ) : null}
      </form>

      {showDropdown ? (
        <div
          id={listId}
          role='listbox'
          className='absolute inset-x-0 top-[calc(100%+0.4rem)] z-50 overflow-hidden rounded-2xl border border-border bg-card shadow-xl'
        >
          <div className='flex items-center gap-2 border-b border-border/70 px-3.5 py-2.5'>
            <Icons.tag className='h-4 w-4 text-primary' />
            <p className='text-sm font-semibold text-foreground'>
              {t('marketplace.searchModelsHeading')}
            </p>
            <span className='ms-auto rounded-full bg-primary/15 px-2 py-0.5 text-xs font-bold text-primary'>
              {totalGroups || suggestions.length}
            </span>
          </div>

          <ul className='max-h-80 overflow-y-auto py-1.5' aria-busy={loading}>
            {loading && suggestions.length === 0 ? <ModelSuggestionsSkeleton /> : null}
            {!loading && suggestions.length === 0 ? (
              <li className='px-4 py-6 text-center text-sm text-muted-foreground'>
                {t('marketplace.noProductsFound')}
              </li>
            ) : null}
            {suggestions.map((item) => (
              <li key={item.modelKey}>
                <button
                  type='button'
                  role='option'
                  className={cn(
                    'flex w-full items-center gap-3 px-3.5 py-2.5 text-start transition-colors',
                    'hover:bg-muted/70 focus-visible:bg-muted/70 focus-visible:outline-none'
                  )}
                  onClick={() => handleSelect(item)}
                >
                  <span className='relative h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-border/70 bg-muted/40'>
                    <Image
                      src={item.imageUrl || PLACEHOLDER_PRODUCT_IMAGE}
                      alt=''
                      fill
                      unoptimized
                      className='object-contain p-1'
                      sizes='44px'
                    />
                  </span>
                  <span className='min-w-0 flex-1'>
                    <span className='block truncate text-sm font-semibold text-foreground'>
                      {item.title}
                    </span>
                    <span className='mt-0.5 block text-xs text-muted-foreground'>
                      {t('marketplace.modelListingCount', { count: item.count })}
                    </span>
                  </span>
                  <Icons.chevronRight className='h-4 w-4 shrink-0 text-muted-foreground rtl:rotate-180' />
                </button>
              </li>
            ))}
          </ul>

          <button
            type='button'
            className='flex w-full items-center justify-center border-t border-border/70 px-3.5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted/60'
            onClick={handleSearchAll}
          >
            {t('marketplace.searchAll')}
          </button>
        </div>
      ) : null}
    </div>
  );
}
