import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export interface PageContent {
  content: string;
  slug: string;
}

export async function readPageContent(
  pagePath: string,
  docsDir: string,
): Promise<PageContent> {
  const filePath = join(docsDir, `${pagePath}.mdx`);
  const content = await readFile(filePath, 'utf-8');

  return {
    content,
    slug: pagePath,
  };
}
