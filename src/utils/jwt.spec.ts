import { describe, it, expect } from 'vitest';
import { decodeJwt } from './jwt';

// Build a JWT-like token from a payload object (base64url, no real signature).
const makeToken = (payload: Record<string, unknown>): string => {
  const b64url = (obj: unknown) =>
    btoa(unescape(encodeURIComponent(JSON.stringify(obj))))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  return `${b64url({ alg: 'HS256', typ: 'JWT' })}.${b64url(payload)}.signature`;
};

describe('decodeJwt', () => {
  it('decodes the payload of a valid token', () => {
    const token = makeToken({ sub: '123', name: 'امیر', roles: ['a', 'b'] });
    const decoded = decodeJwt(token);
    expect(decoded).toEqual({ sub: '123', name: 'امیر', roles: ['a', 'b'] });
  });

  it('handles unicode (Persian) payloads', () => {
    const token = makeToken({ name: 'جلیلی' });
    expect(decodeJwt<{ name: string }>(token)?.name).toBe('جلیلی');
  });

  it('returns null for a malformed token (no payload segment)', () => {
    expect(decodeJwt('only-one-part')).toBeNull();
  });

  it('returns null when the payload is not valid base64/JSON', () => {
    expect(decodeJwt('aaa.!!!notbase64!!!.bbb')).toBeNull();
  });

  it('returns null for an empty string', () => {
    expect(decodeJwt('')).toBeNull();
  });
});
