'use client';

import { useTranslations } from 'next-intl';
import { Icons } from '@/components/icons';
import {
  formatPrice,
  buildWhatsAppLink,
  resolveStoreWhatsAppNumber
} from '@/lib/formatters';
import type { StickyMobileCTAProps } from '@/types/product';

export function StickyMobileCTA({ product, store }: StickyMobileCTAProps) {
  const t = useTranslations('catalog');
  const tWhatsapp = useTranslations('whatsapp');

  const storeName = store.displayName || store.name;
  const whatsappNumber = resolveStoreWhatsAppNumber(store);
  const contactNumber = store.phoneNumber?.trim() || '';

  const isOutOfStock = product.availability === 'OUT_OF_STOCK';
  const displayTitle = product.name;
  const formattedPrice = formatPrice(product.retailPrice);
  const whatsappPrice = formattedPrice ?? '';

  const whatsappMessage = isOutOfStock
    ? tWhatsapp('inquireProduct', {
        storeName,
        productName: displayTitle,
        price: whatsappPrice
      })
    : tWhatsapp('buyProduct', {
        storeName,
        productName: displayTitle,
        price: whatsappPrice
      });

  const whatsappHref = whatsappNumber
    ? buildWhatsAppLink(whatsappNumber, whatsappMessage)
    : null;
  const contactHref = contactNumber ? `tel:${contactNumber}` : null;

  if (!whatsappHref && !contactHref) return null;

  return (
    <div className='fixed bottom-0 inset-x-0 z-40 border-t border-border/80 bg-background/95 backdrop-blur-md px-3 sm:px-4 py-2 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] pb-[max(0.5rem,env(safe-area-inset-bottom))] md:hidden'>
      <div className='mx-auto flex max-w-lg items-center justify-between gap-3'>
        <div className='flex flex-col min-w-0 shrink-0'>
          <span className='text-[10px] font-semibold uppercase tracking-wider text-muted-foreground'>
            {t('price')}
          </span>
          <span className='text-base sm:text-lg font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums truncate'>
            {formattedPrice || t('price')}
          </span>
        </div>

        <div className='flex items-center gap-2 flex-1 justify-end min-w-0'>
          {whatsappHref ? (
            <a
              href={whatsappHref}
              target='_blank'
              rel='noopener noreferrer'
              className='flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 sm:px-4 text-xs sm:text-sm font-bold text-white shadow-xs transition-all hover:bg-emerald-700 active:scale-[0.98]'
            >
              <Icons.whatsapp className='h-4 w-4 shrink-0' />
              <span className='truncate'>
                {isOutOfStock ? t('askAvailabilityWhatsApp') : t('orderOnWhatsApp')}
              </span>
            </a>
          ) : null}

          {contactHref ? (
            <a
              href={contactHref}
              aria-label={t('call')}
              className='flex h-11 w-11 min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-xl border border-border/80 bg-card text-foreground shadow-xs transition-colors hover:bg-muted active:scale-[0.98]'
            >
              <Icons.phone className='h-4 w-4 shrink-0' />
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}
