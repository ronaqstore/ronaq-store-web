import {
  CITY_PREFERENCE_ALL,
  CITY_PREFERENCE_COOKIE,
  CITY_PREFERENCE_MAX_AGE_SECONDS
} from '@/constants/city-preference';
import type { CityPreferenceResolution } from '@/types/marketplace';

export function parseCityPreference(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const value = raw.trim().toLowerCase();
  if (!value) return null;
  if (value.startsWith('area:')) return CITY_PREFERENCE_ALL;
  return value;
}

export function writeCityPreferenceCookie(cityId: string): void {
  if (typeof document === 'undefined') return;
  const value = cityId.trim().toLowerCase() || CITY_PREFERENCE_ALL;
  const secure =
    typeof window !== 'undefined' && window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${CITY_PREFERENCE_COOKIE}=${encodeURIComponent(value)}; path=/; max-age=${CITY_PREFERENCE_MAX_AGE_SECONDS}; SameSite=Lax${secure}`;
}

export function marketplaceCityQueryParam(cityId: string | null | undefined): string | undefined {
  const value = parseCityPreference(cityId);
  if (!value || value === CITY_PREFERENCE_ALL) return undefined;
  return value;
}

export function resolveCityPreferenceFromCookie(
  raw: string | undefined | null
): CityPreferenceResolution {
  if (!raw?.trim()) {
    return { cityId: CITY_PREFERENCE_ALL, hasPreference: false };
  }
  const parsed = parseCityPreference(raw);
  if (!parsed) {
    return { cityId: CITY_PREFERENCE_ALL, hasPreference: false };
  }
  return { cityId: parsed, hasPreference: true };
}
