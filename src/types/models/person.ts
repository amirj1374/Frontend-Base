import config from '@/config';

export interface PersonDTO {
  id: string;
  name: string;
}

export interface CustomizerDTO {
  fontTheme: string,
  inputBg: boolean,
  layoutType: string,
  actTheme: string,
  themeMode: string,
  menuOrientation: string
}