import type { ReactNode } from 'react';
import type { MarketplaceModelSuggestion } from '@/types/marketplace';
import type { StoreProductListItem } from '@/types/product';
import type { StoreListItem } from '@/types/store';

export interface TypeaheadItem {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl?: string | null;
  imageFit?: 'contain' | 'cover';
}

export interface TypeaheadSearchResult<T extends TypeaheadItem = TypeaheadItem> {
  items: T[];
  total: number;
}

export interface ModelTypeaheadItem extends TypeaheadItem {
  model: MarketplaceModelSuggestion;
}

export interface ShopTypeaheadItem extends TypeaheadItem {
  store: StoreListItem;
}

export interface ProductTypeaheadItem extends TypeaheadItem {
  product: StoreProductListItem;
}

export interface TypeaheadSearchBarProps<T extends TypeaheadItem = TypeaheadItem> {
  committedQuery: string;
  placeholder: string;
  heading: string;
  emptyLabel: string;
  searchAllLabel: string;
  headingIcon?: ReactNode;
  disabled?: boolean;
  rootClassName?: string;
  formClassName?: string;
  inputClassName?: string;
  clearButtonClassName?: string;
  searchIconClassName?: string;
  onCommitSearch: (q: string) => void;
  onClearSearch: () => void;
  onSelectItem: (item: T) => void;
  fetchSuggestions: (q: string) => Promise<TypeaheadSearchResult<T>>;
  draftFromSelection?: (item: T) => string;
}
