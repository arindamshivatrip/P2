import type { Project } from "@/types/project";

function formatSource(org?: string): string {
  if (!org) {
    return "Independent";
  }

  if (org.includes("National University of Singapore")) {
    return "NUS";
  }

  if (org.includes("University of Maryland")) {
    return "UMD";
  }

  return org;
}

export function getExperimentMetaLine(project: Project): string {
  return `${project.meta.year} · ${formatSource(project.meta.org)} · ${project.status}`;
}
