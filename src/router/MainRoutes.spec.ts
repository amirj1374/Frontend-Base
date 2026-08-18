import { describe, expect, it } from 'vitest';
import MainRoutes from './MainRoutes';
import { ROUTE_NAMES, ROUTE_PATHS } from './names';

describe('MainRoutes infrastructure contract', () => {
  it('redirects the root entry points to the ISAS new-chat route', () => {
    expect(MainRoutes.redirect).toEqual({ name: ROUTE_NAMES.isasChat });
    const rootRoute = MainRoutes.children.find((route) => route.path === ROUTE_PATHS.dashboard);
    expect(rootRoute?.redirect).toEqual({ name: ROUTE_NAMES.isasChat });
  });

  it('marks the business route tree as authenticated', () => {
    expect(MainRoutes.meta.requiresAuth).toBe(true);
    expect(MainRoutes.children.every((route) => route.meta.requiresAuth)).toBe(true);
  });
});
