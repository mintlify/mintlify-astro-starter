import type { AstroIntegration } from "astro";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { validateEnv } from "./utils/validate-env";
import { clearContentDirectory } from "./utils/clear-content-directory";
import { extractAllPaths } from "./utils/navigation";
import { fetchNavigation } from "./utils/fetch-navigation";
import { fetchPageContent } from "./utils/fetch-page-content";
import { writePageContent } from "./utils/write-page-content";
import { writeFaviconsManifest } from "./utils/write-favicons-manifest";

export type {
  DecoratedPage,
  DecoratedNavigationConfig,
  Favicons,
} from "./types";

const MAX_PAGES = 25; // for testing purposes to reduce API calls
const BATCH_SIZE = 5;

export function mintlify(): AstroIntegration {
  return {
    name: "@mintlify/astro",
    hooks: {
      "astro:config:setup": async ({ config: astroConfig, logger }) => {
        const { apiKey, apiHost, projectId } = validateEnv(astroConfig);

        const srcDir = fileURLToPath(astroConfig.srcDir);
        const contentDir = join(srcDir, "content", "docs");
        const componentsDir = join(srcDir, "content", "extracted");

        await Promise.all([
          clearContentDirectory(contentDir),
          clearContentDirectory(componentsDir),
        ]);

        const navData = await fetchNavigation(apiHost, projectId, apiKey);
        const allPages = extractAllPaths(navData.docsDecoratedNav);

        await writeFaviconsManifest(srcDir, navData.favicons);

        const pagesToSync = allPages.slice(0, MAX_PAGES);

        logger.info(
          `Found ${allPages.length} pages, syncing ${pagesToSync.length}`,
        );

        for (let i = 0; i < pagesToSync.length; i += BATCH_SIZE) {
          const batch = pagesToSync.slice(i, i + BATCH_SIZE);
          await Promise.all(
            batch.map(async (page) => {
              const result = await fetchPageContent(
                page.href,
                apiHost,
                projectId,
                apiKey,
              );

              if (!result) {
                logger.warn(`Failed to fetch content for ${page.href}`);
                return;
              }

              await writePageContent({
                page,
                content: result.content,
                slug: result.slug,
                contentDir,
                componentsDir,
              });
            }),
          );
        }

        logger.info(`Synced ${pagesToSync.length} pages`);
      },
    },
  };
}
