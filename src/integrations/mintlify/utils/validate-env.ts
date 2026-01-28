import { fileURLToPath } from "node:url";
import { loadEnv } from "vite";
import type { AstroConfig } from "astro";

export interface MintlifyEnv {
  apiKey: string;
  apiHost: string;
  projectId: string;
}

export function validateEnv(astroConfig: AstroConfig): MintlifyEnv {
  const env = loadEnv("", fileURLToPath(astroConfig.root), "");

  const { MINTLIFY_API_KEY, MINTLIFY_API_BASE_URL, MINTLIFY_PROJECT_ID } = env;

  if (!MINTLIFY_PROJECT_ID) {
    throw new Error(
      "[@mintlify/astro]: Missing MINTLIFY_PROJECT_ID environment variable.",
    );
  }

  if (!MINTLIFY_API_KEY) {
    throw new Error(
      "[@mintlify/astro]: Missing MINTLIFY_API_KEY environment variable.",
    );
  }

  if (!MINTLIFY_API_BASE_URL) {
    throw new Error(
      "[@mintlify/astro]: Missing MINTLIFY_API_BASE_URL environment variable.",
    );
  }

  return {
    apiKey: MINTLIFY_API_KEY,
    apiHost: MINTLIFY_API_BASE_URL,
    projectId: MINTLIFY_PROJECT_ID,
  };
}
