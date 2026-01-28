import { join } from "node:path";
import { mkdir, writeFile } from "node:fs/promises";
import type { Favicons } from "../types";

export async function writeFaviconsManifest(
  srcDir: string,
  favicons: Favicons,
): Promise<void> {
  const generatedDir = join(srcDir, "generated");
  await mkdir(generatedDir, { recursive: true });

  const faviconValue = favicons;

  const content = `import type { Favicons } from "../types/mintlify";

export const favicons: Favicons = ${JSON.stringify(faviconValue, null, 2)};
`;

  const filePath = join(generatedDir, "favicons.ts");
  await writeFile(filePath, content, "utf-8");
}
