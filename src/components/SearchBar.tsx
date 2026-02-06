import { useState, useEffect } from "react";
import {
  SearchButton,
  SearchProvider,
  type SearchResult,
} from "@mintlify/components";
import { navigate } from "astro:transitions/client";
import { fetchSearchResults } from "../lib/search-utils";

const SUBDOMAIN = import.meta.env.PUBLIC_MINTLIFY_SUBDOMAIN;
const API_KEY = import.meta.env.PUBLIC_MINTLIFY_ASSISTANT_KEY;
const MAX_RECENT_SEARCHES = 5;
const RECENT_SEARCHES_KEY = "mintlify-recent-searches";

export function SearchBar() {
  const [mounted, setMounted] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<SearchResult[]>([]);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse recent searches", e);
      }
    }
  }, []);

  const saveRecentSearch = (result: SearchResult) => {
    setRecentSearches((prev) => {
      const updated = [
        result,
        ...prev.filter((q) => q.id !== result.id),
      ].slice(0, MAX_RECENT_SEARCHES);

      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);

    try {
      const transformedResults = await fetchSearchResults(
        SUBDOMAIN,
        query,
        API_KEY,
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
    saveRecentSearch(result);
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
        recentSearches: recentSearches,
        placeholder: "Search...",
        position: "top",
      }}
    >
      <SearchButton className="min-w-84 rounded-xl" />
    </SearchProvider>
  );
}
