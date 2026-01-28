import { join } from "node:path";
import { mkdir, writeFile } from "node:fs/promises";
import type { Favicons } from "../types";

export async function writeFaviconsManifest(
  srcDir: string,
  favicons: Favicons,
): Promise<void> {
  const generatedDir = join(srcDir, "content/generated");
  await mkdir(generatedDir, { recursive: true });

  const filePath = join(generatedDir, "favicons.json");
  await writeFile(filePath, JSON.stringify(favicons, null, 2));
}
