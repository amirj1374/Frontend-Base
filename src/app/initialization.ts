import { computed, readonly, ref } from 'vue';

export type InitializationStatus = 'not-started' | 'initializing' | 'ready' | 'failed';

const status = ref<InitializationStatus>('not-started');
const failure = ref<unknown>(null);
let activeInitialization: Promise<void> | null = null;

export async function runApplicationInitialization(work: () => Promise<unknown>): Promise<void> {
  if (status.value === 'ready') return;
  if (activeInitialization) return activeInitialization;

  status.value = 'initializing';
  failure.value = null;
  activeInitialization = Promise.resolve()
    .then(work)
    .then(() => { status.value = 'ready'; })
    .catch((error) => {
      status.value = 'failed';
      failure.value = error;
      throw error;
    })
    .finally(() => { activeInitialization = null; });

  return activeInitialization;
}

export function useApplicationInitialization() {
  return {
    status: readonly(status),
    failure: readonly(failure),
    isInitializing: computed(() => status.value === 'initializing'),
    isReady: computed(() => status.value === 'ready'),
    hasFailed: computed(() => status.value === 'failed')
  };
}
