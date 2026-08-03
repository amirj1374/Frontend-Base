import type { ThemeTypes } from '@/types/themeTypes/ThemeType';

const DarkModernTheme: ThemeTypes = {
  name: 'DarkModernTheme',
  dark: true,
  variables: {
    'border-color': '#6366f1',
    'carousel-control-size': 10
  },
  colors: {
    primary: '#6366f1', // Modern indigo
    secondary: '#8b5cf6', // Purple
    info: '#06b6d4', // Cyan
    success: '#10b981', // Emerald
    accent: '#f59e0b', // Amber
    warning: '#f59e0b', // Amber
    error: '#ef4444', // Red

    lightprimary: '#1e1b4b', // Indigo-tinted dark bg
    lightsecondary: '#2a1f4a', // Purple-tinted dark bg
    lightsuccess: '#064e3b', // Green 900
    lighterror: '#7f1d1d', // Red 900
    lightwarning: '#78350f', // Amber 900

    darkText: '#f9fafb', // Gray 50
    lightText: '#cbd5e1', // softer slate text

    darkprimary: '#818cf8', // Indigo 400
    darksecondary: '#a78bfa', // Purple 400

    borderLight: '#374151', // dark cool border
    inputBorder: '#475569', // cool slate border

    containerBg: '#111827', // deep modern slate/indigo bg
    surface: '#0f172a', // rich dark slate
    'on-surface-variant': '#e2e8f0', // Slate 200

    facebook: '#4267b2',
    twitter: '#1da1f2',
    linkedin: '#0e76a8',

    gray100: '#1f2937', // Gray 800
    primary200: '#312e81', // Indigo 800
    secondary200: '#5b21b6', // Purple 800
    white: '#FFFFFF',

    // Refined Indigo Shades
    primary300: '#c7d2fe',
    primary400: '#a5b4fc',
    primary500: '#818cf8',
    primary600: '#6366f1',
    primary700: '#4f46e5',
    primary800: '#4338ca',
    primary900: '#312e81',

    // Refined Purple Shades
    secondary400: '#c4b5fd',
    secondary600: '#7c3aed',
    secondary800: '#5b21b6',

    // Chart Specific Palette for DarkModernTheme - kept mostly aligned
    chartColor1: '#6366f1',
    chartColor2: '#8b5cf6',
    chartColor3: '#818cf8',
    chartColor4: '#a78bfa',
    chartColor5: '#06b6d4',
    chartColor6: '#10b981',
    chartColor7: '#f59e0b',
    chartColor8: '#ef4444',

    chartColor9: '#c7d2fe',
    chartColor10: '#a5b4fc',
    chartColor11: '#4f46e5',
    chartColor12: '#4338ca',

    chartColor13: '#22d3ee',
    chartColor14: '#34d399',
    chartColor15: '#fbbf24',
    chartColor16: '#fb7185',

    chartColor17: '#60a5fa',
    chartColor18: '#a3e635',
    chartColor19: '#f472b6',
    chartColor20: '#94a3b8'
  }
};

export { DarkModernTheme };
