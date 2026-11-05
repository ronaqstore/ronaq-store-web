import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/config/site-config';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/cart',
          '/checkout',
          '/account',
          '/orders',
          '/login',
          '/register',
          '/*?*q=*',
          '/*?*sort=*',
          '/*?*filter=*',
          '/*?*utm_*'
        ]
      }
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL
  };
}
