import type { App } from 'vue';
import type { AuthenticationMode, AuthenticationService, AuthenticatedUser } from './contracts';
import { setupKeycloak, getKeycloakClient } from '@/plugins/key-clock';

class ApplicationAuthenticationService implements AuthenticationService {
  constructor(public readonly mode: AuthenticationMode) {}

  async initialize(app?: App): Promise<void> {
    if (this.mode === 'keycloak') {
      if (!app) throw new Error('A Vue application is required for Keycloak authentication');
      await setupKeycloak(app);
    }
  }

  getAccessToken(): string | null {
    if (this.mode === 'keycloak') {
      const client = getKeycloakClient();
      return client?.token ?? client?.keycloak?.token ?? null;
    }
    return localStorage.getItem('authToken');
  }

  async refreshAccessToken(minValiditySeconds = 5): Promise<string | null> {
    if (this.mode !== 'keycloak') return this.getAccessToken();
    const client = getKeycloakClient();
    const updateToken = client?.keycloak?.updateToken;
    if (!updateToken) return null;
    const refreshed = await updateToken.call(client.keycloak, minValiditySeconds);
    return refreshed ? this.getAccessToken() : null;
  }

  isAuthenticated(): boolean {
    if (this.mode === 'keycloak') {
      const client = getKeycloakClient();
      return Boolean(client?.authenticated ?? client?.keycloak?.authenticated ?? this.getAccessToken());
    }
    return Boolean(this.getAccessToken());
  }

  getCurrentUser(): AuthenticatedUser | null {
    const stored = localStorage.getItem('user');
    if (!stored) return null;
    try { return JSON.parse(stored) as AuthenticatedUser; } catch { return null; }
  }

  async login(): Promise<void> {
    const client = getKeycloakClient();
    const login = client?.login ?? client?.keycloak?.login;
    if (login) await login.call(client?.login ? client : client?.keycloak);
  }

  async logout(): Promise<void> {
    const client = getKeycloakClient();
    const logout = client?.logout ?? client?.keycloak?.logout;
    if (logout) await logout.call(client?.logout ? client : client?.keycloak, { redirectUri: window.location.origin });
  }
}

let authenticationService: AuthenticationService | null = null;

export function createAuthenticationService(mode: AuthenticationMode): AuthenticationService {
  return new ApplicationAuthenticationService(mode);
}

export async function configureAuthentication(app: App, mode: AuthenticationMode): Promise<AuthenticationService> {
  const service = createAuthenticationService(mode);
  await service.initialize(app);
  authenticationService = service;
  return service;
}

export function getAuthenticationService(mode: AuthenticationMode = 'keycloak'): AuthenticationService {
  authenticationService ??= createAuthenticationService(mode);
  return authenticationService;
}

export function setAuthenticationServiceForTesting(service: AuthenticationService | null): void {
  authenticationService = service;
}

export type { AuthenticationMode, AuthenticationService } from './contracts';
