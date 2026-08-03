import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createAuthenticationService } from './service';
import { setKeycloakClientForTesting } from '@/plugins/key-clock';

describe('authentication service', () => {
  beforeEach(() => {
    localStorage.clear();
    setKeycloakClientForTesting(null);
  });

  it('uses Keycloak token and refresh contract', async () => {
    const updateToken = vi.fn(async () => true);
    setKeycloakClientForTesting({ token: 'kc-token', keycloak: { updateToken } });
    const service = createAuthenticationService('keycloak');
    expect(service.getAccessToken()).toBe('kc-token');
    await expect(service.refreshAccessToken()).resolves.toBe('kc-token');
    expect(updateToken).toHaveBeenCalledWith(5);
  });

  it.each(['jwt', 'initializer', 'dev', 'demo'] as const)('uses stored token for %s mode', (mode) => {
    localStorage.setItem('authToken', 'stored-token');
    expect(createAuthenticationService(mode).getAccessToken()).toBe('stored-token');
  });
});
