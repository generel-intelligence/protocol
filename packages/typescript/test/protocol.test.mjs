import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { canonicalize, getSchema, hash_json, validate, PROTOCOL_VERSION } from "../dist/index.js";

const repositoryRoot = join(import.meta.dirname, "..", "..", "..");
const fixtures = JSON.parse(
  readFileSync(join(repositoryRoot, "examples", "canonicalization.json"), "utf8")
);

test("exports the candidate version and bundled schemas", () => {
  assert.equal(PROTOCOL_VERSION, "0.7.0");
  assert.equal(getSchema("0.1.0/artifact.schema.json").title, "Artifact");
  assert.equal(
    getSchema("0.2.0/benchmark-package-manifest.schema.json").title,
    "Benchmark package manifest"
  );
  assert.equal(
    getSchema("0.3.0/agent-trace-event.schema.json").title,
    "Agent trace event"
  );
  assert.equal(
    getSchema("0.6.0/workspace-checkpoint-manifest.schema.json").title,
    "Workspace checkpoint manifest"
  );
  assert.equal(
    getSchema("0.6.0/capture-coverage-manifest.schema.json").title,
    "Capture coverage manifest"
  );
  assert.equal(
    getSchema("0.7.0/artifact-output-manifest.schema.json").title,
    "Artifact output manifest"
  );
});

test("the built package includes every exported generated declaration", () => {
  const packageRoot = join(import.meta.dirname, "..");
  for (const name of readdirSync(join(packageRoot, "src", "generated"))) {
    if (name.endsWith(".d.ts")) {
      assert.ok(existsSync(join(packageRoot, "dist", "generated", name)), name);
    }
  }
});

test("expense result terminal branches validate", () => {
  const value = JSON.parse(
    readFileSync(join(repositoryRoot, "examples", "m2", "expense-report-result.json"), "utf8")
  );
  const schema = "schemas/0.2.0/profiles/expense-report-result.schema.json";
  assert.doesNotThrow(() => validate(schema, value));
  assert.doesNotThrow(() =>
    validate(schema, { ...value, outcome: { status: "error", error_code: "evaluator_failed" } })
  );
  assert.doesNotThrow(() =>
    validate(schema, { ...value, outcome: { status: "not_run", reason: "workspace unavailable" } })
  );
  assert.throws(() =>
    validate(schema, {
      ...value,
      outcome: { ...value.outcome, groups: { ...value.outcome.groups, hidden_case: true } }
    })
  );
});

test("reservation result terminal branches validate", () => {
  const value = JSON.parse(
    readFileSync(join(repositoryRoot, "examples", "m3", "reservation-service-result.json"), "utf8")
  );
  const schema = "schemas/0.4.0/profiles/reservation-service-result.schema.json";
  assert.doesNotThrow(() => validate(schema, value));
  assert.doesNotThrow(() =>
    validate(schema, { ...value, outcome: { status: "error", error_code: "evaluator_failed" } })
  );
  assert.doesNotThrow(() =>
    validate(schema, { ...value, outcome: { status: "not_run", reason: "workspace unavailable" } })
  );
  assert.throws(() =>
    validate(schema, {
      ...value,
      outcome: { ...value.outcome, groups: { ...value.outcome.groups, hidden_case: true } }
    })
  );
});

test("webpage output and result contracts validate", () => {
  const output = JSON.parse(
    readFileSync(join(repositoryRoot, "examples", "m5", "artifact-output-manifest.json"), "utf8")
  );
  const outputSchema = "schemas/0.7.0/artifact-output-manifest.schema.json";
  assert.doesNotThrow(() => validate(outputSchema, output));
  assert.throws(() =>
    validate(outputSchema, { ...output, outputs: [{ ...output.outputs[0], path: "../x" }] })
  );

  const result = JSON.parse(
    readFileSync(join(repositoryRoot, "examples", "m5", "webpage-artifact-result.json"), "utf8")
  );
  const resultSchema = "schemas/0.7.0/profiles/webpage-artifact-result.schema.json";
  assert.doesNotThrow(() => validate(resultSchema, result));
  assert.doesNotThrow(() =>
    validate(resultSchema, { ...result, outcome: { status: "error", error_code: "failed" } })
  );
  assert.doesNotThrow(() =>
    validate(resultSchema, { ...result, outcome: { status: "not_run", reason: "missing" } })
  );
});

