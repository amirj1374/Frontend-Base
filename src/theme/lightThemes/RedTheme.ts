import type { ThemeTypes } from '@/types/themeTypes/ThemeType';

const RedTheme: ThemeTypes = {
  name: 'RedTheme',
  dark: false,
  variables: {
    'border-color': '#203461', // هماهنگ با primary فعلی
    'carousel-control-size': 10
  },
  colors: {
    primary: '#203461',
    secondary: '#EC407A',

    info: '#03c9d7',
    success: '#00c853',
    accent: '#FFAB91',
    warning: '#ffc107',
    error: '#f44336',

    lightprimary: '#EEF2F8', // تمیزتر و هماهنگ با navy
    lightsecondary: '#FDE8EF',
    lightsuccess: '#E8F5E9', // اصلاح
    lighterror: '#f9d8d8',
    lightwarning: '#fff8e1',

    darkText: '#1F2937', // بهتر از مشکی تخت
    lightText: '#6B7280',

    darkprimary: '#132145',
    darksecondary: '#E42A5D',

    borderLight: '#E5E7EB', // روشن‌تر و مدرن‌تر
    inputBorder: '#CBD5E1',

    containerBg: '#F8FAFC', // به جای آبی روشن قدیمی
    surface: '#fff',
    'on-surface-variant': '#fff',

    facebook: '#4267b2',
    twitter: '#1da1f2',
    linkedin: '#0e76a8',

    gray100: '#fafafa',

    primary200: '#D9E2F2',
    secondary200: '#FDE8EF',
    white: '#FFFFFF',

    // Primary shades - حفظ navy ولی یکدست‌تر
    primary300: '#A8B7D1',
    primary400: '#6F86AE',
    primary500: '#3F5A8A',
    primary600: '#203461', // Base
    primary700: '#16284D',
    primary800: '#0F1B36',
    primary900: '#090F1F',

    // Secondary shades - pink family
    secondary400: '#F8BBD9',
    secondary600: '#EC407A', // Base
    secondary800: '#D81B60',

    // Chart palette - حفظ روح navy/pink با کمی تعادل بیشتر
    chartColor1: '#203461',
    chartColor2: '#EC407A',
    chartColor3: '#3F5A8A',
    chartColor4: '#D81B60',
    chartColor5: '#6F86AE',
    chartColor6: '#F8BBD9',
    chartColor7: '#132145',
    chartColor8: '#E42A5D',
    chartColor9: '#A8B7D1',
    chartColor10: '#FF7043',
    chartColor11: '#26A69A',
    chartColor12: '#AB47BC',
    chartColor13: '#66BB6A',
    chartColor14: '#29B6F6',
    chartColor15: '#FFA726',
    chartColor16: '#8D6E63',
    chartColor17: '#78909C',
    chartColor18: '#EF5350',
    chartColor19: '#5C6BC0',
    chartColor20: '#37474F'
  }
};

export { RedTheme };
