import { readdir, readFile } from "node:fs/promises";
import { join, extname, relative } from "node:path";
import { getAST, findExportedNodes } from "@mintlify/common";

export async function findUserComponents(
  docsDir: string,
): Promise<Set<string>> {
  const components = new Set<string>();

  async function scanDirectory(dir: string): Promise<void> {
    try {
      const entries = await readdir(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = join(dir, entry.name);

        if (entry.isDirectory()) {
          if (!entry.name.startsWith(".") && entry.name !== "node_modules") {
            await scanDirectory(fullPath);
          }
        } else {
          const ext = extname(entry.name).toLowerCase();
          if (ext === ".jsx" || ext === ".tsx") {
            const fileComponents = await extractComponentNames(
              fullPath,
              docsDir,
            );
            for (const name of fileComponents) {
              components.add(name);
            }
          }
        }
      }
    } catch {
      // Directory doesn't exist or can't be read
    }
  }

  await scanDirectory(docsDir);
  return components;
}

async function extractComponentNames(
  filePath: string,
  docsDir: string,
): Promise<string[]> {
  try {
    const content = await readFile(filePath, "utf-8");
    const relativePath = "/" + relative(docsDir, filePath);

    const tree = getAST(content, relativePath);
    const exportedNames = findExportedNodes(
      tree,
      "ArrowFunctionExpression",
      "FunctionExpression",
    );

    return exportedNames.filter((name) => /^[A-Z]/.test(name));
  } catch {
    // File can't be read or parsed
    return [];
  }
}
