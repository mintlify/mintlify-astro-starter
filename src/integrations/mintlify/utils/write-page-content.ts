import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

import type { DecoratedPage } from "../types";
import { extractReactComponents } from "./extract-react-components";
import { buildFrontmatter } from "./build-frontmatter";

export interface WritePageContentOptions {
  page: DecoratedPage;
  content: string;
  slug: string;
  contentDir: string;
  componentsDir: string;
}

export async function writePageContent({
  page,
  content,
  slug,
  contentDir,
  componentsDir,
}: WritePageContentOptions): Promise<void> {
  let filePath: string;

  if (slug === "index") {
    filePath = join(contentDir, "index.mdx");
  } else {
    const parts = slug.split("/");
    const fileName = parts.pop() + ".mdx";
    const dirPath = join(contentDir, ...parts);

    if (parts.length > 0) {
      await mkdir(dirPath, { recursive: true });
    }
    filePath = join(dirPath, fileName);
  }

  const frontmatter = buildFrontmatter(page);
  const initialContent = frontmatter + content;

  // Extract React components with hooks to separate .jsx files
  // This is necessary because Astro compiles MDX with its own JSX transform,
  // which is incompatible with React hooks. By extracting to .jsx files and
  // re-importing with client:load, we ensure React's runtime handles these components.
  const finalContent = await extractReactComponents(
    initialContent,
    filePath,
    componentsDir,
    slug,
  );

  await writeFile(filePath, finalContent, "utf-8");
}
