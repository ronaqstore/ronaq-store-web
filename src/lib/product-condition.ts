import type { StoreProductUnit } from '@/types/product';

export type ProductConditionDisplay = 'NEW' | 'USED' | 'MIXED';

export function resolveProductCondition(product: {
  condition?: string | null;
  units?: StoreProductUnit[] | null;
}): ProductConditionDisplay | null {
  const units = product.units ?? [];
  if (units.length > 0) {
    const hasNew = units.some((unit) => unit.condition === 'NEW');
    const hasUsed = units.some((unit) => unit.condition === 'USED');
    if (hasNew && hasUsed) return 'MIXED';
    if (hasUsed) return 'USED';
    if (hasNew) return 'NEW';
  }
  if (product.condition === 'NEW' || product.condition === 'USED') {
    return product.condition;
  }
  return null;
}

export function productConditionMessageKey(
  condition: ProductConditionDisplay
): 'conditionNew' | 'conditionUsed' | 'conditionMixed' {
  if (condition === 'NEW') return 'conditionNew';
  if (condition === 'USED') return 'conditionUsed';
  return 'conditionMixed';
}
