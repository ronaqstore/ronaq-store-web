import type { ReactNode } from 'react';

export interface StoreWhatsAppContact {
  whatsappNumber?: string | null;
}

export interface StoreListItem {
  id: string;
  name?: string;
  city: string;
  address: string | null;
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
}

export interface StoreProfile {
  id: string;
  slug: string;
  name: string;
  displayName: string;
  city: string;
  address: string | null;
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
  children: ReactNode;
}

export interface StoreHeroProps {
  searchQuery: string;
  onSearchChange: (search: string) => void;
}

export interface StoreHeaderProps {
  store: StoreProfile;
}

export interface StoreCatalogFilters {
  q: string;
  category: string;
  inStock: boolean;
}

export interface StoreCatalogClientProps {
  store: StoreProfile;
  categories: import('./product').StoreCategory[];
  products: import('./product').StoreProductListItem[];
  models: import('./product').StoreModelListItem[];
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
}

export interface StoreDiscoveryResultsProps {
  stores: StoreListItem[];
}




