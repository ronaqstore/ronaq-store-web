export function slugify(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
    .slice(0, 80);
}

export function toProductKey(name: string, id: string): string {
  const slug = slugify(name) || 'product';
  return `${slug}--${id}`;
}

export function extractProductId(productKey: string): string {
  const trimmed = productKey.trim();
  if (!trimmed) return trimmed;
  const separator = trimmed.lastIndexOf('--');
  if (separator === -1) return trimmed;
  const id = trimmed.slice(separator + 2).trim();
  return id || trimmed;
}

export function productPath(storeSlug: string, productName: string, productId: string): string {
  return `/shop/${storeSlug}/product/${toProductKey(productName, productId)}`;
}
