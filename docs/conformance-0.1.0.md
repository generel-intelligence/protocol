# Protocol 0.1.0 conformance record

Status: private release candidate; owner approval pending.

The candidate is conformant only when both binding packages:

- regenerate without a diff;
- validate every document listed by `examples/conformance.json`;
- reject a generated unknown-field case;
- produce every canonical string and digest in
  `examples/canonicalization.json`;
- reproduce complete-run event chunk digests;
- pass their build, lint, static-analysis, and test commands.

No benchmark was downloaded or executed. Profile fixtures are normalized from
reviewed public source bytes and explicitly do not carry a
`generel_reproduced` attestation.

Local verification on 2026-07-24:

- TypeScript generated-artifact check passed.
- TypeScript strict build passed.
- TypeScript tests passed: 8 of 8.
- Python generated-artifact check passed.
- Ruff passed.
- mypy strict analysis passed for 20 source files.
- Python tests passed: 8 of 8.
- `git diff --check` passed.

Local candidate archives were inspected and installed into clean temporary
environments:

- `local-benchmark-protocol-0.1.0.tgz`:
  `sha256:1ea739cab5de5db8738905fe14a9dba269627fdbed0eaf850b59b6a94d617474`
- `benchmark_protocol_contract-0.1.0-py3-none-any.whl`:
  `sha256:db234cd7e2f2a5ffb7b5c42d1ccfd08436359312c5ff3d87e8623cda0e5b2ed9`
- `benchmark_protocol_contract-0.1.0.tar.gz`:
  `sha256:35158f704dc2791ff78755fa4e6f378a0f88ba4b6a76a30e44a733d181ea2ba5`

The smoke tests imported each installed package and checked the version and a
shared canonical hash. The first Python offline install attempt could not
resolve uncached transitive wheels; the successful clean install used PyPI.

GitHub Actions remains unverified until the private candidate is pushed. Owner
approval is still required before M1 is official or anything is published.
