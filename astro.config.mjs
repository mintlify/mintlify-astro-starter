// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  integrations: [react()], // only needed for stub-components.tsx can be removed when we move to oss components
});
