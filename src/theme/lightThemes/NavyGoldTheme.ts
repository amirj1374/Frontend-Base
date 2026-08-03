import type { ThemeTypes } from '@/types/themeTypes/ThemeType';

const NavyGoldTheme: ThemeTypes = {
  name: 'NavyGoldTheme',
  dark: false,
  variables: {
    'border-color': '#d1a407', // Gold Border
    'carousel-control-size': 10
  },
  colors: {
    primary: '#001F54', // Navy
    secondary: '#d1a407', // Gold
    info: '#0288D1',
    success: '#2E7D32',
    accent: '#001F54',
    warning: '#FFB300',
    error: '#D32F2F',

    lightprimary: '#F0F4FA', // Very light navy tint
    lightsecondary: '#FFFBF0', // Very light gold tint
    lightsuccess: '#E8F5E9',
    lighterror: '#FFEBEE',
    lightwarning: '#FFF8E1',

    darkText: '#000814', // Deep navy black
    lightText: '#475569', // Slate gray
    darkprimary: '#001438', // Deeper Navy
    darksecondary: '#A67C00', // Deeper Gold

    borderLight: '#CBD5E1', // Slate 300
    inputBorder: '#94A3B8', // Slate 400
    containerBg: '#F8FAFC', // Clean slate background
    surface: '#FFFFFF',
    'on-surface-variant': '#FFFFFF',

    facebook: '#4267b2',
    twitter: '#1da1f2',
    linkedin: '#0e76a8',
    gray100: '#F1F5F9',

    primary200: '#D1D9E6', // Muted Navy 100
    secondary200: '#FFE38C', // Gold 100
    white: '#FFFFFF',

    // اصلاح شد: Primary Shades باید سرمه‌ای باشند
    primary300: '#667999',
    primary400: '#334C77',
    primary500: '#001F54', // Base Navy
    primary600: '#001C4B',
    primary700: '#001843',
    primary800: '#001438',
    primary900: '#000C2A',

    // اصلاح شد: Secondary Shades باید طلایی باشند
    secondary400: '#E7B600',
    secondary600: '#d1a407', // Base Gold
    secondary800: '#B38600',

    // Chart Palette: ترکیب لوکس سرمه‌ای و طلایی با مکمل‌های باکلاس
    chartColor1: '#001F54', // Navy
    chartColor2: '#d1a407', // Gold
    chartColor3: '#1E3A8A', // Royal Blue
    chartColor4: '#B8860B', // Goldenrod
    chartColor5: '#0F172A', // Slate 900
    chartColor6: '#EAB308', // Yellow Gold
    chartColor7: '#334155', // Slate 700
    chartColor8: '#991B1B', // Deep Red
    chartColor9: '#0369A1', // Sky Deep
    chartColor10: '#78350F', // Bronze
    chartColor11: '#475569', // Slate 600
    chartColor12: '#166534', // Forest Green
    chartColor13: '#BE123C', // Rose
    chartColor14: '#4338CA', // Indigo
    chartColor15: '#C2410C', // Burnt Orange
    chartColor16: '#155E75', // Cyan Deep
    chartColor17: '#581C87', // Deep Purple
    chartColor18: '#525252', // Neutral
    chartColor19: '#3F6212', // Olive
    chartColor20: '#000000' // Black
  }
};

export { NavyGoldTheme };
