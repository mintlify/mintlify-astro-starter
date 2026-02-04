import { readdir, readFile } from "node:fs/promises";
import { join, extname, relative } from "node:path";
import {
  getAST,
  findExportedNodes,
  DEFAULT_MINT_IGNORES,
} from "@mintlify/common";

export async function findUserComponents(
  docsDir: string,
): Promise<Set<string>> {
  const components = new Set<string>();

  async function scanDirectory(dir: string): Promise<void> {
    const entries = await readdir(dir, { withFileTypes: true }).catch(() => []);

    for (const entry of entries) {
      const fullPath = join(dir, entry.name);

      if (entry.isDirectory()) {
        if (!DEFAULT_MINT_IGNORES.includes(entry.name)) {
          await scanDirectory(fullPath);
        }
      } else {
        const ext = extname(entry.name).toLowerCase();
        if (ext === ".jsx" || ext === ".tsx") {
          const fileComponents = await extractComponentNames(fullPath, docsDir);
          fileComponents.forEach((name) => components.add(name));
        }
      }
    }
  }

  await scanDirectory(docsDir);
  return components;
}

async function extractComponentNames(
  filePath: string,
  docsDir: string,
): Promise<string[]> {
  const content = await readFile(filePath, "utf-8").catch(() => null);
  if (!content) return [];

  try {
    const relativePath = "/" + relative(docsDir, filePath);
    const tree = getAST(content, relativePath);
    const exportedNames = findExportedNodes(
      tree,
      "ArrowFunctionExpression",
      "FunctionExpression",
    );
    return exportedNames.filter((name) => /^[A-Z]/.test(name));
  } catch {
    return [];
  }
}
