import { defineStore } from 'pinia';
import { decodeJwt } from '@/utils/jwt';
import { evaluateAccess, type AccessEvaluationOptions, type AccessRequirement } from '@/access/policy';

/**
 * API-level access control derived from the JWT access token.
 *
 * The Keycloak token carries the list of APIs the user may call under
 * `resource_access.VOSOOL.roles` (e.g. "/api/all-facilities"). We use that list
 * to gate routes, menu items and individual UI elements.
 *
 * Fail-open policy: when the list cannot be determined (token missing, not yet
 * loaded, or empty — e.g. demo/jwt auth modes) access is granted, so users are
 * never locked out by a misconfiguration. A real VOSOOL token always carries a
 * populated list, so genuine restriction still applies.
 */
interface VosoolTokenPayload {
  resource_access?: {
    VOSOOL?: { roles?: string[] };
  };
}

export const useAccessStore = defineStore('access', {
  state: () => ({
    /** Allowed API paths from the token (e.g. "/api/fbti/gt/find"). */
    allowedApis: [] as string[],
    /** True once a token has been processed (regardless of outcome). */
    loaded: false
  }),

  getters: {
    /** Whether the user may access a single API. Public/unknown -> allowed. */
    canAccessApi:
      (state) =>
      (api?: string | null): boolean => {
        return evaluateAccess(
          { loaded: state.loaded, permissions: state.allowedApis },
          api
        );
      },

    /** Whether the user may access at least one of the given APIs. */
    canAccessAny() {
      return (apis?: string[] | null): boolean => {
        if (!apis || apis.length === 0) return true;
        return apis.some((api) => this.canAccessApi(api));
      };
    }
  },

  actions: {
    /** Evaluate access with an explicit unresolved/empty policy (used by protected routes). */
    evaluate(requirement: AccessRequirement, options?: AccessEvaluationOptions) {
      return evaluateAccess(
        { loaded: this.loaded, permissions: this.allowedApis },
        requirement,
        options
      );
    },
    /** Populate the allowed-API list from a raw JWT string. */
    setFromToken(token?: string | null) {
      const payload = token ? decodeJwt<VosoolTokenPayload>(token) : null;
      const roles = payload?.resource_access?.VOSOOL?.roles;
      this.allowedApis = Array.isArray(roles) ? roles : [];
      this.loaded = true;
    },

    /** Ensure the list is populated, reading the current Keycloak token if needed. */
    ensureLoaded() {
      if (this.loaded) return;
      const token = (window as any)?.$keycloak?.token as string | undefined;
      this.setFromToken(token);
    },

    clear() {
      this.allowedApis = [];
      this.loaded = false;
    }
  }
});
