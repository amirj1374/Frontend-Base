import { describe, expect, it } from 'vitest';
import MainRoutes from './MainRoutes';
import { ROUTE_NAMES, ROUTE_PATHS } from './names';

describe('MainRoutes infrastructure contract', () => {
  it('redirects /main to the base dashboard route', () => {
    expect(MainRoutes.redirect).toEqual({ name: ROUTE_NAMES.dashboard });
    expect(MainRoutes.children.some((route) => route.path === ROUTE_PATHS.dashboard)).toBe(true);
  });

  it('marks the business route tree as authenticated', () => {
    expect(MainRoutes.meta.requiresAuth).toBe(true);
    expect(MainRoutes.children.every((route) => route.meta.requiresAuth)).toBe(true);
  });
});
