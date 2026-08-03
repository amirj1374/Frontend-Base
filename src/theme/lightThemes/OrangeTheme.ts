import type { ThemeTypes } from '@/types/themeTypes/ThemeType';

const OrangeTheme: ThemeTypes = {
  name: 'OrangeTheme',
  dark: false,
  variables: {
    'border-color': '#C77E23',
    'carousel-control-size': 10
  },
  colors: {
    primary: '#C77E23',
    secondary: '#16595A',

    info: '#03c9d7',
    success: '#00c853',
    accent: '#FFAB91',
    warning: '#ffc107',
    error: '#f44336',

    lightprimary: '#F8F0E5',
    lightsecondary: '#E3EBEB',
    lightsuccess: '#E8F5E9', // اصلاح: light success واقعی و لطیف
    lighterror: '#f9d8d8',
    lightwarning: '#fff8e1',

    darkText: '#212121',
    lightText: '#616161',

    darkprimary: '#A9651C', // اصلاح: کمی عمیق‌تر برای حالت hover/active
    darksecondary: '#135152',

    borderLight: '#E5E7EB', // اصلاح: مرز روشن و تمیز (Gray 200)
    inputBorder: '#CBD5E1', // اصلاح: برای input خوانا و لایت (Slate 300)

    containerBg: '#fdf3ec',
    surface: '#fff',
    'on-surface-variant': '#fff',

    facebook: '#4267b2',
    twitter: '#1da1f2',
    linkedin: '#0e76a8',

    gray100: '#fafafa',

    primary200: '#F4E6D3',
    secondary200: '#D9F0F0', // اصلاح: tint روشن از teal

    white: '#FFFFFF',

    // Primary shades (نارنجی یکدست‌تر و نزدیک‌تر به base)
    primary300: '#F4E6D3',
    primary400: '#E3B07A',
    primary500: '#D9924E',
    primary600: '#C77E23', // Base
    primary700: '#9B5F1A',
    primary800: '#6F4312',
    primary900: '#3F2409',

    // Secondary shades (teal منطقی‌تر)
    secondary400: '#7CC7C7',
    secondary600: '#16595A', // Base
    secondary800: '#0A3637',

    // Chart Palette (همان روح قبلی، فقط کمی متعادل‌تر)
    chartColor1: '#C77E23',
    chartColor2: '#16595A',
    chartColor3: '#E3B07A',
    chartColor4: '#0F4748',
    chartColor5: '#D9924E',
    chartColor6: '#7CC7C7',
    chartColor7: '#9B5F1A',
    chartColor8: '#0A3637',
    chartColor9: '#6F4312',
    chartColor10: '#4DB6AC',
    chartColor11: '#FFB74D',
    chartColor12: '#26A69A',
    chartColor13: '#FF8A65',
    chartColor14: '#5C6BC0',
    chartColor15: '#8BC34A',
    chartColor16: '#AB47BC',
    chartColor17: '#29B6F6',
    chartColor18: '#EC407A',
    chartColor19: '#D4A373',
    chartColor20: '#607D8B'
  }
};

export { OrangeTheme };
