import createIntlMiddleware from 'next-intl/middleware';
import type { NextRequest, NextResponse } from 'next/server';
import { routing } from '@/i18n/routing';

const handleI18nRouting = createIntlMiddleware(routing);

export function proxy(req: NextRequest): NextResponse {
  return handleI18nRouting(req);
}

export const config = {
  matcher: [
    '/',
    '/(en|ur|ps)/:path*',
    '/((?!api|_next|_vercel|favicon\\.ico|.*\\..*).*)'
  ]
};
