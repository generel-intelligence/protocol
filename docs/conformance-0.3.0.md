# Protocol 0.3.0 conformance record

## Scope

Protocol `0.3.0` adds one schema without changing the 16 `0.1.0` or two
`0.2.0` schemas:

- `agent-trace-event.schema.json`.

The schema contains the approved seven detailed payloads, closed source and
relationship records, artifact-backed private bodies, capture completeness,
and the unchanged lifecycle payload meanings. The TypeScript and Python
packages remain private and unpublished.

## Fixtures

Synthetic complete, failed, and partial traces exercise:

- contiguous zero-based sequence;
- relationships that point only to earlier events;
- complete and partial capture;
- completed and errored tool outcomes;
- workspace checkpoint linkage;
- missing-normal-stop and capture failures;
- closed profiles, envelopes, and payloads.

No private observation content is copied into the fixtures.

## Recorded schema digest

The canonical RFC 8785 SHA-256 digest is stored in
`evidence/schema-digests-0.3.0.json` and checked by both language test suites.

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

Observed locally on 2026-07-26:

- TypeScript frozen install, generated-file check, build, and 14 tests passed.
- Python frozen sync, generated-file check, Ruff, strict mypy, build, and 15
  tests passed.
- `git diff --check` passed.
- The authoritative and bundled `0.1.0` and `0.2.0` schema trees have no
  content diff.
- The `0.3.0` schema digest is
  `sha256:dd68abe95545690d627cc68ba9008a6c5cf5cfd726db846a2d73eb9b2b1fa076`.
- The private TypeScript package archive built with SHA-256
  `a2b452dbbdc76031f1ba6b42b268b2d645ed0297eccbdf4766a5f49470e791a9`.
- The private Python wheel built with SHA-256
  `c13f391e3fa5aca2f6e3f6e6b98becd6e3f6c3052ee0b848dd30a840f0c4cd2f`.
- The private Python source archive built with SHA-256
  `a7bf94a918a1ed1cb28c165bbefd5f4107ec5fa1e3facaed5f39d18d0eeb5591`.

The archives remain local, ignored, and unpublished.

Draft PR `generel-intelligence/protocol#6` verified signed commit
`2a1b283a1e203082ca080760f90e453507e603b4`:

- governance run `30220351340` passed;
- security-scan run `30220351312` passed;
- Python and TypeScript jobs in protocol-CI run `30220351035` passed.

Independent review and merge remain pending.

## Claim boundary

This record establishes schema, fixture, generation, and cross-language
validation behavior. It does not establish runner normalization, chunk
durability, evaluator execution, model performance, publication, or a
successful final live run.
