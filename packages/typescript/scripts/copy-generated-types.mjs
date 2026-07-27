import { cpSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const source = join(import.meta.dirname, "..", "src", "generated");
const target = join(import.meta.dirname, "..", "dist", "generated");
mkdirSync(target, { recursive: true });
cpSync(source, target, {
  recursive: true,
  filter: (path) => !path.endsWith(".ts") || path.endsWith(".d.ts"),
});
