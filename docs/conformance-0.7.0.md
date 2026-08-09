# Protocol 0.7.0 conformance record

Protocol `0.7.0` adds two closed schemas without changing prior schema bytes:

- `artifact-output-manifest.schema.json` declares bounded, safe relative output
  paths that a runner may promote from a completed workspace;
- `profiles/webpage-artifact-result.schema.json` records the four deterministic
  webpage checks: deliverable, HTML document, self-containment, and requested
  surface.

An output declaration is not evidence that the file exists. Producers must
validate the final regular file and exact byte limit before promotion. Missing,
unsafe, or oversized outputs are omitted rather than fabricated. Webpage bytes
remain untrusted downloadable evidence; this contract does not authorize
browser execution.

Run both package command sets in `README.md` plus `git diff --check`.
