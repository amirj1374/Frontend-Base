import { createApp, type App as VueApp } from 'vue';
import { createPinia } from 'pinia';
import App from '@/App.vue';
import runtimeConfig from '@/config/runtime';
import { configureAuthentication, type AuthenticationService } from '@/auth/service';
import { registerApplicationPlugins, registerStatePlugin } from './plugins';
import { runApplicationInitialization } from './initialization';
import { useAccessStore } from '@/stores/access';
import { useAuthStore } from '@/stores/auth';
import { useCustomizerStore } from '@amirjalili1374/ui-kit';
import { api } from '@/services/api';
import { parseCustomizerPreferences } from '@amirjalili1374/ui-kit';

export interface BootstrapDependencies {
  createVueApp: () => VueApp;
  configureAuth: typeof configureAuthentication;
  initialize: () => Promise<void>;
  registerPlugins: (app: VueApp) => void;
  mount: (app: VueApp) => void;
}

async function initializeAuthenticationMode(app: VueApp): Promise<AuthenticationService> {
  const service = await configureAuthentication(app, runtimeConfig.authMode);
  const customizer = useCustomizerStore();
  customizer.SET_LOADING(true);
  try {
    switch (runtimeConfig.authMode) {
      case 'keycloak':
        useAccessStore().setFromToken(service.getAccessToken());
        break;
      case 'jwt': {
        const response = await api.user.getUserInfo();
        if (response?.data) {
          useAuthStore().setUser(response.data);
          // The API stores all visual preferences in one versioned JSON string.
          // Absence of the field deliberately keeps local/default preferences intact.
          if (response.data.customizer != null) {
            useCustomizerStore().APPLY_PREFERENCES(parseCustomizerPreferences(response.data.customizer));
          }
        }
        break;
      }
      case 'initializer':
      case 'dev':
        break;
      case 'demo':
        if (!useAuthStore().user) {
          useAuthStore().setUser({ id: 'demo-user', name: 'Demo User', username: 'demo' });
        }
        break;
    }
  } finally {
    customizer.SET_LOADING(false);
  }
  return service;
}

const defaultDependencies: BootstrapDependencies = {
  createVueApp: () => createApp(App),
  configureAuth: configureAuthentication,
  initialize: async () => undefined,
  registerPlugins: registerApplicationPlugins,
  mount: (app) => { app.mount('#app'); }
};

export async function bootstrapApplication(overrides: Partial<BootstrapDependencies> = {}): Promise<VueApp> {
  const dependencies = { ...defaultDependencies, ...overrides };
  const app = dependencies.createVueApp();
  const pinia = createPinia();
  registerStatePlugin(app, pinia);

  await runApplicationInitialization(async () => {
    if (dependencies.configureAuth === configureAuthentication) {
      await initializeAuthenticationMode(app);
    } else {
      await dependencies.configureAuth(app, runtimeConfig.authMode);
    }
    await dependencies.initialize();
  });

  dependencies.registerPlugins(app);
  dependencies.mount(app);
  return app;
}
