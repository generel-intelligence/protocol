from __future__ import annotations

import hashlib
import json
from pathlib import Path
from typing import Any

import pytest
from jsonschema import Draft202012Validator
from jsonschema.exceptions import ValidationError

from benchmark_protocol import PROTOCOL_VERSION, canonicalize, get_schema, hash_json, validate

REPOSITORY_ROOT = Path(__file__).resolve().parents[3]


def load(path: str) -> Any:
    return json.loads((REPOSITORY_ROOT / path).read_text(encoding="utf-8"))


def test_version_and_schema_access() -> None:
    assert PROTOCOL_VERSION == "0.8.0"
    assert get_schema("0.1.0/artifact.schema.json")["title"] == "Artifact"
    assert (
        get_schema("0.2.0/benchmark-package-manifest.schema.json")["title"]
        == "Benchmark package manifest"
    )
    assert get_schema("0.3.0/agent-trace-event.schema.json")["title"] == "Agent trace event"
    assert (
        get_schema("0.6.0/workspace-checkpoint-manifest.schema.json")["title"]
        == "Workspace checkpoint manifest"
    )
    assert (
        get_schema("0.6.0/capture-coverage-manifest.schema.json")["title"]
        == "Capture coverage manifest"
    )
    assert get_schema("0.8.0/artifact-output-manifest.schema.json")["title"] == (
        "Artifact output manifest"
    )
    assert get_schema("0.8.0/webpage-bundle-manifest.schema.json")["title"] == (
        "Webpage bundle manifest"
    )


def test_canonicalization_corpus() -> None:
    for fixture in load("examples/canonicalization.json")["cases"]:
        assert canonicalize(fixture["input"]).decode() == fixture["canonical"]
        assert hash_json(fixture["input"]) == fixture["digest"]


def test_all_conformance_documents_validate_and_reject_generated_unknown_fields() -> None:
    for document in load("examples/conformance.json")["documents"]:
        value = load(f"examples/{document['path']}")
        candidates = value if document.get("items") else [value]
        for candidate in candidates:
            validate(document["schema"], candidate)
            with pytest.raises(ValidationError, match="Additional properties"):
                validate(
                    document["schema"],
                    {**candidate, "synthetic_unknown_field": True},
                )


def test_profile_schemas_cover_generated_terminal_and_category_branches() -> None:
    profiles = (
        ("swe-bench-verified", "swe-bench-verified-result"),
        ("terminal-bench-2", "terminal-bench-2-result"),
        ("bfcl-v4", "bfcl-v4-result"),
    )
    for fixture_name, schema_name in profiles:
        value = load(f"examples/profiles/{fixture_name}.json")
        schema = f"schemas/0.1.0/profiles/{schema_name}.schema.json"
        validate(schema, {**value, "outcome": {"status": "error", "error_code": "synthetic_error"}})
        validate(schema, {**value, "outcome": {"status": "not_run", "reason": "synthetic branch"}})

    swe = load("examples/profiles/swe-bench-verified.json")
    validate(
        "schemas/0.1.0/profiles/swe-bench-verified-result.schema.json",
        {**swe, "outcome": {"status": "completed", "resolved": False}},
    )

    terminal = load("examples/profiles/terminal-bench-2.json")
    validate(
        "schemas/0.1.0/profiles/terminal-bench-2-result.schema.json",
        {**terminal, "outcome": {"status": "completed", "reward": 0, "passed": False}},
    )

    bfcl = load("examples/profiles/bfcl-v4.json")
    bfcl_schema = "schemas/0.1.0/profiles/bfcl-v4-result.schema.json"
    validate(
        bfcl_schema,
        {
            **bfcl,
            "outcome": {
                "status": "completed",
                "test_category": "simple_python",
                "accuracy": 0,
                "correct_count": 0,
                "total_count": 1,
                "partial_evaluation": True,
            },
        },
    )
    with pytest.raises(ValidationError):
        validate(
            bfcl_schema,
            {
                **bfcl,
                "outcome": {
                    "status": "completed",
                    "test_category": "simple_python",
                    "accuracy": 0,
                    "correct_count": 0,
                    "partial_evaluation": True,
                },
            },
        )


