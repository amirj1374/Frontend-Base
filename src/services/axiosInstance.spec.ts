import { AxiosError, type AxiosAdapter, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { describe, expect, it, vi } from 'vitest';
import type { AuthenticationService } from '@/auth/contracts';
import { createHttpClient } from './axiosInstance';

const response = (config: AxiosRequestConfig, status: number, data: unknown = {}): AxiosResponse => ({
  config: config as never, status, statusText: '', headers: {}, data
});

const unauthorized = (config: AxiosRequestConfig) => Promise.reject(
  new AxiosError('unauthorized', 'ERR_BAD_REQUEST', config as never, undefined, response(config, 401))
);

const auth = (overrides: Partial<AuthenticationService> = {}): AuthenticationService => ({
  mode: 'keycloak', initialize: vi.fn(async () => undefined), getAccessToken: vi.fn(() => null),
  refreshAccessToken: vi.fn(async () => null), isAuthenticated: vi.fn(() => false),
  getCurrentUser: vi.fn(() => null), login: vi.fn(async () => undefined), logout: vi.fn(async () => undefined),
  ...overrides
});

describe('HTTP client authentication', () => {
  it('prefers the authentication token over JWT fallback', async () => {
    const adapter = vi.fn(async (config) => response(config, 200));
    const client = createHttpClient({ auth: auth({ getAccessToken: () => 'keycloak' }), getFallbackToken: () => 'jwt' });
    client.defaults.adapter = adapter as AxiosAdapter;
    await client.get('/resource');
    expect(adapter.mock.calls[0][0].headers.get('Authorization')).toBe('Bearer keycloak');
  });

  it('uses JWT fallback and allows requests without a token', async () => {
    const adapter = vi.fn(async (config) => response(config, 200));
    const client = createHttpClient({ auth: auth(), getFallbackToken: () => 'jwt' });
    client.defaults.adapter = adapter as AxiosAdapter;
    await client.get('/jwt');
    expect(adapter.mock.calls[0][0].headers.get('Authorization')).toBe('Bearer jwt');

    const publicClient = createHttpClient({ auth: auth(), getFallbackToken: () => null });
    publicClient.defaults.adapter = adapter as AxiosAdapter;
    await publicClient.get('/public');
    expect(adapter.mock.calls[1][0].headers.get('Authorization')).toBeUndefined();
  });

  it('coordinates concurrent refreshes and retries each request once', async () => {
    let resolveRefresh!: (token: string) => void;
    const refresh = vi.fn(() => new Promise<string>((resolve) => { resolveRefresh = resolve; }));
    const adapter: AxiosAdapter = async (config) =>
      config.headers.get('Authorization') === 'Bearer fresh' ? response(config, 200) : unauthorized(config);
    const client = createHttpClient({ auth: auth({ refreshAccessToken: refresh }), getFallbackToken: () => null });
    client.defaults.adapter = adapter;
    const requests = Promise.all([client.get('/one'), client.get('/two')]);
    await vi.waitFor(() => expect(refresh).toHaveBeenCalledTimes(1));
    resolveRefresh('fresh');
    await expect(requests).resolves.toHaveLength(2);
    expect(refresh).toHaveBeenCalledTimes(1);
  });

  it('runs authentication failure once per failed request and prevents retry loops', async () => {
    const failure = vi.fn();
    const adapter = vi.fn(unauthorized) as unknown as AxiosAdapter;
    const client = createHttpClient({ auth: auth(), getFallbackToken: () => null, onAuthenticationFailure: failure });
    client.defaults.adapter = adapter;
    await expect(client.get('/protected')).rejects.toMatchObject({ response: { status: 401 } });
    expect(adapter).toHaveBeenCalledTimes(1);
    expect(failure).toHaveBeenCalledTimes(1);
  });

  it('never retries a request more than once after a successful refresh', async () => {
    const failure = vi.fn();
    const adapter = vi.fn(unauthorized) as unknown as AxiosAdapter;
    const client = createHttpClient({
      auth: auth({ refreshAccessToken: vi.fn(async () => 'fresh') }),
      getFallbackToken: () => null,
      onAuthenticationFailure: failure
    });
    client.defaults.adapter = adapter;
    await expect(client.get('/still-unauthorized')).rejects.toMatchObject({ response: { status: 401 } });
    expect(adapter).toHaveBeenCalledTimes(2);
    expect(failure).not.toHaveBeenCalled();
  });

  it('rejects all queued requests deterministically when refresh fails', async () => {
    const failure = vi.fn();
    const refreshAccessToken = vi.fn(async () => { throw new Error('refresh failed'); });
    const client = createHttpClient({ auth: auth({ refreshAccessToken }), getFallbackToken: () => null, onAuthenticationFailure: failure });
    client.defaults.adapter = vi.fn(unauthorized) as unknown as AxiosAdapter;
    const results = await Promise.allSettled([client.get('/one'), client.get('/two')]);
    expect(results.every((result) => result.status === 'rejected')).toBe(true);
    expect(refreshAccessToken).toHaveBeenCalledTimes(1);
    expect(failure).toHaveBeenCalledTimes(1);
  });
});
