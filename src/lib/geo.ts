import { googleMapsEmbedUrl, googleMapsSearchUrl } from '@/constants/api';

export function distanceKm(
  fromLat: number,
  fromLng: number,
  toLat: number,
  toLng: number
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(toLat - fromLat);
  const dLng = toRad(toLng - fromLng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(fromLat)) * Math.cos(toRad(toLat)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function formatDistanceKm(km: number): string {
  if (!Number.isFinite(km)) return '';
  if (km < 1) return `${Math.max(50, Math.round(km * 1000))} m`;
  if (km < 10) return `${km.toFixed(1)} km`;
  return `${Math.round(km)} km`;
}

export function buildMapEmbedSrc(lat: number, lng: number): string {
  return googleMapsEmbedUrl(lat, lng);
}

export function buildGoogleMapsUrl(lat: number, lng: number): string {
  return googleMapsSearchUrl(lat, lng);
}

export function hasStoreCoords<
  T extends { latitude?: number | null; longitude?: number | null }
>(store: T | null | undefined): store is T & { latitude: number; longitude: number } {
  return (
    !!store &&
    store.latitude != null &&
    store.longitude != null &&
    Number.isFinite(store.latitude) &&
    Number.isFinite(store.longitude)
  );
}
