import { afterEach, describe, expect, it, vi } from 'vitest';
import { fakeBackend } from './fake-backend';

const originalFetch = window.fetch;

afterEach(() => {
  window.fetch = originalFetch;
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('fakeBackend', () => {
  it('passes URL objects through to the real fetch implementation', async () => {
    const response = new Response('{}', { status: 200 });
    const realFetch = vi.fn().mockResolvedValue(response);
    window.fetch = realFetch as typeof window.fetch;
    fakeBackend();

    const url = new URL('http://localhost/backend/erd/stream');
    await window.fetch(url, { method: 'GET' });

    expect(realFetch).toHaveBeenCalledWith(url, { method: 'GET' });
  });

  it('intercepts only the customer search mock route', async () => {
    vi.useFakeTimers();
    const realFetch = vi.fn();
    window.fetch = realFetch as typeof window.fetch;
    fakeBackend();

    const pending = window.fetch('/customers/search', {
      method: 'POST',
      body: JSON.stringify({ nationalCode: '0018523897' })
    });
    await vi.runAllTimersAsync();
    const response = await pending;

    expect(await response.json()).toHaveLength(1);
    expect(realFetch).not.toHaveBeenCalled();
  });
});
