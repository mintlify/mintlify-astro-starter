import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import tailwind from "@astrojs/tailwind";
import { mintlify } from "./src/integrations/mintlify";

export default defineConfig({
  integrations: [
    mintlify({ docsDir: "./docs" }),
    react(),
    mdx(),
    tailwind({
      applyBaseStyles: true,
      nesting: true,
      configFile: './tailwind.config.mjs',
    }),
  ],
  vite: {
    css: {
      postcss: './postcss.config.cjs',
      preprocessorOptions: {
        css: {
          charset: false,
        },
      },
    },
    ssr: {
      noExternal: ['@mintlify/components'],
    },
  },
});
