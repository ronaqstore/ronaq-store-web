import type { ReactNode } from 'react';
import type { StoreAvailability, StoreProductListItem } from './product';

export interface MarketplaceHub {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

export interface MarketplaceHubsQuery {
  page?: number;
  limit?: number;
  q?: string;
}

export interface ApiPaginatedMarketplaceHubs {
  items?: MarketplaceHub[];
  total?: number;
  page?: number;
  pageSize?: number;
  limit?: number;
}

export interface MarketplaceHubsPage {
  items: MarketplaceHub[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface MarketplaceShopSummary {
  slug: string;
  displayName: string;
  city: string | null;
  whatsappNumber: string | null;
}

export interface MarketplaceProduct extends StoreProductListItem {
  shop: MarketplaceShopSummary;
}

export interface MarketplaceListingFilters {
  condition?: 'NEW' | 'USED';
  minPriceRs?: number;
  maxPriceRs?: number;
  inStock?: boolean;
  ptaStatus?: 'PTA_APPROVED' | 'NON_PTA' | 'JV' | 'BYPASS' | 'MDM_BYPASS';
  authenticity?: 'ORIGINAL' | 'COPY';
  sort?: 'newest' | 'price_asc' | 'price_desc';
}

export interface MarketplaceProductListQuery {
  q?: string;
  city?: string;
  modelKey?: string;
  category?: string;
  brand?: string;
  inStock?: boolean;
  condition?: 'NEW' | 'USED';
  minPrice?: number;
  maxPrice?: number;
  ptaStatus?: MarketplaceListingFilters['ptaStatus'];
  authenticity?: MarketplaceListingFilters['authenticity'];
  sort?: MarketplaceListingFilters['sort'];
  page?: number;
  limit?: number;
}

export interface MarketplaceModelSuggestion {
  modelKey: string;
  brand: string;
  model: string;
  title: string;
  count: number;
  imageUrl: string | null;
  minPrice: number | null;
}

export interface MarketplaceModelsResponse {
  items: MarketplaceModelSuggestion[];
  total: number;
}

export interface ApiMarketplaceModelSuggestion {
  modelKey?: string;
  brand?: string;
  model?: string;
  title?: string;
  count?: number;
  imageUrl?: string | null;
  minPrice?: number | null;
}

export interface ApiMarketplaceModelsResponse {
  items?: ApiMarketplaceModelSuggestion[];
  total?: number;
}

export interface PaginatedMarketplaceProducts {
  items: MarketplaceProduct[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiMarketplaceShop {
  slug: string;
  displayName: string;
  city?: string | null;
  whatsappNumber?: string | null;
}

export interface ApiMarketplaceProduct {
  id: string;
  name: string;
  brand?: string;
  category?: string;
  price?: number | null;
  availability?: StoreAvailability;
  stockCount?: number | null;
  ptaStatus?: string | null;
  authenticity?: 'ORIGINAL' | 'COPY' | null;
  trackingType?: 'SERIALIZED' | 'QUANTITY';
  modelKey?: string | null;
  images?: string[];
  description?: string | null;
  specs?: {
    model?: string | null;
    color?: string | null;
    ram?: string | null;
    storage?: string | null;
  } | null;
  shop: ApiMarketplaceShop;
}

export interface ApiPaginatedMarketplaceProducts {
  items?: ApiMarketplaceProduct[];
  total?: number;
  page?: number;
  pageSize?: number;
  limit?: number;
}

export interface CityPreferenceGateProps {
  initialCityId: string | null;
  hasPreference: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export interface MarketplaceShellProps {
  searchQuery: string;
  modelKey: string | null;
  cityId: string;
  selectedCityName: string | null;
  hasCityPreference: boolean;
  filters: MarketplaceListingFilters;
  children: ReactNode;
}

export interface MarketplaceSectionProps {
  searchQuery: string;
  modelKey: string | null;
  cityId: string;
  filters: MarketplaceListingFilters;
}

export interface MarketplaceFeedProps {
  initialProducts: MarketplaceProduct[];
  total: number;
  page: number;
  totalPages: number;
  searchQuery: string;
  modelKey: string | null;
  cityId: string;
  filters: MarketplaceListingFilters;
}

export interface MarketplaceFiltersBarProps {
  filters: MarketplaceListingFilters;
  onChange: (next: MarketplaceListingFilters) => void;
  className?: string;
  showHeader?: boolean;
}

export interface MarketplaceFilterParseInput {
  condition?: string;
  minPrice?: string;
  maxPrice?: string;
  inStock?: string;
  pta?: string;
  authenticity?: string;
  sort?: string;
}

export interface MarketplaceHomeQueryInput {
  q?: string;
  modelKey?: string | null;
  cityId: string;
  filters?: MarketplaceListingFilters;
}

export interface MarketplaceNavigateHomeInput {
  q?: string;
  modelKey?: string | null;
  filters?: MarketplaceListingFilters;
}

export interface MarketplaceModelsSearchQuery {
  q: string;
  city?: string;
  limit?: number;
  signal?: AbortSignal;
}

export interface MarketplaceFilterSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}

export interface MarketplaceFilterOptionRowProps {
  active: boolean;
  label: string;
  onClick: () => void;
  shape?: 'radio' | 'check';
}

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export interface InstallPromptProps {
  className?: string;
}

export interface CityPreferenceResolution {
  cityId: string;
  hasPreference: boolean;
}

export interface MarketplaceSearchBarProps {
  searchQuery: string;
  onSearchChange: (search: string) => void;
  cityId: string;
  modelKey: string | null;
  onSelectModel: (model: MarketplaceModelSuggestion) => void;
  onSearchAll: (query: string) => void;
  onClearModel: () => void;
}

export interface MarketplaceProductCardProps {
  product: MarketplaceProduct;
  priority?: boolean;
}
