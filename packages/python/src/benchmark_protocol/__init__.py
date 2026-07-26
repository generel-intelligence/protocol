from __future__ import annotations

import hashlib
import json
from importlib.resources import files
from importlib.resources.abc import Traversable
from typing import Any

import rfc8785
from jsonschema import Draft202012Validator, FormatChecker
from referencing import Registry, Resource

PROTOCOL_VERSION = "0.3.0"
_SCHEMA_ROOT = files(__package__).joinpath("schemas")


def _schema_files(directory: Traversable) -> list[Traversable]:
    paths: list[Traversable] = []
    for entry in directory.iterdir():
        if entry.is_dir():
            paths.extend(_schema_files(entry))
        elif entry.name.endswith(".schema.json"):
            paths.append(entry)
    return paths


def _load_schemas() -> dict[str, dict[str, Any]]:
    loaded: dict[str, dict[str, Any]] = {}
    for path in _schema_files(_SCHEMA_ROOT):
        schema = json.loads(path.read_text(encoding="utf-8"))
        loaded[schema["$id"]] = schema
        loaded[str(path).rsplit("schemas", 1)[1].lstrip("\\/").replace("\\", "/")] = schema
    return loaded


_SCHEMAS = _load_schemas()
_REGISTRY = Registry()
for _schema in {value["$id"]: value for value in _SCHEMAS.values()}.values():
    _REGISTRY = _REGISTRY.with_resource(_schema["$id"], Resource.from_contents(_schema))


def get_schema(schema_id: str) -> dict[str, Any]:
    try:
        return _SCHEMAS[schema_id]
    except KeyError as error:
        raise KeyError(f"Unknown schema: {schema_id}") from error


def validate(schema_id: str, value: Any) -> None:
    validator = Draft202012Validator(
        get_schema(schema_id), registry=_REGISTRY, format_checker=FormatChecker()
    )
    error = next(iter(sorted(validator.iter_errors(value), key=str)), None)
    if error is not None:
        raise error


def canonicalize(value: Any) -> bytes:
    return rfc8785.dumps(value)


def hash_json(value: Any) -> str:
    return f"sha256:{hashlib.sha256(canonicalize(value)).hexdigest()}"


__all__ = ["PROTOCOL_VERSION", "canonicalize", "get_schema", "hash_json", "validate"]