test("benchmark package paths cannot traverse", () => {
  const value = JSON.parse(
    readFileSync(join(repositoryRoot, "examples", "m2", "benchmark-package-manifest.json"), "utf8")
  );
  assert.throws(() =>
    validate("schemas/0.2.0/benchmark-package-manifest.schema.json", {
      ...value,
      files: [{ ...value.files[0], path: "workspace/../hidden-tests.py" }]
    })
  );
});

test("playback evidence rejects unsafe paths and invalid byte ranges", () => {
  const checkpoint = JSON.parse(
    readFileSync(
      join(repositoryRoot, "examples", "m4", "workspace-checkpoint-manifest.json"),
      "utf8"
    )
  );
  const checkpointSchema = "schemas/0.5.0/workspace-checkpoint-manifest.schema.json";
  assert.doesNotThrow(() => validate(checkpointSchema, checkpoint));
  for (const path of ["/absolute", "../escape", "src//file", "src\\file"]) {
    assert.throws(() =>
      validate(checkpointSchema, {
        ...checkpoint,
        files: { [path]: Object.values(checkpoint.files)[0] }
      })
    );
  }

  const stream = JSON.parse(
    readFileSync(join(repositoryRoot, "examples", "m4", "model-response-stream-index.json"), "utf8")
  );
  const streamSchema = "schemas/0.5.0/model-response-stream-index.schema.json";
  assert.doesNotThrow(() => validate(streamSchema, stream));
  assert.throws(() =>
    validate(streamSchema, {
      ...stream,
      segments: [{ ...stream.segments[0], byte_length: 0 }]
    })
  );
});

test("canonicalization corpus matches", () => {
  for (const fixture of fixtures.cases) {
    assert.equal(new TextDecoder().decode(canonicalize(fixture.input)), fixture.canonical);
    assert.equal(hash_json(fixture.input), fixture.digest);
  }
});

test("all conformance documents validate and reject generated unknown fields", () => {
  const manifest = JSON.parse(
    readFileSync(join(repositoryRoot, "examples", "conformance.json"), "utf8")
  );
  for (const document of manifest.documents) {
    const value = JSON.parse(
      readFileSync(join(repositoryRoot, "examples", document.path), "utf8")
    );
    for (const candidate of document.items ? value : [value]) {
      assert.doesNotThrow(() => validate(document.schema, candidate), document.path);
      assert.throws(
        () => validate(document.schema, { ...candidate, synthetic_unknown_field: true }),
        /additionalProperties/,
        document.path
      );
    }
  }
});

test("profile schemas cover generated terminal and category branches", () => {
  const profiles = [
    ["swe-bench-verified", "swe-bench-verified-result"],
    ["terminal-bench-2", "terminal-bench-2-result"],
    ["bfcl-v4", "bfcl-v4-result"]
  ];
  for (const [fixtureName, schemaName] of profiles) {
    const value = JSON.parse(
      readFileSync(join(repositoryRoot, "examples", "profiles", `${fixtureName}.json`), "utf8")
    );
    const schema = `schemas/0.1.0/profiles/${schemaName}.schema.json`;
    assert.doesNotThrow(() =>
      validate(schema, { ...value, outcome: { status: "error", error_code: "synthetic_error" } })
    );
    assert.doesNotThrow(() =>
      validate(schema, { ...value, outcome: { status: "not_run", reason: "synthetic branch" } })
    );
  }

  const swe = JSON.parse(
    readFileSync(join(repositoryRoot, "examples", "profiles", "swe-bench-verified.json"), "utf8")
  );
  assert.doesNotThrow(() =>
    validate("schemas/0.1.0/profiles/swe-bench-verified-result.schema.json", {
      ...swe,
      outcome: { status: "completed", resolved: false }
    })
  );

  const terminal = JSON.parse(
    readFileSync(join(repositoryRoot, "examples", "profiles", "terminal-bench-2.json"), "utf8")
  );
  assert.doesNotThrow(() =>
    validate("schemas/0.1.0/profiles/terminal-bench-2-result.schema.json", {
      ...terminal,
      outcome: { status: "completed", reward: 0, passed: false }
    })
  );

  const bfcl = JSON.parse(
    readFileSync(join(repositoryRoot, "examples", "profiles", "bfcl-v4.json"), "utf8")
  );
  const bfclSchema = "schemas/0.1.0/profiles/bfcl-v4-result.schema.json";
  assert.doesNotThrow(() =>
    validate(bfclSchema, {
      ...bfcl,
      outcome: {
        status: "completed",
        test_category: "simple_python",
        accuracy: 0,
        correct_count: 0,
        total_count: 1,
        partial_evaluation: true
      }
    })
  );
  assert.throws(() =>
    validate(bfclSchema, {
      ...bfcl,
      outcome: {
        status: "completed",
        test_category: "simple_python",
        accuracy: 0,
        correct_count: 0,
        partial_evaluation: true
      }
    })
  );
});

