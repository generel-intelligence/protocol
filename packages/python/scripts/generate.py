from __future__ import annotations

import argparse
import shutil
import subprocess
import tempfile
from pathlib import Path


PACKAGE_ROOT = Path(__file__).resolve().parents[1]
REPOSITORY_ROOT = PACKAGE_ROOT.parents[1]
SOURCE_SCHEMAS = REPOSITORY_ROOT / "schemas"
VERSIONED_SCHEMAS = SOURCE_SCHEMAS / "0.1.0"
PACKAGE_SCHEMAS = PACKAGE_ROOT / "src" / "benchmark_protocol" / "schemas"
GENERATED = PACKAGE_ROOT / "src" / "benchmark_protocol" / "generated"


def generate(destination: Path) -> None:
    destination.mkdir(parents=True, exist_ok=True)
    subprocess.run(
        [
            "datamodel-codegen",
            "--input",
            str(VERSIONED_SCHEMAS),
            "--input-file-type",
            "jsonschema",
            "--output",
            str(destination),
            "--output-model-type",
            "typing.TypedDict",
            "--target-python-version",
            "3.12",
            "--use-standard-collections",
            "--use-union-operator",
            "--disable-timestamp",
        ],
        check=True,
    )


def same_files(left: Path, right: Path) -> bool:
    left_files = {path.relative_to(left): path.read_bytes() for path in left.rglob("*") if path.is_file()}
    right_files = (
        {path.relative_to(right): path.read_bytes() for path in right.rglob("*") if path.is_file()}
        if right.exists()
        else {}
    )
    return left_files == right_files


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()

    with tempfile.TemporaryDirectory() as temporary:
        candidate = Path(temporary) / "generated"
        generate(candidate)
        if args.check:
            if not same_files(candidate, GENERATED) or not same_files(SOURCE_SCHEMAS, PACKAGE_SCHEMAS):
                raise SystemExit("generated Python models are stale; run the generator")
        else:
            shutil.rmtree(GENERATED, ignore_errors=True)
            shutil.copytree(candidate, GENERATED)
            shutil.rmtree(PACKAGE_SCHEMAS, ignore_errors=True)
            shutil.copytree(SOURCE_SCHEMAS, PACKAGE_SCHEMAS)
            shutil.copy2(REPOSITORY_ROOT / "VERSION", PACKAGE_ROOT / "src" / "benchmark_protocol" / "VERSION")


if __name__ == "__main__":
    main()
