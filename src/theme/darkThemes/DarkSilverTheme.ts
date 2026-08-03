import type { ThemeTypes } from '@/types/themeTypes/ThemeType';

const DarkSilverTheme: ThemeTypes = {
  name: 'DarkSilverTheme',
  dark: true,
  variables: {
    'border-color': '#94a3b8',
    'carousel-control-size': 10
  },
  colors: {
    primary: '#94a3b8', // Bright Silver (Slate 400)
    secondary: '#cbd5e1', // Light Silver (Slate 300)
    info: '#38bdf8',
    success: '#34d399',
    accent: '#fbbf24',
    warning: '#fbbf24',
    error: '#f87171',
    lightprimary: '#1e293b', // Slate 800 background
    lightsecondary: '#334155', // Slate 700 background
    lightsuccess: '#064e3b',
    lighterror: '#7f1d1d',
    lightwarning: '#78350f',
    darkText: '#f8fafc', // Pure light slate text
    lightText: '#94a3b8', // Muted slate text
    darkprimary: '#64748b', // Slate 500
    darksecondary: '#475569', // Slate 600
    borderLight: '#334155', // Slate 700 border
    inputBorder: '#475569', // Slate 600 input border
    containerBg: '#0f172a', // Slate 900 base background
    surface: '#1e293b', // Slate 800 surface
    'on-surface-variant': '#334155',
    facebook: '#4267b2',
    twitter: '#1da1f2',
    linkedin: '#0e76a8',
    gray100: '#0f172a',
    primary200: '#cbd5e1',
    secondary200: '#94a3b8',
    white: '#ffffff',

    // Corrected Primary Shades (Slate/Silver)
    primary300: '#e2e8f0', // Slate 100
    primary400: '#cbd5e1', // Slate 200
    primary500: '#94a3b8', // Slate 400
    primary600: '#64748b', // Slate 500
    primary700: '#475569', // Slate 600
    primary800: '#334155', // Slate 700
    primary900: '#1e293b', // Slate 800

    // Corrected Secondary Shades
    secondary400: '#94a3b8',
    secondary600: '#64748b',
    secondary800: '#334155', // Slate 500
    // Chart Specific Palette for DarkSilverTheme - 20 Colors
    chartColor1: '#94a3b8', // Primary silver
    chartColor2: '#cbd5e1', // Secondary light silver
    chartColor3: '#64748b', // Slate 500
    chartColor4: '#475569', // Slate 600
    chartColor5: '#98bbea', // Soft silver-blue
    chartColor6: '#7493bc', // Medium steel blue
    chartColor7: '#38bdf8', // Info sky blue
    chartColor8: '#34d399', // Success emerald
    chartColor9: '#fbbf24', // Accent amber
    chartColor10: '#f87171', // Error red

    chartColor11: '#22d3ee', // Cyan
    chartColor12: '#60a5fa', // Blue
    chartColor13: '#818cf8', // Indigo
    chartColor14: '#a78bfa', // Violet
    chartColor15: '#f472b6', // Pink
    chartColor16: '#fb7185', // Rose
    chartColor17: '#4ade80', // Green
    chartColor18: '#2dd4bf', // Teal
    chartColor19: '#f59e0b', // Orange
    chartColor20: '#e2e8f0' // Very light slate
  }
};

export { DarkSilverTheme };
