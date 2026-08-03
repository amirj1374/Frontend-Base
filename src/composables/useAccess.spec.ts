import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useAccessStore } from '@/stores/access';
import { useAccess } from './useAccess';

const makeToken = (roles: string[]): string => {
  const b64url = (obj: unknown) =>
    btoa(unescape(encodeURIComponent(JSON.stringify(obj))))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  return `${b64url({ alg: 'HS256' })}.${b64url({ resource_access: { VOSOOL: { roles } } })}.sig`;
};

describe('useAccess', () => {
  beforeEach(() => setActivePinia(createPinia()));

  it('can() reflects the permissions in the token', () => {
    useAccessStore().setFromToken(makeToken(['gt:paid:view', 'gt:paid:export']));
    const { can } = useAccess();
    expect(can('gt:paid:view')).toBe(true);
    expect(can('gt:unpaid:view')).toBe(false);
    expect(can(undefined)).toBe(true); // public
  });

  it('allowedActions keeps only granted action keys', () => {
    useAccessStore().setFromToken(makeToken(['gt:edit', 'gt:paid:export']));
    const { allowedActions } = useAccess();
    const actions = allowedActions({
      edit: 'gt:edit',
      create: 'gt:create', // not granted
      delete: 'gt:delete' // not granted
    });
    expect(actions).toEqual(['edit']);
  });

  it('canAny passes when at least one permission is granted', () => {
    useAccessStore().setFromToken(makeToken(['fac:due:view']));
    const { canAny } = useAccess();
    expect(canAny(['fac:due:view', 'fac:overdue:view'])).toBe(true);
    expect(canAny(['fac:overdue:view'])).toBe(false);
  });
});
