import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getPublicStores } from '@/features/stores/api/service';
import { StoreDiscoveryClient } from '@/features/stores/components/store-discovery-client';
import type { StoreListItem } from '@/types/store';

const SEED_STORES: StoreListItem[] = [
  {
    id: 'seed-store-1',
    name: 'Hafeez Tech Zone',
    displayName: 'Hafeez Tech Zone',
    city: 'Lahore',
    address: 'Shop #42, 2nd Floor, Hafeez Centre, Main Boulevard Gulberg',
    phone: '03001234567',
    slug: 'hafeez-tech-zone',
    description: 'Official retailers for iPhone, Samsung Galaxy, Xiaomi, and high-wattage fast chargers. 100% PTA approved devices.',
    heroBannerUrl: null,
    logoUrl: null,
    productCount: 24
  },
  {
    id: 'seed-store-2',
    name: 'Karachi Cellular Hub',
    displayName: 'Karachi Cellular Hub',
    city: 'Karachi',
    address: 'Shop G-15, Star City Mall, Saddar',
    phone: '03219876543',
    slug: 'karachi-cellular-hub',
    description: 'Specialists in brand new smartphones, wireless earbuds, protective cases, and tempered glass protectors.',
    heroBannerUrl: null,
    logoUrl: null,
    productCount: 38
  },
  {
    id: 'seed-store-3',
    name: 'Islamabad Mobile Gallery',
    displayName: 'Islamabad Mobile Gallery',
    city: 'Islamabad',
    address: 'Shop #8, Beverly Centre, Blue Area',
    phone: '03335551234',
    slug: 'islamabad-mobile-gallery',
    description: 'Premium electronics store offering latest flagship smartphones, smartwatches, and original accessories.',
    heroBannerUrl: null,
    logoUrl: null,
    productCount: 19
  },
  {
    id: 'seed-store-4',
    name: 'Pindi Phone Centre',
    displayName: 'Pindi Phone Centre',
    city: 'Rawalpindi',
    address: 'Shop 11, Singapore Plaza, Bank Road, Saddar',
    phone: '03456789012',
    slug: 'pindi-phone-centre',
    description: 'Wholesale & retail mobile accessories, fast chargers, power banks, and certified pre-owned smartphones.',
    heroBannerUrl: null,
    logoUrl: null,
    productCount: 31
  }
];

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata');
  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description')
    }
  };
}

export default async function HomePage() {
  const response = await getPublicStores({ limit: 50 });
  const stores = response && response.items.length > 0 ? response.items : SEED_STORES;

  return <StoreDiscoveryClient initialStores={stores} />;
}
