import { createVuetify } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg';
import { icons } from './mdi-icon'; // Import icons from separate file
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

// Light Themes
import { ModernTheme } from '@/theme/lightThemes/ModernTheme';
import { PurpleTheme } from '@/theme/lightThemes/PurpleTheme';
import { RedTheme } from '@/theme/lightThemes/RedTheme';
import { OrangeTheme } from '@/theme/lightThemes/OrangeTheme';
import { SteelTealGreen } from '@/theme/lightThemes/SteelTealGreen';
import { TealTheme } from '@/theme/lightThemes/TealTheme';
import { SilverTheme } from '@/theme/lightThemes/SilverTheme';
import { NavyGoldTheme } from '@/theme/lightThemes/NavyGoldTheme';
import { FutureBlueTheme } from '@/theme/lightThemes/FutureBlueTheme';
import { ObsidianMintTheme } from '@/theme/lightThemes/ObsidianMintTheme';
import { SaffronOliveTheme } from '@/theme/lightThemes/SaffronOliveTheme';
import { SandRoseTheme } from '@/theme/lightThemes/SandRoseTheme';
import { TerracottaMossTheme } from '@/theme/lightThemes/TerracottaMossTheme';
import { MulberryLimeTheme } from '@/theme/lightThemes/MulberryLimeTheme';
import { DarkMulberryLimeTheme } from '@/theme/darkThemes/DarkMulberryLimeTheme';
import { GoldenLuxuryTheme } from '@/theme/lightThemes/GoldenLuxuryTheme';



// Dark Themes
import { DarkModernTheme } from '@/theme/darkThemes/DarkModernTheme';
import { DarkOrangeTheme } from '@/theme/darkThemes/DarkOrangeTheme';
import { DarkPurpleTheme } from '@/theme/darkThemes/DarkPurpleTheme';
import { DarkSteelTealGreen } from '@/theme/darkThemes/DarkSteelTealGreen';
import { DarkTealTheme } from '@/theme/darkThemes/DarkTealTheme';
import { DarkSilverTheme } from '@/theme/darkThemes/DarkSilverTheme';
import { DarkRedTheme } from '@/theme/darkThemes/DarkRedTheme';
import { DarkNavyGoldTheme } from '@/theme/darkThemes/DarkNavyGoldTheme';
import { DarkFutureBlueTheme } from '@/theme/darkThemes/DarkFutureBlueTheme';
import { DarkObsidianMintTheme } from '@/theme/darkThemes/DarkObsidianMintTheme';
import { DarkSaffronOliveTheme } from '@/theme/darkThemes/DarkSaffronOliveTheme';
import { DarkSandRoseTheme } from '@/theme/darkThemes/DarkSandRoseTheme';
import { DarkTerracottaMossTheme } from '@/theme/darkThemes/DarkTerracottaMossTheme';
import { CottonCandyMagentaTheme } from '@/theme/lightThemes/CottonCandyMagentaTheme';
import { DarkCottonCandyMagentaTheme } from '@/theme/darkThemes/DarkCottonCandyMagentaTheme';
import { DarkGoldenLuxuryTheme } from '@/theme/darkThemes/DarkGoldenLuxuryTheme';



export default createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases: {
      ...aliases,
      ...icons
    },
    sets: {
      mdi
    }
  },
  theme: {
    defaultTheme: 'DarkSaffronOliveTheme',
    themes: {
      // Light Themes
      ModernTheme,
      PurpleTheme,
      RedTheme,
      OrangeTheme,
      SteelTealGreen,
      TealTheme,
      SilverTheme,
      NavyGoldTheme,
      // Dark Themes
      DarkModernTheme,
      DarkOrangeTheme,
      DarkPurpleTheme,
      DarkSteelTealGreen,
      DarkTealTheme,
      DarkSilverTheme,
      DarkRedTheme,
      DarkNavyGoldTheme,
      FutureBlueTheme,
      DarkFutureBlueTheme,
      ObsidianMintTheme,
      DarkObsidianMintTheme,
      SaffronOliveTheme,
      DarkSaffronOliveTheme,
      SandRoseTheme,
      DarkSandRoseTheme,
      TerracottaMossTheme,
      DarkTerracottaMossTheme,
      MulberryLimeTheme,
      DarkMulberryLimeTheme,
      CottonCandyMagentaTheme,
      DarkCottonCandyMagentaTheme,
      GoldenLuxuryTheme,
      DarkGoldenLuxuryTheme
    }
  },
  defaults: {
    VBtn: {},
    VCard: {
      rounded: 'md'
    },
    VTextField: {
      rounded: 'lg',
      variant: 'outlined'
    },
    VSelect: {
      variant: 'outlined'
    },
    VTooltip: {
      // set v-tooltip default location to top
      location: 'top'
    }
  }
});
