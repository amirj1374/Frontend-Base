import type { ThemeTypes } from '@/types/themeTypes/ThemeType';

const DarkRedTheme: ThemeTypes = {
  name: 'DarkRedTheme',
  dark: true,
  variables: {
    'border-color': '#EC407A',
    'carousel-control-size': 10
  },
  colors: {
    primary: '#EC407A', // Bright rose/pink
    secondary: '#FF6B9D', // Lighter pink
    info: '#03c9d7',
    success: '#00c853',
    accent: '#FFAB91',
    warning: '#ffc107',
    error: '#f44336',
    lightprimary: '#1e1216', // Dark rose-tinted background
    lightsecondary: '#2d1a20', // Darker secondary rose background
    lightsuccess: '#064e3b',
    lighterror: '#7f1d1d',
    lightwarning: '#78350f',
    darkText: '#ffffff',
    lightText: '#f3f4f6', // Bright gray text for readability
    darkprimary: '#D81B60', // Consistent dark rose
    darksecondary: '#C2185B', // Consistent dark pink
    borderLight: '#3f222b', // Muted rose-gray border
    inputBorder: '#5c3541', // Soft rose-gray input border
    containerBg: '#0F090B', // Very dark rose-black background
    surface: '#150C0E', // Dark rose surface
    'on-surface-variant': '#2d2d2d',
    facebook: '#4267b2',
    twitter: '#1da1f2',
    linkedin: '#0e76a8',
    gray100: '#150C0E',
    primary200: '#f06292', // Rose 300
    secondary200: '#f8bbd0', // Light rose 100
    white: '#ffffff', // Real white

    // Corrected Primary Shades (Rose/Pink)
    primary300: '#f48fb1',
    primary400: '#f06292',
    primary500: '#ec407a', // Primary base
    primary600: '#d81b60',
    primary700: '#c2185b',
    primary800: '#ad1457',
    primary900: '#880e4f', // Darkest wine/rose

    // Corrected Secondary Shades
    secondary400: '#ff8da1',
    secondary600: '#ff4081',
    secondary800: '#f50057', // Darker pink

    // Chart Specific Palette for DarkRedTheme - 20 Colors
    chartColor1: '#EC407A', // Primary rose
    chartColor2: '#FF6B9D', // Secondary pink
    chartColor3: '#E42A5D', // Darker rose (darkprimary)
    chartColor4: '#F06292', // Rose 400
    chartColor5: '#FFB3D1', // Light pink
    chartColor6: '#f44336', // Red (error)
    chartColor7: '#FF8A65', // Coral (warm separation)
    chartColor8: '#ffc107', // Amber (warning)
    chartColor9: '#03c9d7', // Cyan (info)
    chartColor10: '#00c853', // Green (success)

    chartColor11: '#29B6F6', // Sky blue
    chartColor12: '#407dd3', // Strong blue (from primary500)
    chartColor13: '#7ea6ec', // Soft blue (from primary400)
    chartColor14: '#90caf9', // Light blue (from primary300)
    chartColor15: '#26A69A', // Teal
    chartColor16: '#66BB6A', // Green 400
    chartColor17: '#AB47BC', // Purple
    chartColor18: '#5C6BC0', // Indigo
    chartColor19: '#A1887F', // Warm gray/brown
    chartColor20: '#94a3b8' // Light slate (neutral, readable on dark)
  }
};

export { DarkRedTheme };
