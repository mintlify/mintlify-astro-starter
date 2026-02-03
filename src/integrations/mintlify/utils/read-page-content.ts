import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { parseFrontmatter, hasFrontmatter } from "@mintlify/common";

export interface PageFrontmatter {
  title?: string;
  description?: string;
  icon?: string;
  iconType?: string;
  sidebarTitle?: string;
  mode?: string;
  api?: string;
  openapi?: string;
  [key: string]: unknown;
}

export interface PageContent {
  content: string;
  slug: string;
  frontmatter: PageFrontmatter;
  body: string;
}

export async function readPageContent(
  pagePath: string,
  docsDir: string,
): Promise<PageContent> {
  const filePath = join(docsDir, `${pagePath}.mdx`);
  const content = await readFile(filePath, "utf-8");

  let frontmatter: PageFrontmatter = {};
  let body = content;

  if (hasFrontmatter(content)) {
    const parsed = parseFrontmatter(content);
    frontmatter = (parsed.attributes || {}) as PageFrontmatter;
    body = parsed.body || content;
  }

  return {
    content,
    slug: pagePath,
    frontmatter,
    body,
  };
}
