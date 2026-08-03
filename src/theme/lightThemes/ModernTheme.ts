import type { ThemeTypes } from '@/types/themeTypes/ThemeType';

const ModernTheme: ThemeTypes = {
  name: 'ModernTheme',
  dark: false,
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

    lightprimary: '#eef2ff', // Indigo 50
    lightsecondary: '#f5f3ff', // Purple 50 (اصلاح شد از خاکستری به بنفش بسیار روشن)
    lightsuccess: '#ecfdf5', // Green 50
    lighterror: '#fef2f2', // Red 50
    lightwarning: '#fffbeb', // Amber 50

    darkText: '#1f2937', // Gray 800
    lightText: '#64748b', // Slate 500 (خواناتر از خاکستری معمولی)
    darkprimary: '#4f46e5', // Indigo 600
    darksecondary: '#7c3aed', // Purple 600

    borderLight: '#e2e8f0', // Slate 200
    inputBorder: '#cbd5e1', // Slate 300
    containerBg: '#f8fafc', // Slate 50 (حس مدرن‌تر از آبی قبلی)
    surface: '#ffffff',
    'on-surface-variant': '#ffffff',

    facebook: '#4267b2',
    twitter: '#1da1f2',
    linkedin: '#0e76a8',

    gray100: '#f1f5f9', // Slate 100
    primary200: '#e0e7ff', // Indigo 100
    secondary200: '#f3e8ff', // Purple 100
    white: '#FFFFFF',

    // اصلاح Shadeهای Primary (پله‌های رنگی استاندارد Indigo)
    primary300: '#c7d2fe',
    primary400: '#a5b4fc',
    primary500: '#818cf8',
    primary600: '#6366f1', // Base
    primary700: '#4f46e5',
    primary800: '#3730a3',
    primary900: '#1e1b4b',

    // اصلاح Shadeهای Secondary
    secondary400: '#a78bfa',
    secondary600: '#7c3aed',
    secondary800: '#5b21b6',

    // Chart Palette (۲۰ تایی استاندارد و زنده برای لایت)
    chartColor1: '#6366f1',
    chartColor2: '#8b5cf6',
    chartColor3: '#06b6d4',
    chartColor4: '#10b981',
    chartColor5: '#f59e0b',
    chartColor6: '#ef4444',
    chartColor7: '#3b82f6',
    chartColor8: '#ec4899',
    chartColor9: '#f97316',
    chartColor10: '#14b8a6',
    chartColor11: '#64748b',
    chartColor12: '#a855f7',
    chartColor13: '#eab308',
    chartColor14: '#d946ef',
    chartColor15: '#0ea5e9',
    chartColor16: '#84cc16',
    chartColor17: '#475569',
    chartColor18: '#be123c',
    chartColor19: '#4338ca',
    chartColor20: '#15803d'
  }
};

export { ModernTheme };
