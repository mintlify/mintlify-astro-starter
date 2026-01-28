import { mkdir, rm } from "node:fs/promises";
import { existsSync } from "node:fs";

export async function clearContentDirectory(dirPath: string): Promise<void> {
  if (existsSync(dirPath)) {
    await rm(dirPath, { recursive: true });
  }
  await mkdir(dirPath, { recursive: true });
}
