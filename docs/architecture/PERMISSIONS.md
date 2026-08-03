# Permissions and Access Policy

Frontend permissions govern route, menu, and action visibility; they never replace backend authorization. Existing business permission strings and role semantics are compatibility contracts.

The application contains current access APIs and a retained legacy permission path. Route, menu, and action infrastructure share the current evaluator where compatible, while legacy adapters remain until usage is migrated and characterized. Loading/unresolved behavior is explicit: protected routes fail closed; existing menu and action compatibility paths remain fail open. Destructive actions should explicitly request fail-closed evaluation unless an approved product decision requires another policy.

UI Kit does not own consumer permission codes or policy. No migration to unreleased UI Kit provider APIs is part of this infrastructure phase.
