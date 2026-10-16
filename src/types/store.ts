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
  heroBannerUrl: string | null;
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
  logoUrl: string | null;
  heroBannerUrl: string | null;
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
}

export interface StoreHeroProps {
  initialSearch?: string;
  onSearchChange: (search: string) => void;
}

export interface StoreHeaderProps {
  store: StoreProfile;
}

export interface StoreCatalogClientProps {
  store: StoreProfile;
  initialCategories: import('./product').StoreCategory[];
  initialProducts: import('./product').StoreProductListItem[];
}

export interface StoreDiscoveryClientProps {
  initialStores: StoreListItem[];
}




