# AGENTS.md

## Purpose

This repository owns the versioned public contracts shared by benchmark
producers, runners, evaluators, the platform, and published records.

## Ownership

It owns protocol schemas, compatibility rules, examples, and generated language
packages.

It does not own application behavior, benchmark content, evaluation policy,
deployment, or storage implementation.

## Local Contracts

- Keep the protocol independent of UI, database, runner, and deployment code.
- Treat versioned files under `schemas/` as the sole runtime authority.
- Keep schemas closed with `additionalProperties: false`.
- Hash structured JSON as RFC 8785 canonical UTF-8 bytes with SHA-256.
- Treat raw evidence as append-only and preserve incomplete and unknown states.
- Protocol `0.3.0` owns the observation-backed agent trace envelope and seven
  detailed payloads; private bodies and provider-specific shapes remain
  artifacts.
- Protocol `0.4.0` owns only the project-authored reservation-service result
  profile; all prior schemas remain unchanged.
- Protocol `0.5.0` owns only workspace-checkpoint manifests and model-response
  stream indexes; all prior schemas remain unchanged.
- Protocol `0.6.0` owns multi-harness execution identity, agent/workspace event
  context, portable tool start/finish lifecycle, expected and achieved capture
  coverage, and workspace-scoped checkpoints; all prior schema bytes remain
  unchanged.
- New run producers and consumers cut over directly to `0.6.0`; this repository
  does not require legacy run ingestion, backfill, or dual-version dispatch.
- Detailed relationships require proven source IDs or runner-owned actions;
  capture order must not be presented as inferred cross-source causality.
- Keep result envelopes neutral; benchmark profiles own benchmark-specific
  fields.
- Introduce cross-repository changes in a compatibility-safe order.
- Never silently infer missing scoring or evidence semantics.
- Preserve unknown, partial, failed, and incompatible states.
- Keep the TypeScript and Python packages unpublished until owner approval.
- The Git-installed TypeScript package must include every generated declaration
  referenced by its public `dist` type index.
- Do not run benchmarks as part of protocol verification.

## Work Guidance

- Prefer explicit fields and deterministic validation.
- Do not duplicate generated models manually across languages.
- Keep public changes within the current pre-alpha contribution scope.
- Regenerate package artifacts after changing an authoritative schema.
- Retain a security-lint suppression only when a safe rewrite is unreasonable.
  State the enforced invariant in an adjacent `Security proof` comment and add
  a focused test for non-trivial validation.

## Verification

- Run the commands in `README.md` for each package.
- Run `git diff --check`.
- Require the shared `governance` and `security-scan` checks.
- Require the repository-local `protocol-conformance` checks.

## Child DOX Index

No child `AGENTS.md` files are required; this file owns the schemas, examples,
evidence records, and both small binding packages.