def test_expense_result_terminal_branches_validate() -> None:
    value = load("examples/m2/expense-report-result.json")
    schema = "schemas/0.2.0/profiles/expense-report-result.schema.json"
    validate(schema, value)
    validate(schema, {**value, "outcome": {"status": "error", "error_code": "evaluator_failed"}})
    validate(schema, {**value, "outcome": {"status": "not_run", "reason": "workspace unavailable"}})
    with pytest.raises(ValidationError):
        validate(
            schema,
            {
                **value,
                "outcome": {
                    **value["outcome"],
                    "groups": {**value["outcome"]["groups"], "hidden_case": True},
                },
            },
        )


def test_reservation_result_terminal_branches_validate() -> None:
    value = load("examples/m3/reservation-service-result.json")
    schema = "schemas/0.4.0/profiles/reservation-service-result.schema.json"
    validate(schema, value)
    validate(schema, {**value, "outcome": {"status": "error", "error_code": "evaluator_failed"}})
    validate(schema, {**value, "outcome": {"status": "not_run", "reason": "workspace unavailable"}})
    with pytest.raises(ValidationError):
        validate(
            schema,
            {
                **value,
                "outcome": {
                    **value["outcome"],
                    "groups": {**value["outcome"]["groups"], "hidden_case": True},
                },
            },
        )


def test_webpage_output_and_result_contracts() -> None:
    output = load("examples/m5/artifact-output-manifest.json")
    output_schema = "schemas/0.7.0/artifact-output-manifest.schema.json"
    validate(output_schema, output)
    with pytest.raises(ValidationError):
        validate(output_schema, {**output, "outputs": [{**output["outputs"][0], "path": "../x"}]})

    result = load("examples/m5/webpage-artifact-result.json")
    result_schema = "schemas/0.7.0/profiles/webpage-artifact-result.schema.json"
    validate(result_schema, result)
    validate(result_schema, {**result, "outcome": {"status": "error", "error_code": "failed"}})
    validate(result_schema, {**result, "outcome": {"status": "not_run", "reason": "missing"}})


def test_webpage_bundle_contracts() -> None:
    declaration = load("examples/webpage-bundle/artifact-output-manifest.json")
    declaration_schema = "schemas/0.8.0/artifact-output-manifest.schema.json"
    validate(declaration_schema, declaration)
    with pytest.raises(ValidationError):
        validate(
            declaration_schema,
            {
                **declaration,
                "webpage_bundles": [
                    {**declaration["webpage_bundles"][0], "entrypoint": "../index.html"}
                ],
            },
        )

    bundle = load("examples/webpage-bundle/webpage-bundle-manifest.json")
    bundle_schema = "schemas/0.8.0/webpage-bundle-manifest.schema.json"
    validate(bundle_schema, bundle)
    with pytest.raises(ValidationError):
        validate(bundle_schema, {**bundle, "entrypoint": "/index.html"})


def test_benchmark_package_paths_cannot_traverse() -> None:
    value = load("examples/m2/benchmark-package-manifest.json")
    with pytest.raises(ValidationError):
        validate(
            "schemas/0.2.0/benchmark-package-manifest.schema.json",
            {
                **value,
                "files": [{**value["files"][0], "path": "workspace/../hidden-tests.py"}],
            },
        )


def test_playback_evidence_rejects_unsafe_paths_and_invalid_byte_ranges() -> None:
    checkpoint = load("examples/m4/workspace-checkpoint-manifest.json")
    checkpoint_schema = "schemas/0.5.0/workspace-checkpoint-manifest.schema.json"
    validate(checkpoint_schema, checkpoint)
    for path in ("/absolute", "../escape", "src//file", r"src\file"):
        with pytest.raises(ValidationError):
            validate(
                checkpoint_schema,
                {**checkpoint, "files": {path: next(iter(checkpoint["files"].values()))}},
            )

    stream = load("examples/m4/model-response-stream-index.json")
    stream_schema = "schemas/0.5.0/model-response-stream-index.schema.json"
    validate(stream_schema, stream)
    with pytest.raises(ValidationError):
        validate(
            stream_schema,
            {**stream, "segments": [{**stream["segments"][0], "byte_length": 0}]},
        )


