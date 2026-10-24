import type { Metadata } from 'next';
import { APP_DESCRIPTION, APP_NAME, SEO_KEYWORDS } from '@/constants/site';
import { env } from '@/config/env';
import { absoluteLocaleUrl, absoluteUrl, getSiteUrl } from '@/lib/seo/site-url';
import { locales } from '@/i18n/request';
import type { CatalogSearchParams, HomeSearchParams } from '@/types/common';
import type { BuildMetadataInput } from '@/types/seo';

export const DEFAULT_OG_IMAGE = '/icons/icon-512.png';
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

function languageAlternates(path: string): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of locales) {
    languages[locale] = absoluteLocaleUrl(locale, path);
  }
  languages['x-default'] = absoluteLocaleUrl('en', path);
  return languages;
}

export function buildPageMetadata({
  locale,
  title,
  description,
  path = '/',
  canonicalPath,
  images,
  type = 'website',
  noIndex = false,
  keywords = SEO_KEYWORDS
}: BuildMetadataInput): Metadata {
  const cleanPath = canonicalPath ?? path;
  const canonical = absoluteLocaleUrl(locale, cleanPath);
  const ogImages =
    images && images.length > 0
      ? images.map((image) => ({
          url: image.url.startsWith('http') ? image.url : absoluteUrl(image.url),
          width: image.width ?? OG_IMAGE_WIDTH,
          height: image.height ?? OG_IMAGE_HEIGHT,
          alt: image.alt ?? title
        }))
      : [
          {
            url: absoluteUrl(DEFAULT_OG_IMAGE),
            width: OG_IMAGE_WIDTH,
            height: OG_IMAGE_HEIGHT,
            alt: APP_NAME
          }
        ];

  const clippedTitle = title.length > 60 ? `${title.slice(0, 57)}...` : title;
  const clippedDescription =
    description.length > 160 ? `${description.slice(0, 157)}...` : description;

  const ogLocale = locale === 'ur' ? 'ur_PK' : locale === 'ps' ? 'ps_AF' : 'en_US';

  return {
    title: clippedTitle,
    description: clippedDescription,
    keywords,
    alternates: {
      canonical,
      languages: languageAlternates(cleanPath)
    },
    openGraph: {
      title: clippedTitle,
      description: clippedDescription,
      url: canonical,
      siteName: APP_NAME,
      locale: ogLocale,
      type,
      images: ogImages
    },
    twitter: {
      card: 'summary_large_image',
      title: clippedTitle,
      description: clippedDescription,
      images: ogImages.map((image) => image.url)
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          googleBot: { index: false, follow: false, noimageindex: true }
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1
          }
        }
  };
}

export function rootMetadataBase(): URL {
  return new URL(getSiteUrl());
}

export function defaultRootMetadata(): Metadata {
  const siteUrl = getSiteUrl();
  const verification = env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim();

  return {
    metadataBase: rootMetadataBase(),
    title: {
      default: `${APP_NAME} — Discover Local Mobile Shops`,
      template: `%s | ${APP_NAME}`
    },
    description: APP_DESCRIPTION,
    keywords: SEO_KEYWORDS,
    applicationName: APP_NAME,
    authors: [{ name: APP_NAME, url: siteUrl }],
    creator: APP_NAME,
    publisher: APP_NAME,
    formatDetection: {
      telephone: false,
      email: false,
      address: false
    },
    alternates: {
      canonical: absoluteLocaleUrl('en', '/')
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1
      }
    },
    openGraph: {
      title: APP_NAME,
      description: APP_DESCRIPTION,
      url: absoluteLocaleUrl('en', '/'),
      siteName: APP_NAME,
      locale: 'en_US',
      type: 'website',
      images: [
        {
          url: absoluteUrl(DEFAULT_OG_IMAGE),
          width: OG_IMAGE_WIDTH,
          height: OG_IMAGE_HEIGHT,
          alt: APP_NAME
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: APP_NAME,
      description: APP_DESCRIPTION,
      images: [absoluteUrl(DEFAULT_OG_IMAGE)]
    },
    ...(verification ? { verification: { google: verification } } : {})
  };
}

export function isSearchNoIndex(
  searchParams: CatalogSearchParams | HomeSearchParams
): boolean {
  return Object.entries(searchParams).some(([key, value]) => {
    if (key === 'rf') return false;
    if (value == null) return false;
    const raw = Array.isArray(value) ? value[0] : value;
    if (typeof raw !== 'string') return false;
    return raw.trim().length > 0;
  });
}
