// Mintlify API client for fetching decorated navigation

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

interface NavigationResponse {
  docsDecoratedNav: DecoratedNavigationConfig;
}

const API_KEY = import.meta.env.MINTLIFY_API_KEY;
const PROJECT_ID = import.meta.env.MINTLIFY_PROJECT_ID;
const BASE_URL = import.meta.env.MINTLIFY_BASE_URL || 'http://localhost:5000/';

export async function getDecoratedNavigation(): Promise<DecoratedNavigationConfig> {
  const url = `${BASE_URL}api/external/v1/project/${PROJECT_ID}/navigation`;

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch navigation: ${response.status} ${response.statusText}`);
  }

  const data: NavigationResponse = await response.json();
  return data.docsDecoratedNav;
}

// Recursively extract all page paths from the decorated navigation
export function extractAllPaths(nav: DecoratedNavigationConfig): DecoratedPage[] {
  const pages: DecoratedPage[] = [];

  // Handle direct pages array
  if (nav.pages) {
    for (const entry of nav.pages) {
      if ('href' in entry && 'title' in entry && !('group' in entry)) {
        pages.push(entry as DecoratedPage);
      } else if ('group' in entry) {
        // It's a group, recurse into it
        const groupPages = extractAllPathsFromGroup(entry as DecoratedGroup);
        pages.push(...groupPages);
      }
    }
  }

  // Handle groups array
  if (nav.groups) {
    for (const group of nav.groups) {
      const groupPages = extractAllPathsFromGroup(group);
      pages.push(...groupPages);
    }
  }

  // Handle divisions (tabs, versions, products, languages, dropdowns, anchors)
  const divisions = ['tabs', 'versions', 'products', 'languages', 'dropdowns', 'anchors'] as const;
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

  // Add root page if it exists
  if (group.root) {
    pages.push(group.root);
  }

  // Process pages in the group
  for (const entry of group.pages) {
    if ('href' in entry && 'title' in entry && !('group' in entry)) {
      pages.push(entry as DecoratedPage);
    } else if ('group' in entry) {
      // Nested group
      const nestedPages = extractAllPathsFromGroup(entry as DecoratedGroup);
      pages.push(...nestedPages);
    }
  }

  return pages;
}

// Convert href to slug array for Astro's [...slug] route
export function hrefToSlug(href: string): string[] {
  // Remove leading slash and split
  const cleaned = href.replace(/^\//, '');
  if (cleaned === '') {
    return [];
  }
  return cleaned.split('/');
}

export type { DecoratedPage, DecoratedGroup, DecoratedNavigationConfig };
