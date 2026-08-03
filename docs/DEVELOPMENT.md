# Development Guide

## Toolchain

Use Node `22.12.0` (the `.nvmrc` baseline) and npm 11. The supported engine range also permits Node `^20.19.0` or newer compatible Node releases. Use `npm ci` from the committed lockfile for reproducible validation.

Copy `.env.example` to the mode-specific Vite file needed locally and replace placeholders. Never commit credentials or client secrets. Vite browser variables are public.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start development mode |
| `npm run lint:check` | Non-mutating lint gate |
| `npm run lint:fix` | Apply lint fixes locally |
| `npm run typecheck` | Check Vue and TypeScript |
| `npm run test:run` | Run unit tests once |
| `npm run test:coverage` | Run tests with coverage |
| `npm run build` | Typecheck and build development mode |
| `npm run build:prelive` | Typecheck and build prelive mode |
| `npm run build:live` | Typecheck and build live mode |
| `npm run validate` | Run lint, types, tests, and the default build |

## Change boundaries

- Infrastructure may improve startup, Router, authentication, authorization, HTTP, configuration, validation, testing, and build reliability.
- Do not change domain endpoints, DTOs, filters, statuses, permissions, workflows, or page behavior as infrastructure cleanup.
- Consume `@amirjalili1374/ui-kit` through published package exports. Do not use sibling-source imports or unreleased platform providers.
- Preserve the injected application Axios instance at every DataTable integration.
- Add characterization tests before changing redirects, auth selection, refresh, permission resolution, initializer completion, or fatal-error behavior.

## CI and review

GitLab CI runs clean install, lint, typecheck, tests, coverage, and live/prelive builds. A merge is not ready if any required gate fails. Review generated dependency changes separately, never run forced audit fixes, and do not combine unrelated user work with infrastructure commits.

See [Infrastructure](architecture/INFRASTRUCTURE.md), [Bootstrap](architecture/BOOTSTRAP.md), [Authentication](architecture/AUTHENTICATION.md), [HTTP and errors](architecture/HTTP_AND_ERRORS.md), and [Permissions](architecture/PERMISSIONS.md).

For clean-checkout setup, promotion gates, environment smoke checks, known risks, and ownership after handoff, follow the [Team Delivery Runbook](DELIVERY.md).
