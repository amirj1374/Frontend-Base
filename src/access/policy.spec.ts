import { describe, expect, it, vi } from 'vitest';
import { evaluateAccess } from './policy';

describe('access policy', () => {
  it('keeps normal any/all behavior when the development flag is absent', () => {
    vi.stubEnv('VITE_DEV_PERMISSION_BYPASS', 'false');
    expect(evaluateAccess({ loaded: true, permissions: ['one'] }, ['one', 'two'])).toBe(true);
    expect(evaluateAccess({ loaded: true, permissions: ['one'] }, ['one', 'two'], { mode: 'all' })).toBe(false);
  });

  it('allows single, any, and all checks when explicitly enabled during development', () => {
    vi.stubEnv('VITE_DEV_PERMISSION_BYPASS', 'true');
    const snapshot = { loaded: true, permissions: [] };
    expect(evaluateAccess(snapshot, 'restricted')).toBe(true);
    expect(evaluateAccess(snapshot, ['one', 'two'])).toBe(true);
    expect(evaluateAccess(snapshot, ['one', 'two'], { mode: 'all' })).toBe(true);
    vi.unstubAllEnvs();
  });
});
