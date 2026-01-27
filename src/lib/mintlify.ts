import { evaluate } from "@mdx-js/mdx";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import * as jsxRuntime from "react/jsx-runtime";
import { stubComponents } from "../components/mdx/stub-components";
import { createMintlifyClient } from "./mintlify-client";

interface DecoratedPage {
  title: string;
  href: string;
  icon?: string;
  description?: string;
  sidebarTitle?: string;
  openapi?: string;
  asyncapi?: string;
  public?: boolean;
  isPublic?: boolean;
  deprecated?: boolean;
  noindex?: boolean;
  lastUpdatedDate?: string;
  createdDate?: string;
}

interface DecoratedGroup {
  group: string;
  pages: (DecoratedPage | DecoratedGroup)[];
  icon?: string;
  root?: DecoratedPage;
}

type DecoratedNavigationEntry = DecoratedPage | DecoratedGroup;

interface DecoratedNavigationConfig {
  groups?: DecoratedGroup[];
  tabs?: DecoratedNavigationConfig[];
  versions?: DecoratedNavigationConfig[];
  products?: DecoratedNavigationConfig[];
  languages?: DecoratedNavigationConfig[];
  dropdowns?: DecoratedNavigationConfig[];
  anchors?: DecoratedNavigationConfig[];
  pages?: DecoratedNavigationEntry[];
  global?: unknown;
}

const API_KEY = import.meta.env.MINTLIFY_API_KEY;
const PROJECT_ID = import.meta.env.MINTLIFY_PROJECT_ID;
const BASE_URL = import.meta.env.MINTLIFY_API_BASE_URL;

if (!API_KEY || !PROJECT_ID) {
  throw new Error(
    "Missing required environment variables: MINTLIFY_API_KEY and MINTLIFY_PROJECT_ID must be set",
  );
}

const client = createMintlifyClient({
  apiKey: API_KEY,
  projectId: PROJECT_ID,
  baseUrl: BASE_URL,
});

export async function getDecoratedNavigation(): Promise<DecoratedNavigationConfig> {
  const response = await client.getNavigation();
  return response.docsDecoratedNav;
}

export interface RenderedMdxPage {
  html: string;
  metadata?: {
    title?: string;
    description?: string;
    icon?: string;
    href?: string;
  };
}

export async function getMdxPage(href: string) {
  return await client.getPageContent(href);
}

export async function getRenderedMdxPage(
  href: string,
): Promise<RenderedMdxPage> {
  const page = await getMdxPage(href);

  try {
    const { default: MDXContent } = await evaluate(page.content, {
      ...jsxRuntime,
      development: false,
    });

    const html = renderToStaticMarkup(
      createElement(MDXContent, { components: stubComponents }),
    );

    return {
      html,
      metadata: page.metadata,
    };
  } catch (error) {
    console.error(`Failed to render MDX for ${href}:`, error);
    const errorHtml = `<div style="color: red; padding: 1rem; background: #ffebee; border-radius: 8px;">
      <strong>Failed to render MDX content.</strong>
      <p>${error instanceof Error ? error.message : "Unknown error"}</p>
    </div>`;
    return {
      html: errorHtml,
      metadata: page.metadata,
    };
  }
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

function extractAllPathsFromGroup(group: DecoratedGroup): DecoratedPage[] {
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

export function hrefToSlug(href: string): string[] {
  const cleaned = href.replace(/^\//, "");
  if (cleaned === "") {
    return [];
  }
  return cleaned.split("/");
}

export type { DecoratedPage, DecoratedGroup, DecoratedNavigationConfig };
