import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const isVercelPreview = Boolean(process.env.VERCEL_ENV) && process.env.VERCEL_ENV !== 'production';

const baseConfig: NextConfig = {
  devIndicators: false,
  output: process.env.BUILD_STANDALONE === 'true' ? 'standalone' : undefined,
  trailingSlash: false,
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [320, 400, 640, 750, 800, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 60 * 60 * 24 * 7,
    qualities: [65, 75],
    remotePatterns: [
      { protocol: 'https', hostname: '**.r2.dev' },
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'i.picsum.photos' },
      { protocol: 'https', hostname: 'fastly.picsum.photos' },
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'http', hostname: '127.0.0.1' },
      { protocol: 'https', hostname: 'localhost' },
      { protocol: 'https', hostname: '127.0.0.1' }
    ]
  },

  allowedDevOrigins: ['127.0.0.1'],
  experimental: {
    optimizePackageImports: ['@tabler/icons-react'],
    inlineCss: true
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          ...(process.env.NODE_ENV === 'production'
            ? [{ key: 'X-Frame-Options', value: 'SAMEORIGIN' }]
            : []),
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self)'
          },
          ...(isVercelPreview
            ? [{ key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' }]
            : []),
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com https://www.googletagmanager.com chrome-extension:",
              "style-src 'self' 'unsafe-inline' chrome-extension:",
              "img-src 'self' data: blob: https: chrome-extension:",
              "font-src 'self' data: chrome-extension:",
              "connect-src 'self' https: http://localhost:* http://127.0.0.1:* ws: wss: chrome-extension:",
              "frame-src 'self' https://www.google.com https://maps.google.com chrome-extension:",
              process.env.NODE_ENV === 'production'
                ? "frame-ancestors 'self' chrome-extension:"
                : "frame-ancestors 'self' http://localhost:* http://127.0.0.1:* chrome-extension: chrome-extension://*",
              "base-uri 'self'",
              "form-action 'self'",
              "object-src 'none'"
            ].join('; ')
          },
          ...(process.env.NODE_ENV === 'production'
            ? [
                {
                  key: 'Strict-Transport-Security',
                  value: 'max-age=63072000; includeSubDomains; preload'
                }
              ]
            : [])
        ]
      },
      {
        source: '/icons/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        source: '/placeholders/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      }
    ];
  },

  async redirects() {
    return [
      {
        source: '/home',
        destination: '/en',
        permanent: true
      },
      {
        source: '/stores',
        destination: '/en',
        permanent: true
      },
      {
        source: '/stores/:slug',
        destination: '/en/shop/:slug',
        permanent: true
      }
    ];
  }
};

export default withNextIntl(baseConfig);
