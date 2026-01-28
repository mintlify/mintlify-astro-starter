import { join } from "node:path";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import type { Favicons } from "../types";

export async function getCachePath(cacheDir: string): Promise<string> {
  return join(cacheDir, "favicons.json");
}

export async function cacheFavicons(
  cacheDir: string,
  favicons: Favicons | null,
): Promise<void> {
  const cachePath = join(cacheDir, "favicons.json");
  await mkdir(cacheDir, { recursive: true });
  await writeFile(cachePath, JSON.stringify(favicons, null, 2), "utf-8");
}

export async function loadCachedFavicons(
  cacheDir: string,
): Promise<Favicons | null | undefined> {
  const cachePath = join(cacheDir, "favicons.json");
  try {
    const cached = await readFile(cachePath, "utf-8");
    return JSON.parse(cached);
  } catch {
    return undefined; // Cache miss
  }
}
