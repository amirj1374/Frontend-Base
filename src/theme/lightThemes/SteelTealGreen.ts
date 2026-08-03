import type { ThemeTypes } from '@/types/themeTypes/ThemeType';

const SteelTealGreen: ThemeTypes = {
  name: 'SteelTealGreen',
  dark: false,
  variables: {
    'border-color': '#607D8B', // اصلاح: هماهنگ با primary
    'carousel-control-size': 10
  },
  colors: {
    primary: '#607D8B', // Steel / Blue Gray
    secondary: '#009688', // Teal

    info: '#03c9d7',
    success: '#00c853',
    accent: '#FFAB91',
    warning: '#ffc107',
    error: '#f44336',

    lightprimary: '#ECEFF1',
    lightsecondary: '#E0F2F1',
    lightsuccess: '#E8F5E9', // اصلاح: لطیف
    lighterror: '#f9d8d8',
    lightwarning: '#fff8e1',

    darkText: '#111827',
    lightText: '#6B7280',

    darkprimary: '#546E7A',
    darksecondary: '#00897B',

    borderLight: '#E5E7EB', // اصلاح: روشن/مدرن
    inputBorder: '#CBD5E1', // اصلاح

    containerBg: '#F7FAFA', // اصلاح: تمیزتر از حالت کمی آبی قبلی
    surface: '#fff',
    'on-surface-variant': '#fff',

    facebook: '#4267b2',
    twitter: '#1da1f2',
    linkedin: '#0e76a8',
    gray100: '#fafafa',

    primary200: '#E2E8F0', // به جای teal tint، steel tint منطقی‌تر برای primary
    secondary200: '#E0F2F1', // teal tint باقی بماند
    white: '#FFFFFF',

    // اصلاح: primary shades یکدست‌تر و نزدیک به blue-gray واقعی
    primary300: '#B0BEC5',
    primary400: '#90A4AE',
    primary500: '#607D8B', // Base
    primary600: '#546E7A',
    primary700: '#455A64',
    primary800: '#37474F',
    primary900: '#263238',

    // secondary shades (teal)
    secondary400: '#4DB6AC',
    secondary600: '#009688', // Base (با secondary یکی شد)
    secondary800: '#00695C',

    // Chart palette: حفظ روح steel/teal + رنگ‌های مکمل
    chartColor1: '#607D8B',
    chartColor2: '#009688',
    chartColor3: '#90A4AE',
    chartColor4: '#4DB6AC',
    chartColor5: '#546E7A',
    chartColor6: '#00695C',
    chartColor7: '#455A64',
    chartColor8: '#26A69A',
    chartColor9: '#37474F',
    chartColor10: '#80CBC4',
    chartColor11: '#29B6F6',
    chartColor12: '#66BB6A',
    chartColor13: '#FFA726',
    chartColor14: '#AB47BC',
    chartColor15: '#FF7043',
    chartColor16: '#5C6BC0',
    chartColor17: '#26C6DA',
    chartColor18: '#8D6E63',
    chartColor19: '#78909C',
    chartColor20: '#263238'
  }
};

export { SteelTealGreen };
