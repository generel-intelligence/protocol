import { compileFromFile } from "json-schema-to-typescript";
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { basename, dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const packageRoot = resolve(here, "..");
const repositoryRoot = resolve(packageRoot, "..", "..");
const sourceRoot = join(repositoryRoot, "schemas");
const destinationRoot = join(packageRoot, "schemas");
const generatedRoot = join(packageRoot, "src", "generated");
const check = process.argv.includes("--check");

function sameGeneratedText(actual, expected) {
  return actual.replaceAll("\r\n", "\n") === expected.replaceAll("\r\n", "\n");
}

async function syncVersion() {
  const source = await readFile(join(repositoryRoot, "VERSION"));
  const destination = join(packageRoot, "VERSION");
  try {
    if ((await readFile(destination)).equals(source)) return;
  } catch {
    // Write the missing generated file below.
  }
  await writeFile(destination, source);
}

async function schemaFiles(directory) {
  const { readdir } = await import("node:fs/promises");
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? schemaFiles(path) : [path];
  }));
  return nested
    .flat()
    .filter((path) => path.endsWith(".schema.json"))
    .sort((left, right) => left.localeCompare(right, undefined, { numeric: true }));
}

async function expectedFiles() {
  const output = new Map();
  const exports = new Map();
  for (const schemaPath of await schemaFiles(sourceRoot)) {
    const name = basename(schemaPath, ".schema.json").replaceAll("-", "_");
    const declaration = await compileFromFile(schemaPath, {
      bannerComment: "/* Generated from JSON Schema. Do not edit. */",
      cwd: dirname(schemaPath),
      unreachableDefinitions: true
    });
    output.set(join(generatedRoot, `${name}.d.ts`), declaration);
    const topLevelName = declaration.match(/export (?:interface|type) ([A-Za-z0-9_]+)/)?.[1];
    if (!topLevelName) throw new Error(`no generated top-level type for ${schemaPath}`);
    exports.set(name, `export type { ${topLevelName} } from "./${name}.js";`);
  }
  output.set(
    join(packageRoot, "src", "generated", "index.ts"),
    `/* Generated from JSON Schema. Do not edit. */\n\n${[...exports.values()].join("\n")}\n`
  );
  return output;
}

const expected = await expectedFiles();
if (check) {
  const stale = [];
  for (const [path, content] of expected) {
    try {
      if (!sameGeneratedText(await readFile(path, "utf8"), content)) {
        stale.push(relative(packageRoot, path));
      }
    } catch {
      stale.push(relative(packageRoot, path));
    }
  }
  const version = await readFile(join(repositoryRoot, "VERSION"), "utf8");
  try {
    if ((await readFile(join(packageRoot, "VERSION"), "utf8")) !== version) stale.push("VERSION");
  } catch {
    stale.push("VERSION");
  }
  for (const source of await schemaFiles(sourceRoot)) {
    try {
      if (!(await readFile(source)).equals(
        await readFile(join(destinationRoot, relative(sourceRoot, source)))
      )) stale.push(relative(sourceRoot, source));
    } catch {
      stale.push(relative(sourceRoot, source));
    }
  }
  if (stale.length) {
    throw new Error(`generated TypeScript artifacts are stale: ${stale.join(", ")}`);
  }
} else {
  await rm(destinationRoot, { recursive: true, force: true });
  await rm(generatedRoot, { recursive: true, force: true });
  await cp(sourceRoot, destinationRoot, { recursive: true });
  for (const [path, content] of expected) {
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, content);
  }
  await syncVersion();
}
