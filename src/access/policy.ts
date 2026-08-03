export type AccessRequirement = string | readonly string[] | null | undefined;

export type UnresolvedAccessPolicy = 'allow' | 'deny';

export interface AccessEvaluationOptions {
  mode?: 'any' | 'all';
  unresolved?: UnresolvedAccessPolicy;
  empty?: UnresolvedAccessPolicy;
}

export interface AccessSnapshot {
  loaded: boolean;
  permissions: readonly string[];
}

/** Temporary development-only visual bypass. Authentication and backend calls remain unchanged. */
export function isDevelopmentPermissionBypassActive(): boolean {
  return import.meta.env.DEV && import.meta.env.VITE_DEV_PERMISSION_BYPASS === 'true';
}

/** Shared evaluator for routes, menus and actions. Missing requirements are public. */
export function evaluateAccess(
  snapshot: AccessSnapshot,
  requirement: AccessRequirement,
  options: AccessEvaluationOptions = {}
): boolean {
  if (isDevelopmentPermissionBypassActive()) return true;
  const requirements = Array.isArray(requirement)
    ? requirement.filter(Boolean)
    : requirement
      ? [requirement]
      : [];

  if (requirements.length === 0) return true;
  if (!snapshot.loaded) return (options.unresolved ?? 'allow') === 'allow';
  if (snapshot.permissions.length === 0) return (options.empty ?? 'allow') === 'allow';

  const contains = (permission: string) => snapshot.permissions.includes(permission);
  return (options.mode ?? 'any') === 'all'
    ? requirements.every(contains)
    : requirements.some(contains);
}
