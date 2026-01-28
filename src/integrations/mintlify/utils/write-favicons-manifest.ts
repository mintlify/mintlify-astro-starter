import { join } from "node:path";
import { mkdir, writeFile } from "node:fs/promises";
import type { Favicons } from "../types";

export async function writeFaviconsManifest(
  publicDir: string,
  favicons: Favicons | null,
): Promise<void> {
  if (!favicons) return;

  const faviconDir = join(publicDir, "favicons");
  await mkdir(faviconDir, { recursive: true });

  const manifestPath = join(faviconDir, "manifest.json");
  await writeFile(manifestPath, JSON.stringify(favicons, null, 2), "utf-8");
}