test("event chunk digests match canonical event bytes", () => {
  for (const ordinal of ["000", "001"]) {
    const events = JSON.parse(
      readFileSync(join(repositoryRoot, "examples", "complete-run", "events", `chunk-${ordinal}.json`), "utf8")
    );
    const manifest = JSON.parse(
      readFileSync(join(repositoryRoot, "examples", "complete-run", `chunk-${ordinal}.manifest.json`), "utf8")
    );
    assert.equal(hash_json(events), manifest.digest);
  }
});

test("the public schema inventory is exactly sixteen valid schemas", () => {
  const schemaRoot = join(repositoryRoot, "schemas", "0.1.0");
  const recorded = JSON.parse(
    readFileSync(join(repositoryRoot, "evidence", "schema-digests-0.1.0.json"), "utf8")
  ).schemas;
  const paths = [
    ...readdirSync(schemaRoot).filter((name) => name.endsWith(".schema.json")),
    ...readdirSync(join(schemaRoot, "profiles"))
      .filter((name) => name.endsWith(".schema.json"))
      .map((name) => `profiles/${name}`)
  ];
  assert.equal(paths.length, 16);
  for (const path of paths) {
    const schema = getSchema(`schemas/0.1.0/${path}`);
    assert.equal(hash_json(schema), recorded[path]);
  }
});

test("the protocol 0.2 schema inventory is exactly two recorded schemas", () => {
  const schemaRoot = join(repositoryRoot, "schemas", "0.2.0");
  const recorded = JSON.parse(
    readFileSync(join(repositoryRoot, "evidence", "schema-digests-0.2.0.json"), "utf8")
  ).schemas;
  const paths = [
    ...readdirSync(schemaRoot).filter((name) => name.endsWith(".schema.json")),
    ...readdirSync(join(schemaRoot, "profiles"))
      .filter((name) => name.endsWith(".schema.json"))
      .map((name) => `profiles/${name}`)
  ];
  assert.equal(paths.length, 2);
  for (const path of paths) {
    const schema = getSchema(`schemas/0.2.0/${path}`);
    assert.equal(hash_json(schema), recorded[path]);
  }
});

test("the protocol 0.3 schema inventory is exactly one recorded schema", () => {
  const schemaRoot = join(repositoryRoot, "schemas", "0.3.0");
  const recorded = JSON.parse(
    readFileSync(join(repositoryRoot, "evidence", "schema-digests-0.3.0.json"), "utf8")
  ).schemas;
  const paths = readdirSync(schemaRoot).filter((name) => name.endsWith(".schema.json"));
  assert.equal(paths.length, 1);
  for (const path of paths) {
    const schema = getSchema(`schemas/0.3.0/${path}`);
    assert.equal(hash_json(schema), recorded[path]);
  }
});

test("the protocol 0.4 schema inventory is exactly one recorded schema", () => {
  const schemaRoot = join(repositoryRoot, "schemas", "0.4.0");
  const recorded = JSON.parse(
    readFileSync(join(repositoryRoot, "evidence", "schema-digests-0.4.0.json"), "utf8")
  ).schemas;
  const paths = readdirSync(join(schemaRoot, "profiles"))
    .filter((name) => name.endsWith(".schema.json"))
    .map((name) => `profiles/${name}`);
  assert.equal(paths.length, 1);
  for (const path of paths) {
    const schema = getSchema(`schemas/0.4.0/${path}`);
    assert.equal(hash_json(schema), recorded[path]);
  }
});

