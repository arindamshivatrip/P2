import "server-only";
import { getProjectDestinationHref, projects } from "@/data/projects";
import type { ProjectLink } from "./link-projects";

// Other ways Ask Ari names a project besides its page title. Matching is
// case-sensitive, so a common word like "Reframed" only links as the name.
const aliases: Record<string, string[]> = {
  "light-helmets-scan-to-fitment": [
    "LIGHT Helmets",
    "scan-to-fitment pipeline",
    "helmet scan-to-fitment pipeline",
    "helmet scanning project",
    "helmet fitting pipeline",
    "helmet project"
  ],
  "shoot-it-ar-laser-tag-system": ["Shoot IT", "Shoot It"],
  "revamping-shopeepay": ["ShopeePay"],
  // A bare "L'Oréal" means the full-time role, Ari's main L'Oréal page.
  "loreal-ml-planning-suite": [
    "ML Planning Suite",
    "L'Oréal planning tools",
    "L'Oreal planning tools",
    "L'Oréal",
    "L’Oréal",
    "L'Oreal"
  ],
  "loreal-analytics-storefront": ["Tool Storefront", "analytics storefront"],
  "sp-digital-utility-platform": ["SP Digital"],
  "niantic-spatial-ar": ["Niantic Spatial"],
  "media-framing-sentiment-pipeline": ["Media Framing"],
  "ai-assisted-portfolio-platform": ["this portfolio site", "this portfolio"],
  "vr-heatstroke-education-simulator": ["VR heatstroke simulator", "heatstroke simulator"],
  "pico-game-jam-vr-flight-game": ["Pico Game Jam"],
  "snapt": ["SNAPT"],
  "music-lyrics-transcription-system": [
    "Music and Lyrics Transcription System",
    "Music and Lyrics Transcription App"
  ]
};

/** Every visible project's page and the names that should link to it. */
export function getProjectLinks(): ProjectLink[] {
  return projects
    .filter((project) => project.visible)
    .map((project) => ({
      href: getProjectDestinationHref(project),
      names: [project.title, ...(aliases[project.slug] ?? [])]
    }))
    .filter((link) => link.href.startsWith("/") && link.href !== "/");
}
