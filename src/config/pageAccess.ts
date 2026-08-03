/**
 * Page-level access control.
 *
 * Maps a route/menu path to the permission(s) that gate it. Permissions come from
 * the JWT (`resource_access.VOSOOL.roles`) as `res:sub:act` codes — see
 * docs/ACCESS_CONTROL.md.
 *
 * Value can be:
 *  - a single permission string  → page shown if the user has it.
 *  - an array of permissions      → page shown if the user has ANY of them (canAny).
 *    Used for multi-tab pages: visible if at least one list tab is allowed.
 *
 * A path not listed here (or undefined) is always accessible (e.g. dashboard).
 */
export const PAGE_REQUIRED_PERMISSION: Readonly<Record<string, string | string[]>> = {
  '/facilities': ['fac:due:view', 'fac:overdue:view'],
  '/guarantees': ['gt:paid:view', 'gt:unpaid:view'],
  '/currency-guarantees': ['cgt:paid:view', 'cgt:unpaid:view'],
  '/letter-of-credit': ['lc:paid:view', 'lc:unpaid:view'],
  '/documentary-collection': 'dc:view',
  '/ocp': 'ocp:view',
  '/sms': ['sms:due:view', 'sms:overdue:view'],
  '/warnings': ['wrn:report:view', 'wrn:waiting:view', 'wrn:whitelist-hq:view', 'wrn:whitelist-branch:view'],
  '/settings': 'set:manage',
  '/default-messages': 'msg:view'
  // '/' (dashboard) → public
};

/** Permission(s) that gate the given path, or undefined when the path is public. */
export function requiredPermissionFor(path?: string): string | string[] | undefined {
  if (!path) return undefined;
  return PAGE_REQUIRED_PERMISSION[path];
}
