import type { ThemeTypes } from '@/types/themeTypes/ThemeType';

const DarkTealTheme: ThemeTypes = {
  name: 'DarkTealTheme',
  dark: true,
  variables: {
    'border-color': '#00695C',
    'carousel-control-size': 10
  },
  colors: {
    primary: '#00695C', // Deep Teal
    secondary: '#4DB6AC', // Soft Teal
    info: '#03c9d7',
    success: '#00c853',
    accent: '#FFAB91',
    warning: '#ffc107',
    error: '#f44336',
    lightprimary: '#0e1a19', // Very dark teal-gray background
    lightsecondary: '#122221', // Muted teal background
    lightsuccess: '#1B3A1B',
    lighterror: '#3A1B1B',
    lightwarning: '#3A2F1B',
    darkText: '#FFFFFF',
    lightText: '#80cbc4', // Soft teal text
    darkprimary: '#004d40', // Extremely deep teal
    darksecondary: '#26a69a', // Strong teal accent
    borderLight: '#18302d', // Muted teal border
    inputBorder: '#20403c', // Dark teal border
    containerBg: '#040a09', // Pure teal-black background
    surface: '#0a1413', // Dark teal surface
    'on-surface-variant': '#E0E0E0',
    facebook: '#4267b2',
    twitter: '#1da1f2',
    linkedin: '#0e76a8',
    gray100: '#0a1413',
    primary200: '#00796b',
    secondary200: '#004d40',
    white: '#ffffff',

    // Corrected Primary Shades (True Teal/Pine)
    primary300: '#b2dfdb',
    primary400: '#80cbc4',
    primary500: '#4db6ac',
    primary600: '#26a69a',
    primary700: '#00897b',
    primary800: '#00695c', // Base Primary
    primary900: '#004d40', // Deepest Forest Teal

    // Corrected Secondary Shades
    secondary400: '#80cbc4',
    secondary600: '#00897b',
    secondary800: '#004d40',
    // Chart Specific Palette for DarkTealTheme - 20 Colors
    chartColor1: '#00695C', // Primary deep teal
    chartColor2: '#4DB6AC', // Secondary teal
    chartColor3: '#008E76', // Darkprimary teal
    chartColor4: '#64D8CB', // Lightsecondary teal
    chartColor5: '#15caab', // Primary 400
    chartColor6: '#027a66', // Primary 500
    chartColor7: '#73ece1', // Primary 300 (very bright)
    chartColor8: '#26A69A', // Secondary 800
    chartColor9: '#03c9d7', // Info cyan
    chartColor10: '#00c853', // Success green

    chartColor11: '#29B6F6', // Blue
    chartColor12: '#80CBC4', // Muted teal
    chartColor13: '#B2DFDB', // Pale teal
    chartColor14: '#4DD0E1', // Aqua bright
    chartColor15: '#AB47BC', // Purple
    chartColor16: '#FFAB91', // Accent peach
    chartColor17: '#ffc107', // Amber
    chartColor18: '#f44336', // Red
    chartColor19: '#D4E157', // Lime
    chartColor20: '#B0BEC5' // Blue-gray
  }
};

export { DarkTealTheme };
