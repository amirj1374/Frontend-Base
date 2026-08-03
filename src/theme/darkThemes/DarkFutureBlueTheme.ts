import type { ThemeTypes } from '@/types/themeTypes/ThemeType';

const DarkFutureBlueTheme: ThemeTypes = {
  name: 'DarkFutureBlueTheme',
  dark: true,
  variables: {
    'border-color': '#1D4ED8',
    'carousel-control-size': 10
  },
  colors: {
    primary: '#38BDF8', // luminous blue for dark surfaces
    secondary: '#94A3B8', // cyber silver

    info: '#00BFFF',
    success: '#22C55E',
    accent: '#8B5CF6',
    warning: '#F59E0B',
    error: '#EF4444',

    lightprimary: '#0F2A3D',
    lightsecondary: '#1E293B',
    lightsuccess: '#052E1A',
    lighterror: '#3A0D13',
    lightwarning: '#3B2A05',

    darkText: '#F8FAFC',
    lightText: '#CBD5E1',

    darkprimary: '#7DD3FC',
    darksecondary: '#E2E8F0',

    borderLight: '#334155',
    inputBorder: '#475569',

    containerBg: '#020817', // deep futuristic navy
    surface: '#0F172A',
    'on-surface-variant': '#111827',

    facebook: '#4267B2',
    twitter: '#1DA1F2',
    linkedin: '#0E76A8',
    gray100: '#1E293B',

    primary200: '#0EA5E9',
    secondary200: '#334155',
    white: '#FFFFFF',

    // luminous blue scale for dark theme
    primary300: '#7DD3FF',
    primary400: '#38BDF8',
    primary500: '#0EA5E9',
    primary600: '#0284C7',
    primary700: '#0369A1',
    primary800: '#075985',
    primary900: '#0C4A6E',

    secondary400: '#94A3B8',
    secondary600: '#64748B',
    secondary800: '#334155',

    chartColor1: '#38BDF8',
    chartColor2: '#8B5CF6',
    chartColor3: '#22C55E',
    chartColor4: '#94A3B8',
    chartColor5: '#F59E0B',
    chartColor6: '#06B6D4',
    chartColor7: '#7DD3FF',
    chartColor8: '#A78BFA',
    chartColor9: '#F472B6',
    chartColor10: '#14B8A6',
    chartColor11: '#F97316',
    chartColor12: '#6366F1',
    chartColor13: '#84CC16',
    chartColor14: '#EF4444',
    chartColor15: '#E2E8F0',
    chartColor16: '#0F172A',
    chartColor17: '#334155',
    chartColor18: '#0284C7',
    chartColor19: '#64748B',
    chartColor20: '#CBD5E1'
  }
};

export { DarkFutureBlueTheme };
