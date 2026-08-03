import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useAccessStore } from './access';

// Build a JWT-like token (base64url payload, fake signature).
const makeToken = (payload: Record<string, unknown>): string => {
  const b64url = (obj: unknown) =>
    btoa(unescape(encodeURIComponent(JSON.stringify(obj))))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  return `${b64url({ alg: 'HS256', typ: 'JWT' })}.${b64url(payload)}.sig`;
};

const tokenWith = (roles: string[]) => makeToken({ resource_access: { VOSOOL: { roles } } });

describe('useAccessStore', () => {
  beforeEach(() => setActivePinia(createPinia()));

  it('extracts allowed APIs from resource_access.VOSOOL.roles', () => {
    const s = useAccessStore();
    s.setFromToken(tokenWith(['/api/all-facilities', '/api/fbti/gt/find']));
    expect(s.loaded).toBe(true);
    expect(s.allowedApis).toEqual(['/api/all-facilities', '/api/fbti/gt/find']);
  });

  it('grants access only to listed APIs', () => {
    const s = useAccessStore();
    s.setFromToken(tokenWith(['/api/all-facilities']));
    expect(s.canAccessApi('/api/all-facilities')).toBe(true);
    expect(s.canAccessApi('/api/fbti/lc/find')).toBe(false);
  });

  it('treats public (undefined/null) requirements as accessible', () => {
    const s = useAccessStore();
    s.setFromToken(tokenWith(['/api/x']));
    expect(s.canAccessApi(undefined)).toBe(true);
    expect(s.canAccessApi(null)).toBe(true);
  });

  it('fails open before any token is loaded', () => {
    const s = useAccessStore();
    expect(s.loaded).toBe(false);
    expect(s.canAccessApi('/api/anything')).toBe(true);
  });

  it('fails open when the token carries no VOSOOL roles', () => {
    const s = useAccessStore();
    s.setFromToken(makeToken({ sub: '1' }));
    expect(s.loaded).toBe(true);
    expect(s.allowedApis).toEqual([]);
    expect(s.canAccessApi('/api/anything')).toBe(true);
  });

  it('can fail closed explicitly for protected routes', () => {
    const s = useAccessStore();
    expect(s.evaluate('fac:view', { unresolved: 'deny' })).toBe(false);
    s.setFromToken(makeToken({ sub: '1' }));
    expect(s.evaluate('fac:view', { empty: 'deny' })).toBe(false);
  });

  it('canAccessAny passes when at least one API is allowed', () => {
    const s = useAccessStore();
    s.setFromToken(tokenWith(['/api/a']));
    expect(s.canAccessAny(['/api/a', '/api/b'])).toBe(true);
    expect(s.canAccessAny(['/api/x', '/api/y'])).toBe(false);
    expect(s.canAccessAny([])).toBe(true);
  });

  it('clear() resets state', () => {
    const s = useAccessStore();
    s.setFromToken(tokenWith(['/api/a']));
    s.clear();
    expect(s.loaded).toBe(false);
    expect(s.allowedApis).toEqual([]);
  });
});
