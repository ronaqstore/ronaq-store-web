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
  condition: string;
  warrantyType: string;
  primaryImageUrl: string | null;
  inStock: boolean;
  totalQuantity: number;
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
  condition: string;
  warrantyType: string;
  description: string | null;
  images: StoreProductImage[];
  inStock: boolean;
  totalQuantity: number;
}

export interface ProductListQuery {
  q?: string;
  categoryId?: string;
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

export interface ProductCardProps {
  product: StoreProductListItem;
  storeName: string;
  storePhone: string;
  onSelectProduct?: (product: StoreProductListItem) => void;
}

export interface ProductGridProps {
  products: StoreProductListItem[];
  storeName: string;
  storePhone: string;
  onSelectProduct?: (product: StoreProductListItem) => void;
}

export interface ProductFiltersProps {
  categories: StoreCategory[];
  selectedCategoryId: string;
  inStockOnly: boolean;
  searchQuery: string;
  onCategorySelect: (categoryId: string) => void;
  onInStockToggle: (inStock: boolean) => void;
  onSearchChange: (search: string) => void;
}

export interface ProductDetailModalProps {
  product: StoreProductDetail | null;
  storeName: string;
  storePhone: string;
  onClose: () => void;
}

