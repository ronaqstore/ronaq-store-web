import type { ReactNode } from 'react';
import type { StoreProductDetail } from '@/types/product';
import type { StoreProfile } from '@/types/store';

export type JsonLdGraph = Record<string, unknown> | Array<Record<string, unknown>>;

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export interface JsonLdProps {
  data: JsonLdGraph;
  id?: string;
}

export interface MetadataImageInput {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
}

export interface BuildMetadataInput {
  locale: string;
  title: string;
  description: string;
  path?: string;
  canonicalPath?: string;
  images?: MetadataImageInput[];
  type?: 'website' | 'article';
  noIndex?: boolean;
  keywords?: string[];
}

export interface ProductJsonLdInput {
  locale: string;
  store: StoreProfile;
  product: StoreProductDetail;
  productPath: string;
}

export interface CollectionItemRef {
  name: string;
  path: string;
}

export interface CollectionPageJsonLdInput {
  locale: string;
  name: string;
  description: string;
  path: string;
  items: CollectionItemRef[];
}

export interface FaqEntry {
  question: string;
  answer: string;
}

export interface ProductStaticParam {
  locale: string;
  slug: string;
  productId: string;
}

export interface RootLayoutProps {
  children: ReactNode;
}
