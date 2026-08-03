import axios from 'axios';

export type AppErrorKind = 'network' | 'timeout' | 'unauthenticated' | 'forbidden' | 'not-found' |
  'validation' | 'conflict' | 'server' | 'configuration' | 'initialization' | 'unknown';

export interface AppError {
  kind: AppErrorKind;
  status?: number;
  code?: string;
  message: string;
  details?: unknown;
  cause?: unknown;
  retryable: boolean;
}

const statusKind = (status?: number): AppErrorKind => {
  if (status === 401) return 'unauthenticated';
  if (status === 403) return 'forbidden';
  if (status === 404) return 'not-found';
  if (status === 409) return 'conflict';
  if (status === 400 || status === 422) return 'validation';
  if (status && status >= 500) return 'server';
  return 'unknown';
};

export function normalizeAppError(error: unknown, fallbackKind: AppErrorKind = 'unknown'): AppError {
  if (isAppError(error)) return error;
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const timeout = error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT';
    const network = !error.response && !timeout;
    const kind = timeout ? 'timeout' : network ? 'network' : statusKind(status);
    return {
      kind,
      status,
      code: error.code,
      message: timeout ? 'مهلت درخواست به پایان رسید.' : network ? 'ارتباط با سرور برقرار نشد.' : 'درخواست با خطا مواجه شد.',
      details: status === 400 || status === 422 ? error.response?.data : undefined,
      cause: error,
      retryable: timeout || network || kind === 'server'
    };
  }
  return {
    kind: fallbackKind,
    message: error instanceof Error ? error.message : 'خطای ناشناخته‌ای رخ داد.',
    cause: error,
    retryable: false
  };
}

export function isAppError(value: unknown): value is AppError {
  return Boolean(value && typeof value === 'object' && 'kind' in value && 'message' in value && 'retryable' in value);
}
