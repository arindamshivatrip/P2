import { access } from "node:fs/promises";
import path from "node:path";
import type { Project } from "@/types/project";

const publicRoot = path.join(process.cwd(), "public");

function normalizePublicAssetPath(assetPath: string): string {
  return assetPath.replace(/\\/g, "/").replace(/^\/+/, "");
}

async function publicAssetExists(assetPath: string | undefined): Promise<boolean> {
  if (!assetPath) {
    return false;
  }

  const normalized = normalizePublicAssetPath(assetPath);
  const filePath = path.join(publicRoot, normalized);

  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function getProjectAssetAvailability(project: Project) {
  return {
    thumbnail: await publicAssetExists(project.thumbnail),
    coverImage: await publicAssetExists(project.coverImage),
    pdfEmbed: await publicAssetExists(project.pdf?.embedUrl),
    pdfDownload: await publicAssetExists(project.pdf?.downloadUrl),
    video: await publicAssetExists(project.video?.src),
    videoPoster: await publicAssetExists(project.video?.poster)
  };
}
