# Protocol 0.8.0 conformance record

Protocol `0.8.0` replaces the pre-release declared-output contract with two
closed schemas:

- `artifact-output-manifest.schema.json` retains bounded single-file outputs
  and adds bounded webpage-directory declarations with one relative HTML
  entrypoint;
- `webpage-bundle-manifest.schema.json` records the exact promoted file path,
  media type, size, artifact identity, and aggregate size of one webpage.

A bundle declaration does not authorize the whole workspace. Producers promote
only final regular files below the exact declared directory, reject duplicate
or unsafe paths, enforce both declared limits, and omit an incomplete bundle.
Consumers must verify the entrypoint exists, paths are unique and ordered, the
aggregate size is exact, and every artifact reference belongs to the run.

Webpage bundle bytes remain untrusted evidence. This contract does not grant
script execution, outbound network access, application-origin access, or
permission to infer undeclared resources.
