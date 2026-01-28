import type { DecoratedPage } from "../types";

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
