import { cp, stat } from 'node:fs/promises';
import { join } from 'node:path';

async function exists(path: string): Promise<boolean> {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

async function isDirectory(path: string): Promise<boolean> {
  try {
    const stats = await stat(path);
    return stats.isDirectory();
  } catch {
    return false;
  }
}

async function copyDirectoryIfExists(
  source: string,
  dest: string,
): Promise<void> {
  if (!(await isDirectory(source))) return;
  await cp(source, dest, { recursive: true });
}

async function copyFileIfExists(source: string, dest: string): Promise<void> {
  if (!(await exists(source))) return;
  await cp(source, dest);
}

export async function copyAssets(
  docsDir: string,
  publicDir: string,
): Promise<void> {
  await copyDirectoryIfExists(
    join(docsDir, 'images'),
    join(publicDir, 'images'),
  );

  await copyDirectoryIfExists(join(docsDir, 'logo'), join(publicDir, 'logo'));

  await copyFileIfExists(
    join(docsDir, 'favicon.svg'),
    join(publicDir, 'favicon.svg'),
  );

  await copyFileIfExists(
    join(docsDir, 'favicon.ico'),
    join(publicDir, 'favicon.ico'),
  );
}
