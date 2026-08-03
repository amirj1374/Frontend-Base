import type { ThemeTypes } from '@/types/themeTypes/ThemeType';

const FutureBlueTheme: ThemeTypes = {
  name: 'FutureBlueTheme',
  dark: false,
  variables: {
    'border-color': '#00A6FF', // Luminous Blue
    'carousel-control-size': 10
  },
  colors: {
    primary: '#00A6FF', // Luminous Blue (رنگ اصلی ۲۰۲۷)
    secondary: '#64748B', // Cyber Silver (Slate 500)

    info: '#00BFFF',
    success: '#10B981',
    accent: '#7C3AED', // بنفش درخشان برای مکمل
    warning: '#F59E0B',
    error: '#EF4444',

    lightprimary: '#E0F4FF', // آبی بسیار روشن و شفاف
    lightsecondary: '#F1F5F9', // نقره‌ای بسیار روشن
    lightsuccess: '#ECFDF5',
    lighterror: '#FEF2F2',
    lightwarning: '#FFFBEB',

    darkText: '#0F172A', // Slate 900
    lightText: '#475569', // Slate 600

    darkprimary: '#007ACC', // آبی عمیق‌تر
    darksecondary: '#334155', // نقره‌ای تیره

    borderLight: '#E2E8F0', // مرزهای ظریف
    inputBorder: '#94A3B8', // فوکوس ورودی‌ها

    containerBg: '#F8FAFF', // پس‌زمینه سفید با هاله بسیار کم آبی
    surface: '#FFFFFF',
    'on-surface-variant': '#FFFFFF',

    facebook: '#1877F2',
    twitter: '#1DA1F2',
    linkedin: '#0A66C2',
    gray100: '#F1F5F9',

    primary200: '#BAE6FF',
    secondary200: '#CBD5E1',
    white: '#FFFFFF',

    // Shades برای Luminous Blue (2027)
    primary300: '#7DD3FF',
    primary400: '#38BDF8',
    primary500: '#00A6FF', // Base
    primary600: '#0284C7',
    primary700: '#0369A1',
    primary800: '#075985',
    primary900: '#0C4A6E',

    secondary400: '#94A3B8',
    secondary600: '#475569',
    secondary800: '#1E293B',

    // Chart Palette: ترکیبی از آبی‌های آینده‌نگرانه و نئونی
    chartColor1: '#00A6FF', // Luminous Blue
    chartColor2: '#7C3AED', // Accent Purple
    chartColor3: '#10B981', // Success Green
    chartColor4: '#64748B', // Cyber Silver
    chartColor5: '#F59E0B', // Amber
    chartColor6: '#0EA5E9', // Sky
    chartColor7: '#38BDF8',
    chartColor8: '#8B5CF6',
    chartColor9: '#EC4899', // Pink Neon
    chartColor10: '#06B6D4', // Cyan
    chartColor11: '#14B8A6',
    chartColor12: '#F43F5E',
    chartColor13: '#6366F1',
    chartColor14: '#84CC16',
    chartColor15: '#F97316',
    chartColor16: '#0F172A',
    chartColor17: '#94A3B8',
    chartColor18: '#007ACC',
    chartColor19: '#BAE6FF',
    chartColor20: '#E2E8F0'
  }
};

export { FutureBlueTheme };
