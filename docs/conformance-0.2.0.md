# Protocol 0.2.0 conformance record

## Scope

Protocol `0.2.0` adds two schemas without changing the 16 `0.1.0` schemas:

- `benchmark-package-manifest.schema.json`;
- `profiles/expense-report-result.schema.json`.

The TypeScript and Python packages remain private and unpublished.

## Recorded schema digests

Canonical RFC 8785 SHA-256 digests are stored in
`evidence/schema-digests-0.2.0.json` and checked by both language test suites.

## Local verification

Run from `packages/typescript`:

```text
corepack pnpm install --frozen-lockfile
corepack pnpm check:generated
corepack pnpm build
corepack pnpm test
```

Run from `packages/python`:

```text
python -m uv sync --frozen
python -m uv run python scripts/generate.py --check
python -m uv run ruff check .
python -m uv run mypy
python -m uv run pytest
```

The candidate must also pass `git diff --check`, repository governance, and
security scanning before merge.

Observed locally on 2026-07-25:

- TypeScript generated-file check, build, and 11 tests passed.
- Python generated-file check, Ruff, strict mypy, and 12 tests passed.
- `git diff --check` passed.
- The authoritative `schemas/0.1.0/` tree has no diff.
- The TypeScript package archive built with SHA-256
  `426213d57c24abd1cbc9cbcec17b3a2c26926669651174e6064290dfdef12d38`.
- The Python wheel built and clean-installed with SHA-256
  `980a3504fa0d645db121f404140cea284d4582de75522eb3407583b83c422fd0`.
- The Python source archive built with SHA-256
  `5889c94729777642c0fcbe58037ed3dc0379299931bb7ff84fa0f5457a4e1eeb`.

The archives were created in temporary directories and were not committed or
published. GitHub governance, security, and protocol CI remain pending until
the reviewed candidate is pushed.

## Claim boundary

This record establishes schema, fixture, generation, and cross-language
validation behavior. It does not establish `.gbench` byte reproducibility,
container execution, evaluator correctness, model performance, public package
publication, or compatibility with an external benchmark wrapper.
