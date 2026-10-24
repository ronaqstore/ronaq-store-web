import type {
  ApiCategoriesResponse,
  ApiPaginatedProducts,
  ApiPaginatedStores,
  ApiProduct,
  ApiStore,
  ApiStoreModel,
  ApiStoreModelDetail
} from '@/types/api';
import type {
  PaginatedStoresResponse,
  StoreListItem,
  StoreProfile
} from '@/types/store';
import type {
  PaginatedProductsResponse,
  StoreCategory,
  StoreModelDetail,
  StoreModelListItem,
  StoreProductDetail,
  StoreProductListItem
} from '@/types/product';
import type {
  ApiMarketplaceProduct,
  ApiPaginatedMarketplaceProducts,
  MarketplaceProduct,
  PaginatedMarketplaceProducts
} from '@/types/marketplace';

function mapStoreItem(raw: ApiStore): StoreListItem {
  return {
    id: raw.id ?? raw.slug,
    slug: raw.slug,
    displayName: raw.displayName,
    name: raw.displayName,
    city: raw.city ?? '',
    address: raw.address ?? null,
    latitude: raw.latitude ?? null,
    longitude: raw.longitude ?? null,
    phone: raw.phoneNumber ?? null,
    phoneNumber: raw.phoneNumber ?? null,
    whatsappNumber: raw.whatsappNumber ?? null,
    description: raw.about ?? null,
    about: raw.about ?? null,
    logoUrl: raw.logoUrl ?? null,
    heroBannerUrl: raw.bannerUrl ?? null,
    bannerUrl: raw.bannerUrl ?? null,
    productCount: raw.totalProducts ?? 0,
    totalProducts: raw.totalProducts ?? 0,
    openingHours: raw.openingHours ?? null
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
    latitude: raw.latitude ?? null,
    longitude: raw.longitude ?? null,
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
  if (status === 'JV') return 'JV';
  if (status === 'BYPASS') return 'BYPASS';
  if (status === 'MDM_BYPASS') return 'MDM_BYPASS';
  return status ?? '';
}

export function mapProduct(raw: ApiProduct): StoreProductListItem {
  const availability = raw.availability ?? 'OUT_OF_STOCK';
  const specs = raw.specs
    ? {
        model: raw.specs.model ?? null,
        color: raw.specs.color ?? null,
        ram: raw.specs.ram ?? null,
        storage: raw.specs.storage ?? null
      }
    : null;
  return {
    id: raw.id,
    name: raw.name,
    sku: raw.sku ?? '',
    categoryId: '',
    categoryName: raw.category ?? '',
    brandId: null,
    brandName: raw.brand ?? null,
    retailPrice: raw.price == null ? '' : String(raw.price),
    ptaStatus: mapPtaStatus(raw.ptaStatus),
    authenticity:
      raw.authenticity === 'ORIGINAL' || raw.authenticity === 'COPY'
        ? raw.authenticity
        : '',
    condition: raw.condition ?? '',
    warrantyType: '',
    trackingType: raw.trackingType,
    modelKey: raw.modelKey ?? null,
    model: raw.specs?.model ?? null,
    color: raw.specs?.color ?? null,
    ram: raw.specs?.ram ?? null,
    storage: raw.specs?.storage ?? null,
    specs,
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
    description: raw.description ?? null,
    units: (raw.units ?? []).map((unit) => ({
      id: unit.id,
      imeiMasked: unit.imeiMasked,
      condition: unit.condition,
      batteryHealth: unit.batteryHealth ?? null,
      price: unit.price == null ? null : String(unit.price),
      defectNotes: unit.defectNotes ?? null
    }))
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

export function mapStoreModel(raw: ApiStoreModel): StoreModelListItem {
  return {
    key: raw.key,
    brand: raw.brand,
    model: raw.model,
    variantCount: raw.variantCount,
    coverImage: raw.coverImage ?? null,
    fromPrice: raw.fromPrice == null ? null : String(raw.fromPrice),
    availability: raw.availability
  };
}

export function mapStoreModels(raw: ApiStoreModel[] | null): StoreModelListItem[] {
  if (!raw) return [];
  return raw.map(mapStoreModel);
}

export function mapStoreModelDetail(raw: ApiStoreModelDetail | null): StoreModelDetail | null {
  if (!raw) return null;
  return {
    key: raw.key,
    brand: raw.brand,
    model: raw.model,
    variants: (raw.variants ?? []).map(mapProduct)
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

export function mapMarketplaceProduct(raw: ApiMarketplaceProduct): MarketplaceProduct {
  const base = mapProduct(raw as ApiProduct);
  return {
    ...base,
    shop: {
      slug: raw.shop.slug,
      displayName: raw.shop.displayName,
      city: raw.shop.city ?? null,
      whatsappNumber: raw.shop.whatsappNumber ?? null
    }
  };
}

export function mapMarketplaceProductsResponse(
  raw: ApiPaginatedMarketplaceProducts | null
): PaginatedMarketplaceProducts | null {
  if (!raw) return null;
  const pageSize = raw.pageSize ?? raw.limit ?? 24;
  const total = raw.total ?? 0;
  const page = raw.page ?? 1;
  return {
    items: (raw.items ?? []).map(mapMarketplaceProduct),
    total,
    page,
    limit: pageSize,
    totalPages: pageSize > 0 ? Math.max(1, Math.ceil(total / pageSize)) : 1
  };
}
