/**
 * Theme configuration for the application
 * Colors, typography, spacing, and design tokens
 */

export const THEME = {
  // ============ COLORS ============
  colors: {
    // Dark background colors
    dark: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#0f172a',
      950: '#0a0e27', // Primary background
    },

    // Primary color (purple)
    primary: {
      50: '#faf5ff',
      100: '#f3e8ff',
      200: '#e9d5ff',
      300: '#d8b4fe',
      400: '#c084fc',
      500: '#a855f7',
      600: '#9333ea',
      700: '#7e22ce',
      800: '#6b21a8',
      900: '#581c87',
      950: '#2d0a4e',
    },

    // Secondary color (cyan/turquoise)
    secondary: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#06b6d4',
      600: '#0891b2',
      700: '#0e7490',
      800: '#155e75',
      900: '#164e63',
      950: '#082f49',
    },

    // Accent color (pink)
    accent: {
      50: '#fdf2f8',
      100: '#fce7f3',
      200: '#fbcfe8',
      300: '#f8b4d6',
      400: '#f472b6',
      500: '#ec4899',
      600: '#db2777',
      700: '#be185d',
      800: '#9d174d',
      900: '#831843',
      950: '#500724',
    },

    // Status colors
    success: '#51cf66',
    warning: '#ffa94d',
    error: '#ff7d7d',
    info: '#06b6d4',

    // Semantic colors
    text: {
      primary: '#e0e0e0',
      secondary: '#9ca3af',
      disabled: '#6b7280',
    },

    // Borders
    border: '#374151',
    borderLight: '#4b5563',
  },

  // ============ TYPOGRAPHY ============
  typography: {
    fontFamily: {
      display: "'Poppins', sans-serif",
      body: "'Inter', sans-serif",
      mono: "'JetBrains Mono', monospace",
    },

    fontSize: {
      xs: { size: '12px', lineHeight: '16px' },
      sm: { size: '14px', lineHeight: '20px' },
      base: { size: '16px', lineHeight: '24px' },
      lg: { size: '18px', lineHeight: '28px' },
      xl: { size: '20px', lineHeight: '28px' },
      '2xl': { size: '24px', lineHeight: '32px' },
      '3xl': { size: '30px', lineHeight: '36px' },
      '4xl': { size: '36px', lineHeight: '40px' },
    },

    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },

  // ============ SPACING ============
  spacing: {
    0: '0',
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
    8: '32px',
    10: '40px',
    12: '48px',
    16: '64px',
    20: '80px',
    24: '96px',
  },

  // ============ BORDER RADIUS ============
  borderRadius: {
    none: '0',
    sm: '4px',
    base: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '32px',
    full: '9999px',
  },

  // ============ SHADOWS ============
  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
    'glow-primary': '0 0 20px rgba(168, 85, 247, 0.4)',
    'glow-secondary': '0 0 20px rgba(6, 182, 212, 0.4)',
    'glow-error': '0 0 20px rgba(255, 125, 125, 0.4)',
  },

  // ============ TRANSITIONS ============
  transitions: {
    fast: '150ms ease-in-out',
    base: '300ms ease-in-out',
    slow: '500ms ease-in-out',
  },

  // ============ Z-INDEX ============
  zIndex: {
    hide: -1,
    base: 0,
    dropdown: 10,
    sticky: 20,
    fixed: 30,
    backdrop: 40,
    modal: 50,
    popover: 60,
    tooltip: 70,
  },

  // ============ BREAKPOINTS ============
  breakpoints: {
    xs: '320px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // ============ CONTAINER ============
  container: {
    xs: '320px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
} as const

// ============ UTILITY FUNCTIONS ============

export function getColor(path: string): string {
  const keys = path.split('.')
  let value: any = THEME.colors

  for (const key of keys) {
    value = value[key]
    if (value === undefined) return 'transparent'
  }

  return value
}

export function getFontFamily(type: 'display' | 'body' | 'mono'): string {
  return THEME.typography.fontFamily[type]
}

export function getSpacing(size: keyof typeof THEME.spacing): string {
  return THEME.spacing[size]
}

export function getRadius(size: keyof typeof THEME.borderRadius): string {
  return THEME.borderRadius[size]
}

export function getShadow(name: keyof typeof THEME.shadows): string {
  return THEME.shadows[name]
}

export function getTransition(speed: keyof typeof THEME.transitions): string {
  return THEME.transitions[speed]
}

// ============ CSS VARIABLES ============

export const CSS_VARIABLES = {
  '--color-dark-950': THEME.colors.dark[950],
  '--color-dark-900': THEME.colors.dark[900],
  '--color-dark-800': THEME.colors.dark[800],
  '--color-primary-500': THEME.colors.primary[500],
  '--color-primary-600': THEME.colors.primary[600],
  '--color-secondary-500': THEME.colors.secondary[500],
  '--color-accent-500': THEME.colors.accent[500],
  '--color-success': THEME.colors.success,
  '--color-warning': THEME.colors.warning,
  '--color-error': THEME.colors.error,
  '--color-text-primary': THEME.colors.text.primary,
  '--color-text-secondary': THEME.colors.text.secondary,
  '--font-display': THEME.typography.fontFamily.display,
  '--font-body': THEME.typography.fontFamily.body,
  '--font-mono': THEME.typography.fontFamily.mono,
  '--shadow-md': THEME.shadows.md,
  '--shadow-lg': THEME.shadows.lg,
  '--transition-base': THEME.transitions.base,
} as const
