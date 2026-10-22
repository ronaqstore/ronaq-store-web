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
  latitude?: number | null;
  longitude?: number | null;
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

export interface ApiProductSpecs {
  model?: string | null;
  color?: string | null;
  ram?: string | null;
  storage?: string | null;
}

export interface ApiProduct {
  id: string;
  name: string;
  brand?: string;
  category?: string;
  price?: number | null;
  availability?: StoreAvailability;
  stockCount?: number | null;
  ptaStatus?: string | null;
  authenticity?: 'ORIGINAL' | 'COPY' | null;
  sku?: string | null;
  condition?: string | null;
  trackingType?: 'SERIALIZED' | 'QUANTITY';
  modelKey?: string | null;
  images?: string[];
  description?: string | null;
  specs?: ApiProductSpecs | null;
  units?: ApiStoreUnit[] | null;
}

export interface ApiStoreUnit {
  id: string;
  imeiMasked: string;
  condition: 'NEW' | 'USED';
  batteryHealth?: number | null;
  price: number | null;
  defectNotes?: string | null;
}

export interface ApiStoreModel {
  key: string;
  brand: string;
  model: string;
  variantCount: number;
  coverImage?: string | null;
  fromPrice?: number | null;
  availability: StoreAvailability;
}

export interface ApiStoreModelDetail {
  key: string;
  brand: string;
  model: string;
  variants: ApiProduct[];
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
