export type AppInitializationResult = unknown;

export interface AppInitializerOptions {
  demoEnvKey?: string;
  demoEnvValue?: string;
  demoFallbackResult?: AppInitializationResult;
}

export abstract class AppInitializer {
  private initializationPromise: Promise<AppInitializationResult> | null = null;
  private resolveInit: ((value: AppInitializationResult) => void) | null = null;
  private rejectInit: ((reason?: any) => void) | null = null;
  private isInitializing = false;

  protected constructor(private readonly options: AppInitializerOptions = {}) {}

  /**
   * Public API to start initialization flow.
   * Returns the same promise for all callers while the process is running.
   */
  initializeApp(): Promise<AppInitializationResult> {
    if (this.isDemoMode()) {
      return Promise.resolve(this.options.demoFallbackResult ?? { demo: true });
    }

    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = new Promise<AppInitializationResult>((resolve, reject) => {
      this.resolveInit = resolve;
      this.rejectInit = reject;
    });

    this.isInitializing = true;
    return this.initializationPromise;
  }

  /**
   * Force a brand-new initialization cycle.
   */
  async reinitialize(): Promise<AppInitializationResult> {
    this.resetInitializationState();
    const promise = this.initializeApp();
    await this.startInitialization();
    return promise;
  }

  /**
   * Triggers the actual initialization work.
   * Consumers should call this once (e.g., in router guard or app bootstrap).
   */
  async startInitialization(): Promise<void> {
    if (this.isDemoMode() || !this.isInitializing) {
      return;
    }

    try {
      const result = await this.runInitialization();
      this.resolveInit?.(result);
    } catch (error) {
      this.handleInitializationError(error);
      this.rejectInit?.(error);
      this.resetInitializationState();
      throw error;
    } finally {
      this.onInitializationFinally();
      this.isInitializing = false;
    }
  }

  private resetInitializationState(): void {
    this.initializationPromise = null;
    this.resolveInit = null;
    this.rejectInit = null;
    this.isInitializing = false;
  }

  /**
   * Indicates whether initialization has completed successfully or failed.
   */
  isAppInitialized(): boolean {
    return this.initializationPromise !== null && !this.isInitializing;
  }

  /**
   * Waits for the initialization process to complete.
   * Returns resolved promise immediately if initialization never started.
   */
  waitForInitialization(): Promise<AppInitializationResult> {
    if (this.initializationPromise) {
      return this.initializationPromise;
    }
    return Promise.resolve();
  }

  /**
   * Override point for subclasses to provide demo-mode detection
   * when the default environment check is insufficient.
   */
  protected isDemoMode(): boolean {
    const envValue = this.options.demoEnvValue ?? import.meta.env.VITE_APP_ENV;
    return envValue === 'demo';
  }

  /**
   * Implement this method in subclasses to perform the actual initialization logic.
   * Should throw on failure to propagate the error to initializeApp callers.
   */
  protected abstract runInitialization(): Promise<AppInitializationResult>;

  /**
   * Optional hook for centralized error handling/logging.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected handleInitializationError(error: unknown): void {
    if (import.meta.env.DEV) {
      console.error('[AppInitializer] Initialization failed', error);
    }
  }

  /**
   * Optional hook executed after initialization finishes, regardless of success.
   */
  protected onInitializationFinally(): void {
    // No-op by default
  }
}
