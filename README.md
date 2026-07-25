# Benchmark protocol

This repository owns versioned, implementation-independent contracts for
benchmark packages, run evidence, and objective results. The repository and
package names are provisional.

## Status

Pre-alpha. Protocol `0.2.0` adds custom benchmark package and expense-result
contracts without changing the 16 protocol `0.1.0` schemas. Both versions are
source-available contracts, and the TypeScript and Python bindings remain
unpublished.

The protocol must remain independent of website, database, runner, evaluator,
and deployment implementations.

## Layout

- `schemas/0.1.0/` — the unchanged M1 schemas.
- `schemas/0.2.0/` — additive package and custom-result schemas.
- `examples/` — complete, partial, profile, and canonicalization fixtures.
- `evidence/mappings/` — reviewed mappings from upstream result fields.
- `packages/typescript/` — generated declarations and an Ajv validator.
- `packages/python/` — generated `TypedDict` models and a `jsonschema`
  validator.
- `docs/protocol.md` — hashing, evidence, and compatibility rules.
- `docs/conformance-0.1.0.md` — archived M1 verification record.
- `docs/conformance-0.2.0.md` — additive M2 candidate verification record.

## Verification

TypeScript:

```text
cd packages/typescript
corepack pnpm install --frozen-lockfile
corepack pnpm check:generated
corepack pnpm build
corepack pnpm test
```

Python:

```text
cd packages/python
python -m uv sync --frozen
python -m uv run python scripts/generate.py --check
python -m uv run ruff check .
python -m uv run mypy
python -m uv run pytest
```

No command above downloads or executes a benchmark.

## Contributing and security

See `CONTRIBUTING.md` for the current narrow contribution scope and
`SECURITY.md` for private vulnerability reporting.

## License

Licensed under the Apache License 2.0. See `LICENSE` and `NOTICE`.