def test_event_chunk_digests_match_canonical_event_bytes() -> None:
    for ordinal in ("000", "001"):
        events = load(f"examples/complete-run/events/chunk-{ordinal}.json")
        manifest = load(f"examples/complete-run/chunk-{ordinal}.manifest.json")
        assert hash_json(events) == manifest["digest"]


def test_complete_and_partial_run_fixtures_preserve_sequence_integrity() -> None:
    final = load("examples/complete-run/final-run-manifest.json")
    chunks = final["chunks"]
    assert [chunk["ordinal"] for chunk in chunks] == list(range(len(chunks)))

    sequences: list[int] = []
    for chunk in chunks:
        ordinal = chunk["ordinal"]
        events = load(f"examples/complete-run/events/chunk-{ordinal:03}.json")
        event_sequences = [event["sequence"] for event in events]
        assert len(events) == chunk["event_count"]
        assert event_sequences == list(
            range(chunk["sequence_range"]["first"], chunk["sequence_range"]["last"] + 1)
        )
        assert {event["run_id"] for event in events} == {final["run_id"]}
        assert hash_json(events) == chunk["digest"]
        sequences.extend(event_sequences)

    assert sequences == list(range(len(sequences)))
    assert sum(chunk["event_count"] for chunk in chunks) == len(sequences)

    partial = load("examples/partial-run/partial-run-manifest.json")
    assert not (REPOSITORY_ROOT / "examples/partial-run/final-run-manifest.json").exists()
    present = partial["chunks"]
    assert [chunk["ordinal"] for chunk in present] == list(range(len(present)))
    assert present[-1]["sequence_range"]["last"] < partial["missing_ranges"][0]["first"]


def test_public_schema_inventory_is_exactly_sixteen_valid_schemas() -> None:
    paths = sorted((REPOSITORY_ROOT / "schemas" / "0.1.0").rglob("*.schema.json"))
    recorded = load("evidence/schema-digests-0.1.0.json")["schemas"]
    assert len(paths) == 16
    for path in paths:
        schema = json.loads(path.read_text(encoding="utf-8"))
        Draft202012Validator.check_schema(schema)
        relative = path.relative_to(REPOSITORY_ROOT / "schemas" / "0.1.0").as_posix()
        assert hash_json(schema) == recorded[relative]


def test_protocol_0_2_schema_inventory_is_exactly_two_valid_schemas() -> None:
    paths = sorted((REPOSITORY_ROOT / "schemas" / "0.2.0").rglob("*.schema.json"))
    recorded = load("evidence/schema-digests-0.2.0.json")["schemas"]
    assert len(paths) == 2
    for path in paths:
        schema = json.loads(path.read_text(encoding="utf-8"))
        Draft202012Validator.check_schema(schema)
        relative = path.relative_to(REPOSITORY_ROOT / "schemas" / "0.2.0").as_posix()
        assert hash_json(schema) == recorded[relative]


def test_protocol_0_3_schema_inventory_is_exactly_one_valid_schema() -> None:
    paths = sorted((REPOSITORY_ROOT / "schemas" / "0.3.0").rglob("*.schema.json"))
    recorded = load("evidence/schema-digests-0.3.0.json")["schemas"]
    assert len(paths) == 1
    for path in paths:
        schema = json.loads(path.read_text(encoding="utf-8"))
        Draft202012Validator.check_schema(schema)
        relative = path.relative_to(REPOSITORY_ROOT / "schemas" / "0.3.0").as_posix()
        assert hash_json(schema) == recorded[relative]


def test_protocol_0_4_schema_inventory_is_exactly_one_valid_schema() -> None:
    paths = sorted((REPOSITORY_ROOT / "schemas" / "0.4.0").rglob("*.schema.json"))
    recorded = load("evidence/schema-digests-0.4.0.json")["schemas"]
    assert len(paths) == 1
    for path in paths:
        schema = json.loads(path.read_text(encoding="utf-8"))
        Draft202012Validator.check_schema(schema)
        relative = path.relative_to(REPOSITORY_ROOT / "schemas" / "0.4.0").as_posix()
        assert hash_json(schema) == recorded[relative]


