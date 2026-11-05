import createIntlMiddleware from 'next-intl/middleware';
import type { NextRequest, NextResponse } from 'next/server';
import { env } from '@/config/env';
import { routing } from '@/i18n/routing';

const handleI18nRouting = createIntlMiddleware(routing);

function isNonProductionDeployment(host: string | null): boolean {
  if (env.VERCEL_ENV && env.VERCEL_ENV !== 'production') {
    return true;
  }
  if (!host) return false;
  const normalized = host.split(':')[0].toLowerCase();
  return normalized.endsWith('.vercel.app') || normalized.includes('preview');
}

export function proxy(req: NextRequest): NextResponse {
  const res = handleI18nRouting(req);
  const host = req.headers.get('host');
  if (isNonProductionDeployment(host)) {
    res.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
  }
  return res;
}

export const config = {
  matcher: [
    '/',
    '/(en|ur|ps|roman)/:path*',
    '/((?!api|_next|_vercel|favicon\\.ico|.*\\..*).*)'
  ]
};
