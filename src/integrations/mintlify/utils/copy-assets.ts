import { cp, access, stat } from "node:fs/promises";
import { join } from "node:path";

/**
 * Copy static assets (images, etc.) from docs folder to public folder.
 */
export async function copyAssets(
  docsDir: string,
  publicDir: string,
): Promise<void> {
  // Copy images folder
  const sourceImages = join(docsDir, "images");
  const destImages = join(publicDir, "images");

  try {
    await access(sourceImages);
    const stats = await stat(sourceImages);
    if (stats.isDirectory()) {
      await cp(sourceImages, destImages, { recursive: true });
    }
  } catch {
    // No images folder, that's fine
  }

  // Copy logo folder
  const sourceLogo = join(docsDir, "logo");
  const destLogo = join(publicDir, "logo");

  try {
    await access(sourceLogo);
    const stats = await stat(sourceLogo);
    if (stats.isDirectory()) {
      await cp(sourceLogo, destLogo, { recursive: true });
    }
  } catch {
    // No logo folder, that's fine
  }

  // Copy favicon if it exists
  const sourceFavicon = join(docsDir, "favicon.svg");
  const destFavicon = join(publicDir, "favicon.svg");

  try {
    await access(sourceFavicon);
    await cp(sourceFavicon, destFavicon);
  } catch {
    // No favicon, that's fine
  }

  // Also try .ico favicon
  const sourceFaviconIco = join(docsDir, "favicon.ico");
  const destFaviconIco = join(publicDir, "favicon.ico");

  try {
    await access(sourceFaviconIco);
    await cp(sourceFaviconIco, destFaviconIco);
  } catch {
    // No favicon.ico, that's fine
  }
}
