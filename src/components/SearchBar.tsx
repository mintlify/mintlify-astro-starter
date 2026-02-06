import { useState, useEffect } from "react";
import {
  SearchButton,
  SearchProvider,
  type SearchResult,
} from "@mintlify/components";
import { navigate } from "astro:transitions/client";

const SUBDOMAIN = import.meta.env.PUBLIC_MINTLIFY_SUBDOMAIN;
const API_KEY = import.meta.env.PUBLIC_MINTLIFY_ASSISTANT_KEY;

const normalizePath = (path: string | undefined): string => {
  if (!path) return "/";

  let normalized = path.startsWith("/") ? path : `/${path}`;
  if (normalized.endsWith("/index")) {
    normalized = normalized.slice(0, -5) + "/";
  }
  return normalized;
};

export function SearchBar() {
  const [mounted, setMounted] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `https://api.mintlify.com/discovery/v1/search/${SUBDOMAIN}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(API_KEY && { Authorization: `Bearer ${API_KEY}` }),
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

      const transformedResults: SearchResult[] = data.map(
        (item: any, index: number) => {
          // Create breadcrumb array from path and capitalize first letter of each segment
          const pathSegments = item.path
            ? item.path.split("/").map((segment: string) =>
                segment.charAt(0).toUpperCase() + segment.slice(1)
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
        },
      );

      setResults(transformedResults);
    } catch (err) {
      console.error("Search error:", err);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectResult = (result: SearchResult) => {
    navigate(result.link);
  };

  if (!mounted) {
    return <SearchButton className="min-w-84 rounded-xl" />;
  }

  return (
    <SearchProvider
      searchProps={{
        onSearch: handleSearch,
        results,
        isLoading,
        onSelectResult: handleSelectResult,
        placeholder: "Search...",
        position: "top",
      }}
    >
      <SearchButton className="min-w-84 rounded-xl" />
    </SearchProvider>
  );
}
