import { ImageResponse } from 'next/og';
import { SITE_NAME, SITE_TAGLINE } from '@/config/site-config';

export const runtime = 'nodejs';
export const alt = `${SITE_NAME} - ${SITE_TAGLINE}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px',
          background: 'linear-gradient(135deg, #090e17 0%, #0f172a 60%, #064e3b 100%)',
          color: '#ffffff',
          fontFamily: 'sans-serif'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              borderRadius: '9999px',
              padding: '8px 20px',
              fontSize: '20px',
              fontWeight: 600,
              color: '#34d399'
            }}
          >
            KPK Mobile Marketplace
          </div>
          <div style={{ fontSize: '20px', color: '#94a3b8', fontWeight: 500 }}>
            www.ronaqstores.com
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ fontSize: '64px', fontWeight: 800, letterSpacing: '-0.02em', color: '#ffffff' }}>
            {SITE_NAME}
          </div>
          <div style={{ fontSize: '30px', color: '#cbd5e1', fontWeight: 500, lineHeight: 1.3 }}>
            {SITE_TAGLINE}
          </div>
          <div style={{ fontSize: '22px', color: '#94a3b8', marginTop: '8px' }}>
            Timergara · Lower Dir · Swat · Batkhela · Chakdara
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            borderTop: '1px solid rgba(148, 163, 184, 0.2)',
            paddingTop: '24px',
            fontSize: '18px',
            color: '#a7f3d0'
          }}
        >
          <span>✓ Verified Local Shops</span>
          <span>✓ Live Smartphone Prices</span>
          <span>✓ PTA Approval Status</span>
          <span>✓ Direct WhatsApp Chat</span>
        </div>
      </div>
    ),
    { ...size }
  );
}

