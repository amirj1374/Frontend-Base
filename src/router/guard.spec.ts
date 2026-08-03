import { describe, expect, it, vi } from 'vitest';
import type { RouteLocationNormalized } from 'vue-router';
import { createInfrastructureGuard, type RouterGuardDependencies } from './guard';
import { ROUTE_NAMES } from './names';

const route = (path: string, requiresAuth = true) =>
  ({ path, fullPath: path, matched: [{ meta: { requiresAuth } }] }) as unknown as RouteLocationNormalized;

const dependencies = (overrides: Partial<RouterGuardDependencies> = {}): RouterGuardDependencies => ({
  isDemo: () => false,
  isAuthenticated: () => true,
  rememberReturnUrl: vi.fn(),
  ensureAccessLoaded: vi.fn(),
  canAccessProtectedRoute: () => true,
  ...overrides
});

describe('infrastructure route guard', () => {
  it('remembers protected destinations and redirects unauthenticated users by name', async () => {
    const deps = dependencies({ isAuthenticated: () => false });
    const result = await createInfrastructureGuard(deps)(route('/facilities'), route('/'), vi.fn());
    expect(deps.rememberReturnUrl).toHaveBeenCalledWith('/facilities');
    expect(result).toEqual({ name: ROUTE_NAMES.login });
  });

  it('waits for access loading before evaluating protected route permissions', async () => {
    const order: string[] = [];
    const guard = createInfrastructureGuard(dependencies({
      ensureAccessLoaded: async () => { order.push('load'); },
      canAccessProtectedRoute: () => { order.push('evaluate'); return true; }
    }));
    expect(await guard(route('/facilities'), route('/'), vi.fn())).toBe(true);
    expect(order).toEqual(['load', 'evaluate']);
  });

  it('separates access denial and initialization failure from not-found routing', async () => {
    const denied = createInfrastructureGuard(dependencies({ canAccessProtectedRoute: () => false }));
    expect(await denied(route('/facilities'), route('/'), vi.fn())).toEqual({ name: ROUTE_NAMES.forbidden });

    const failed = createInfrastructureGuard(dependencies({ ensureAccessLoaded: () => { throw new Error('failed'); } }));
    expect(await failed(route('/facilities'), route('/'), vi.fn())).toEqual({ name: ROUTE_NAMES.forbidden });
  });

  it('allows auth/error infrastructure routes without access initialization', async () => {
    const ensureAccessLoaded = vi.fn();
    const guard = createInfrastructureGuard(dependencies({ ensureAccessLoaded }));
    expect(await guard(route('/auth/login'), route('/'), vi.fn())).toBe(true);
    expect(await guard(route('/error/403'), route('/'), vi.fn())).toBe(true);
    expect(ensureAccessLoaded).not.toHaveBeenCalled();
  });
});
