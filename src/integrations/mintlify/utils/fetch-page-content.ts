import type { MdxPageResponse } from "../types";

export interface FetchPageContentResult {
  content: string;
  slug: string;
}

export async function fetchPageContent(
  href: string,
  apiHost: string,
  projectId: string,
  apiKey: string,
): Promise<FetchPageContentResult | null> {
  const strippedHref = href.startsWith("/") ? href.slice(1) : href;
  const contentUrl = `${apiHost}/v1/headless/${projectId}/content/${strippedHref}`;

  const response = await fetch(contentUrl, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });

  if (!response.ok) {
    return null;
  }

  const data: MdxPageResponse = await response.json();
  const slug = strippedHref || "index";

  return { content: data.content, slug };
}
