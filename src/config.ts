export type ConfigProps = {
  Sidebar_drawer: boolean;
  Customizer_drawer: boolean;
  mini_sidebar: boolean;
  setHorizontalLayout: boolean;
  actTheme: string;
  boxed: boolean;
  fontTheme: string;
  inputBg: boolean;
  textFieldBorderRadius: number;
  textFieldVariant: 'outlined' | 'filled' | 'solo' | 'plain' | 'underlined';
  uiDensity: 'compact' | 'default' | 'comfortable';
  textScale: number;
  layoutType: string;
  loading: boolean;
};

const config: ConfigProps = {
  Sidebar_drawer: true,
  Customizer_drawer: false,
  mini_sidebar: false,
  setHorizontalLayout: false, // Horizontal layout
  actTheme: 'PurpleTheme',
  fontTheme: 'vazir',
  layoutType: 'SideBar',
  inputBg: false,
  textFieldBorderRadius: 10,
  textFieldVariant: 'outlined',
  uiDensity: 'default',
  textScale: 100,
  boxed: true,
  loading: false
};

export default config;
