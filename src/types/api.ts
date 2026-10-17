import type { StoreAvailability } from './product';

export interface ApiStore {
  id?: string;
  slug: string;
  displayName: string;
  about?: string | null;
  logoUrl?: string | null;
  bannerUrl?: string | null;
  whatsappNumber?: string | null;
  phoneNumber?: string | null;
  address?: string | null;
  city?: string | null;
  googleMapsUrl?: string | null;
  openingHours?: string | null;
  totalProducts?: number;
}

export interface ApiPaginatedStores {
  items?: ApiStore[];
  total?: number;
  page?: number;
  pageSize?: number;
  limit?: number;
}

export interface ApiProduct {
  id: string;
  name: string;
  brand?: string;
  category?: string;
  price?: number | null;
  contactForPrice?: boolean;
  availability?: StoreAvailability;
  stockCount?: number | null;
  ptaStatus?: string | null;
  images?: string[];
  description?: string | null;
}

export interface ApiPaginatedProducts {
  items?: ApiProduct[];
  total?: number;
  page?: number;
  pageSize?: number;
  limit?: number;
}

export interface ApiFilterOption {
  id: string;
  name: string;
}

export interface ApiCategoriesResponse {
  categories?: ApiFilterOption[];
  brands?: ApiFilterOption[];
}
