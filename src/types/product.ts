export type StoreAvailability = 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';

export interface StoreCategory {
  id: string;
  name: string;
  slug: string;
  productCount: number;
}

export interface StoreProductImage {
  id: string;
  url: string;
  sortOrder: number;
}

export interface ProductSpecs {
  model: string | null;
  color: string | null;
  ram: string | null;
  storage: string | null;
}

export interface StoreProductUnit {
  id: string;
  imeiMasked: string;
  condition: 'NEW' | 'USED';
  batteryHealth: number | null;
  price: string | null;
  defectNotes: string | null;
}

export interface StoreProductListItem {
  id: string;
  name: string;
  sku: string;
  categoryId: string;
  categoryName: string;
  brandId: string | null;
  brandName: string | null;
  retailPrice: string;
  ptaStatus: string;
  authenticity: 'ORIGINAL' | 'COPY' | '';
  condition: string;
  warrantyType: string;
  trackingType?: 'SERIALIZED' | 'QUANTITY';
  modelKey?: string | null;
  model?: string | null;
  color?: string | null;
  ram?: string | null;
  storage?: string | null;
  specs?: ProductSpecs | null;
  primaryImageUrl: string | null;
  images?: StoreProductImage[];
  availability: StoreAvailability;
  stockCount: number | null;
  inStock: boolean;
  totalQuantity: number;
  description?: string | null;
  units?: StoreProductUnit[];
}

export interface StoreProductDetail {
  id: string;
  name: string;
  sku: string;
  categoryId: string;
  categoryName: string;
  brandId: string | null;
  brandName: string | null;
  retailPrice: string;
  ptaStatus: string;
  authenticity: 'ORIGINAL' | 'COPY' | '';
  condition: string;
  warrantyType: string;
  trackingType?: 'SERIALIZED' | 'QUANTITY';
  model?: string | null;
  color?: string | null;
  ram?: string | null;
  storage?: string | null;
  specs?: ProductSpecs | null;
  description: string | null;
  images: StoreProductImage[];
  availability: StoreAvailability;
  stockCount: number | null;
  inStock: boolean;
  totalQuantity: number;
}

export interface ProductListQuery {
  q?: string;
  category?: string;
  inStock?: boolean;
  page?: number;
  limit?: number;
}

export interface PaginatedProductsResponse {
  items: StoreProductListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface StoreModelListItem {
  key: string;
  brand: string;
  model: string;
  variantCount: number;
  coverImage: string | null;
  fromPrice: string | null;
  availability: StoreAvailability;
}

export interface StoreModelDetail {
  key: string;
  brand: string;
  model: string;
  variants: StoreProductListItem[];
}

export interface ProductCardProps {
  product: StoreProductListItem;
  storeSlug?: string;
  storeName?: string;
  storePhone?: string;
  onSelectProduct?: (product: StoreProductListItem) => void;
  priority?: boolean;
  linkToModel?: boolean;
}

export interface ModelVariantsClientProps {
  variants: StoreProductListItem[];
  storeSlug: string;
  storeName: string;
  storePhone: string;
  isAppleBrand: boolean;
}

export interface ModelCardProps {
  model: StoreModelListItem;
  storeSlug: string;
  priority?: boolean;
}

export interface ModelDetailViewProps {
  locale: string;
  slug: string;
  store: import('./store').StoreProfile;
  model: StoreModelDetail;
}

export interface ProductGridProps {
  products: StoreProductListItem[];
  storeSlug: string;
  storeName: string;
  storePhone: string;
  onSelectProduct?: (product: StoreProductListItem) => void;
  linkToModel?: boolean;
}

export interface ProductGridSkeletonProps {
  count?: number;
  className?: string;
}

export interface ProductFiltersProps {
  categories: StoreCategory[];
  selectedCategoryId: string;
  searchQuery: string;
  onCategorySelect: (categoryId: string) => void;
  onSearchChange: (search: string) => void;
}

export interface FacetedFilterOption {
  label: string;
  value: string;
}

export interface FacetedFilterProps {
  title: string;
  options: FacetedFilterOption[];
  value: string;
  onChange: (value: string) => void;
  allLabel?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export interface ProductDetailModalProps {
  product: StoreProductDetail | null;
  storeName?: string;
  storePhone?: string;
  onClose: () => void;
}

export interface ProductImageGalleryProps {
  images: StoreProductImage[];
  productName: string;
}

export interface ProductDetailViewProps {
  locale: string;
  slug: string;
  store: import('./store').StoreProfile;
  product: StoreProductDetail;
  relatedProducts?: StoreProductListItem[];
}

export interface StockBadgeProps {
  availability: StoreAvailability;
  stockCount: number | null;
}
