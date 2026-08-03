import { AxiosError } from 'axios';
import { describe, expect, it } from 'vitest';
import { normalizeAppError } from './appError';

const axiosError = (status?: number, code?: string, data?: unknown) => new AxiosError(
  'request failed', code, { headers: {} } as never, {}, status ? { status, statusText: '', headers: {}, config: { headers: {} } as never, data } : undefined
);

describe('normalizeAppError', () => {
  it.each([
    [401, 'unauthenticated'], [403, 'forbidden'], [404, 'not-found'],
    [409, 'conflict'], [422, 'validation'], [500, 'server']
  ])('maps HTTP %s to %s', (status, kind) => {
    expect(normalizeAppError(axiosError(status)).kind).toBe(kind);
  });

  it('keeps validation details but not arbitrary server payloads', () => {
    expect(normalizeAppError(axiosError(422, undefined, { field: 'required' })).details).toEqual({ field: 'required' });
    expect(normalizeAppError(axiosError(500, undefined, { secret: true })).details).toBeUndefined();
  });

  it('distinguishes timeout and network failures', () => {
    expect(normalizeAppError(axiosError(undefined, 'ECONNABORTED'))).toMatchObject({ kind: 'timeout', retryable: true });
    expect(normalizeAppError(axiosError())).toMatchObject({ kind: 'network', retryable: true });
  });
});
