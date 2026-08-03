import type { NavigationGuard, RouteLocationNormalized } from 'vue-router';
import { requiredPermissionFor } from '@/config/pageAccess';
import { ROUTE_NAMES } from './names';

export interface RouterGuardDependencies {
  isDemo: () => boolean;
  isAuthenticated: () => boolean;
  rememberReturnUrl: (url: string) => void;
  ensureAccessLoaded: () => void | Promise<void>;
  canAccessProtectedRoute: (requirement: string | string[] | undefined) => boolean;
}

const isInfrastructureRoute = (to: RouteLocationNormalized) =>
  to.path.startsWith('/error') || to.path.startsWith('/auth');

export function createInfrastructureGuard(dependencies: RouterGuardDependencies): NavigationGuard {
  return async (to) => {
    if (isInfrastructureRoute(to) || dependencies.isDemo()) return true;

    if (to.matched.some((record) => record.meta.requiresAuth) && !dependencies.isAuthenticated()) {
      dependencies.rememberReturnUrl(to.fullPath);
      return { name: ROUTE_NAMES.login };
    }

    try {
      await dependencies.ensureAccessLoaded();
    } catch {
      return { name: ROUTE_NAMES.forbidden };
    }

    const requirement = requiredPermissionFor(to.path);
    return dependencies.canAccessProtectedRoute(requirement)
      ? true
      : { name: ROUTE_NAMES.forbidden };
  };
}
