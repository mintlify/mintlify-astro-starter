import type { Favicons } from '@mintlify/astro';

type FaviconConfig = {
  light?: string;
  dark?: string;
};

type DocsConfigWithFavicon = {
  favicon?: string | FaviconConfig;
};

export function getFaviconsFromDocsConfig(
  docsConfig: DocsConfigWithFavicon,
): Favicons | undefined {
  const faviconConfig = docsConfig.favicon;
  const faviconHref =
    typeof faviconConfig === 'string'
      ? faviconConfig
      : (faviconConfig?.light ?? faviconConfig?.dark);

  if (!faviconHref) {
    return undefined;
  }

  return {
    icons: [
      {
        rel: 'icon',
        type: 'image/svg+xml',
        href: faviconHref,
      },
    ],
  };
}
