export type AuthMode = 'keycloak' | 'initializer' | 'dev' | 'jwt' | 'demo';

export interface EnvConfig {
  PORT: number;
  API_BASE_URL: string;
  BASE_URL: string;
  APP_TITLE: string;
  ENVIRONMENT: string;
  AUTH_MODE?: AuthMode;
}