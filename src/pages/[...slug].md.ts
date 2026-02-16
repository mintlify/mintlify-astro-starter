import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import fs from 'node:fs/promises';
import path from 'node:path';

export async function getStaticPaths() {
  const docs = await getCollection('docs');

  const paths = docs.flatMap((doc) => {
    if (doc.id === 'index') {
      return [
        {
          params: { slug: undefined },
          props: { doc },
        },
        {
          params: { slug: 'index' },
          props: { doc },
        },
      ];
    }
    return {
      params: { slug: doc.id },
      props: { doc },
    };
  });

  return paths;
}

export const GET: APIRoute = async ({ props }) => {
  const { doc } = props as { doc: any };

  try {
    const filePath = path.join(process.cwd(), 'docs', `${doc.id}.mdx`);

    let content: string;
    try {
      content = await fs.readFile(filePath, 'utf-8');
    } catch {
      const mdPath = path.join(process.cwd(), 'docs', `${doc.id}.md`);
      content = await fs.readFile(mdPath, 'utf-8');
    }

    return new Response(content, {
      status: 200,
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error reading markdown file:', error);
    return new Response('Markdown file not found', {
      status: 404,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }
};
