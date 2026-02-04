import { readdir, readFile } from "node:fs/promises";
import { join, extname, relative } from "node:path";
import {
  getAST,
  SNIPPET_EXTENSIONS,
  topologicalSort,
  extractImportSources,
  resolveImportPath,
  DEFAULT_MINT_IGNORES,
} from "@mintlify/common";
import type { Root } from "mdast";

export interface SnippetFile {
  filename: string;
  tree: Root;
  content: string;
}

async function scanDirectory(
  dir: string,
  rootDir: string,
  files: { path: string; relativePath: string }[] = [],
): Promise<{ path: string; relativePath: string }[]> {
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      if (DEFAULT_MINT_IGNORES.includes(entry.name)) {
        continue;
      }
      await scanDirectory(fullPath, rootDir, files);
    } else {
      const ext = extname(entry.name).toLowerCase();
      if (SNIPPET_EXTENSIONS.includes(ext)) {
        const relativePath = "/" + relative(rootDir, fullPath);
        files.push({ path: fullPath, relativePath });
      }
    }
  }

  return files;
}

export async function loadAllSnippets(docsDir: string): Promise<SnippetFile[]> {
  const files = await scanDirectory(docsDir, docsDir);
  const snippets: SnippetFile[] = [];

  for (const file of files) {
    try {
      const content = await readFile(file.path, "utf-8");
      const tree = getAST(content, file.relativePath) as Root;

      snippets.push({
        filename: file.relativePath,
        tree,
        content,
      });
    } catch (error) {
      console.warn(`Failed to parse ${file.relativePath}:`, error);
    }
  }

  const graph: Record<string, string[]> = {};

  for (const snippet of snippets) {
    const normalizedPath = snippet.filename.toLowerCase();
    graph[normalizedPath] = [];

    const importSources = extractImportSources(snippet.tree);
    for (const source of importSources) {
      const resolved = resolveImportPath(source, snippet.filename);
      if (resolved) {
        graph[normalizedPath].push(resolved.toLowerCase());
      }
    }
  }

  const sortedPaths = topologicalSort(graph);
  const sortedSnippets: SnippetFile[] = [];
  for (const path of sortedPaths) {
    const snippet = snippets.find(
      (s) => s.filename.toLowerCase() === path.toLowerCase(),
    );
    if (snippet) {
      sortedSnippets.push(snippet);
    }
  }

  return sortedSnippets;
}
