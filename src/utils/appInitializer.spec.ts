import { describe, expect, it, vi } from 'vitest';
import { AppInitializer } from './appInitializer';

class TestInitializer extends AppInitializer {
  constructor(private readonly work: () => Promise<unknown>) { super({ demoEnvValue: 'test' }); }
  protected runInitialization() { return this.work(); }
}

describe('AppInitializer', () => {
  it('does not report completion before its work resolves', async () => {
    let release!: (value: unknown) => void;
    const work = vi.fn(() => new Promise((resolve) => { release = resolve; }));
    const initializer = new TestInitializer(work);
    const pending = initializer.initializeApp();
    const started = initializer.startInitialization();
    expect(initializer.isAppInitialized()).toBe(false);
    release({ ready: true });
    await started;
    await expect(pending).resolves.toEqual({ ready: true });
    expect(initializer.isAppInitialized()).toBe(true);
  });

  it('shares one pending initialization result', async () => {
    const work = vi.fn(async () => ({ ready: true }));
    const initializer = new TestInitializer(work);
    const first = initializer.initializeApp();
    const second = initializer.initializeApp();
    await initializer.startInitialization();
    await expect(Promise.all([first, second])).resolves.toEqual([{ ready: true }, { ready: true }]);
    expect(work).toHaveBeenCalledTimes(1);
  });
});
