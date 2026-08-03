import type { ThemeTypes } from '@/types/themeTypes/ThemeType';

const SilverTheme: ThemeTypes = {
  name: 'SilverTheme',
  dark: false,
  variables: {
    'border-color': '#64748B',
    'carousel-control-size': 10
  },
  colors: {
    primary: '#64748B', // Slate 500
    secondary: '#94A3B8', // Slate 400

    info: '#0EA5E9',
    success: '#10B981',
    accent: '#F59E0B',
    warning: '#F59E0B',
    error: '#EF4444',

    lightprimary: '#F1F5F9',
    lightsecondary: '#F8FAFC',
    lightsuccess: '#ECFDF5',
    lighterror: '#FEF2F2',
    lightwarning: '#FFFBEB',

    darkText: '#1E293B',
    lightText: '#64748B',

    darkprimary: '#475569',
    darksecondary: '#64748B',

    borderLight: '#E2E8F0',
    inputBorder: '#CBD5E1',

    containerBg: '#F8FAFC', // اصلاح: به جای آبی‌مایه، slate 50 واقعی
    surface: '#FFFFFF',
    'on-surface-variant': '#FFFFFF',

    facebook: '#4267b2',
    twitter: '#1da1f2',
    linkedin: '#0e76a8',

    gray100: '#F8FAFC',
    primary200: '#E2E8F0',
    secondary200: '#F1F5F9',
    white: '#FFFFFF',

    // Primary shades - اصلاح به طیف واقعی Slate
    primary300: '#CBD5E1',
    primary400: '#94A3B8',
    primary500: '#64748B',
    primary600: '#475569',
    primary700: '#334155',
    primary800: '#1E293B',
    primary900: '#0F172A',

    // Secondary shades - lighter slate family
    secondary400: '#CBD5E1',
    secondary600: '#64748B',
    secondary800: '#475569',

    // Chart palette - خنثی، حرفه‌ای، مناسب light silver
    chartColor1: '#64748B',
    chartColor2: '#94A3B8',
    chartColor3: '#475569',
    chartColor4: '#0EA5E9',
    chartColor5: '#10B981',
    chartColor6: '#334155',
    chartColor7: '#CBD5E1',
    chartColor8: '#F59E0B',
    chartColor9: '#6366F1',
    chartColor10: '#8B5CF6',
    chartColor11: '#EC4899',
    chartColor12: '#F43F5E',
    chartColor13: '#06B6D4',
    chartColor14: '#84CC16',
    chartColor15: '#14B8A6',
    chartColor16: '#F97316',
    chartColor17: '#A855F7',
    chartColor18: '#1E293B',
    chartColor19: '#D1D5DB',
    chartColor20: '#52525B'
  }
};

export { SilverTheme };
