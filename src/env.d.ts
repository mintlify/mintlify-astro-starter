/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly MINTLIFY_ASSISTANT_API_KEY?: string;
  readonly MINTLIFY_SUBDOMAIN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
