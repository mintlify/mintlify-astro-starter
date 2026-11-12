import { defineConfig, envField } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import { mintlify } from '@mintlify/astro';
import node from '@astrojs/node';

import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // Pages are prerendered at build time. The adapter runs the API routes in
  // src/pages/api/, which keep the assistant API key on the server.
  adapter: node({ mode: 'standalone' }),
  env: {
    schema: {
      MINTLIFY_ASSISTANT_KEY: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
      }),
    },
  },
  integrations: [mintlify({ docsDir: './docs' }), react(), mdx()],
  markdown: {
    shikiConfig: {
      theme: 'github-light-default',
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
