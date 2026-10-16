import en from '../../messages/en.json';
import ur from '../../messages/ur.json';
import ps from '../../messages/ps.json';

export type AppLocaleName = 'en' | 'ur' | 'ps';

const catalogs: Record<AppLocaleName, Record<string, unknown>> = { en, ur, ps };
const defaultCatalogLocale: AppLocaleName = 'en';

function getMessage(catalog: Record<string, unknown>, key: string): string | undefined {
  if (!key) return undefined;
  let value: unknown = catalog;

  for (const segment of key.split('.')) {
    if (typeof value !== 'object' || value === null || !(segment in value)) {
      return undefined;
    }
    value = (value as Record<string, unknown>)[segment];
  }

  return typeof value === 'string' ? value : undefined;
}

export function staticT(key: string): string {
  if (!key) return '';
  let locale: AppLocaleName = defaultCatalogLocale;
  if (typeof window !== 'undefined') {
    const match = window.location.pathname.match(/^\/(en|ur|ps)(\/|$)/);
    if (match) {
      locale = match[1] as AppLocaleName;
    }
  }

  const catalog = catalogs[locale] ?? catalogs.en;
  return getMessage(catalog, key) ?? getMessage(catalogs.en, key) ?? key;
}
