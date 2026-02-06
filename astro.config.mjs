import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import { mintlify } from "./src/integrations/mintlify";

import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  integrations: [
    mintlify({ docsDir: "./docs" }),
    react(),
    mdx(),
  ],
  vite: {
    plugins: [
      tailwindcss({
        base: './src/styles/global.css',
      })
    ],
  },
});