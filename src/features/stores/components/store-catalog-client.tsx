'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ProductFilters } from '@/components/products/product-filters';
import { ProductGrid } from '@/components/products/product-grid';
import { ProductDetailModal } from '@/components/products/product-detail-modal';
import { Spinner } from '@/components/ui/spinner';
import { getStoreProducts } from '@/features/products/api/service';
import type { StoreCatalogClientProps } from '@/types/store';
import type { StoreProductListItem, StoreProductDetail } from '@/types/product';

export function StoreCatalogClient({
  store,
  initialCategories,
  initialProducts
}: StoreCatalogClientProps) {
  const t = useTranslations();
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [products, setProducts] = useState(initialProducts);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<StoreProductDetail | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(searchQuery.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    let cancelled = false;

    const hasFilters = Boolean(selectedCategoryId || inStockOnly || debouncedSearch);
    if (!hasFilters) {
      setProducts(initialProducts);
      return;
    }

    setIsLoading(true);
    void getStoreProducts(store.slug, {
      q: debouncedSearch || undefined,
      category: selectedCategoryId || undefined,
      inStock: inStockOnly || undefined,
      limit: 50
    }).then((response) => {
      if (cancelled) return;
      setProducts(response?.items ?? []);
      setIsLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [store.slug, selectedCategoryId, inStockOnly, debouncedSearch, initialProducts]);

  const handleSelectProduct = (product: StoreProductListItem) => {
    const detail: StoreProductDetail = {
      ...product,
      description: null,
      images: product.primaryImageUrl
        ? [{ id: '1', url: product.primaryImageUrl, sortOrder: 0 }]
        : []
    };
    setSelectedProduct(detail);
  };

  return (
    <div className='mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-8 space-y-6'>
      <ProductFilters
        categories={initialCategories}
        selectedCategoryId={selectedCategoryId}
        inStockOnly={inStockOnly}
        searchQuery={searchQuery}
        onCategorySelect={setSelectedCategoryId}
        onInStockToggle={setInStockOnly}
        onSearchChange={setSearchQuery}
      />

      <div className='flex items-center justify-between text-xs text-muted-foreground'>
        {isLoading ? (
          <span className='inline-flex items-center gap-2'>
            <Spinner className='size-3.5 text-primary' />
            {t('common.loading')}
          </span>
        ) : (
          <span>{t('stores.productsAvailable', { count: products.length })}</span>
        )}
      </div>

      <ProductGrid
        products={products}
        storeName={store.displayName}
        storePhone={store.phoneNumber}
        onSelectProduct={handleSelectProduct}
      />

      <ProductDetailModal
        product={selectedProduct}
        storeName={store.displayName}
        storePhone={store.phoneNumber}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}
