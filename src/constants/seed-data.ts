import { GOOGLE_MAPS_BASE_URL } from '@/constants/api';
import type { StoreProfile } from '@/types/store';
import type { StoreCategory, StoreProductListItem } from '@/types/product';

export const SEED_CATEGORIES: StoreCategory[] = [
  { id: 'cat-1', name: 'Smartphones', slug: 'smartphones', productCount: 3 },
  { id: 'cat-2', name: 'Chargers & Adapters', slug: 'chargers', productCount: 2 },
  { id: 'cat-3', name: 'Audio & Earbuds', slug: 'audio', productCount: 2 },
  { id: 'cat-4', name: 'Cables & Accessories', slug: 'accessories', productCount: 1 }
];

export const SEED_PRODUCTS: StoreProductListItem[] = [
  {
    id: 'prod-1',
    name: 'iPhone 15 Pro Max 256GB Natural Titanium',
    sku: 'IPH-15PM-256',
    categoryId: 'cat-1',
    categoryName: 'Smartphones',
    brandId: 'brand-apple',
    brandName: 'Apple',
    retailPrice: '48500000',
    ptaStatus: 'APPROVED',
    condition: 'Brand New',
    warrantyType: '1 Year Apple Official',
    primaryImageUrl: null,
    inStock: true,
    totalQuantity: 5
  },
  {
    id: 'prod-2',
    name: 'Samsung Galaxy S24 Ultra 512GB Titanium Gray',
    sku: 'SAM-S24U-512',
    categoryId: 'cat-1',
    categoryName: 'Smartphones',
    brandId: 'brand-samsung',
    brandName: 'Samsung',
    retailPrice: '39500000',
    ptaStatus: 'APPROVED',
    condition: 'Brand New',
    warrantyType: '1 Year Official Warranty',
    primaryImageUrl: null,
    inStock: true,
    totalQuantity: 3
  },
  {
    id: 'prod-3',
    name: 'Xiaomi Redmi Note 13 Pro 8GB/256GB Midnight Black',
    sku: 'XIA-RN13P-256',
    categoryId: 'cat-1',
    categoryName: 'Smartphones',
    brandId: 'brand-xiaomi',
    brandName: 'Xiaomi',
    retailPrice: '6499900',
    ptaStatus: 'APPROVED',
    condition: 'Brand New',
    warrantyType: 'Official Warranty',
    primaryImageUrl: null,
    inStock: true,
    totalQuantity: 8
  },
  {
    id: 'prod-4',
    name: 'Anker 65W GaN II 3-Port Fast Charger Adapter',
    sku: 'ANK-65W-GAN',
    categoryId: 'cat-2',
    categoryName: 'Chargers & Adapters',
    brandId: 'brand-anker',
    brandName: 'Anker',
    retailPrice: '750000',
    ptaStatus: 'NA',
    condition: 'Brand New',
    warrantyType: '18 Months Replacement',
    primaryImageUrl: null,
    inStock: true,
    totalQuantity: 15
  },
  {
    id: 'prod-5',
    name: 'Baseus 20W PD Quick Charger USB-C',
    sku: 'BAS-20W-PD',
    categoryId: 'cat-2',
    categoryName: 'Chargers & Adapters',
    brandId: 'brand-baseus',
    brandName: 'Baseus',
    retailPrice: '280000',
    ptaStatus: 'NA',
    condition: 'Brand New',
    warrantyType: '6 Months Warranty',
    primaryImageUrl: null,
    inStock: true,
    totalQuantity: 20
  },
  {
    id: 'prod-6',
    name: 'Apple AirPods Pro 2nd Gen with USB-C MagSafe Case',
    sku: 'APP-APP2-USBC',
    categoryId: 'cat-3',
    categoryName: 'Audio & Earbuds',
    brandId: 'brand-apple',
    brandName: 'Apple',
    retailPrice: '6800000',
    ptaStatus: 'NA',
    condition: 'Brand New',
    warrantyType: '1 Year International',
    primaryImageUrl: null,
    inStock: true,
    totalQuantity: 6
  },
  {
    id: 'prod-7',
    name: 'Samsung Galaxy Buds 2 Pro Graphite',
    sku: 'SAM-BUDS2P-GR',
    categoryId: 'cat-3',
    categoryName: 'Audio & Earbuds',
    brandId: 'brand-samsung',
    brandName: 'Samsung',
    retailPrice: '3200000',
    ptaStatus: 'NA',
    condition: 'Brand New',
    warrantyType: '1 Year Official',
    primaryImageUrl: null,
    inStock: true,
    totalQuantity: 4
  },
  {
    id: 'prod-8',
    name: 'Remax 65W Braided Fast Charging Type-C to Type-C Cable',
    sku: 'RMX-CC-65W',
    categoryId: 'cat-4',
    categoryName: 'Cables & Accessories',
    brandId: 'brand-remax',
    brandName: 'Remax',
    retailPrice: '120000',
    ptaStatus: 'NA',
    condition: 'Brand New',
    warrantyType: '3 Months Warranty',
    primaryImageUrl: null,
    inStock: true,
    totalQuantity: 45
  }
];

export function getSeedStoreProfile(slug: string): StoreProfile {
  const formattedName = slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return {
    id: `seed-${slug}`,
    slug,
    name: formattedName,
    displayName: formattedName,
    city: 'Lahore',
    address: 'Main Hafeez Centre Market, Gulberg III',
    phoneNumber: '03001234567',
    whatsappNumber: '03001234567',
    description: `Welcome to ${formattedName}. We provide 100% genuine mobile phones, original chargers, and tech accessories with official warranty and instant WhatsApp customer service.`,
    logoUrl: null,
    heroBannerUrl: null,
    googleMapsUrl: `${GOOGLE_MAPS_BASE_URL}`,
    openingHours: '11:00 AM - 10:00 PM (Mon-Sat)'
  };
}
