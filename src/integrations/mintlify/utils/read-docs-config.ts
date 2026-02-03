import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { DocsConfig } from "@mintlify/validation";

export async function readDocsConfig(docsDir: string): Promise<DocsConfig> {
  const configPath = join(docsDir, "docs.json");
  const content = await readFile(configPath, "utf-8");
  return JSON.parse(content) as DocsConfig;
}
