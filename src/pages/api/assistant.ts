import type { APIRoute } from "astro";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.text();
    if (!body) {
      return new Response(JSON.stringify({ error: "Request body is empty" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const requestData = JSON.parse(body);
    const { messages, fp, retrievalPageSize, context, threadId } = requestData;

    const baseUrl = import.meta.env.MINTLIFY_API_BASE_URL;
    const subdomain = import.meta.env.MINTLIFY_SUBDOMAIN;
    const apiKey = import.meta.env.MINTLIFY_ASSISTANT_API_KEY;

    console.log('Environment variables:', { baseUrl, subdomain, apiKey: apiKey ? 'SET' : 'NOT SET' });

    if (!baseUrl || !subdomain) {
      return new Response(
        JSON.stringify({ error: "Assistant configuration missing" }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }

    const endpoint = `${baseUrl}/api/discovery/v2/assistant/${subdomain}/message`;
    console.log('Calling endpoint:', endpoint);

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(apiKey && { Authorization: `Bearer ${apiKey}` }),
      },
      body: JSON.stringify({
        messages,
        fp: fp || "anonymous",
        retrievalPageSize: retrievalPageSize || 5,
        context: context || [],
        ...(threadId && { threadId }),
      }),
    });

    // Check if the response is streaming
    const contentType = response.headers.get("content-type");

    if (
      contentType?.includes("text/event-stream") ||
      contentType?.includes("application/x-ndjson")
    ) {
      // Stream the response back and forward thread ID
      const responseThreadId = response.headers.get("x-thread-id");
      return new Response(response.body, {
        status: response.status,
        headers: {
          "Content-Type": contentType,
          "Transfer-Encoding": "chunked",
          "Access-Control-Expose-Headers": "x-thread-id",
          ...(responseThreadId && { "x-thread-id": responseThreadId }),
        },
      });
    }

    const data = await response.json();

    if (!response.ok) {
      console.error('Mintlify API error:', response.status, data);
      return new Response(
        JSON.stringify({
          error: data.error || "Failed to get response from assistant",
          details: data,
        }),
        {
          status: response.status,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const responseThreadId = response.headers.get("x-thread-id");
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Expose-Headers": "x-thread-id",
        ...(responseThreadId && { "x-thread-id": responseThreadId }),
      },
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