test("the protocol 0.5 schema inventory is exactly two recorded schemas", () => {
  const schemaRoot = join(repositoryRoot, "schemas", "0.5.0");
  const recorded = JSON.parse(
    readFileSync(join(repositoryRoot, "evidence", "schema-digests-0.5.0.json"), "utf8")
  ).schemas;
  const paths = readdirSync(schemaRoot).filter((name) => name.endsWith(".schema.json"));
  assert.equal(paths.length, 2);
  for (const path of paths) {
    const schema = getSchema(`schemas/0.5.0/${path}`);
    assert.equal(hash_json(schema), recorded[path]);
  }
});

test("the protocol 0.6 schema inventory is exactly four recorded schemas", () => {
  const schemaRoot = join(repositoryRoot, "schemas", "0.6.0");
  const recorded = JSON.parse(
    readFileSync(join(repositoryRoot, "evidence", "schema-digests-0.6.0.json"), "utf8")
  ).schemas;
  const paths = readdirSync(schemaRoot).filter((name) => name.endsWith(".schema.json"));
  assert.equal(paths.length, 4);
  for (const path of paths) {
    const schema = getSchema(`schemas/0.6.0/${path}`);
    assert.equal(hash_json(schema), recorded[path]);
  }
});

test("the protocol 0.7 schema inventory is exactly two recorded schemas", () => {
  const schemaRoot = join(repositoryRoot, "schemas", "0.7.0");
  const recorded = JSON.parse(
    readFileSync(join(repositoryRoot, "evidence", "schema-digests-0.7.0.json"), "utf8")
  ).schemas;
  const paths = [
    ...readdirSync(schemaRoot).filter((name) => name.endsWith(".schema.json")),
    ...readdirSync(join(schemaRoot, "profiles"))
      .filter((name) => name.endsWith(".schema.json"))
      .map((name) => `profiles/${name}`)
  ];
  assert.equal(paths.length, 2);
  for (const path of paths) {
    const schema = getSchema(`schemas/0.7.0/${path}`);
    assert.equal(hash_json(schema), recorded[path]);
  }
});

test("protocol 0.6 rejects malformed context, coverage, parent, and workspace fields", () => {
  const eventSchema = "schemas/0.6.0/agent-trace-event.schema.json";
  const events = JSON.parse(
    readFileSync(
      join(repositoryRoot, "examples", "m3-multi-harness", "complete-trace.json"),
      "utf8"
    )
  );
  assert.throws(() =>
    validate(eventSchema, {
      ...events[0],
      context: { agent_span_id: "", workspace_context_id: null }
    })
  );

  const payloadWithoutNativeParent = { ...events[4].payload };
  delete payloadWithoutNativeParent.native_parent_agent_id;
  assert.throws(() =>
    validate(eventSchema, { ...events[4], payload: payloadWithoutNativeParent })
  );

  const coverage = JSON.parse(
    readFileSync(
      join(repositoryRoot, "examples", "m3-multi-harness", "coverage-partial.json"),
      "utf8"
    )
  );
  const recordWithoutReason = { ...coverage.records[8] };
  delete recordWithoutReason.reason_code;
  assert.throws(() =>
    validate("schemas/0.6.0/capture-coverage-manifest.schema.json", {
      ...coverage,
      records: [...coverage.records.slice(0, 8), recordWithoutReason, ...coverage.records.slice(9)]
    })
  );

  const checkpoint = JSON.parse(
    readFileSync(
      join(repositoryRoot, "examples", "m3-multi-harness", "workspace-checkpoint-primary.json"),
      "utf8"
    )
  );
  const checkpointWithoutWorkspace = { ...checkpoint };
  delete checkpointWithoutWorkspace.workspace_context_id;
  assert.throws(() =>
    validate("schemas/0.6.0/workspace-checkpoint-manifest.schema.json", checkpointWithoutWorkspace)
  );
});

