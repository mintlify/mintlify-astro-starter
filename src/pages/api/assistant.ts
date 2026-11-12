import type { APIRoute } from 'astro';
import { MINTLIFY_ASSISTANT_KEY } from 'astro:env/server';

// Runs on the server for every request so the assistant API key never
// reaches the browser.
export const prerender = false;

const SUBDOMAIN = import.meta.env.PUBLIC_MINTLIFY_SUBDOMAIN;

// Response headers the assistant UI needs: the stream format and the thread
// identifiers it stores to continue a conversation.
const PASSTHROUGH_HEADERS = [
  'content-type',
  'x-vercel-ai-ui-message-stream',
  'x-thread-id',
  'x-thread-key',
  'x-message-id',
];

export const POST: APIRoute = async ({ request }) => {
  if (!MINTLIFY_ASSISTANT_KEY) {
    return Response.json(
      { error: 'MINTLIFY_ASSISTANT_KEY is not set' },
      { status: 500 },
    );
  }

  let body: { messages?: unknown; threadId?: unknown; threadKey?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!Array.isArray(body.messages)) {
    return Response.json({ error: 'Missing messages' }, { status: 400 });
  }

  // Build the upstream body here instead of forwarding the client's body, so
  // callers can't change retrieval settings or filters such as `groups`.
  const upstream = await fetch(
    `https://api.mintlify.com/discovery/v2/assistant/${SUBDOMAIN}/message`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${MINTLIFY_ASSISTANT_KEY}`,
      },
      body: JSON.stringify({
        messages: body.messages,
        fp: 'anonymous',
        retrievalPageSize: 5,
        context: [],
        ...(typeof body.threadId === 'string' && { threadId: body.threadId }),
        ...(typeof body.threadKey === 'string' && {
          threadKey: body.threadKey,
        }),
      }),
      signal: request.signal,
    },
  );

  const headers = new Headers();
  for (const name of PASSTHROUGH_HEADERS) {
    const value = upstream.headers.get(name);
    if (value) headers.set(name, value);
  }

  // Stream the response back unchanged.
  return new Response(upstream.body, { status: upstream.status, headers });
};
