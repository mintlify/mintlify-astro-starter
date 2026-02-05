import type { APIRoute } from "astro";

export const prerender = false;

interface SearchRequest {
  query: string;
  pageSize?: number;
  filter?: {
    version?: string;
    language?: string;
  };
}

interface SearchResult {
  content: string;
  path: string;
  metadata?: Record<string, any>;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.text();
    if (!body) {
      return new Response(JSON.stringify({ error: "Request body is empty" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const requestData: SearchRequest = JSON.parse(body);
    const { query, pageSize = 10, filter } = requestData;

    if (!query) {
      return new Response(
        JSON.stringify({ error: "Query parameter is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const baseUrl = import.meta.env.MINTLIFY_API_BASE_URL;
    const subdomain = import.meta.env.MINTLIFY_SUBDOMAIN;
    const apiKey = import.meta.env.MINTLIFY_ASSISTANT_API_KEY;

    if (!baseUrl || !subdomain) {
      return new Response(
        JSON.stringify({ error: "Search configuration missing" }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }

    const endpoint = `${baseUrl}/discovery/v1/search/${subdomain}`;

    const requestBody: {
      query: string;
      pageSize: number;
      filter?: {
        version?: string;
        language?: string;
      };
    } = {
      query,
      pageSize,
    };

    if (filter) {
      requestBody.filter = {};
      if (filter.version) {
        requestBody.filter.version = filter.version;
      }
      if (filter.language) {
        requestBody.filter.language = filter.language;
      }
    }

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(apiKey && { Authorization: `Bearer ${apiKey}` }),
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return new Response(
        JSON.stringify({
          error: errorData.error || "Failed to search documentation",
          details: errorData.message,
        }),
        {
          status: response.status,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const results: SearchResult[] = await response.json();

    return new Response(JSON.stringify({ results }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
};
