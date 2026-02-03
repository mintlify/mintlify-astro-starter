import type { AstroIntegration } from "astro";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { getAllPathsInDocsNav } from "@mintlify/common";
import { clearContentDirectory } from "./utils/clear-content-directory";
import { copyAssets } from "./utils/copy-assets";
import { findUserComponents } from "./utils/find-user-components";
import { loadAllSnippets } from "./utils/load-all-snippets";
import { readDocsConfig } from "./utils/read-docs-config";
import { readPageContent } from "./utils/read-page-content";
import { writePageContent } from "./utils/write-page-content";
import { writeFaviconsManifest } from "./utils/write-favicons-manifest";

export type { DocsConfig, NavigationConfig, Favicons } from "./types";

export interface MintlifyOptions {
  /** Path to the docs directory containing docs.json and MDX files. Defaults to "./docs" */
  docsDir?: string;
}

const BATCH_SIZE = 5;

export function mintlify(options?: MintlifyOptions): AstroIntegration {
  return {
    name: "@mintlify/astro",
    hooks: {
      "astro:config:setup": async ({ config: astroConfig, logger }) => {
        const rootDir = fileURLToPath(astroConfig.root);
        const srcDir = fileURLToPath(astroConfig.srcDir);
        const publicDir = fileURLToPath(astroConfig.publicDir);
        const contentDir = join(srcDir, "content", "docs");
        const componentsDir = join(srcDir, "content", "components");

        const docsDir = resolve(rootDir, options?.docsDir ?? "./docs");

        await Promise.all([
          clearContentDirectory(contentDir),
          clearContentDirectory(componentsDir),
        ]);

        // Copy static assets (images, logos, favicons) to public folder
        await copyAssets(docsDir, publicDir);

        // Load and parse all potential snippet files for import resolution
        const snippets = await loadAllSnippets(docsDir);
        logger.info(`Loaded ${snippets.length} snippet files`);

        // Find all user-defined React components in the docs folder
        const userComponents = await findUserComponents(docsDir);

        const docsConfig = await readDocsConfig(docsDir);
        const pagePaths = getAllPathsInDocsNav(docsConfig.navigation);

        if (docsConfig.favicon) {
          const faviconHref =
            typeof docsConfig.favicon === "string"
              ? docsConfig.favicon
              : docsConfig.favicon.light;
          await writeFaviconsManifest(srcDir, {
            icons: [
              {
                rel: "icon",
                type: "image/svg+xml",
                href: faviconHref,
              },
            ],
          });
        }

        logger.info(`Found ${pagePaths.length} pages to sync`);

        for (let i = 0; i < pagePaths.length; i += BATCH_SIZE) {
          const batch = pagePaths.slice(i, i + BATCH_SIZE);
          await Promise.all(
            batch.map(async (pagePath) => {
              try {
                const { content, slug } = await readPageContent(
                  pagePath,
                  docsDir,
                );

                await writePageContent({
                  content,
                  slug,
                  contentDir,
                  componentsDir,
                  userComponents,
                  snippets,
                  logger,
                });
              } catch (error) {
                logger.warn(`Failed to read content for ${pagePath}: ${error}`);
              }
            }),
          );
        }

        logger.info(`Synced ${pagePaths.length} pages`);
      },
    },
  };
}
