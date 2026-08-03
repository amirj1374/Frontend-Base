import type { ThemeTypes } from '@/types/themeTypes/ThemeType';

const DarkPurpleTheme: ThemeTypes = {
  name: 'DarkPurpleTheme',
  dark: true,
  variables: {
    // اصلاح شد: Border باید متناسب با تم بنفش باشد نه آبی
    'border-color': '#7E57C2',
    'carousel-control-size': 10
  },
  colors: {
    primary: '#7E57C2', // Deep Purple (Deep Lavender)
    secondary: '#AB47BC', // Orchid Purple
    info: '#03c9d7',
    success: '#00c853',
    accent: '#FFAB91',
    warning: '#ffc107',
    error: '#f44336',
    lightprimary: '#1A1425', // Very dark purple-tinted bg
    lightsecondary: '#251A35', // Slightly lighter purple bg
    lightsuccess: '#1B3A1B',
    lighterror: '#3A1B1B',
    lightwarning: '#3A2F1B',
    darkText: '#FFFFFF',
    lightText: '#B0A8C0', // Muted purple-gray text
    darkprimary: '#5E35B1', // Rich dark purple
    darksecondary: '#8E24AA', // Vivid dark purple
    borderLight: '#322943', // Muted purple border
    inputBorder: '#45395A', // Stronger purple-gray border
    containerBg: '#0D0A14', // Darkest Purple/Black
    surface: '#14101D', // Deep Purple Surface
    'on-surface-variant': '#E0E0E0',
    facebook: '#4267b2',
    twitter: '#1da1f2',
    linkedin: '#0e76a8',
    gray100: '#14101D',
    primary200: '#9575CD', // Lighter purple
    secondary200: '#CE93D8', // Pale purple
    white: '#FFFFFF',

    // اصلاح شد: Shadeها کاملاً از آبی به بنفش (Lavender/Purple) منتقل شدند
    primary300: '#D1C4E9',
    primary400: '#B39DBB',
    primary500: '#9575CD',
    primary600: '#7E57C2', // Base Primary
    primary700: '#673AB7',
    primary800: '#512DA8',
    primary900: '#311B92', // Deepest Purple

    secondary400: '#BA68C8',
    secondary600: '#9C27B0',
    secondary800: '#7B1FA2',

    // Chart Palette ریفکتور شده برای هارمونی بنفش و مکمل‌های شارپ
    chartColor1: '#7E57C2', // Base Purple
    chartColor2: '#AB47BC', // Secondary Orchid
    chartColor3: '#5E35B1', // Deep Purple
    chartColor4: '#9C27B0', // Vivid Purple
    chartColor5: '#CE93D8', // Soft Lavender
    chartColor6: '#512DA8', // Indigo Purple
    chartColor7: '#BA68C8', // Mid Orchid
    chartColor8: '#311B92', // Deepest Purple
    chartColor9: '#4A148C', // Dark Grape
    chartColor10: '#E1BEE7', // Very Light Purple

    chartColor11: '#00BCD4', // Cyan (Contrast)
    chartColor12: '#26A69A', // Teal (Contrast)
    chartColor13: '#FF7043', // Deep Orange (Warm Contrast)
    chartColor14: '#8BC34A', // Light Green
    chartColor15: '#F06292', // Pink Rose
    chartColor16: '#4FC3F7', // Sky Blue
    chartColor17: '#FFCA28', // Amber
    chartColor18: '#EC407A', // Crimson
    chartColor19: '#90A4AE', // Blue Gray
    chartColor20: '#D1C4E9' // Light Lavender
  }
};

export { DarkPurpleTheme };
