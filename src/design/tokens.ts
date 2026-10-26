export const designTokens = {
  colors: {
    brand: {
      light: '#16a34a',
      dark: '#22c55e',
      primaryOklchLight: 'oklch(0.55 0.18 152)',
      primaryOklchDark: 'oklch(0.68 0.17 152)'
    },
    surface: {
      light: '#ffffff',
      dark: '#1c1f26'
    },
    surfaceMuted: {
      light: '#f8fafc',
      dark: '#242933'
    },
    border: {
      light: '#e2e8f0',
      dark: '#334155'
    },
    text: {
      light: '#0f172a',
      dark: '#f8fafc'
    },
    textMuted: {
      light: '#64748b',
      dark: '#94a3b8'
    },
    danger: {
      light: '#dc2626',
      dark: '#ef4444'
    },
    success: {
      light: '#16a34a',
      dark: '#22c55e'
    },
    warning: {
      light: '#d97706',
      dark: '#f59e0b'
    }
  },
  spacing: {
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    6: '24px',
    8: '32px',
    12: '48px'
  },
  radius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    full: '9999px'
  },
  elevation: {
    1: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
    2: '0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
    3: '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04)'
  },
  touchTarget: {
    minWidth: '48px',
    minHeight: '48px'
  },
  motion: {
    durationFast: '150ms',
    durationNormal: '200ms',
    durationSlow: '300ms',
    easing: 'cubic-bezier(0, 0, 0.2, 1)'
  },
  typography: {
    heroTitle: {
      mobile: 'text-2xl',
      sm: 'text-3xl',
      md: 'text-4xl',
      lg: 'text-4xl',
      '2xl': 'text-5xl'
    },
    heroSubtitle: {
      mobile: 'text-sm',
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
      '2xl': 'text-lg'
    },
    sectionHeading: {
      mobile: 'text-lg',
      sm: 'text-xl',
      md: 'text-2xl',
      lg: 'text-2xl',
      '2xl': 'text-3xl'
    },
    cardTitle: {
      mobile: 'text-sm',
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-base',
      '2xl': 'text-base'
    },
    cardPrice: {
      mobile: 'text-base',
      sm: 'text-lg',
      md: 'text-lg',
      lg: 'text-lg',
      '2xl': 'text-xl'
    },
    shopCardName: {
      mobile: 'text-base',
      sm: 'text-base',
      md: 'text-lg',
      lg: 'text-lg',
      '2xl': 'text-lg'
    },
    meta: {
      mobile: 'text-xs',
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-sm',
      '2xl': 'text-sm'
    },
    brandLabel: {
      mobile: 'text-[11px]',
      sm: 'text-[11px]',
      md: 'text-xs',
      lg: 'text-xs',
      '2xl': 'text-xs'
    }
  },
  layout: {
    pageMax: 'max-w-7xl 2xl:max-w-[1440px]',
    pagePad: 'px-4 sm:px-6 lg:px-8',
    appBarCssVar: '--app-bar-h',
    touchMinPx: 48
  }
} as const;
