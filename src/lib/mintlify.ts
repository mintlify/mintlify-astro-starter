import { evaluate } from "@mdx-js/mdx";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import * as jsxRuntime from "react/jsx-runtime";
import { createClient, type DecoratedNavigationConfig } from "@mintlify/headless-sdk";
import { components as mintlifyComponents } from "../components/index.js";

const API_KEY = import.meta.env.MINTLIFY_API_KEY;
const PROJECT_ID = import.meta.env.MINTLIFY_PROJECT_ID;
const BASE_URL = import.meta.env.MINTLIFY_API_BASE_URL;

if (!API_KEY || !PROJECT_ID) {
  throw new Error(
    "Missing required environment variables: MINTLIFY_API_KEY and MINTLIFY_PROJECT_ID must be set",
  );
}

const client = createClient({
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
      createElement(MDXContent, { components: mintlifyComponents }),
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

export function extractAllPaths(nav: DecoratedNavigationConfig) {
  const pages: Array<{ href: string; title: string }> = [];

  if (nav.pages) {
    for (const entry of nav.pages) {
      if ("href" in entry && "title" in entry && !("group" in entry)) {
        pages.push(entry);
      } else if ("group" in entry) {
        pages.push(...extractAllPathsFromGroup(entry));
      }
    }
  }

  if (nav.groups) {
    for (const group of nav.groups) {
      pages.push(...extractAllPathsFromGroup(group));
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
        pages.push(...extractAllPaths(item as DecoratedNavigationConfig));
      }
    }
  }

  return pages;
}

function extractAllPathsFromGroup(group: any) {
  const pages: Array<{ href: string; title: string }> = [];

  if (group.root) {
    pages.push(group.root);
  }

  for (const entry of group.pages) {
    if ("href" in entry && "title" in entry && !("group" in entry)) {
      pages.push(entry);
    } else if ("group" in entry) {
      pages.push(...extractAllPathsFromGroup(entry));
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

export interface SearchOptions {
  query: string;
  pageSize?: number;
  filter?: {
    version?: string;
    language?: string;
  };
}

export interface SearchResult {
  content: string;
  path: string;
  metadata?: Record<string, any>;
}

export async function searchDocumentation(
  options: SearchOptions
): Promise<SearchResult[]> {
  const response = await fetch("/api/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(options),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Search failed");
  }

  const data = await response.json();
  return data.results;
}

export type { DecoratedNavigationConfig };
