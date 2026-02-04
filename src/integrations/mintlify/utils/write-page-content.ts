import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { AstroIntegrationLogger } from "astro";

import { extractReactComponents } from "./extract-react-components";
import { resolveSnippets } from "./resolve-snippets";
import type { SnippetFile } from "./load-all-snippets";

export interface WritePageContentOptions {
  content: string;
  slug: string;
  contentDir: string;
  componentsDir: string;
  userComponents: Set<string>;
  snippets: SnippetFile[];
  logger?: AstroIntegrationLogger;
}

export async function writePageContent({
  content,
  slug,
  contentDir,
  componentsDir,
  userComponents,
  snippets,
  logger,
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

  // Resolve all snippet/MDX imports by inlining their content
  // This happens before React component extraction since snippets may contain React components
  const contentWithResolvedSnippets = await resolveSnippets(
    content,
    `/${slug}.mdx`,
    snippets,
  );

  // Extract compound React components to separate .jsx files
  // This is necessary because Astro compiles MDX with its own JSX runtime,
  // which is incompatible with React hooks. By extracting to .jsx files and
  // re-importing with client:load, we ensure React's JSX runtime handles these components.
  const finalContent = await extractReactComponents(
    contentWithResolvedSnippets,
    filePath,
    componentsDir,
    slug,
    userComponents,
    logger,
  );

  await writeFile(filePath, finalContent, "utf-8");
}
