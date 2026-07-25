from __future__ import annotations

import hashlib
import json
from pathlib import Path
from typing import Any

import pytest

from benchmark_protocol import PROTOCOL_VERSION, canonicalize, get_schema, hash_json, validate
from jsonschema import Draft202012Validator

REPOSITORY_ROOT = Path(__file__).resolve().parents[3]


def load(path: str) -> Any:
    return json.loads((REPOSITORY_ROOT / path).read_text(encoding="utf-8"))


def test_version_and_schema_access() -> None:
    assert PROTOCOL_VERSION == "0.1.0"
    assert get_schema("0.1.0/artifact.schema.json")["title"] == "Artifact"


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
            with pytest.raises(Exception, match="Additional properties"):
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
    with pytest.raises(Exception):
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
