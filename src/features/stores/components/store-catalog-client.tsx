'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { ProductFilters } from '@/components/products/product-filters';
import { ProductGrid } from '@/components/products/product-grid';
import { ProductDetailModal } from '@/components/products/product-detail-modal';
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
  const [selectedProduct, setSelectedProduct] = useState<StoreProductDetail | null>(null);

  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      if (selectedCategoryId && product.categoryId !== selectedCategoryId) {
        return false;
      }
      if (inStockOnly && !product.inStock) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesBrand = product.brandName?.toLowerCase().includes(query);
        const matchesCategory = product.categoryName.toLowerCase().includes(query);
        const matchesSku = product.sku.toLowerCase().includes(query);
        if (!matchesName && !matchesBrand && !matchesCategory && !matchesSku) {
          return false;
        }
      }
      return true;
    });
  }, [initialProducts, selectedCategoryId, inStockOnly, searchQuery]);

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
        <span>{t('stores.productsAvailable', { count: filteredProducts.length })}</span>
      </div>

      <ProductGrid
        products={filteredProducts}
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
