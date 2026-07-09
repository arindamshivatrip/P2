import type { MetadataRoute } from "next";
import { siteMeta } from "@/data/site";
import {
  experimentProjects,
  getExperimentDetailHref,
  getWorkDetailHref,
  workProjects
} from "@/data/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteMeta.url.replace(/\/$/, "");
  const now = new Date();

  const staticRoutes = [
    "/",
    "/work",
    "/experiments",
    "/about",
    "/contact",
    "/cv",
    "/privacy-policy"
  ];

  const projectRoutes = [
    ...workProjects.map((project) => getWorkDetailHref(project.slug)),
    ...experimentProjects.map((project) => getExperimentDetailHref(project.slug))
  ];

  return [...staticRoutes, ...projectRoutes].map((path) => ({
    url: `${base}${path}`,
    lastModified: now
  }));
}
