import { join } from "node:path";
import { mkdir, writeFile } from "node:fs/promises";
import type { Favicons } from "../types";

async function downloadFavicon(url: string, outputPath: string): Promise<void> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download favicon: ${url}`);
  }
  const buffer = await response.arrayBuffer();
  await writeFile(outputPath, Buffer.from(buffer));
}

async function downloadAndLocalizeHref(
  href: string,
  publicDir: string,
  index: number,
): Promise<string> {
  const url = new URL(href);
  const ext = url.pathname.split(".").pop() || "png";

  const filename = `favicon-${index}.${ext}`;
  const localPath = join(publicDir, "favicons", filename);

  await downloadFavicon(href, localPath);

  return `/favicons/${filename}`;
}

export async function downloadFavicons(
  favicons: Favicons | null,
  publicDir: string,
  logger: any,
): Promise<Favicons | null> {
  if (!favicons?.icons) return null;

  const faviconDir = join(publicDir, "favicons");
  await mkdir(faviconDir, { recursive: true });

  logger.info(`Downloading ${favicons.icons.length} favicon(s)...`);

  const localizedIcons = await Promise.all(
    favicons.icons.map(async (icon, index) => {
      const localHref = await downloadAndLocalizeHref(
        icon.href,
        publicDir,
        index,
      );
      return { ...icon, href: localHref };
    }),
  );

  return {
    ...favicons,
    icons: localizedIcons,
  };
}
