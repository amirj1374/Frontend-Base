import type { ThemeTypes } from '@/types/themeTypes/ThemeType';

const PurpleTheme: ThemeTypes = {
  name: 'PurpleTheme',
  dark: false,
  variables: {
    'border-color': '#7E57C2',
    'carousel-control-size': 10
  },
  colors: {
    primary: '#7E57C2', // Purple
    secondary: '#5E35B1', // Deep Purple

    info: '#03c9d7',
    success: '#00c853',
    accent: '#D1C4E9',
    warning: '#ffc107',
    error: '#f44336',

    lightprimary: '#F3EFFF', // soft purple tint
    lightsecondary: '#EDE7F6',
    lightsuccess: '#E8F5E9',
    lighterror: '#f9d8d8',
    lightwarning: '#fff8e1',

    darkText: '#1F1B2D', // deep violet-gray
    lightText: '#6B7280',

    darkprimary: '#673AB7',
    darksecondary: '#4527A0',

    borderLight: '#E5E7EB',
    inputBorder: '#CBD5E1',

    containerBg: '#F8F5FF',
    surface: '#fff',
    'on-surface-variant': '#fff',

    facebook: '#4267b2',
    twitter: '#1da1f2',
    linkedin: '#0e76a8',
    gray100: '#fafafa',

    primary200: '#E9DDFB',
    secondary200: '#D1C4E9',
    white: '#FFFFFF',

    // Primary shades - true purple scale
    primary300: '#D6C4F4',
    primary400: '#B39DDB',
    primary500: '#9575CD',
    primary600: '#7E57C2', // Base
    primary700: '#673AB7',
    primary800: '#512DA8',
    primary900: '#311B92',

    // Secondary shades - deeper purple family
    secondary400: '#7E57C2',
    secondary600: '#5E35B1',
    secondary800: '#4527A0',

    // Chart palette - purple first, then elegant complements
    chartColor1: '#7E57C2',
    chartColor2: '#5E35B1',
    chartColor3: '#9575CD',
    chartColor4: '#4527A0',
    chartColor5: '#B39DDB',
    chartColor6: '#673AB7',
    chartColor7: '#D1C4E9',
    chartColor8: '#311B92',
    chartColor9: '#03c9d7',
    chartColor10: '#26A69A',
    chartColor11: '#EC407A',
    chartColor12: '#FF7043',
    chartColor13: '#66BB6A',
    chartColor14: '#29B6F6',
    chartColor15: '#FFB74D',
    chartColor16: '#AB47BC',
    chartColor17: '#8D6E63',
    chartColor18: '#78909C',
    chartColor19: '#9C27B0',
    chartColor20: '#212121'
  }
};

export { PurpleTheme };
