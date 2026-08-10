export const AUTH_MODES = ['keycloak', 'initializer', 'dev', 'jwt', 'demo'] as const;

export type AuthMode = (typeof AUTH_MODES)[number];

export interface RuntimeEnvironment {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_BASE_URL?: string;
  readonly VITE_AUTH_MODE?: string;
  readonly VITE_KEYCLOAK_URL?: string;
  readonly VITE_KEYCLOAK_REALM?: string;
  readonly VITE_KEYCLOAK_CLIENT_ID?: string;
  readonly VITE_AUTH_FALLBACK_LOGIN_URL?: string;
  readonly VITE_AUTH_FALLBACK_AUTHORIZATION_URL?: string;
  readonly VITE_DEBUG?: string;
  readonly VITE_DEV_PERMISSION_BYPASS?: string;
  /** Consumer-owned path used to persist the UI Kit customizer string. */
  readonly VITE_CUSTOMIZER_ENDPOINT?: string;
  readonly VITE_APP_TITLE?: string;
  readonly VITE_APP_ENV?: string;
  readonly DEV?: boolean;
  readonly PROD?: boolean;
  readonly TEST?: boolean;
}

export interface RuntimeConfig {
  readonly apiBaseUrl: string;
  readonly appBaseUrl: string;
  readonly authMode: AuthMode;
  readonly keycloak: Readonly<{
    url: string;
    realm: string;
    clientId: string;
  }>;
  readonly auth: Readonly<{
    fallbackLoginUrl?: string;
    fallbackAuthorizationUrl?: string;
  }>;
  readonly debug: boolean;
  /** Development-only visual permission bypass; never enabled outside dev. */
  readonly devPermissionBypass: boolean;
  /** Consumer-owned API endpoint; UI Kit never contains this value. */
  readonly customizerEndpoint: string;
  readonly appTitle: string;
  readonly appEnv: string;
}

export class RuntimeConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RuntimeConfigurationError';
  }
}

const read = (value: string | undefined): string | undefined => {
  const normalized = value?.trim();
  return normalized || undefined;
};

const required = (env: RuntimeEnvironment, key: keyof RuntimeEnvironment): string => {
  const value = read(env[key] as string | undefined);
  if (!value) throw new RuntimeConfigurationError(`Missing required runtime configuration: ${key}`);
  return value;
};

const normalizeAbsoluteUrl = (value: string, key: string): string => {
  try {
    const url = new URL(value);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') throw new Error('unsupported protocol');
    return url.toString().replace(/\/$/, '');
  } catch {
    throw new RuntimeConfigurationError(`${key} must be an absolute HTTP(S) URL`);
  }
};

const normalizeAppBaseUrl = (value: string | undefined): string => {
  const base = read(value) ?? '/';
  if (/^https?:\/\//i.test(base)) return normalizeAbsoluteUrl(base, 'VITE_BASE_URL');
  return `/${base.replace(/^\/+|\/+$/g, '')}${base === '/' ? '' : '/'}`;
};

const normalizeAuthMode = (value: string | undefined): AuthMode => {
  const mode = (read(value) ?? 'keycloak').toLowerCase();
  if ((AUTH_MODES as readonly string[]).includes(mode)) return mode as AuthMode;
  throw new RuntimeConfigurationError(
    `VITE_AUTH_MODE must be one of: ${AUTH_MODES.join(', ')}`
  );
};

const optionalUrl = (value: string | undefined, key: string): string | undefined => {
  const normalized = read(value);
  if (!normalized) return undefined;
  if (normalized.startsWith('/')) return normalized;
  return normalizeAbsoluteUrl(normalized, key);
};

export const createRuntimeConfig = (env: RuntimeEnvironment): RuntimeConfig => {
  const authMode = normalizeAuthMode(env.VITE_AUTH_MODE);
  if (env.PROD && (authMode === 'demo' || authMode === 'dev')) {
    throw new RuntimeConfigurationError(`${authMode} authentication is not allowed in production`);
  }

  const keycloakRequired = authMode === 'keycloak';
  const keycloakUrl = keycloakRequired
    ? normalizeAbsoluteUrl(required(env, 'VITE_KEYCLOAK_URL'), 'VITE_KEYCLOAK_URL')
    : read(env.VITE_KEYCLOAK_URL)
      ? normalizeAbsoluteUrl(env.VITE_KEYCLOAK_URL!, 'VITE_KEYCLOAK_URL')
      : '';

  const appEnv = read(env.VITE_APP_ENV) ?? (env.PROD ? 'production' : 'development');
  const devPermissionBypass = !env.PROD && ['dev', 'development'].includes(appEnv.toLowerCase()) && read(env.VITE_DEV_PERMISSION_BYPASS)?.toLowerCase() === 'true';
  if (devPermissionBypass && typeof console !== 'undefined') console.warn('[DEV] Frontend permission bypass is active');
  return Object.freeze({
    apiBaseUrl: normalizeAbsoluteUrl(required(env, 'VITE_API_BASE_URL'), 'VITE_API_BASE_URL'),
    appBaseUrl: normalizeAppBaseUrl(env.VITE_BASE_URL),
    authMode,
    keycloak: Object.freeze({
      url: keycloakUrl,
      realm: keycloakRequired ? required(env, 'VITE_KEYCLOAK_REALM') : read(env.VITE_KEYCLOAK_REALM) ?? '',
      clientId: keycloakRequired
        ? required(env, 'VITE_KEYCLOAK_CLIENT_ID')
        : read(env.VITE_KEYCLOAK_CLIENT_ID) ?? ''
    }),
    auth: Object.freeze({
      fallbackLoginUrl: optionalUrl(env.VITE_AUTH_FALLBACK_LOGIN_URL, 'VITE_AUTH_FALLBACK_LOGIN_URL'),
      fallbackAuthorizationUrl: optionalUrl(
        env.VITE_AUTH_FALLBACK_AUTHORIZATION_URL,
        'VITE_AUTH_FALLBACK_AUTHORIZATION_URL'
      )
    }),
    debug: read(env.VITE_DEBUG)?.toLowerCase() === 'true',
    devPermissionBypass,
    customizerEndpoint: read(env.VITE_CUSTOMIZER_ENDPOINT) ?? 'api/v1/customizer',
    appTitle: read(env.VITE_APP_TITLE) ?? 'Vosool Frontend',
    appEnv
  });
};

const moduleEnvironment: RuntimeEnvironment = import.meta.env.TEST
  ? {
      ...import.meta.env,
      VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost',
      VITE_AUTH_MODE: import.meta.env.VITE_AUTH_MODE ?? 'jwt'
    }
  : import.meta.env;

export const runtimeConfig = createRuntimeConfig(moduleEnvironment);

export default runtimeConfig;
