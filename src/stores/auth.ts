import runtimeConfig from '@/config/runtime';
import { router } from '@/router';
import { ROUTE_NAMES } from '@/router/names';
import { getAuthenticationService } from '@/auth/service';
import { useAccessStore } from '@/stores/access';
import { fetchWrapper } from '@/utils/helpers/fetch-wrapper';
import { clearReferenceCache } from '@/services/referenceCache';
import { defineStore } from 'pinia';

const baseUrl = `${runtimeConfig.apiBaseUrl}/users`;

export interface UserClaims {
  sub: string;
  preferred_username?: string;
  name?: string;
  branchCode?: string;
  positionCode?: string;
  position?: string;
  lotusRoles?: string[];
  exp?: number;
  iat?: number;
}

function decodeJwt(token: string): UserClaims | null {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;

    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    const json = decodeURIComponent(
      atob(padded)
        .split('')
        .map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, '0')}`)
        .join('')
    );

    return JSON.parse(json);
  } catch (error) {
    console.error('JWT decode failed:', error);
    return null;
  }
}

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    claims: JSON.parse(localStorage.getItem('claims') || 'null') as UserClaims | null,
    returnUrl: null as string | null
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    token: (state) => state.user?.token || null,
    displayName: (state) => state.claims?.name || '',
    username: (state) => state.claims?.preferred_username || '',
    branchCode: (state) => state.claims?.branchCode || '',
    position: (state) => state.claims?.position || '',
    positionCode: (state) => state.claims?.positionCode || '',
    lotusRoles: (state) => state.claims?.lotusRoles || [],
    hasRole: (state) => (role: string) => state.claims?.lotusRoles?.includes(role) ?? false
  },

  actions: {
    setUser(user: any) {
      this.user = user;
      localStorage.setItem('user', JSON.stringify(user));

      const token = user?.token;
      if (token) {
        const decoded = decodeJwt(token);
        this.claims = decoded;
        localStorage.setItem('claims', JSON.stringify(decoded));
      }
    },

    setToken(token: string) {
      if (!this.user) {
        this.user = {};
      }

      this.user.token = token;
      localStorage.setItem('user', JSON.stringify(this.user));

      const decoded = decodeJwt(token);
      this.claims = decoded;
      localStorage.setItem('claims', JSON.stringify(decoded));
    },

    clearAuth() {
      this.user = null;
      this.claims = null;
      localStorage.removeItem('user');
      localStorage.removeItem('claims');
      useAccessStore().clear();
      // Drop cached reference data so a different session never sees stale lookups.
      clearReferenceCache();
    },

    async login(username: string, password: string) {
      const user = await fetchWrapper.post(`${baseUrl}/authenticate`, { username, password });

      this.setUser(user);

      if (runtimeConfig.authMode === 'initializer' || runtimeConfig.authMode === 'dev') {
        // Initialization is owned by the application bootstrap. Login keeps the
        // compatibility branch without starting a competing initialization.
      }

      await router.push(this.returnUrl || { name: ROUTE_NAMES.dashboard });
    },

    logout() {
      this.clearAuth();
      localStorage.clear();
      sessionStorage.clear();

      void getAuthenticationService(runtimeConfig.authMode).logout();
    }
  }
});
