import { defineStore } from 'pinia';
import config from '@/config';

export const useCustomizerStore = defineStore({
  id: 'customizer',
  state: () => ({
    Sidebar_drawer: config.Sidebar_drawer,
    Customizer_drawer: config.Customizer_drawer,
    mini_sidebar: config.mini_sidebar,
    fontTheme: config.fontTheme,
    inputBg: config.inputBg,
    textFieldBorderRadius: config.textFieldBorderRadius,
    textFieldVariant: config.textFieldVariant,
    uiDensity: config.uiDensity,
    textScale: config.textScale,
    layoutType: config.layoutType,
    actTheme: config.actTheme,
    loading: config.loading,
    themeMode: 'light', // 'light' or 'dark'
    menuOrientation: 'vertical' // 'vertical' or 'horizontal'
  }),

  getters: {
    getActTheme: (state) => state.actTheme,
  },
  actions: {
    SET_SIDEBAR_DRAWER(payload?: boolean) {
      if (payload !== undefined) {
        this.Sidebar_drawer = payload;
      } else {
        this.Sidebar_drawer = !this.Sidebar_drawer;
      }
    },
    SET_MINI_SIDEBAR(payload: boolean) {
      this.mini_sidebar = payload;
    },
    SET_CUSTOMIZER_DRAWER(payload: boolean) {
      this.Customizer_drawer = payload;
    },
    SET_FONT(payload: string) {
      this.fontTheme = payload;
    },
    SET_TEXT_FIELD_BORDER_RADIUS(payload: number) {
      this.textFieldBorderRadius = Math.min(24, Math.max(0, Math.round(payload)));
    },
    SET_TEXT_FIELD_VARIANT(payload: string) {
      this.textFieldVariant = ['outlined', 'filled', 'solo', 'plain', 'underlined'].includes(payload)
        ? (payload as typeof this.textFieldVariant)
        : 'outlined';
    },
    SET_UI_DENSITY(payload: string) {
      this.uiDensity = ['compact', 'default', 'comfortable'].includes(payload)
        ? (payload as typeof this.uiDensity)
        : 'default';
    },
    SET_TEXT_SCALE(payload: number) {
      this.textScale = Math.min(115, Math.max(85, Math.round(payload)));
    },
    SET_THEME(payload: string) {
      this.actTheme = payload;
    },
    SET_LOADING(payload: boolean) {
      this.loading = payload;
    },
    SET_LAYOUT_TYPE(payload: string) {
      this.layoutType = payload;
    },
    SET_THEME_MODE(payload: string) {
      this.themeMode = payload;
    },
    SET_MENU_ORIENTATION(payload: string) {
      this.menuOrientation = payload;
    }
  }

});
