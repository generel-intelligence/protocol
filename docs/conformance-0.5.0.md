# Protocol 0.5.0 conformance record

## Scope

Protocol `0.5.0` adds two schemas without changing prior versions:

- `workspace-checkpoint-manifest.schema.json`;
- `model-response-stream-index.schema.json`.

The first records the complete content-addressed regular-file state of one
workspace checkpoint. The second indexes when ordered ranges of an exact model
response artifact became available. Both language packages remain unpublished.

## Verification

Run the TypeScript and Python commands in the repository `README.md`. Both
language suites validate the examples, reject unsafe workspace paths and
invalid byte lengths, check generated bindings, and verify the recorded
canonical schema digests.

The TypeScript package also runs its build during Git dependency preparation so
an exact repository commit and `packages/typescript` subdirectory can be
installed without publishing to npm.

This record does not establish runner capture correctness, exact token timing,
benchmark execution, platform ingestion, or publication.
