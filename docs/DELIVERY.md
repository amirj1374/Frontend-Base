# Team Delivery Runbook

This branch is the infrastructure foundation for `vosool-frontend`. It does not include business-module migrations, UI redesign, generators, project scaffolding, feature packs, or deployment automation.

## Prepare a workstation

1. Install Node 22.12.0 and npm 11. The supported Node range is `^20.19.0 || >=22.12.0`.
2. Run `npm ci` from the repository root. Do not use another package manager or regenerate the lockfile during ordinary setup.
3. Copy `.env.example` to the appropriate local Vite environment file.
4. Supply public environment values for the selected authentication mode. Never place a client secret or credential in a `VITE_*` variable.
5. Run `npm run validate` before starting feature work.
6. Start the application with `npm run dev`.

## Required configuration

At minimum, configure the API URL, application base URL, application environment, and authentication mode. Keycloak mode additionally requires its URL, realm, and public client ID. Production rejects `dev` and `demo` authentication modes.

Use `.env.example` as the authoritative variable inventory. Environment-specific values should be managed through approved local files and protected GitLab CI variables.

### Safe environment checklist

- [ ] `VITE_API_BASE_URL` is an absolute HTTP(S) API URL.
- [ ] `VITE_BASE_URL` matches the deployment subpath and ends up normalized with leading/trailing slashes.
- [ ] `VITE_APP_ENV` identifies the intended environment.
- [ ] `VITE_APP_TITLE` contains the public browser title.
- [ ] `VITE_AUTH_MODE` is explicitly selected; production must not use `dev` or `demo`.
- [ ] Keycloak mode supplies `VITE_KEYCLOAK_URL`, `VITE_KEYCLOAK_REALM`, and the public `VITE_KEYCLOAK_CLIENT_ID`.
- [ ] Optional `VITE_AUTH_FALLBACK_LOGIN_URL` and `VITE_AUTH_FALLBACK_AUTHORIZATION_URL` are either root-relative or absolute HTTP(S) URLs.
- [ ] `VITE_DEBUG` is `false` unless diagnostic output is deliberately approved.
- [ ] `VITE_PORT` is set only as needed for local development.
- [ ] No password, token, cookie, private key, or client secret appears in any `VITE_*` value.

Missing API or Keycloak-required values stop startup with `RuntimeConfigurationError`. The prelive/live scripts select `.env.prelive`/`.env.live`; Vite and the typed runtime boundary consume the same variable names.

## Delivery gates

A candidate is ready for team review only when these commands pass from a clean checkout:

```bash
npm ci
npm run validate
npm run build:prelive
npm run build:live
git diff --check
git status --short
```

GitLab CI repeats clean installation, lint, type checking, unit coverage, and environment builds. Do not merge when a required job is allowed to fail, skipped without explanation, or red.

## Environment smoke check

Before promoting the branch, verify in a representative non-production environment:

1. The application waits for authentication and initialization before mounting.
2. Login, token refresh, logout, and expired-session reauthentication complete without redirect loops.
3. `/main`, `/main/facilities`, and `/approval` compatibility redirects reach their documented destinations.
4. A protected route denies unresolved or missing access rather than briefly exposing its page.
5. A normal API request carries the expected token and concurrent 401 responses cause one refresh attempt.
6. Fatal initialization failure shows the infrastructure error page and clears global loading.
7. Existing DataTables still use the consumer Axios instance.

### Authentication mode classification

| Mode | Classification | Required verification |
| --- | --- | --- |
| `keycloak` | Production-supported and configured by current environment files | Complete the full non-production checklist below |
| `jwt` | Present but unverified | Verify backend current-user response, stored token contract, refresh/expiry behavior, and logout before production use |
| `initializer` | Deprecated compatibility, present but unverified | Verify legacy identity injection and awaited base-data initialization before use |
| `dev` | Development-only | Local use only; production configuration rejects it |
| `demo` | Demo-only code path | Production rejects it; current checked-in demo mode still selects Keycloak, so synthetic demo auth is not an active shipped configuration |

### Authentication smoke test

- [ ] Application opens without a JavaScript bootstrap failure.
- [ ] An unauthenticated Keycloak user is sent to login.
- [ ] Successful login returns to the originally requested protected route.
- [ ] The access token is attached to API requests and no token is attached to an intentionally public request.
- [ ] Concurrent `401` responses produce one refresh call and queued requests resume with the refreshed token.
- [ ] A failed refresh rejects all queued requests deterministically.
- [ ] Reauthentication or fallback login occurs once without a redirect loop.
- [ ] Logout clears user, claims, cached reference data, local/session storage, and the identity-provider session.
- [ ] Browser refresh preserves a still-valid authenticated session.
- [ ] Invalid and expired tokens produce deterministic unauthenticated behavior.
- [ ] `403` access denial is visually distinct from fatal bootstrap/configuration failure.
- [ ] No token, cookie, or identity response is recorded in review evidence.

### Route verification matrix

