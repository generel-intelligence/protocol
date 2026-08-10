# Protocol 0.10.0 conformance record

Protocol `0.10.0` adds one closed agent-trace contract for continuous model
response evidence without changing prior schema bytes.

`model_response_progress` records one observed non-empty response transport
chunk. Its zero-based `chunk_index`, `byte_offset`, and `byte_count` preserve
ordering and byte continuity. The event references exactly one artifact; its
descriptor role is `model-response-chunk`, and its exact byte size equals
`byte_count`.

Once progress capture begins for a request, producers retain every subsequent
non-empty observed chunk. The completed response artifact and stream index
remain authoritative for the full response. Progress events describe observed
transport bytes, not provider tokens, completed messages, or inferred model
timing.