test("protocol 0.6 examples cover recursive agents, workspaces, and attribution", () => {
  const directory = join(repositoryRoot, "examples", "m3-multi-harness");
  const events = JSON.parse(readFileSync(join(directory, "complete-trace.json"), "utf8"));
  const eventsById = new Map(events.map((event) => [event.event_id, event]));
  const started = events
    .filter((event) => event.payload.type === "agent_started")
    .map((event) => event.payload);
  const workspaces = new Set(
    events
      .filter((event) => event.payload.type === "workspace_registered")
      .map((event) => event.payload.workspace_context_id)
  );
  const gatewayContexts = events
    .filter((event) => event.source.kind === "model_gateway")
    .map((event) => event.context);
  const coverageStatuses = new Set(
    ["complete", "partial", "unavailable"].flatMap((name) =>
      JSON.parse(readFileSync(join(directory, `coverage-${name}.json`), "utf8")).records.map(
        (record) => record.status
      )
    )
  );

  assert.ok(started.some((payload) => "parent_agent_span_id" in payload));
  assert.deepEqual(workspaces, new Set(["workspace_primary", "workspace_child"]));
  assert.ok(gatewayContexts.some((context) => context.agent_span_id === "agent_child"));
  assert.ok(gatewayContexts.some((context) => context.agent_span_id === null));
  const toolStarted = events.find((event) => event.payload.type === "tool_started");
  const toolFinished = events.find((event) => event.payload.type === "tool_finished");
  assert.deepEqual(toolFinished.relationships, [
    { type: "caused_by", event_id: toolStarted.event_id }
  ]);
  const directed = events.flatMap((event) =>
    event.relationships.filter((relationship) => relationship.type === "directed_to")
  );
  assert.equal(directed.length, 1);
  assert.equal(eventsById.get(directed[0].event_id).payload.type, "agent_started");
  assert.deepEqual(coverageStatuses, new Set(["complete", "partial", "unavailable"]));
});

test("agent trace fixtures have contiguous sequences and proven relationships", () => {
  const payloadTypes = new Set();
  for (const name of ["complete", "failed", "partial"]) {
    const events = JSON.parse(
      readFileSync(join(repositoryRoot, "examples", "m3", `${name}-trace.json`), "utf8")
    );
    assert.deepEqual(events.map((event) => event.sequence), events.map((_, index) => index));
    assert.equal(new Set(events.map((event) => event.event_id)).size, events.length);
    const previous = new Set();
    for (const event of events) {
      payloadTypes.add(event.payload.type);
      assert.ok(event.relationships.every((relationship) => previous.has(relationship.event_id)));
      previous.add(event.event_id);
    }
  }
  for (const type of [
    "conversation_message",
    "model_request",
    "model_response_started",
    "model_response_finished",
    "tool_finished",
    "workspace_checkpoint",
    "execution_error"
  ]) {
    assert.ok(payloadTypes.has(type), type);
  }
});

test("agent trace profiles and payloads are closed", () => {
  const schema = "schemas/0.3.0/agent-trace-event.schema.json";
  const event = JSON.parse(
    readFileSync(join(repositoryRoot, "examples", "m3", "complete-trace.json"), "utf8")
  )[1];
  assert.throws(() =>
    validate(schema, { ...event, profile: { id: "lifecycle", version: "0.1.0" } })
  );
  assert.throws(() =>
    validate(schema, { ...event, payload: { ...event.payload, content: "private" } })
  );
});

test("stored artifact metadata matches payload bytes", () => {
  const directory = join(repositoryRoot, "examples", "complete-run");
  const records = JSON.parse(readFileSync(join(directory, "artifacts.json"), "utf8"));
  const payloads = {
    "artifact_instruction": ["instruction.txt", false],
    "artifact_model-output": ["model-output.txt", false],
    "artifact_projection": ["projection.json", true],
    "artifact_objective-result": ["objective-result.json", true]
  };
  for (const record of records) {
    const [name, structured] = payloads[record.artifact_id];
    const raw = readFileSync(join(directory, name));
    const bytes = structured ? canonicalize(JSON.parse(raw)) : raw;
    const digest = `sha256:${createHash("sha256").update(bytes).digest("hex")}`;
    assert.equal(bytes.length, record.byte_size, record.artifact_id);
    assert.equal(digest, record.digest, record.artifact_id);
  }
});

test("profile mapping digests match reviewed mapping records", () => {
  const names = ["swe-bench-verified", "terminal-bench-2", "bfcl-v4"];
  for (const name of names) {
    const fixture = JSON.parse(
      readFileSync(join(repositoryRoot, "examples", "profiles", `${name}.json`), "utf8")
    );
    const mapping = JSON.parse(
      readFileSync(join(repositoryRoot, "evidence", "mappings", `${name}-0.1.0.json`), "utf8")
    );
    assert.equal(hash_json(mapping), fixture.mapping.implementation_digest);
  }
});
