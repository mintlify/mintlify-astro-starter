import {
  getAST,
  findAndRemoveImports,
  resolveAllImports,
  stringifyTree,
} from '@mintlify/common';
import type { Root } from 'mdast';
import type { SnippetFile } from './load-all-snippets';
import { getLogger } from './logger';

export async function resolveSnippets(
  content: string,
  filename: string,
  snippets: SnippetFile[],
): Promise<string> {
  try {
    const tree = getAST(content, filename) as Root;
    const { importMap, tree: treeWithoutImports } = await findAndRemoveImports(
      structuredClone(tree),
    );

    if (Object.keys(importMap).length === 0) {
      return content;
    }

    const snippetTrees = snippets.map((s) => ({
      filename: s.filename,
      tree: s.tree,
    }));

    const resolvedTree = await resolveAllImports({
      snippets: snippetTrees,
      fileWithImports: {
        tree: treeWithoutImports,
        filename,
        importMap,
      },
    });

    return stringifyTree(resolvedTree);
  } catch (error) {
    getLogger()?.warn(`Failed to resolve snippets in ${filename}: ${error}`);
    return content;
  }
}
