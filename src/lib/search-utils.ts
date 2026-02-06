import type { SearchResult } from "@mintlify/components";

interface SearchAPIResponse {
  content: string;
  path: string;
  metadata: {
    title?: string;
    description?: string;
    [key: string]: unknown;
  };
}

export const normalizePath = (path: string | undefined): string => {
  if (!path) return "/";

  let normalized = path.startsWith("/") ? path : `/${path}`;
  if (normalized.endsWith("/index")) {
    normalized = normalized.slice(0, -5) + "/";
  }
  return normalized;
};

export const transformSearchResults = (
  data: SearchAPIResponse[],
): SearchResult[] => {
  return data.map((item, index) => {
    // Create breadcrumb array from path and capitalize first letter of each segment
    const pathSegments = item.path
      ? item.path
          .split("/")
          .map(
            (segment: string) =>
              segment.charAt(0).toUpperCase() + segment.slice(1),
          )
      : [];

    return {
      id: item.path || `result-${index}`,
      header:
        item.metadata?.title ||
        pathSegments[pathSegments.length - 1] ||
        "Untitled",
      content: item.metadata?.description || item.content || "",
      link: normalizePath(item.path),
      metadata: {
        ...item.metadata,
        breadcrumbs: pathSegments,
      },
    };
  });
};

export const fetchSearchResults = async (
  subdomain: string,
  query: string,
  apiKey?: string,
): Promise<SearchResult[]> => {
  const response = await fetch(
    `https://api.mintlify.com/discovery/v1/search/${subdomain}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(apiKey && { Authorization: `Bearer ${apiKey}` }),
      },
      body: JSON.stringify({
        query,
        pageSize: 10,
        filter: {
          language: "en",
        },
      }),
    },
  );

  if (!response.ok) {
    throw new Error("Search failed");
  }

  const data = await response.json();
  return transformSearchResults(data);
};
