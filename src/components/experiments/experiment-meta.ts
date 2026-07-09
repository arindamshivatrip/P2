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
  // status lives on the stamp now — keep the meta line to provenance
  return `${project.meta.year} · ${formatSource(project.meta.org)}`;
}

// Honest lab vocabulary, derived from data — never hand-assigned per tile.
export function getExperimentStamp(project: Project): string {
  if (project.entryType === "hackathon") {
    return "game jam";
  }
  if (project.entryType === "course") {
    return "class project";
  }
  if (project.status === "In Progress") {
    return "in progress";
  }
  if (project.status === "Prototype") {
    return "prototype";
  }
  if (project.status === "Shipped" || project.status === "Live") {
    return "shipped";
  }
  if (project.status === "Completed") {
    return "finished";
  }
  return project.status.toLowerCase();
}
