import { useAccessStore } from '@/stores/access';

/**
 * Ergonomic permission helpers for components (built on the access store).
 *
 * Permissions are `res:sub:act` codes from the JWT (`resource_access.VOSOOL.roles`),
 * e.g. `gt:paid:view`, `fac:detail`, `wrn:export`. See docs/ACCESS_CONTROL.md.
 *
 * The data table is permission-agnostic: it renders whatever actions/buttons/export
 * it is given. So we gate those *inputs* here, based on the user's permissions.
 *
 * Usage in a view:
 *
 *   const { can, allowedActions } = useAccess();
 *
 *   const tableActions = computed(() => [
 *     'filter',
 *     ...allowedActions({ edit: 'gt:edit', delete: 'gt:delete' }),
 *   ]);
 *
 *   <CustomDataTable
 *     :actions="tableActions"
 *     :enable-export="can('gt:paid:export')"
 *     :custom-buttons-fn="getCustomButtons"
 *   />
 *
 *   // inside getCustomButtons(item):
 *   if (can('gt:detail')) buttons.push({ label: 'جزییات بیشتر', onClick });
 */
export function useAccess() {
  const store = useAccessStore();
  store.ensureLoaded();

  /** True if the user has this permission (undefined/public -> true). */
  const can = (permission?: string | null): boolean => store.canAccessApi(permission);

  /** True if the user has at least one of these permissions. */
  const canAny = (permissions?: string[] | null): boolean => store.canAccessAny(permissions);

  /**
   * Given a map of action-key -> required permission, returns only the action keys
   * the user is allowed to use. Handy for building the table `:actions` array.
   */
  const allowedActions = <T extends string>(map: Partial<Record<T, string>>): T[] =>
    (Object.keys(map) as T[]).filter((key) => can(map[key]));

  return { can, canAny, allowedActions };
}