def test_protocol_0_5_schema_inventory_is_exactly_two_valid_schemas() -> None:
    paths = sorted((REPOSITORY_ROOT / "schemas" / "0.5.0").rglob("*.schema.json"))
    recorded = load("evidence/schema-digests-0.5.0.json")["schemas"]
    assert len(paths) == 2
    for path in paths:
        schema = json.loads(path.read_text(encoding="utf-8"))
        Draft202012Validator.check_schema(schema)
        relative = path.relative_to(REPOSITORY_ROOT / "schemas" / "0.5.0").as_posix()
        assert hash_json(schema) == recorded[relative]


def test_protocol_0_6_schema_inventory_is_exactly_four_valid_schemas() -> None:
    paths = sorted((REPOSITORY_ROOT / "schemas" / "0.6.0").rglob("*.schema.json"))
    recorded = load("evidence/schema-digests-0.6.0.json")["schemas"]
    assert len(paths) == 4
    for path in paths:
        schema = json.loads(path.read_text(encoding="utf-8"))
        Draft202012Validator.check_schema(schema)
        relative = path.relative_to(REPOSITORY_ROOT / "schemas" / "0.6.0").as_posix()
        assert hash_json(schema) == recorded[relative]


def test_protocol_0_7_schema_inventory_is_exactly_two_valid_schemas() -> None:
    paths = sorted((REPOSITORY_ROOT / "schemas" / "0.7.0").rglob("*.schema.json"))
    recorded = load("evidence/schema-digests-0.7.0.json")["schemas"]
    assert len(paths) == 2
    for path in paths:
        schema = json.loads(path.read_text(encoding="utf-8"))
        Draft202012Validator.check_schema(schema)
        relative = path.relative_to(REPOSITORY_ROOT / "schemas" / "0.7.0").as_posix()
        assert hash_json(schema) == recorded[relative]


def test_protocol_0_8_schema_inventory_is_exactly_two_valid_schemas() -> None:
    paths = sorted((REPOSITORY_ROOT / "schemas" / "0.8.0").rglob("*.schema.json"))
    recorded = load("evidence/schema-digests-0.8.0.json")["schemas"]
    assert len(paths) == 2
    for path in paths:
        schema = json.loads(path.read_text(encoding="utf-8"))
        Draft202012Validator.check_schema(schema)
        relative = path.relative_to(REPOSITORY_ROOT / "schemas" / "0.8.0").as_posix()
        assert hash_json(schema) == recorded[relative]


def test_protocol_0_6_rejects_malformed_context_coverage_parent_and_workspace_fields() -> None:
    event_schema = "schemas/0.6.0/agent-trace-event.schema.json"
    events = load("examples/m3-multi-harness/complete-trace.json")

    with pytest.raises(ValidationError):
        validate(
            event_schema,
            {
                **events[0],
                "context": {"agent_span_id": "", "workspace_context_id": None},
            },
        )

    child = events[4]
    malformed_parent = {
        **child,
        "payload": {
            key: value for key, value in child["payload"].items() if key != "native_parent_agent_id"
        },
    }
    with pytest.raises(ValidationError):
        validate(event_schema, malformed_parent)

    coverage = load("examples/m3-multi-harness/coverage-partial.json")
    malformed_record = {**coverage["records"][8]}
    malformed_record.pop("reason_code")
    with pytest.raises(ValidationError):
        validate(
            "schemas/0.6.0/capture-coverage-manifest.schema.json",
            {
                **coverage,
                "records": [
                    *coverage["records"][:8],
                    malformed_record,
                    *coverage["records"][9:],
                ],
            },
        )

    checkpoint = load("examples/m3-multi-harness/workspace-checkpoint-primary.json")
    with pytest.raises(ValidationError):
        validate(
            "schemas/0.6.0/workspace-checkpoint-manifest.schema.json",
            {key: value for key, value in checkpoint.items() if key != "workspace_context_id"},
        )


