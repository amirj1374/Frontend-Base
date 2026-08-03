import type { App } from 'vue';
import VueKeycloakJs from '@dsb-norge/vue-keycloak-js';
import runtimeConfig from '@/config/runtime';
import type { KeycloakClient } from '@/auth/contracts';

let keycloakClient: KeycloakClient | null = null;

export function getKeycloakClient(): KeycloakClient | null {
  return keycloakClient;
}

export function setKeycloakClientForTesting(client: KeycloakClient | null): void {
  keycloakClient = client;
}

/**
 * Installs Keycloak and resolves only after the client is ready.
 * `window.$keycloak` remains as a deprecated compatibility bridge for legacy code.
 */
export function setupKeycloak(app: App): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      app.use(VueKeycloakJs, {
        config: runtimeConfig.keycloak,
        init: {
          flow: 'standard',
          checkLoginIframe: false,
          onLoad: 'login-required',
          pkceMethod: 'S256'
        },
        logout: { redirectUri: window.location.origin },
        onAuthLogout: () => { keycloakClient = null; },
        onReady: (client: KeycloakClient) => {
          keycloakClient = client;
          window.$keycloak = client;
          resolve();
        },
        onInitError: (error: unknown) => {
          keycloakClient = null;
          reject(error);
        }
      });
    } catch (error) {
      keycloakClient = null;
      reject(error);
    }
  });
}

declare global {
  interface Window {
    /** @deprecated Use getAuthenticationService() or getKeycloakClient(). */
    $keycloak?: KeycloakClient;
  }
}
