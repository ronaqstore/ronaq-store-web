import type {
  ApiCategoriesResponse,
  ApiPaginatedProducts,
  ApiPaginatedStores,
  ApiProduct,
  ApiStore
} from '@/types/api';
import type {
  PaginatedStoresResponse,
  StoreListItem,
  StoreProfile
} from '@/types/store';
import type {
  PaginatedProductsResponse,
  StoreCategory,
  StoreProductDetail,
  StoreProductListItem
} from '@/types/product';

function mapStoreItem(raw: ApiStore): StoreListItem {
  return {
    id: raw.id ?? raw.slug,
    slug: raw.slug,
    displayName: raw.displayName,
    name: raw.displayName,
    city: raw.city ?? '',
    address: raw.address ?? null,
    phone: raw.phoneNumber ?? null,
    phoneNumber: raw.phoneNumber ?? null,
    whatsappNumber: raw.whatsappNumber ?? null,
    description: raw.about ?? null,
    about: raw.about ?? null,
    logoUrl: raw.logoUrl ?? null,
    heroBannerUrl: raw.bannerUrl ?? null,
    bannerUrl: raw.bannerUrl ?? null,
    productCount: raw.totalProducts ?? 0,
    totalProducts: raw.totalProducts ?? 0
  };
}

export function mapStoresResponse(raw: ApiPaginatedStores | null): PaginatedStoresResponse | null {
  if (!raw) return null;
  const pageSize = raw.pageSize ?? raw.limit ?? 50;
  const total = raw.total ?? 0;
  const page = raw.page ?? 1;
  return {
    items: (raw.items ?? []).map(mapStoreItem),
    total,
    page,
    limit: pageSize,
    totalPages: pageSize > 0 ? Math.max(1, Math.ceil(total / pageSize)) : 1
  };
}

export function mapStoreProfile(raw: ApiStore | null): StoreProfile | null {
  if (!raw) return null;
  return {
    id: raw.id ?? raw.slug,
    slug: raw.slug,
    name: raw.displayName,
    displayName: raw.displayName,
    city: raw.city ?? '',
    address: raw.address ?? null,
    phoneNumber: raw.phoneNumber ?? '',
    whatsappNumber: raw.whatsappNumber ?? null,
    description: raw.about ?? null,
    about: raw.about ?? null,
    logoUrl: raw.logoUrl ?? null,
    heroBannerUrl: raw.bannerUrl ?? null,
    bannerUrl: raw.bannerUrl ?? null,
    googleMapsUrl: raw.googleMapsUrl ?? null,
    openingHours: raw.openingHours ?? null
  };
}

function mapPtaStatus(status?: string | null): string {
  if (status === 'PTA_APPROVED') return 'APPROVED';
  if (status === 'NON_PTA') return 'NON_PTA';
  return status ?? '';
}

function mapProduct(raw: ApiProduct): StoreProductListItem {
  const availability = raw.availability ?? 'OUT_OF_STOCK';
  return {
    id: raw.id,
    name: raw.name,
    sku: '',
    categoryId: '',
    categoryName: raw.category ?? '',
    brandId: null,
    brandName: raw.brand ?? null,
    retailPrice: raw.contactForPrice || raw.price == null ? '' : String(raw.price),
    contactForPrice: Boolean(raw.contactForPrice),
    ptaStatus: mapPtaStatus(raw.ptaStatus),
    condition: '',
    warrantyType: '',
    primaryImageUrl: raw.images?.[0] ?? null,
    images: (raw.images ?? []).map((url, index) => ({
      id: `${raw.id}-${index}`,
      url,
      sortOrder: index
    })),
    availability,
    stockCount: raw.stockCount ?? null,
    inStock: availability !== 'OUT_OF_STOCK',
    totalQuantity: raw.stockCount ?? 0,
    description: raw.description ?? null
  };
}

export function mapProductsResponse(
  raw: ApiPaginatedProducts | null
): PaginatedProductsResponse | null {
  if (!raw) return null;
  const pageSize = raw.pageSize ?? raw.limit ?? 50;
  const total = raw.total ?? 0;
  const page = raw.page ?? 1;
  return {
    items: (raw.items ?? []).map(mapProduct),
    total,
    page,
    limit: pageSize,
    totalPages: pageSize > 0 ? Math.max(1, Math.ceil(total / pageSize)) : 1
  };
}

export function mapProductDetail(raw: ApiProduct | null): StoreProductDetail | null {
  if (!raw) return null;
  const base = mapProduct(raw);
  return {
    ...base,
    description: raw.description ?? null,
    images: base.images ?? []
  };
}

export function mapCategoriesResponse(
  raw: ApiCategoriesResponse | StoreCategory[] | null
): StoreCategory[] {
  if (!raw) return [];
  if (Array.isArray(raw)) {
    return raw.map((item) => ({
      id: item.id,
      name: item.name,
      slug: 'slug' in item && typeof item.slug === 'string' ? item.slug : item.id,
      productCount:
        'productCount' in item && typeof item.productCount === 'number' ? item.productCount : 0
    }));
  }
  return (raw.categories ?? []).map((item) => ({
    id: item.id,
    name: item.name,
    slug: item.id,
    productCount: 0
  }));
}
