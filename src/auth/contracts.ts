import type { App } from 'vue';

export type AuthenticationMode = 'keycloak' | 'jwt' | 'initializer' | 'dev' | 'demo';

export interface AuthenticatedUser {
  [key: string]: unknown;
}
export interface AuthenticationService {
  readonly mode: AuthenticationMode;
  initialize(app?: App): Promise<void>;
  getAccessToken(): string | null;
  refreshAccessToken(minValiditySeconds?: number): Promise<string | null>;
  isAuthenticated(): boolean;
  getCurrentUser(): AuthenticatedUser | null;
  login(): Promise<void>;
  logout(): Promise<void>;
}

export interface KeycloakClient {
  token?: string;
  authenticated?: boolean;
  keycloak?: {
    token?: string;
    authenticated?: boolean;
    updateToken?: (minValiditySeconds: number) => Promise<boolean>;
    login?: () => Promise<void> | void;
    logout?: (options?: { redirectUri?: string }) => Promise<void> | void;
    loadUserProfile?: () => Promise<AuthenticatedUser>;
  };
  login?: () => Promise<void> | void;
  logout?: (options?: { redirectUri?: string }) => Promise<void> | void;
}
