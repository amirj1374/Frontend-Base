import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig
} from 'axios';
import runtimeConfig from '@/config/runtime';
import { getAuthenticationService } from '@/auth/service';
import type { AuthenticationService } from '@/auth/contracts';
import { useAuthStore } from '@/stores/auth';
import { normalizeAppError } from '@/errors/appError';

type RetriableRequest = AxiosRequestConfig & { _retry?: boolean };

export interface HttpClientDependencies {
  auth: AuthenticationService;
  getFallbackToken: () => string | null;
  onToken?: (token: string) => void;
  onAuthenticationFailure?: () => Promise<void> | void;
}

const defaultDependencies = (): HttpClientDependencies => ({
  auth: getAuthenticationService(runtimeConfig.authMode),
  getFallbackToken: () => localStorage.getItem('authToken'),
  onToken: (token) => {
    const store = useAuthStore();
    if ((store.user?.token ?? store.token ?? null) !== token) store.setToken(token);
  },
  onAuthenticationFailure: async () => {
    const store = useAuthStore();
    store.clearAuth?.();
    localStorage.removeItem('authToken');
    const auth = getAuthenticationService(runtimeConfig.authMode);
    await auth.login();
    if (!auth.isAuthenticated() && runtimeConfig.auth.fallbackLoginUrl) {
      window.location.assign(runtimeConfig.auth.fallbackLoginUrl);
    }
  }
});

export function createHttpClient(
  dependencies: HttpClientDependencies = defaultDependencies()
): AxiosInstance {
  const instance = axios.create({
    baseURL: runtimeConfig.apiBaseUrl,
    timeout: 30_000,
    headers: { 'Content-Type': 'application/json' }
  });
  let refreshPromise: Promise<string | null> | null = null;
  let authenticationFailurePromise: Promise<void> | null = null;

  const freshToken = (): Promise<string | null> => {
    if (!refreshPromise) {
      refreshPromise = dependencies.auth.refreshAccessToken(5).finally(() => {
        refreshPromise = null;
      });
    }
    return refreshPromise;
  };

  const handleAuthenticationFailure = (): Promise<void> => {
    if (!authenticationFailurePromise) {
      authenticationFailurePromise = Promise.resolve(dependencies.onAuthenticationFailure?.()).finally(() => {
        authenticationFailurePromise = null;
      });
    }
    return authenticationFailurePromise;
  };

  instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = dependencies.auth.getAccessToken() || dependencies.getFallbackToken();
    if (token) {
      dependencies.onToken?.(token);
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    async (error: unknown) => {
      if (!axios.isAxiosError(error)) return Promise.reject(error);
      const request = error.config as RetriableRequest | undefined;
      if (error.response?.status !== 401 || !request || request._retry) {
        return Promise.reject(error);
      }

      request._retry = true;
      try {
        const token = await freshToken();
        if (token) {
          dependencies.onToken?.(token);
          request.headers = request.headers ?? {};
          (request.headers as Record<string, string>).Authorization = `Bearer ${token}`;
          return instance(request);
        }
        await handleAuthenticationFailure();
      } catch {
        await handleAuthenticationFailure();
      }
      return Promise.reject(error);
    }
  );

  return instance;
}

/** Migration helper: existing callers may keep Axios errors while new infrastructure normalizes them. */
export const normalizeHttpError = normalizeAppError;

const axiosInstance = createHttpClient();
export default axiosInstance;
