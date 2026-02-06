import { divisions, type NavigationConfig } from '@mintlify/validation';

export interface NavPage {
  href: string;
  title: string;
  icon?: string;
  tag?: string;
  api?: string;
  deprecated?: boolean;
}

export interface NavGroup {
  group: string;
  pages: NavEntry[];
  icon?: string;
  tag?: string;
}

export type NavEntry = NavPage | NavGroup;
export type NavNode = Record<string, unknown>;

export interface TabInfo {
  name: string;
  href: string;
  isActive: boolean;
}

export function isNavPage(entry: NavEntry): entry is NavPage {
  return 'href' in entry && 'title' in entry;
}

export function isNavGroup(entry: NavEntry): entry is NavGroup {
  return 'group' in entry && 'pages' in entry;
}

export function decorateNavigation(
  nav: NavigationConfig,
  titleMap: Record<string, string>,
): NavNode {
  return decorateNavNode(nav as NavNode, titleMap);
}

function decorateNavNode(
  nav: NavNode,
  titleMap: Record<string, string>,
): NavNode {
  const result: NavNode = { ...nav };

  const pages = result.pages;
  if (Array.isArray(pages) && !result.group) {
    result.pages = pages.map((p: unknown) => decorateEntry(p, titleMap));
  }

  const groups = result.groups;
  if (Array.isArray(groups)) {
    result.groups = groups.map((g: unknown) => decorateEntry(g, titleMap));
  }

  for (const key of divisions) {
    const division = result[key];
    if (Array.isArray(division)) {
      result[key] = division.map((item: unknown) =>
        decorateNavNode(item as NavNode, titleMap),
      );
    }
  }

  return result;
}

function decorateEntry(
  entry: unknown,
  titleMap: Record<string, string>,
): NavEntry | NavNode {
  if (typeof entry === 'string') {
    return {
      href: entry === 'index' ? '/' : `/${entry}`,
      title: titleMap[entry] ?? slugToTitle(entry),
    };
  }
  if (typeof entry === 'object' && entry !== null) {
    const node = entry as NavNode;
    const pages = node.pages;
    if (node.group != null && Array.isArray(pages)) {
      return {
        ...node,
        pages: pages.map((page: unknown) => decorateEntry(page, titleMap)),
      };
    }
  }
  return entry as NavNode;
}

function slugToTitle(slug: string): string {
  const last = slug.split('/').pop() ?? slug;
  return last
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function unwrapNav(nav: NavNode, currentPath: string): NavEntry[] {
  const groups = nav.groups;
  if (Array.isArray(groups)) return groups as NavEntry[];

  const pages = nav.pages;
  if (Array.isArray(pages) && !nav.group) return pages as NavEntry[];

  for (const key of divisions) {
    const divisionArr = nav[key];
    if (!Array.isArray(divisionArr)) continue;

    for (const division of divisionArr) {
      const entries = unwrapNav(division as NavNode, currentPath);
      if (entries.length > 0 && containsPath(entries, currentPath))
        return entries;
    }

    if (divisionArr.length > 0) {
      return unwrapNav(divisionArr[0] as NavNode, currentPath);
    }
  }

  return [];
}

export function containsPath(entries: NavEntry[], path: string): boolean {
  return entries.some((entry) =>
    isNavPage(entry)
      ? entry.href === path
      : isNavGroup(entry) && containsPath(entry.pages, path),
  );
}

export function getTabsFromNav(
  nav: NavNode,
  currentPath: string,
): TabInfo[] | null {
  const tabs = nav.tabs;
  if (!Array.isArray(tabs)) return null;

  return tabs.map((tab: unknown) => {
    const tabNode = tab as NavNode;
    const entries = unwrapNav(tabNode, currentPath);
    return {
      name: (tabNode.tab as string) ?? '',
      href: findFirstPage(entries)?.href ?? '/',
      isActive: containsPath(entries, currentPath),
    };
  });
}

function findFirstPage(entries: NavEntry[]): NavPage | undefined {
  for (const entry of entries) {
    if (isNavPage(entry)) return entry;
    if (isNavGroup(entry)) {
      const page = findFirstPage(entry.pages);
      if (page) return page;
    }
  }
  return undefined;
}

export function getFooterPages(entries: NavEntry[], currentPath: string) {
  const pages = (function flatten(e: NavEntry[]): NavPage[] {
    return e.flatMap((x) => (isNavGroup(x) ? flatten(x.pages) : [x]));
  })(entries);
  const idx = pages.findIndex((p) => p.href === currentPath);
  return {
    prev: idx > 0 ? pages[idx - 1] : null,
    next: idx < pages.length - 1 ? pages[idx + 1] : null,
  };
}

export function findGroupForPath(
  entries: NavEntry[],
  path: string,
): string | null {
  for (const entry of entries) {
    if (isNavGroup(entry)) {
      for (const page of entry.pages) {
        if (isNavPage(page) && page.href === path) {
          return entry.group;
        }
        if (isNavGroup(page)) {
          const nested = findGroupForPath([page], path);
          if (nested) return nested;
        }
      }
    }
  }
  return null;
}
