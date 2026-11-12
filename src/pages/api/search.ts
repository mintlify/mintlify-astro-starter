import type { APIRoute } from 'astro';
import { MINTLIFY_ASSISTANT_KEY } from 'astro:env/server';

// Runs on the server for every request so the assistant API key never
// reaches the browser.
export const prerender = false;

const SUBDOMAIN = import.meta.env.PUBLIC_MINTLIFY_SUBDOMAIN;
const MAX_QUERY_LENGTH = 500;

export const POST: APIRoute = async ({ request }) => {
  if (!MINTLIFY_ASSISTANT_KEY) {
    return Response.json(
      { error: 'MINTLIFY_ASSISTANT_KEY is not set' },
      { status: 500 },
    );
  }

  let query: unknown;
  try {
    ({ query } = await request.json());
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (typeof query !== 'string' || !query.trim()) {
    return Response.json({ error: 'Missing query' }, { status: 400 });
  }

  // Build the upstream body here instead of forwarding the client's body, so
  // callers can't change filters such as `groups`.
  const upstream = await fetch(
    `https://api.mintlify.com/discovery/v1/search/${SUBDOMAIN}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${MINTLIFY_ASSISTANT_KEY}`,
      },
      body: JSON.stringify({
        query: query.slice(0, MAX_QUERY_LENGTH),
        pageSize: 10,
        filter: {
          language: 'en',
        },
      }),
    },
  );

  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      'Content-Type':
        upstream.headers.get('content-type') ?? 'application/json',
    },
  });
};
