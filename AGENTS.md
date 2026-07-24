# AGENTS.md

## Purpose

This repository owns the versioned public contracts shared by benchmark
producers, runners, evaluators, the platform, and published records.

## Ownership

It will own protocol schemas, compatibility rules, examples, and generated
language packages once those artifacts are introduced in M1.

It does not own application behavior, benchmark content, evaluation policy,
deployment, or storage implementation.

## Local Contracts

- Keep the protocol independent of UI, database, runner, and deployment code.
- Treat JSON Schema as authoritative once M1 introduces schemas.
- Introduce cross-repository changes in a compatibility-safe order.
- Never silently infer missing scoring or evidence semantics.
- Preserve unknown, partial, failed, and incompatible states.
- Do not add schema or SDK scaffolding during M0.

## Work Guidance

- Prefer explicit fields and deterministic validation.
- Do not duplicate generated models manually across languages.
- Keep public changes within the current pre-alpha contribution scope.

## Verification

- Run `git diff --check`.
- Require the shared `governance` and `security-scan` checks.
- Add schema and cross-language checks only when M1 introduces their real
  sources and commands.

## Child DOX Index

No child `AGENTS.md` files are required at this stage.
