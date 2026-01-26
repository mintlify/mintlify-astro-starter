import type { AstroIntegration } from "astro";
import { mkdir, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv } from "vite";

import type { NavigationResponse } from "./types";
import { extractAllPaths, fetchAndWritePage } from "./helpers";

export type { DecoratedPage, DecoratedNavigationConfig } from "./types";

const MAX_PAGES = 25; // for testing purposes to reduce API calls
const BATCH_SIZE = 5;

export function mintlify(): AstroIntegration {
  return {
    name: "@mintlify/astro",
    hooks: {
      "astro:config:setup": async ({
        config: astroConfig,
        command,
        logger,
      }) => {
        const env = loadEnv(
          command === "dev" ? "development" : "production",
          fileURLToPath(astroConfig.root),
          "",
        );

        const apiKey = env.MINTLIFY_API_KEY;
        const apiHost = env.MINTLIFY_API_HOST;
        const projectId = env.MINTLIFY_PROJECT_ID;

        if (!projectId) {
          throw new Error(
            "[@mintlify/astro]: Missing MINTLIFY_PROJECT_ID environment variable.",
          );
        }

        if (!apiKey) {
          throw new Error(
            "[@mintlify/astro]: Missing MINTLIFY_API_KEY environment variable.",
          );
        }

        const contentDir = join(
          fileURLToPath(astroConfig.srcDir),
          "content",
          "docs",
        );

        if (existsSync(contentDir)) {
          await rm(contentDir, { recursive: true });
        }
        await mkdir(contentDir, { recursive: true });

        const navUrl = `${apiHost}/v1/headless/${projectId}/navigation`;
        const navResponse = await fetch(navUrl, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });

        if (!navResponse.ok) {
          if (navResponse.status === 401) {
            throw new Error(
              "[@mintlify/astro]: Invalid API key. Check your MINTLIFY_API_KEY.",
            );
          }
          if (navResponse.status === 404) {
            throw new Error(
              `[@mintlify/astro]: Project not found: "${projectId}". Check your projectId.`,
            );
          }
          throw new Error(
            `[@mintlify/astro]: Failed to fetch navigation (${navResponse.status}): ${navResponse.statusText}`,
          );
        }

        const navData: NavigationResponse = await navResponse.json();
        const allPages = extractAllPaths(navData.docsDecoratedNav);
        const pagesToSync = allPages.slice(0, MAX_PAGES);

        logger.info(
          `Found ${allPages.length} pages, syncing ${pagesToSync.length}`,
        );

        for (let i = 0; i < pagesToSync.length; i += BATCH_SIZE) {
          const batch = pagesToSync.slice(i, i + BATCH_SIZE);
          await Promise.all(
            batch.map((page) =>
              fetchAndWritePage({
                page,
                apiHost,
                projectId,
                apiKey,
                contentDir,
                onError: (href, status) => {
                  logger.warn(`Failed to fetch content for ${href}: ${status}`);
                },
              }),
            ),
          );
        }

        logger.info(`Synced ${pagesToSync.length} pages`);
      },
    },
  };
}
