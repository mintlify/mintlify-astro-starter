export type { DocsConfig, NavigationConfig } from "@mintlify/validation";

export interface FaviconIcon {
  rel: string;
  sizes?: string;
  type: string;
  href: string;
  media?: string;
}

export interface Favicons {
  icons: FaviconIcon[];
  browserconfig?: string;
}
