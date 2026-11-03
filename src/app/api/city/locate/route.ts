import { NextResponse } from 'next/server';
import { IP_LOOKUP_URL } from '@/constants/api';
import { resolveNearestHub } from '@/features/marketplace/api/service';
import type { IpWhoIsResponse, LocateCityApiResponse } from '@/types/marketplace';

export async function GET(request: Request): Promise<NextResponse<LocateCityApiResponse>> {
  try {
    let lat: number | null = null;
    let lng: number | null = null;

    const vercelLat = request.headers.get('x-vercel-ip-latitude');
    const vercelLng = request.headers.get('x-vercel-ip-longitude');
    const cfLat = request.headers.get('cf-iplatitude');
    const cfLng = request.headers.get('cf-iplongitude');

    if (vercelLat && vercelLng) {
      lat = Number.parseFloat(vercelLat);
      lng = Number.parseFloat(vercelLng);
    } else if (cfLat && cfLng) {
      lat = Number.parseFloat(cfLat);
      lng = Number.parseFloat(cfLng);
    }

    if (lat === null || lng === null || Number.isNaN(lat) || Number.isNaN(lng)) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 2500);
      try {
        const ipRes = await fetch(IP_LOOKUP_URL, {
          signal: controller.signal,
          headers: { Accept: 'application/json' }
        });
        clearTimeout(timer);
        if (ipRes.ok) {
          const ipData = (await ipRes.json()) as IpWhoIsResponse;
          if (typeof ipData.latitude === 'number' && typeof ipData.longitude === 'number') {
            lat = ipData.latitude;
            lng = ipData.longitude;
          }
        }
      } catch {
        clearTimeout(timer);
      }
    }

    if (lat !== null && lng !== null && !Number.isNaN(lat) && !Number.isNaN(lng)) {
      const hub = await resolveNearestHub(lat, lng);
      return NextResponse.json({ hub });
    }

    return NextResponse.json({ hub: null });
  } catch {
    return NextResponse.json({ hub: null });
  }
}
