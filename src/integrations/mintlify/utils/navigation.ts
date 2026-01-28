import type {
  DecoratedPage,
  DecoratedGroup,
  DecoratedNavigationConfig,
} from "../types";

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
