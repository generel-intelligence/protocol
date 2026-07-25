# Protocol 0.1.0 conformance record

Status: source release candidate; owner approved public repository visibility
on 2026-07-25. npm and PyPI publication remain unapproved.

The candidate is conformant only when both binding packages:

- regenerate without a diff;
- validate every document listed by `examples/conformance.json`;
- reject a generated unknown-field case for every conformance document;
- validate generated completed, error, not-run, failure, and category profile
  branches without representing them as observed results;
- produce every canonical string and digest in
  `examples/canonicalization.json`;
- reproduce complete-run event chunk digests;
- verify contiguous complete-run ordinals and event sequences, exact event
  counts and run IDs, and an explicitly incomplete partial run;
- pass their build, lint, static-analysis, and test commands.

No benchmark was downloaded or executed. Profile fixtures are normalized from
reviewed public source bytes and explicitly do not carry a
`generel_reproduced` attestation.

Local verification on 2026-07-25:

- TypeScript generated-artifact check passed.
- TypeScript strict build passed.
- TypeScript tests passed: 8 of 8.
- Python generated-artifact check passed.
- Ruff passed.
- mypy strict analysis passed for 20 source files.
- Python tests passed: 9 of 9.
- `git diff --check` passed.

Local candidate archives were inspected and installed into clean temporary
environments:

- `local-benchmark-protocol-0.1.0.tgz`:
  `sha256:cf0c46039ae9889257c91cf7cf0db332f6b0f5659165d8321eb6559bb4d0811d`
- `benchmark_protocol_contract-0.1.0-py3-none-any.whl`:
  `sha256:f8ea7d9ac55caf96d4c958d4a09e14631f9519526468e0c824aaf83e9650e724`
- `benchmark_protocol_contract-0.1.0.tar.gz`:
  `sha256:9f48bedfbb7602aca9c6e0d3f2f7f4d62ce5ade8418bc4740d243223401404b6`

The smoke tests imported each installed package and checked the version and a
shared canonical hash.

No npm or PyPI publication, tag, or GitHub Release is authorized by this
candidate. Explicit owner confirmation is still required before M1 is declared
complete.
