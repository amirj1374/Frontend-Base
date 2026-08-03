import type { ThemeTypes } from '@/types/themeTypes/ThemeType';

const DarkSteelTealGreen: ThemeTypes = {
  name: 'DarkSteelTealGreen',
  dark: true,
  variables: {
    'border-color': '#607D8B',
    'carousel-control-size': 10
  },
  colors: {
    primary: '#607D8B', // Steel Blue
    secondary: '#009688', // Teal Accent
    info: '#03c9d7',
    success: '#00c853',
    accent: '#FFAB91',
    warning: '#ffc107',
    error: '#f44336',
    lightprimary: '#1d272b', // Muted steel background
    lightsecondary: '#182525', // Muted dark teal-gray background
    lightsuccess: '#1B3A1B',
    lighterror: '#3A1B1B',
    lightwarning: '#3A2F1B',
    darkText: '#FFFFFF',
    lightText: '#90A4AE', // Soft steel gray text
    darkprimary: '#455a64', // Darker steel
    darksecondary: '#00796b', // Darker teal
    borderLight: '#2c3b41', // Steel-border
    inputBorder: '#37474f', // Dark slate-gray border
    containerBg: '#0B1215', // Deep steel black
    surface: '#111c20', // Dark steel surface
    'on-surface-variant': '#E0E0E0',
    facebook: '#4267b2',
    twitter: '#1da1f2',
    linkedin: '#0e76a8',
    gray100: '#111c20',
    primary200: '#78909c',
    secondary200: '#26a69a',
    white: '#ffffff',

    // Corrected Primary Shades (Steel Blue Gray)
    primary300: '#cfd8dc',
    primary400: '#b0bec5',
    primary500: '#90a4ae',
    primary600: '#78909c',
    primary700: '#607d8b', // Base
    primary800: '#455a64',
    primary900: '#263238', // Deep dark steel

    // Corrected Secondary Shades (Teal)
    secondary400: '#80cbc4',
    secondary600: '#00897b',
    secondary800: '#004d40',
    // Chart Specific Palette for DarkSteelTealGreen - 20 Colors
    chartColor1: '#607D8B', // Primary steel blue
    chartColor2: '#009688', // Secondary teal
    chartColor3: '#90A4AE', // Light steel
    chartColor4: '#4DB6AC', // Light teal
    chartColor5: '#52839c', // Steel mid
    chartColor6: '#74a2b8', // Soft steel blue
    chartColor7: '#3c5868', // Dark steel
    chartColor8: '#00897B', // Deep teal
    chartColor9: '#03c9d7', // Cyan (info)
    chartColor10: '#00c853', // Green (success)

    chartColor11: '#26A69A', // Teal variant
    chartColor12: '#4DD0E1', // Aqua
    chartColor13: '#29B6F6', // Blue
    chartColor14: '#5C6BC0', // Indigo
    chartColor15: '#AB47BC', // Purple
    chartColor16: '#FF7043', // Deep orange
    chartColor17: '#FFAB91', // Accent peach
    chartColor18: '#ffc107', // Amber
    chartColor19: '#66BB6A', // Green soft
    chartColor20: '#B0BEC5' // Light blue‑gray
  }
};

export { DarkSteelTealGreen };
