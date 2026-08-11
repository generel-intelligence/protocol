import { Ajv2020, type ValidateFunction } from "ajv/dist/2020.js";
import formatsPlugin from "ajv-formats";
import canonicalizeValue from "canonicalize";
import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

export type * from "./generated/index.js";

export const PROTOCOL_VERSION = "0.10.0";

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const schemaRoot = join(packageRoot, "schemas");
const schemas = new Map<string, object>();

function loadSchemas(directory: string): void {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) loadSchemas(path);
    else if (entry.name.endsWith(".schema.json")) {
      const schema = JSON.parse(readFileSync(path, "utf8")) as { $id: string };
      schemas.set(schema.$id, schema);
      schemas.set(relative(schemaRoot, path).replaceAll("\\", "/"), schema);
    }
  }
}

loadSchemas(schemaRoot);
const ajv = new Ajv2020({ allErrors: true, strict: true });
(formatsPlugin as unknown as (instance: Ajv2020) => Ajv2020)(ajv);
for (const schema of new Set(schemas.values())) ajv.addSchema(schema);

export function getSchema(id: string): object {
  const schema = schemas.get(id);
  if (!schema) throw new Error(`Unknown schema: ${id}`);
  return schema;
}

export function validate(id: string, value: unknown): void {
  const schema = getSchema(id) as { $id?: string };
  const validator: ValidateFunction =
    (schema.$id ? ajv.getSchema(schema.$id) : undefined) ?? ajv.compile(schema);
  if (!validator(value)) {
    const first = validator.errors?.[0];
    throw new Error(
      `${id} validation failed at ${first?.instancePath || "/"}: ${first?.keyword || "unknown"}`,
      { cause: validator.errors ?? [] }
    );
  }
}

export function canonicalize(value: unknown): Uint8Array {
  const result = canonicalizeValue(value);
  if (result === undefined) throw new TypeError("value is not valid RFC 8785 JSON");
  return Buffer.from(result, "utf8");
}

export function hash_json(value: unknown): string {
  return `sha256:${createHash("sha256").update(canonicalize(value)).digest("hex")}`;
}
