import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';

vi.mock('@/router', () => ({ router: { push: vi.fn() } }));
vi.mock('@/auth/service', () => ({ getAuthenticationService: () => ({ logout: vi.fn() }) }));
vi.mock('@/services/referenceCache', () => ({ clearReferenceCache: vi.fn() }));

import { useAccessStore } from './access';
import { useAuthStore } from './auth';

describe('authentication reset', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    setActivePinia(createPinia());
  });

  it('clears the access snapshot when authentication is cleared', () => {
    const access = useAccessStore();
    access.loaded = true;
    access.allowedApis = ['/api/previous-session'];

    useAuthStore().clearAuth();

    expect(access.loaded).toBe(false);
    expect(access.allowedApis).toEqual([]);
  });
});
