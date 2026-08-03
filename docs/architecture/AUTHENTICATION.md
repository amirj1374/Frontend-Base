# Authentication

Authentication is application infrastructure, not a UI Kit concern. Runtime configuration selects one of the implemented modes: `keycloak`, `jwt`, `initializer`, `dev`, or `demo`. Keycloak is the production-configured mode. JWT and initializer compatibility paths require representative-environment verification before production use. Development and demo modes are prohibited when Vite reports a production build.

Keycloak URL, realm, and public client ID come from typed runtime configuration. Fallback login and authorization URLs are optional public configuration. No frontend client secret is supported.

The stable service boundary provides token retrieval, refresh, login, logout, authentication state, and current-user retrieval without requiring domain services to understand the active mode. Temporary `window.$keycloak` exposure remains documented deprecated compatibility behavior.

Authentication answers who the user is. Authorization decides what they may do. Backend enforcement remains authoritative.
