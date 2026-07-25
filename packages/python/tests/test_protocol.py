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


def test_validation_accepts_fixture_and_rejects_unknown_field() -> None:
    value = load("examples/complete-run/run-session.json")
    validate("schemas/0.1.0/run-session.schema.json", value)
    with pytest.raises(Exception, match="Additional properties"):
        validate("schemas/0.1.0/run-session.schema.json", {**value, "extra": True})


def test_all_conformance_documents_validate() -> None:
    for document in load("examples/conformance.json")["documents"]:
        value = load(f"examples/{document['path']}")
        candidates = value if document.get("items") else [value]
        for candidate in candidates:
            validate(document["schema"], candidate)


def test_event_chunk_digests_match_canonical_event_bytes() -> None:
    for ordinal in ("000", "001"):
        events = load(f"examples/complete-run/events/chunk-{ordinal}.json")
        manifest = load(f"examples/complete-run/chunk-{ordinal}.manifest.json")
        assert hash_json(events) == manifest["digest"]


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
