# Benchmark protocol

This repository owns versioned, implementation-independent contracts for
benchmark packages, run evidence, and objective results. The repository and
package names are provisional.

## Status

Pre-alpha. Protocol `0.8.0` adds bounded multi-file webpage declarations and a
deterministic promoted bundle manifest without changing prior schema bytes.
New run producers and consumers cut over directly to `0.8.0`; legacy output
declaration ingestion is not supported.
The TypeScript and Python bindings remain unpublished.

The protocol must remain independent of website, database, runner, evaluator,
and deployment implementations.

## Layout

- `schemas/0.1.0/` — the unchanged M1 schemas.
- `schemas/0.2.0/` — additive package and custom-result schemas.
- `schemas/0.3.0/` — additive detailed agent-trace schema.
- `schemas/0.4.0/` — additive reservation-service result profile.
- `schemas/0.5.0/` — additive workspace and response-stream evidence schemas.
- `schemas/0.6.0/` — multi-harness run evidence and identity schemas.
- `schemas/0.7.0/` — declared output and webpage-result schemas.
- `schemas/0.8.0/` — multi-file webpage declaration and bundle schemas.
- `examples/` — complete, partial, profile, and canonicalization fixtures.
- `evidence/mappings/` — reviewed mappings from upstream result fields.
- `packages/typescript/` — generated declarations and an Ajv validator.
- `packages/python/` — generated `TypedDict` models and a `jsonschema`
  validator.
- `docs/protocol.md` — hashing, evidence, and compatibility rules.
- `docs/conformance-0.1.0.md` — archived M1 verification record.
- `docs/conformance-0.2.0.md` — additive M2 candidate verification record.
- `docs/conformance-0.3.0.md` — additive M3 trace verification record.
- `docs/conformance-0.4.0.md` — second-language result-profile record.
- `docs/conformance-0.5.0.md` — playback-evidence contract record.
- `docs/conformance-0.6.0.md` — multi-harness evidence conformance rules.
- `docs/conformance-0.7.0.md` — declared-output conformance rules.
- `docs/conformance-0.8.0.md` — webpage-bundle conformance rules.

## Verification

TypeScript:

```text
cd packages/typescript
corepack pnpm install --frozen-lockfile
corepack pnpm lint
corepack pnpm check:generated
corepack pnpm build
corepack pnpm test
```

Python:

```text
cd packages/python
python -m uv sync --frozen
python -m uv run python scripts/generate.py --check
python -m uv run ruff format --check .
python -m uv run ruff check .
python -m uv run mypy
python -m uv run pytest
python -m uv build
```

No command above downloads or executes a benchmark.

## Contributing and security

See `CONTRIBUTING.md` for the current narrow contribution scope and
`SECURITY.md` for private vulnerability reporting.

## License

Licensed under the Apache License 2.0. See `LICENSE` and `NOTICE`.
