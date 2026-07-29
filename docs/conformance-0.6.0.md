# Protocol 0.6.0 conformance record

## Scope

Protocol `0.6.0` adds four closed schemas without changing prior schema bytes:

- `agent-trace-event.schema.json`;
- `capture-coverage-manifest.schema.json`;
- `execution-config.schema.json`;
- `workspace-checkpoint-manifest.schema.json`.

The release is a clean pre-production run-evidence cutover. Runner and platform
consumers accept `0.6.0` run evidence only; there is no legacy dispatch,
backfill, compatibility projection, or legacy UI.

## Schema guarantees

Every event has explicit nullable agent and workspace context. Agent parent
fields occur as an authoritative runner/native pair. Workspace checkpoints
identify one workspace context. Coverage records use the fixed initial channel,
status, scope, reason-code, harness, adapter, and capture-source vocabularies.
Every coverage manifest includes a run-scope record for every required channel.

The examples cover complete, partial, and unavailable coverage; a native
parent/child agent pair; a message directed to an exact earlier agent; two
registered workspaces; an exactly attributable gateway request; and a gateway
request whose agent and workspace remain null.

## Cross-record enforcement

JSON Schema validates one document at a time. Runner and platform conformance
must additionally reject:

- a relationship or agent parent that does not identify an earlier record in
  the same run;
- a `directed_to` relationship that does not identify the earlier
  `agent_started` event for the exact native recipient;
- duplicate agent starts, finish without start, duplicate finish, finish before
  start, or agent-attributed events after finish;
- a workspace context used before registration, except by its own registration
  event, or a checkpoint whose workspace is not registered in the same run;
- conflicting runner/native identity mappings or conflicting registrations for
  one workspace context;
- missing or duplicate `(channel, scope, scope_id)` coverage records;
- an achieved coverage record absent from a normal `run_finished`, or one that
  changes harness/adapter identity from expected coverage;
- an achieved status that upgrades expected `unavailable` to `partial` or
  `complete`, or expected `partial` to `complete`.

For coverage comparison, `complete` is stronger than `partial`, which is
stronger than `unavailable`. A running, cancelled, or abandoned partial run may
lack achieved coverage only while it has no normal `run_finished`; consumers
present expected coverage beside the interrupted state and do not synthesize
an achieved claim.

Cross-source event relationships and agent attribution require an exact shared
source identifier or runner-owned action. Timestamp, text, model name, socket
order, and apparent conversation position are never conformance evidence.

## Verification

Run both package command sets in the repository `README.md` plus
`git diff --check`. The suites validate positive examples, reject malformed
context, coverage, parent, and workspace fields, verify generated bindings,
and compare every version's canonical schema digests. Package builds prove the
new bindings are distributable without publishing them.

Owner review and approval of the protocol change is required before merge.
This record does not approve the combined-image strategy, a database reset,
model execution, image publication, or M3 completion.
