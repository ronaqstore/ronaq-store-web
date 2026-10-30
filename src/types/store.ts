import type { ReactNode } from 'react';

export type OpenStatusKind = 'open' | 'closed' | 'unknown';

export interface OpenStatus {
  status: OpenStatusKind;
  closesAt: string | null;
  opensAt: string | null;
}

export interface MinutesRange {
  open: number;
  close: number;
}

export interface StoreWhatsAppContact {
  whatsappNumber?: string | null;
}

export interface StoreListItem {
  id: string;
  name?: string;
  city: string;
  address: string | null;
  latitude?: number | null;
  longitude?: number | null;
  phone?: string | null;
  phoneNumber?: string | null;
  whatsappNumber?: string | null;
  slug: string;
  displayName: string;
  description: string | null;
  about?: string | null;
  heroBannerUrl: string | null;
  bannerUrl?: string | null;
  logoUrl: string | null;
  productCount?: number;
  totalProducts?: number;
  openingHours?: string | null;
}

export interface StoreProfile {
  id: string;
  slug: string;
  name: string;
  displayName: string;
  city: string;
  address: string | null;
  latitude?: number | null;
  longitude?: number | null;
  phoneNumber: string;
  whatsappNumber: string | null;
  description: string | null;
  about?: string | null;
  logoUrl: string | null;
  heroBannerUrl: string | null;
  bannerUrl?: string | null;
  googleMapsUrl: string | null;
  openingHours: string | null;
}

export interface StoreMapEmbedProps {
  store: Pick<
    StoreListItem | StoreProfile,
    'displayName' | 'name' | 'address' | 'city' | 'latitude' | 'longitude'
  >;
  className?: string;
  heightClassName?: string;
}

export interface StoreMapLinkProps {
  store: StoreListItem | StoreProfile;
  triggerClassName?: string;
  children?: ReactNode;
}

export interface StoreListQuery {
  q?: string;
  city?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedStoresResponse {
  items: StoreListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface StoreCardProps {
  store: StoreListItem;
  priority?: boolean;
}

export interface StoreDiscoveryShellProps {
  searchQuery: string;
  cityId: string;
  selectedCityName: string | null;
  hasCityPreference: boolean;
  children: ReactNode;
}

export interface StoreSearchBarProps {
  committedQuery: string;
  cityId: string;
  onCommitSearch: (search: string) => void;
  onSelectStore: (store: StoreListItem) => void;
  onClearSearch: () => void;
}

export interface StoreHeaderProps {
  store: StoreProfile;
}

export interface StoreCatalogFilters {
  q: string;
  category: string;
  inStock: boolean;
}

export interface StoreCatalogShellProps {
  storeSlug: string;
  categories: import('./product').StoreCategory[];
  filters: StoreCatalogFilters;
  children: ReactNode;
}

export interface StoreCatalogFeedProps {
  store: StoreProfile;
  initialProducts: import('./product').StoreProductListItem[];
  allModels: import('./product').StoreModelListItem[];
  productsTotal: number;
  productsPage: number;
  productsTotalPages: number;
  filters: StoreCatalogFilters;
}

export interface StoreCatalogSectionProps {
  store: StoreProfile;
  filters: StoreCatalogFilters;
}

export interface ShopPageViewProps {
  locale: string;
  store: StoreProfile;
  filters: StoreCatalogFilters;
}

export interface StoreDiscoverySectionProps {
  searchQuery: string;
  cityId: string;
}

export interface StoreDiscoveryFeedProps {
  initialStores: StoreListItem[];
  total: number;
  page: number;
  totalPages: number;
  searchQuery: string;
  cityId: string;
  initialFetchFailed?: boolean;
}
