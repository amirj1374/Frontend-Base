import { describe, expect, it } from 'vitest';
import {
  createRuntimeConfig,
  RuntimeConfigurationError,
  type RuntimeEnvironment
} from './runtime';

const validEnvironment = (overrides: RuntimeEnvironment = {}): RuntimeEnvironment => ({
  VITE_API_BASE_URL: 'https://api.example.test/',
  VITE_BASE_URL: '/vosool',
  VITE_AUTH_MODE: 'keycloak',
  VITE_KEYCLOAK_URL: 'https://identity.example.test/',
  VITE_KEYCLOAK_REALM: 'test-realm',
  VITE_KEYCLOAK_CLIENT_ID: 'test-client',
  VITE_APP_TITLE: 'Test application',
  VITE_APP_ENV: 'test',
  VITE_DEBUG: 'true',
  ...overrides
});

describe('createRuntimeConfig', () => {
  it('normalizes URLs and exposes typed values', () => {
    expect(createRuntimeConfig(validEnvironment())).toEqual({
      apiBaseUrl: 'https://api.example.test',
      appBaseUrl: '/vosool/',
      authMode: 'keycloak',
      keycloak: {
        url: 'https://identity.example.test',
        realm: 'test-realm',
        clientId: 'test-client'
      },
      auth: {},
      debug: true,
      devPermissionBypass: false,
      customizerEndpoint: 'api/v1/customizer',
      appTitle: 'Test application',
      appEnv: 'test'
    });
  });

  it('enables the bypass only for an explicit non-production development environment', () => {
    expect(createRuntimeConfig(validEnvironment({ VITE_APP_ENV: 'dev', VITE_DEV_PERMISSION_BYPASS: 'true' })).devPermissionBypass).toBe(true);
    expect(createRuntimeConfig(validEnvironment({ VITE_APP_ENV: 'prelive', VITE_DEV_PERMISSION_BYPASS: 'true' })).devPermissionBypass).toBe(false);
    expect(createRuntimeConfig(validEnvironment({ VITE_APP_ENV: 'dev', VITE_DEV_PERMISSION_BYPASS: 'true', PROD: true })).devPermissionBypass).toBe(false);
  });

  it('requires the API URL', () => {
    expect(() => createRuntimeConfig(validEnvironment({ VITE_API_BASE_URL: ' ' }))).toThrow(
      RuntimeConfigurationError
    );
  });

  it('requires Keycloak settings only in Keycloak mode', () => {
    expect(() => createRuntimeConfig(validEnvironment({ VITE_KEYCLOAK_REALM: undefined }))).toThrow(
      'VITE_KEYCLOAK_REALM'
    );
    expect(
      createRuntimeConfig(
        validEnvironment({
          VITE_AUTH_MODE: 'jwt',
          VITE_KEYCLOAK_URL: undefined,
          VITE_KEYCLOAK_REALM: undefined,
          VITE_KEYCLOAK_CLIENT_ID: undefined
        })
      ).authMode
    ).toBe('jwt');
  });

  it('rejects unknown authentication modes', () => {
    expect(() => createRuntimeConfig(validEnvironment({ VITE_AUTH_MODE: 'other' }))).toThrow(
      'VITE_AUTH_MODE must be one of'
    );
  });

  it('rejects demo and dev authentication in production', () => {
    expect(() =>
      createRuntimeConfig(validEnvironment({ VITE_AUTH_MODE: 'demo', PROD: true }))
    ).toThrow('demo authentication is not allowed in production');
  });

  it('accepts relative fallback routes and normalizes absolute fallback URLs', () => {
    const config = createRuntimeConfig(
      validEnvironment({
        VITE_AUTH_FALLBACK_LOGIN_URL: '/login',
        VITE_AUTH_FALLBACK_AUTHORIZATION_URL: 'https://identity.example.test/authorize/'
      })
    );
    expect(config.auth).toEqual({
      fallbackLoginUrl: '/login',
      fallbackAuthorizationUrl: 'https://identity.example.test/authorize'
    });
  });
});
