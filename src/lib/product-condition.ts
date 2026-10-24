import type {
  ProductConditionDisplay,
  ProductConditionInput,
  ProductConditionMessageKey
} from '@/types/product';

export type { ProductConditionDisplay } from '@/types/product';

export function resolveProductCondition(
  product: ProductConditionInput
): ProductConditionDisplay | null {
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
): ProductConditionMessageKey {
  if (condition === 'NEW') return 'conditionNew';
  if (condition === 'USED') return 'conditionUsed';
  return 'conditionMixed';
}
