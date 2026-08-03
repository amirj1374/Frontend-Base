import runtimeConfig from './runtime';
import type { EnvConfig } from '@/types/models/env';

/** @deprecated Prefer the typed `runtimeConfig`; retained for existing imports. */
const envConfig: EnvConfig = {
  PORT: Number(import.meta.env.VITE_PORT || 5050),
  API_BASE_URL: runtimeConfig.apiBaseUrl,
  BASE_URL: runtimeConfig.appBaseUrl,
  APP_TITLE: runtimeConfig.appTitle,
  ENVIRONMENT: runtimeConfig.appEnv,
  AUTH_MODE: runtimeConfig.authMode
};

export const apiConfig = { baseURL: runtimeConfig.apiBaseUrl };
export default envConfig;
