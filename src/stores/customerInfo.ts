import { defineStore } from 'pinia';

/**
 * Generic user-context store retained for shared layout and access components.
 * Product applications can populate it from their own profile endpoint.
 */
export const useCustomerInfoStore = defineStore('customerInfo', {
  state: () => ({
    userInfo: null as { authTime?: string } | null,
    roles: [] as string[],
    lotusRoles: [] as string[],
    error: null as string | null,
    isUserInfoLoaded: true
  }),
  getters: {
    getUserInfo: (state) => state.userInfo,
    getUserRoles: (state) => state.roles,
    getLotusRoles: (state) => state.lotusRoles
  },
  actions: {
    setUserInfo(userInfo: { authTime?: string } | null) {
      this.userInfo = userInfo;
      this.isUserInfoLoaded = true;
    },
    setRoles(roles: string[] = [], lotusRoles: string[] = []) {
      this.roles = roles;
      this.lotusRoles = lotusRoles;
      this.isUserInfoLoaded = true;
    },
    hasRole(role: string) {
      return this.roles.includes(role);
    },
    hasLotusRole(role: string) {
      return this.lotusRoles.includes(role);
    },
    setError(message: string | null) {
      this.error = message;
    },
    clearError() {
      this.error = null;
    }
  }
});
