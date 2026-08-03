import type { ThemeTypes } from '@/types/themeTypes/ThemeType';

const DarkNavyGoldTheme: ThemeTypes = {
  name: 'DarkNavyGoldTheme',
  dark: true,
  variables: {
    'border-color': '#FFD43B', // طلایی شاخص
    'carousel-control-size': 10
  },
  colors: {
    primary: '#FFD43B', // Classic Gold
    secondary: '#1A4DAB', // Royal Navy Blue
    info: '#4FC3F7',
    success: '#81C995',
    accent: '#FFE066',
    warning: '#FFB84D',
    error: '#FF6B6B',

    lightprimary: '#241D0A', // Very dark gold-brown background
    lightsecondary: '#0D1425', // Very dark navy background
    lightsuccess: '#142914',
    lighterror: '#2D1414',
    lightwarning: '#2D2314',

    darkText: '#FFFFFF',
    lightText: '#A5ADC1', // Muted Navy-Gray text (better than neutral gray)
    darkprimary: '#E2B830', // Burnished Gold
    darksecondary: '#102A5A', // Deep Midnight Blue

    // اصلاح شد: مرزها باید به سرمه‌ای تیره متمایل باشند نه خاکستری
    borderLight: '#1E2B48', // Deep Navy border
    inputBorder: '#2C3E67', // Strong Navy-Gray border
    containerBg: '#050811', // Absolute Navy Black
    surface: '#0A1121', // Deep Royal Navy Surface
    'on-surface-variant': '#E0E0E0',

    facebook: '#4267b2',
    twitter: '#1da1f2',
    linkedin: '#0e76a8',
    gray100: '#0A1121',

    primary200: '#FFDD70',
    secondary200: '#1A4DAB',
    white: '#FFFFFF',

    // اصلاح Shadeها: طلایی از درخشان به سمت برنز قدیمی
    primary300: '#FFF1C1',
    primary400: '#FFE799',
    primary500: '#FFDD70',
    primary600: '#FFD43B', // Base Gold
    primary700: '#E2B830',
    primary800: '#B89626',
    primary900: '#665315',

    // اصلاح Shadeها: سرمه‌ای از روشن به سمت تاریکی مطلق
    secondary400: '#3D6FCB',
    secondary600: '#1A4DAB', // Base Royal Navy
    secondary800: '#0D2B63',

    // Chart Palette: ترکیبی لوکس از طلایی، نقره‌ای، سرمه‌ای و رنگ‌های جواهری
    chartColor1: '#FFD43B', // Gold
    chartColor2: '#1A4DAB', // Royal Blue
    chartColor3: '#E2B830', // Deep Gold
    chartColor4: '#0D2B63', // Midnight Navy
    chartColor5: '#FFE799', // Champagne
    chartColor6: '#3D6FCB', // Bright Navy
    chartColor7: '#B89626', // Bronze
    chartColor8: '#051832', // Deep Sea Blue
    chartColor9: '#CFD8DC', // Silver Blue
    chartColor10: '#90A4AE', // Steel Gray

    chartColor11: '#26C6DA', // Cyan Jewel
    chartColor12: '#4DB6AC', // Teal Jewel
    chartColor13: '#7986CB', // Indigo
    chartColor14: '#81C995', // Emerald
    chartColor15: '#5C6BC0', // Deep Indigo
    chartColor16: '#FFB84D', // Amber
    chartColor17: '#FFDD70', // Pale Gold
    chartColor18: '#42A5F5', // Sky Jewel
    chartColor19: '#D4A373', // Brass
    chartColor20: '#546E7A' // Muted Slate
  }
};

export { DarkNavyGoldTheme };
