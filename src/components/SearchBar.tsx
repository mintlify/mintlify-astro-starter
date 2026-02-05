import { useState, useRef, useEffect } from "react";
import type { SearchResult } from "../lib/mintlify";

const SUBDOMAIN = import.meta.env.PUBLIC_MINTLIFY_SUBDOMAIN;
const API_KEY = import.meta.env.PUBLIC_MINTLIFY_API_KEY;

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim()) {
      return;
    }

    setLoading(true);
    setError(null);
    setIsOpen(true);

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
              language: "en", // TODO: make dynamic based on user preference
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Search failed");
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={searchRef} className="relative w-full">
      <form onSubmit={handleSearch} className="flex">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder="Search documentation..."
          disabled={loading}
          className="flex-1 px-4 py-3 border border-black border-r-0 text-sm outline-none focus:ring-2 focus:ring-black/20 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="px-6 py-3 bg-black text-white border border-black text-sm font-medium whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-800 transition-colors"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {isOpen && (error || results.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-black max-h-96 overflow-y-auto z-[1000] shadow-lg">
          {error && (
            <div className="p-4 text-red-600 text-sm border-b border-gray-200">
              Error: {error}
            </div>
          )}

          {results.length > 0 && (
            <div>
              {results.map((result, index) => (
                <a
                  key={index}
                  href={result.path}
                  onClick={() => setIsOpen(false)}
                  className="block p-4 border-b border-gray-200 last:border-0 hover:bg-gray-100 transition-colors no-underline text-inherit"
                >
                  <div className="font-semibold mb-1 text-sm">
                    {result.path}
                  </div>
                  <div className="text-xs text-gray-600 leading-relaxed">
                    {result.content.substring(0, 150)}
                    {result.content.length > 150 ? "..." : ""}
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
