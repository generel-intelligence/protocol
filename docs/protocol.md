# Protocol compatibility

## Authority and compatibility

The versioned JSON Schema 2020-12 documents under `schemas/` are the sole
runtime authority. Generated language types are conveniences and may not relax
a schema. All schemas are closed. An unknown field is invalid rather than an
implicit extension.

The 16 `0.1.0` schemas and two `0.2.0` schemas are unchanged. `0.2.0` adds only
the benchmark-package manifest and project-owned expense-report result profile.
`0.3.0` adds only the observation-backed agent trace event. Source is public,
while provisional language packages remain unpublished. Removing a field,
changing its meaning, tightening accepted values, or changing hashing
semantics requires a new protocol version and rollout plan. Incompatible
documents remain labeled, not silently normalized.

## Custom benchmark packages

The `0.2.0` benchmark-package manifest identifies one suite, one or more tasks,
an immutable OCI environment image, included licenses, and every payload file.
Payload paths are relative forward-slash paths. Package validators must also
enforce unique paths and identifiers, resolve every license reference, verify
every declared byte size and digest, and reject unsafe archive entries.

The manifest does not contain its own digest. The `.gbench` archive digest is
computed over the final deterministic archive and recorded by its producer and
consumers.

## Project-owned expense results

The expense-report profile exposes only four stable behavior groups:
`status`, `dates`, `refunds`, and `currencies`. A completed result includes all
four booleans, their passed count, and overall pass/fail. The evaluator must
make those summary fields consistent; schema validation checks their closed
shape and bounds but does not replace evaluator conformance tests.

Case-level hidden-test evidence is intentionally outside the shareable profile.
The `error` and `not_run` branches preserve failed or absent evaluation without
fabricating group results.

## Canonicalization and digests

Structured JSON is encoded with RFC 8785 and hashed with SHA-256. Digest strings
use `sha256:` followed by 64 lowercase hexadecimal characters. `byte_size` for a
structured artifact is the length of its canonical UTF-8 bytes. Non-JSON
artifacts are hashed as their exact bytes.

IDs are opaque identifiers. Their prefixes communicate entity kind but do not
encode database, organization, or deployment ownership.

## Evidence and results

An objective result links two different artifacts:

- `raw_result` identifies the source evaluator output.
- `projection` identifies the typed, benchmark-profile projection.

The mapping records in `evidence/mappings/` identify reviewed upstream fields.
Each projection carries the mapping version, canonical digest, warnings, and
unmapped fields. The protocol does not claim that imported public results were
reproduced locally.

Attestations distinguish schema validation, source review, upstream
verification, and local reproduction. These claims are not interchangeable.
Automated validation never implies human approval or publication.

The neutral objective-result envelope has no universal score. SWE-bench
Verified, Terminal-Bench 2, and BFCL V4 each have a dedicated result profile.
Their fixtures reference public upstream bytes by URI and digest; those bytes
are not copied into this repository. A projection omits optional profile fields
that are absent from the referenced bytes; it must not synthesize them from an
aggregate category or other indirect evidence.

## Run evidence

Trace events use one monotonic zero-based sequence per run. In `0.1.0`, event
payloads cover lifecycle only: run start, task start, task finish, and run
finish.

The additive `0.3.0` agent trace retains those lifecycle meanings and adds:

- completed user and assistant conversation messages;
- model request, response-start, and response-finish boundaries;
- terminal tool outcomes;
- authoritative workspace checkpoints;
- runner-observed execution errors.

Private message, model, tool, workspace, and error bodies remain
content-addressed artifacts. Ordered network chunks remain inside the model
response-stream artifact rather than becoming one normalized event each.
OpenCode-specific steps, parts, todo state, permission details, and session
storage remain raw evidence.

Every detailed event records its observed source and only relationships proven
by source IDs or runner-owned actions. Global sequence is runner capture order.
Consumers must not infer cross-source causality from clocks, timing, or content.
Fixture conformance verifies that relationships point to earlier events in the
same trace.

An event chunk digest covers the RFC 8785 encoding of its JSON event array.
Chunk ordinals and sequence ranges make gaps explicit. A partial manifest must
declare at least one missing range and cannot be mistaken for a final manifest.
A final manifest requires complete evidence but does not imply publication.

## Benchmark source pins

- SWE-bench evaluator:
  `SWE-bench/SWE-bench@f7bbbb2ccdf479001d6467c9e34af59e44a840f9`
  (MIT).
- Terminal-Bench 2 task/evaluator:
  `laude-institute/terminal-bench-2@2fd12b88aafdd04a52c298e3940bcb189f9766d6`
  (Apache-2.0).
- BFCL evaluator:
  `ShishirPatil/gorilla@6ea57973c7a6097fd7c5915698c54c17c5b1b6c8`
  (Apache-2.0).

The public result URIs and exact retrieved digests are recorded in the profile
fixtures. Their inclusion is source evidence, not an endorsement of an
execution wrapper such as Harbor.
