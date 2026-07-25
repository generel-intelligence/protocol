import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { canonicalize, getSchema, hash_json, validate, PROTOCOL_VERSION } from "../dist/index.js";

const repositoryRoot = join(import.meta.dirname, "..", "..", "..");
const fixtures = JSON.parse(
  readFileSync(join(repositoryRoot, "examples", "canonicalization.json"), "utf8")
);

test("exports the candidate version and bundled schemas", () => {
  assert.equal(PROTOCOL_VERSION, "0.2.0");
  assert.equal(getSchema("0.1.0/artifact.schema.json").title, "Artifact");
  assert.equal(
    getSchema("0.2.0/benchmark-package-manifest.schema.json").title,
    "Benchmark package manifest"
  );
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
