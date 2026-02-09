import { useState, useEffect } from 'react';
import {
  SearchButton,
  SearchProvider,
  type SearchResult,
} from '@mintlify/components';
import { navigate } from 'astro:transitions/client';

const SUBDOMAIN = import.meta.env.PUBLIC_MINTLIFY_SUBDOMAIN;
const API_KEY = import.meta.env.PUBLIC_MINTLIFY_ASSISTANT_KEY;

const normalizePath = (path: string | undefined): string => {
  if (!path) return '/';

  let normalized = path.startsWith('/') ? path : `/${path}`;
  if (normalized.endsWith('index')) {
    normalized = normalized.replace('index', '');
  }
  console.log('Normalized path:', normalized);
  return normalized;
};

const SEARCH_HISTORY_KEY = 'mintlify-search-history';
const MAX_HISTORY_ITEMS = 5;

export function SearchBar() {
  const [mounted, setMounted] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<SearchResult[]>([]);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(SEARCH_HISTORY_KEY);
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch (err) {
      console.error('Failed to load search history:', err);
    }
  }, []);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `https://api.mintlify.com/discovery/v1/search/${SUBDOMAIN}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(API_KEY && { Authorization: `Bearer ${API_KEY}` }),
          },
          body: JSON.stringify({
            query: searchQuery,
            pageSize: 10,
            filter: {
              language: 'en',
            },
          }),
        },
      );

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      console.log('Raw search results:', data);

      const transformedResults: SearchResult[] = data.map(
        (item: any, index: number) => {
          const pathSegments = item.path
            ? item.path
                .split('/')
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
              'Untitled',
            content: item.metadata?.description || item.content || '',
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
      console.error('Search error:', err);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectResult = (result: SearchResult) => {
    navigate(result.link);

    try {
      const newHistory = [
        result,
        ...recentSearches.filter((item) => item.id !== result.id),
      ].slice(0, MAX_HISTORY_ITEMS);

      setRecentSearches(newHistory);
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
    } catch (err) {
      console.error('Failed to save search history:', err);
    }
  };

  if (!mounted) {
    return <SearchButton className="w-full rounded-xl" />;
  }

  return (
    <SearchProvider
      searchProps={{
        onSearch: handleSearch,
        results,
        isLoading,
        onSelectResult: handleSelectResult,
        recentSearches,
      }}
    >
      <SearchButton className="w-full rounded-xl" />
    </SearchProvider>
  );
}
