import { createApp } from 'vue';
import { createPinia } from 'pinia';
import vuetify from '@/plugins/vuetify';
import { normalizeAppError } from '@/errors/appError';

export async function mountFatalError(error: unknown): Promise<void> {
  const normalized = normalizeAppError(error, 'initialization');
  const target = document.getElementById('app');
  if (!target) return;
  target.replaceChildren();

  try {
    const { default: Error401Page } = await import('@/views/pages/maintenance/error/Error401Page.vue');
    const errorApp = createApp(Error401Page as never, { error: normalized.message });
    errorApp.use(createPinia());
    errorApp.use(vuetify);
    errorApp.mount('#app');
  } catch {
    const container = document.createElement('main');
    container.setAttribute('role', 'alert');
    container.setAttribute('dir', 'rtl');
    const heading = document.createElement('h1');
    heading.textContent = 'راه‌اندازی برنامه ناموفق بود';
    const message = document.createElement('p');
    message.textContent = normalized.message;
    const retry = document.createElement('button');
    retry.type = 'button';
    retry.textContent = 'تلاش مجدد';
    retry.addEventListener('click', () => window.location.reload());
    container.append(heading, message, retry);
    target.append(container);
  }
}
