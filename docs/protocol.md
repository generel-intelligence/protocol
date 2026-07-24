# Protocol 0.1.0 candidate

## Authority and compatibility

The 16 JSON Schema 2020-12 documents in `schemas/0.1.0/` are the sole runtime
authority. Generated language types are conveniences and may not relax a
schema. All schemas are closed. An unknown field is invalid rather than an
implicit extension.

`0.1.0` is a private pre-alpha candidate. A future version may add optional
fields compatibly. Removing a field, changing its meaning, tightening accepted
values, or changing hashing semantics requires a new protocol version and a
rollout plan. Incompatible documents must remain labeled, not silently
normalized.

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
are not copied into this repository.

## Run evidence

Trace events use one monotonic zero-based sequence per run. In `0.1.0`, event
payloads cover lifecycle only: run start, task start, task finish, and run
finish. Detailed process events belong to runner work after M1.

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
