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
  category?: string;
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

export type MarketplaceSearchParamValue = string | string[] | undefined;

export interface MarketplaceFilterParseInput {
  condition?: MarketplaceSearchParamValue;
  minPrice?: MarketplaceSearchParamValue;
  maxPrice?: MarketplaceSearchParamValue;
  inStock?: MarketplaceSearchParamValue;
  pta?: MarketplaceSearchParamValue;
  authenticity?: MarketplaceSearchParamValue;
  sort?: MarketplaceSearchParamValue;
  category?: MarketplaceSearchParamValue;
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

export type MarketplaceFilterSectionKey =
  | 'condition'
  | 'price'
  | 'availability'
  | 'pta'
  | 'authenticity';

export interface MarketplaceFilterSectionProps {
  title: string;
  open?: boolean;
  onToggle?: () => void;
  defaultOpen?: boolean;
  children: ReactNode;
}

export interface MarketplacePriceFilterSectionProps {
  minPriceRs?: number;
  maxPriceRs?: number;
  onChange: (patch: { minPriceRs?: number; maxPriceRs?: number }) => void;
  open: boolean;
  onToggle: () => void;
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

export type PwaInstallOutcome = 'accepted' | 'dismissed' | 'unavailable';

export interface UsePwaInstallResult {
  canPrompt: boolean;
  isStandalone: boolean;
  isIos: boolean;
  promptInstall: () => Promise<PwaInstallOutcome>;
}

export interface InstallAppButtonProps {
  className?: string;
}

export interface CityPreferenceResolution {
  cityId: string;
  hasPreference: boolean;
}

export interface MarketplaceSearchBarProps {
  committedQuery: string;
  cityId: string;
  modelKey: string | null;
  onCommitSearch: (query: string) => void;
  onSelectModel: (model: MarketplaceModelSuggestion) => void;
  onClearSearch: () => void;
}

export interface MarketplaceProductCardProps {
  product: MarketplaceProduct;
  priority?: boolean;
  prefetch?: boolean;
}

export interface QuickFilterChipsProps {
  filters: MarketplaceListingFilters;
  onChange: (next: MarketplaceListingFilters) => void;
  className?: string;
}

export interface ActiveFilterChipItem {
  id: string;
  label: string;
  onRemove: () => void;
}

export interface ActiveFilterChipsProps {
  filters: MarketplaceListingFilters;
  searchQuery?: string;
  modelKey?: string | null;
  onChange: (next: MarketplaceListingFilters) => void;
  onClearSearch?: () => void;
  onClearAll: () => void;
  className?: string;
}

export interface FilterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: MarketplaceListingFilters;
  onApplyFilters: (filters: MarketplaceListingFilters) => void;
  totalResults?: number;
}

export interface EmptyStateProps {
  title?: string;
  description?: string;
  onAction?: () => void;
  actionLabel?: string;
  className?: string;
}

export interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

export interface OfflineBannerProps {
  className?: string;
}

export interface BottomNavProps {
  className?: string;
}

export type MarketplaceSortValue = 'newest' | 'price_asc' | 'price_desc';

export interface MarketplaceSortOption {
  value: MarketplaceSortValue;
  label: string;
}

export interface MarketplaceSortDropdownProps {
  value?: MarketplaceSortValue;
  onChange: (value: MarketplaceSortValue) => void;
  className?: string;
}