def test_protocol_0_6_examples_cover_recursive_agents_workspaces_and_attribution() -> None:
    events = load("examples/m3-multi-harness/complete-trace.json")
    events_by_id = {event["event_id"]: event for event in events}
    started = [event["payload"] for event in events if event["payload"]["type"] == "agent_started"]
    workspaces = {
        event["payload"]["workspace_context_id"]
        for event in events
        if event["payload"]["type"] == "workspace_registered"
    }
    gateway_contexts = [
        event["context"] for event in events if event["source"]["kind"] == "model_gateway"
    ]

    assert any("parent_agent_span_id" in payload for payload in started)
    assert workspaces == {"workspace_primary", "workspace_child"}
    assert any(context["agent_span_id"] == "agent_child" for context in gateway_contexts)
    assert any(context["agent_span_id"] is None for context in gateway_contexts)
    tool_started = next(event for event in events if event["payload"]["type"] == "tool_started")
    tool_finished = next(event for event in events if event["payload"]["type"] == "tool_finished")
    assert tool_finished["relationships"] == [
        {"type": "caused_by", "event_id": tool_started["event_id"]}
    ]
    directed = [
        relationship
        for event in events
        for relationship in event["relationships"]
        if relationship["type"] == "directed_to"
    ]
    assert len(directed) == 1
    assert events_by_id[directed[0]["event_id"]]["payload"]["type"] == "agent_started"
    coverage_statuses = {
        record["status"]
        for name in ("complete", "partial", "unavailable")
        for record in load(f"examples/m3-multi-harness/coverage-{name}.json")["records"]
    }
    assert coverage_statuses == {"complete", "partial", "unavailable"}


def test_agent_trace_fixtures_have_contiguous_sequences_and_proven_relationships() -> None:
    payload_types: set[str] = set()
    for name in ("complete", "failed", "partial"):
        events = load(f"examples/m3/{name}-trace.json")
        assert [event["sequence"] for event in events] == list(range(len(events)))
        assert len({event["event_id"] for event in events}) == len(events)
        previous: set[str] = set()
        for event in events:
            payload_types.add(event["payload"]["type"])
            assert all(
                relationship["event_id"] in previous for relationship in event["relationships"]
            )
            previous.add(event["event_id"])

    assert payload_types >= {
        "conversation_message",
        "model_request",
        "model_response_started",
        "model_response_finished",
        "tool_finished",
        "workspace_checkpoint",
        "execution_error",
    }


def test_agent_trace_profiles_and_payloads_are_closed() -> None:
    schema = "schemas/0.3.0/agent-trace-event.schema.json"
    event = load("examples/m3/complete-trace.json")[1]
    with pytest.raises(ValidationError):
        validate(schema, {**event, "profile": {"id": "lifecycle", "version": "0.1.0"}})
    with pytest.raises(ValidationError):
        validate(schema, {**event, "payload": {**event["payload"], "content": "private"}})


def test_stored_artifact_metadata_matches_payload_bytes() -> None:
    directory = REPOSITORY_ROOT / "examples" / "complete-run"
    payloads = {
        "artifact_instruction": ("instruction.txt", False),
        "artifact_model-output": ("model-output.txt", False),
        "artifact_projection": ("projection.json", True),
        "artifact_objective-result": ("objective-result.json", True),
    }
    for record in load("examples/complete-run/artifacts.json"):
        name, structured = payloads[record["artifact_id"]]
        raw = (directory / name).read_bytes()
        content = canonicalize(json.loads(raw)) if structured else raw
        assert len(content) == record["byte_size"]
        assert f"sha256:{hashlib.sha256(content).hexdigest()}" == record["digest"]


def test_profile_mapping_digests_match_reviewed_mapping_records() -> None:
    for name in ("swe-bench-verified", "terminal-bench-2", "bfcl-v4"):
        fixture = load(f"examples/profiles/{name}.json")
        mapping = load(f"evidence/mappings/{name}-0.1.0.json")
        assert hash_json(mapping) == fixture["mapping"]["implementation_digest"]
