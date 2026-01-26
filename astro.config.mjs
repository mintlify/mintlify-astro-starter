import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import { mintlify } from "./src/integrations/mintlify";

export default defineConfig({
  integrations: [
    mintlify(),
    react(),
    mdx({
      jsx: true,
    }),
  ],
});
