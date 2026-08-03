import type { ThemeTypes } from '@/types/themeTypes/ThemeType';

const TealTheme: ThemeTypes = {
  name: 'TealTheme',
  dark: false,
  variables: {
    'border-color': '#00695C',
    'carousel-control-size': 10
  },
  colors: {
    primary: '#00695C', // Teal 800
    secondary: '#4DB6AC', // Teal 300

    info: '#03c9d7',
    success: '#00c853',
    accent: '#FFAB91',
    warning: '#ffc107',
    error: '#f44336',

    lightprimary: '#E0F2F1', // Teal 50/100 vibe
    lightsecondary: '#F0FDFA', // تمیزتر و سبک‌تر
    lightsuccess: '#E8F5E9', // اصلاح: استاندارد لایت
    lighterror: '#FEECEC',
    lightwarning: '#FFF8E1',

    darkText: '#111827',
    lightText: '#6B7280',

    darkprimary: '#004D40', // Teal 900
    darksecondary: '#00796B', // Teal 700

    borderLight: '#E5E7EB', // مدرن‌تر
    inputBorder: '#CBD5E1', // هماهنگ با استاندارد جدید

    containerBg: '#F6FBFA', // اصلاح: به‌جای سبز شدید، بک‌گراند لطیف teal-tint
    surface: '#FFFFFF',
    'on-surface-variant': '#FFFFFF',

    facebook: '#4267B2',
    twitter: '#1DA1F2',
    linkedin: '#0E76A8',
    gray100: '#FAFAFA',

    primary200: '#B2DFDB',
    secondary200: '#CCFBF1',
    white: '#FFFFFF',

    // اصلاح: shades یکدست و واقعی بر پایه teal
    primary300: '#80CBC4',
    primary400: '#4DB6AC',
    primary500: '#26A69A',
    primary600: '#00897B',
    primary700: '#00796B',
    primary800: '#00695C',
    primary900: '#004D40',

    secondary400: '#80CBC4',
    secondary600: '#26A69A',
    secondary800: '#00695C',

    // Chart palette: teal-centric + رنگ مکمل برای تفکیک
    chartColor1: '#00695C',
    chartColor2: '#4DB6AC',
    chartColor3: '#26A69A',
    chartColor4: '#80CBC4',
    chartColor5: '#00796B',
    chartColor6: '#004D40',
    chartColor7: '#14B8A6',
    chartColor8: '#0F766E',
    chartColor9: '#B2DFDB',
    chartColor10: '#115E59',
    chartColor11: '#29B6F6',
    chartColor12: '#03C9D7',
    chartColor13: '#66BB6A',
    chartColor14: '#FFC107',
    chartColor15: '#FF7043',
    chartColor16: '#EC407A',
    chartColor17: '#AB47BC',
    chartColor18: '#5C6BC0',
    chartColor19: '#8D6E63',
    chartColor20: '#607D8B'
  }
};

export { TealTheme };
