import type { MetadataRoute } from 'next';
import {
  APP_DESCRIPTION,
  APP_ID,
  APP_NAME,
  APP_SHORT_NAME,
  PWA_BACKGROUND_COLOR,
  PWA_THEME_COLOR_LIGHT
} from '@/constants/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: APP_NAME,
    short_name: APP_SHORT_NAME,
    description: APP_DESCRIPTION,
    id: APP_ID,
    lang: 'en',
    dir: 'auto',
    start_url: '/?source=pwa',
    scope: '/',
    display: 'standalone',
    display_override: ['standalone', 'minimal-ui'],
    orientation: 'any',
    theme_color: PWA_THEME_COLOR_LIGHT,
    background_color: PWA_BACKGROUND_COLOR,
    categories: ['shopping', 'business'],
    prefer_related_applications: false,
    icons: [
      {
        src: '/placeholders/shop-logo.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any'
      }
    ]
  };
}
