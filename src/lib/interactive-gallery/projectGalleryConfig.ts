import {
  getProjectDestinationHref,
  workProjects
} from "@/data/projects";

export type GalleryProject = {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  year: string;
  status: string;
  tags: string[];
  mediaBackground: string;
  href: string;
  accent: string;
  summary: string;
};

const preferredProjectSlugs = [
  "loreal-ml-planning-suite",
  "smartphone-use-mental-wellbeing",
  "music-lyrics-transcription-system",
  "vr-heatstroke-education-simulator",
  "shoot-it-ar-laser-tag-system",
  "media-framing-sentiment-transformation-pipeline"
] as const;

const accentByTheme: Record<string, string> = {
  AI: "rgba(255, 153, 50, 0.78)",
  XR: "rgba(85, 118, 114, 0.78)",
  Research: "rgba(126, 108, 85, 0.78)",
  Data: "rgba(92, 116, 132, 0.78)",
  Web: "rgba(174, 115, 72, 0.78)",
  Mobile: "rgba(112, 125, 96, 0.78)",
  Editorial: "rgba(145, 108, 83, 0.78)"
};

const mediaBackgroundByTheme: Record<string, string> = {
  AI:
    "linear-gradient(140deg, #30343b 0%, #232931 48%, #274a50 100%), radial-gradient(circle at 22% 20%, rgba(255,153,50,0.26), transparent 38%), repeating-linear-gradient(45deg, rgba(245,244,237,0.05) 0 1px, transparent 1px 13px)",
  XR:
    "linear-gradient(150deg, #a9b4c2 0%, #6d7c8d 52%, #3e444d 100%), radial-gradient(circle at 25% 18%, rgba(245,244,237,0.28), transparent 42%)",
  Research:
    "linear-gradient(145deg, #d2c6b8 0%, #b8aa98 54%, #9e9588 100%), repeating-linear-gradient(0deg, rgba(31,31,31,0.05) 0 1px, transparent 1px 15px)",
  Data:
    "linear-gradient(145deg, #3f3f45 0%, #2f3239 46%, #2d4b54 100%), repeating-linear-gradient(90deg, rgba(245,244,237,0.04) 0 1px, transparent 1px 12px)",
  Web:
    "linear-gradient(140deg, #d1c5b8 0%, #b9ab9b 58%, #958f85 100%), radial-gradient(circle at 72% 22%, rgba(245,244,237,0.2), transparent 45%)",
  Mobile:
    "linear-gradient(145deg, #9eabbb 0%, #758495 55%, #525d68 100%), radial-gradient(circle at 22% 20%, rgba(245,244,237,0.24), transparent 44%)",
  Editorial:
    "linear-gradient(145deg, #cebfac 0%, #b4a593 55%, #8c8379 100%), repeating-linear-gradient(45deg, rgba(31,31,31,0.03) 0 2px, transparent 2px 16px)"
};

export function getInteractiveGalleryProjects(): GalleryProject[] {
  const bySlug = new Map(workProjects.map((project) => [project.slug, project] as const));
  const preferredProjects = preferredProjectSlugs
    .map((slug) => bySlug.get(slug))
    .filter((project): project is NonNullable<typeof project> => Boolean(project));

  const projects = preferredProjects.length >= 4 ? preferredProjects : workProjects.slice(0, 6);

  return projects.slice(0, 6).map((project) => ({
    slug: project.slug,
    title: project.title,
    subtitle: project.oneLiner,
    category: project.contributionTag ?? project.categories[0] ?? project.entryType,
    year: project.meta.year,
    status: project.status,
    tags: project.tags?.length ? project.tags.slice(0, 3) : project.tech.slice(0, 3),
    mediaBackground:
      mediaBackgroundByTheme[project.themeKey ?? "Editorial"] ?? mediaBackgroundByTheme.Editorial,
    href: getProjectDestinationHref(project),
    accent: accentByTheme[project.themeKey ?? "Editorial"] ?? accentByTheme.Editorial,
    summary: project.summary
  }));
}
