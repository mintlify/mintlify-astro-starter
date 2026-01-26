import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

import type {
  DecoratedPage,
  DecoratedGroup,
  DecoratedNavigationConfig,
  MdxPageResponse,
} from "./types";

export function buildFrontmatter(page: DecoratedPage): string {
  const lines: string[] = ["---"];

  if (page.title) {
    lines.push(`title: ${JSON.stringify(page.title)}`);
  }
  if (page.description) {
    lines.push(`description: ${JSON.stringify(page.description)}`);
  }
  if (page.sidebarTitle) {
    lines.push(`sidebarTitle: ${JSON.stringify(page.sidebarTitle)}`);
  }
  if (page.icon) {
    lines.push(`icon: ${JSON.stringify(page.icon)}`);
  }
  if (page.deprecated) {
    lines.push(`deprecated: true`);
  }
  if (page.lastUpdatedDate) {
    lines.push(`lastUpdatedDate: ${JSON.stringify(page.lastUpdatedDate)}`);
  }
  if (page.createdDate) {
    lines.push(`createdDate: ${JSON.stringify(page.createdDate)}`);
  }

  lines.push("---", "");
  return lines.join("\n");
}

export interface FetchPageOptions {
  page: DecoratedPage;
  apiHost: string;
  projectId: string;
  apiKey: string;
  contentDir: string;
  onError?: (href: string, status: number) => void;
}

export async function fetchAndWritePage({
  page,
  apiHost,
  projectId,
  apiKey,
  contentDir,
  onError,
}: FetchPageOptions): Promise<void> {
  const strippedHref = page.href.startsWith("/")
    ? page.href.slice(1)
    : page.href;
  const contentUrl = `${apiHost}/v1/headless/${projectId}/content/${strippedHref}`;

  const contentResponse = await fetch(contentUrl, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });

  if (!contentResponse.ok) {
    onError?.(page.href, contentResponse.status);
    return;
  }

  const contentData: MdxPageResponse = await contentResponse.json();

  let id = strippedHref || "index";
  if (id === "") id = "index";

  let filePath: string;
  if (id === "index") {
    filePath = join(contentDir, "index.mdx");
  } else {
    const parts = id.split("/");
    const fileName = parts.pop() + ".mdx";
    const dirPath = join(contentDir, ...parts);

    if (parts.length > 0) {
      await mkdir(dirPath, { recursive: true });
    }
    filePath = join(dirPath, fileName);
  }

  const frontmatter = buildFrontmatter(page);
  // Mintlify strips imports and injects React hooks via MDX scope at runtime so we don't have them :/ this is a workaround to get them back.
  // This is a hack and we should find a better solution.
  const reactImports = `import React, { useState, useEffect, useRef, useMemo, useCallback, useContext, useReducer, useLayoutEffect, useImperativeHandle, useDebugValue, useDeferredValue, useTransition, useId, useSyncExternalStore, useInsertionEffect } from 'react';\n\n`;

  await writeFile(
    filePath,
    frontmatter + reactImports + contentData.content,
    "utf-8",
  );
}

export function extractAllPathsFromGroup(
  group: DecoratedGroup,
): DecoratedPage[] {
  const pages: DecoratedPage[] = [];

  if (group.root) {
    pages.push(group.root);
  }

  for (const entry of group.pages) {
    if ("href" in entry && "title" in entry && !("group" in entry)) {
      pages.push(entry as DecoratedPage);
    } else if ("group" in entry) {
      const nestedPages = extractAllPathsFromGroup(entry as DecoratedGroup);
      pages.push(...nestedPages);
    }
  }

  return pages;
}

export function extractAllPaths(
  nav: DecoratedNavigationConfig,
): DecoratedPage[] {
  const pages: DecoratedPage[] = [];

  if (nav.pages) {
    for (const entry of nav.pages) {
      if ("href" in entry && "title" in entry && !("group" in entry)) {
        pages.push(entry as DecoratedPage);
      } else if ("group" in entry) {
        const groupPages = extractAllPathsFromGroup(entry as DecoratedGroup);
        pages.push(...groupPages);
      }
    }
  }

  if (nav.groups) {
    for (const group of nav.groups) {
      const groupPages = extractAllPathsFromGroup(group);
      pages.push(...groupPages);
    }
  }

  const divisions = [
    "tabs",
    "versions",
    "products",
    "languages",
    "dropdowns",
    "anchors",
  ] as const;

  for (const division of divisions) {
    const items = nav[division];
    if (items && Array.isArray(items)) {
      for (const item of items) {
        const nestedPages = extractAllPaths(item as DecoratedNavigationConfig);
        pages.push(...nestedPages);
      }
    }
  }

  return pages;
}
