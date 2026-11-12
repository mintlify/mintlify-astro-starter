/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_MINTLIFY_SUBDOMAIN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
