import type { ThemeTypes } from '@/types/themeTypes/ThemeType';

const DarkOrangeTheme: ThemeTypes = {
  name: 'DarkOrangeTheme',
  dark: true,
  variables: {
    'border-color': '#C77E23',
    'carousel-control-size': 10
  },
  colors: {
    primary: '#C77E23', // Rich Amber/Orange
    secondary: '#FF9800', // Bright Orange
    info: '#00BCD4',
    success: '#4CAF50',
    accent: '#FFAB91',
    warning: '#FFC107',
    error: '#F44336',
    lightprimary: '#24180E', // Dark chocolate tint
    lightsecondary: '#2D1F14', // Slightly lighter warm tint
    lightsuccess: '#1B3A1B',
    lighterror: '#3A1B1B',
    lightwarning: '#3A2F1B',
    darkText: '#FFFFFF',
    lightText: '#D1BFA7', // Warm muted sand text
    darkprimary: '#A6661C', // Deep bronze
    darksecondary: '#E65100', // Deep burnt orange
    borderLight: '#3D2B1F', // Muted wood border
    inputBorder: '#5E4433', // Warm brown-gray border
    containerBg: '#0F0A07', // Deep Obsidian Orange (Not pure black)
    surface: '#17100B', // Dark Sepia Surface
    'on-surface-variant': '#E0E0E0',
    facebook: '#4267b2',
    twitter: '#1da1f2',
    linkedin: '#0e76a8',
    gray100: '#17100B',
    primary200: '#E89B4A',
    secondary200: '#FFCC80',
    white: '#FFFFFF',

    // اصلاح Shadeها: حذف تناژهای سبز و تمرکز روی پالت آتشین و خاکی
    primary300: '#F5DEB3', // Wheat
    primary400: '#FFCC80', // Peach orange
    primary500: '#FFB74D', // Mellow orange
    primary600: '#FB8C00', // Vivid orange
    primary700: '#F57C00', // Strong orange
    primary800: '#EF6C00', // Burnt orange
    primary900: '#E65100', // Deepest blood orange

    secondary400: '#FFB300',
    secondary600: '#FF8F00',
    secondary800: '#FF6F00',

    // Chart Palette: ترکیبی از گرم (نارنجی/قرمز) و مکمل‌های خنثی
    chartColor1: '#C77E23', // Primary
    chartColor2: '#FF9800', // Orange
    chartColor3: '#FF5722', // Deep Orange
    chartColor4: '#E65100', // Burnt
    chartColor5: '#FFCC80', // Peach
    chartColor6: '#FB8C00', // Vivid
    chartColor7: '#D84315', // Rust
    chartColor8: '#BF360C', // Dark Brick
    chartColor9: '#8D6E63', // Muted Brown
    chartColor10: '#A1887F', // Coffee

    chartColor11: '#FFD54F', // Amber
    chartColor12: '#4DB6AC', // Teal (Soft Contrast)
    chartColor13: '#26A69A', // Muted Teal
    chartColor14: '#607D8B', // Blue Gray
    chartColor15: '#90A4AE', // Silver Steel
    chartColor16: '#FFAB91', // Coral
    chartColor17: '#795548', // Brown
    chartColor18: '#5D4037', // Deep Brown
    chartColor19: '#FFB300', // Gold
    chartColor20: '#FFE082' // Light Gold
  }
};

export { DarkOrangeTheme };
