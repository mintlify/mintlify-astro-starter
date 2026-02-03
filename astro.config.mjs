import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import { mintlify } from "./src/integrations/mintlify";
import { fileURLToPath } from "node:url";
import { resolve, dirname } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  integrations: [mintlify({ docsDir: "./docs" }), react(), mdx()],
  vite: {
    resolve: {
      alias: {
        "/snippets": resolve(__dirname, "./src/content/snippets"),
      },
    },
  },
});