| Route/scenario | Expected result | Automated test | Manual smoke required |
| --- | --- | ---: | ---: |
| `/` authenticated | Dashboard renders | Partial | Yes |
| `/` unauthenticated | Login route, return URL remembered | Yes, guard | Yes |
| `/main` | Redirect by name to `/facilities` | Yes | Yes |
| `/facilities` authorized | Facilities shell renders | Yes, route/guard | Yes |
| `/main/facilities` | Compatibility redirect to `/facilities` | Route declaration | Yes |
| `/approval` | Compatibility redirect to dashboard | Route declaration | Yes |
| `/auth/login` | Login page allowed without access initialization | Yes, guard | Yes |
| `/error/403` | Unauthorized page, no guard loop | Yes, guard | Yes |
| Unknown URL | Deterministic 404 page | Route declaration | Yes |
| Protected route while access loads | Await access loading before evaluation | Yes, guard | Yes |
| Protected route with denied/empty access | Redirect to 403 | Yes | Yes |
| Access initialization failure | Redirect to 403; does not become 404 | Yes | Yes |
| Direct nested navigation/refresh | Server fallback serves app; Router restores route | No | Yes |
| Fatal application initialization | Fatal infrastructure page; normal mount does not occur | Yes, bootstrap/fatal path | Yes |

The hosting environment must return `index.html` for application routes. This repository does not configure the external web server.

### HTTP and error smoke checks

- [ ] Confirm the configured API base URL in a representative request.
- [ ] Confirm Keycloak-token preference, JWT fallback, and a no-token public request.
- [ ] Exercise network failure and 30-second timeout normalization.
- [ ] Verify `401`, `403`, `404`, `409`, `422`, and `500` map to their documented error kinds.
- [ ] Verify refresh success, refresh failure, concurrent `401` coordination, and the one-retry limit.
- [ ] Verify a required bootstrap API failure reaches the fatal path and clears loading.
- [ ] Verify arbitrary server payloads are not displayed; only validation details are retained by the generic normalizer.
- [ ] Confirm representative domain services still receive ordinary Axios responses without contract conversion.

### Access policy matrix

| Context | Unresolved policy | Denied behavior | Backend enforcement required |
| --- | --- | --- | ---: |
| Protected route | Fail closed | Redirect to 403 | Yes |
| Menu visibility | Compatibility fail open | Item is hidden only after a resolved denial | Yes |
| Non-destructive action visibility | Compatibility fail open | Action hidden after resolved denial | Yes |
| Destructive action | Must explicitly request fail closed before migration | Action disabled/hidden | Yes |
| Legacy `v-permission` path | Legacy store semantics retained | Existing directive behavior | Yes |

Logout/reset must clear the access snapshot. Permission strings and backend role meanings remain business contracts and must not be renamed during infrastructure work.

## Known delivery risks

- The repository currently reports legacy lint warnings even though lint exits with no errors.
- `xlsx@0.18.5` is a direct dependency and is also used by `@amirjalili1374/ui-kit@1.9.2`; it has two high-severity advisories with no compatible registry fix. The offered force-fix downgrades UI Kit to `1.5.85` and is rejected.
- `happy-dom@15.11.7` is a development-only test dependency (also selected by Vitest) with critical advisories. The offered `20.11.1` update is a breaking major change and requires a separate test-environment migration.
- Patched `brace-expansion` resolutions are `1.1.18` and `2.1.4`; its prior advisory is resolved.
- Never run `npm audit fix --force`.
- The consumed UI Kit DataTable does not provide latest-request-wins behavior or remote sorting.
- Real-browser automation and deployment automation are not included in this phase.
- No SSR support is claimed.

Record smoke-check evidence and environment names in the merge request. Do not include tokens, cookies, credentials, or private endpoint payloads.

## Team review and merge prerequisites

- [ ] Review all infrastructure commits and the generated lockfile diff.
- [ ] Confirm GitLab CI passes from a clean runner without allowed failures.
- [ ] Complete the environment, authentication, Router, HTTP, and access smoke checks above in a representative non-production environment.
- [ ] Attach sanitized evidence and record the environment/build identifier.
- [ ] Confirm `v2` has not moved unexpectedly; resolve new upstream work through normal governance rather than rebasing or force-pushing during review.
- [ ] Confirm no business endpoint, DTO, filter, status, permission code, workflow, or form behavior changed.
- [ ] Confirm UI Kit remains at the approved package version and CSS is imported once.
- [ ] Obtain application owner, security/risk owner, and repository maintainer approval for the remaining advisories and merge.

## Rollback guidance

Before merge, rollback means abandoning the local implementation branch; never reset a shared branch. After a governed merge or deployment:

1. Stop promotion and retain the failing build/environment evidence without secrets.
2. Redeploy the last known-good immutable artifact and its matching public environment configuration.
3. Revert the infrastructure merge through a normal reviewed revert commit; do not rewrite shared history.
4. If failure is configuration-only, restore the last approved environment-variable set and redeploy without changing source.
5. Re-run clean installation, validation, environment builds, and the relevant smoke scenario before re-promoting.
6. Invalidate affected sessions only when the identity/security owner determines it is necessary.

## Ownership after handoff

- Application teams own runtime values, authentication policy, routes, permissions, Axios configuration, and domain services.
- UI Kit owns generic presentation components only.
- Backend authorization remains mandatory; frontend visibility is not an authorization boundary.
- Business endpoints, DTOs, filters, workflows, statuses, and permission codes remain unchanged unless addressed by a separately approved feature task.

Future CLI, generator, manifest, upgrade, feature-pack, and project-scaffolding work is explicitly deferred until this base project has been delivered and stabilized.
