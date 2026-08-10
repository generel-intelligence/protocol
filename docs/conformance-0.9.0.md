# Protocol 0.9.0 conformance record

Protocol `0.9.0` adds two closed contracts for operator-guided runs without
changing protocol `0.6.0` trace bytes:

- `interaction-config.schema.json` declares that a run accepts human operator
  guidance and records its bounded idle timeout;
- `operator-action.schema.json` records a delivered root-agent guidance or
  finish message, its native delivery mode, timestamps, and exact text artifact
  reference.

An interaction configuration is attached to `run_started` as an
`interaction-config` artifact. A delivered operator action and its referenced
text are attached to one runner-owned user `conversation_message`. Harness
echoes of that same root message are not emitted again.

Only successfully delivered actions become run evidence. Rejected or pending
commands remain control-plane records and must not be presented as model input.
`delivered_at` must not precede `submitted_at`. An operator-guided run remains
distinguishable from an autonomous run during scoring, comparison, review, and
publication.
