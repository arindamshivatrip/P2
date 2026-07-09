import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/json-ld";
import { WorkDetailShell } from "@/components/work/work-detail-shell";
import {
  getProjectBySlug,
  getProjectsBySection,
  getVisibleProjectsBySection,
  getWorkDetailHref
} from "@/data/projects";
import { getProjectAssetAvailability } from "@/lib/project-assets.server";
import { breadcrumbJsonLd, buildPageMetadata, projectOgImage } from "@/lib/seo";

type WorkDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const workProjects = getProjectsBySection("work");
  return workProjects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: WorkDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project || project.section !== "work" || !project.visible) {
    return buildPageMetadata({
      title: "Work",
      description:
        "Selected case studies across XR, data-driven product systems, UX research, and interactive engineering.",
      path: "/work"
    });
  }

  // Only reference a real OG image that exists on disk; otherwise the helper
  // falls back to the sitewide default.
  const availability = await getProjectAssetAvailability(project);
  const image = projectOgImage(availability, project);

  return buildPageMetadata({
    title: project.title,
    description: project.summary,
    path: getWorkDetailHref(project.slug),
    image,
    imageAlt: project.title
  });
}

export default async function WorkDetailPage({ params }: WorkDetailPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project || project.section !== "work" || !project.visible) {
    notFound();
  }

  const availability = await getProjectAssetAvailability(project);

  const visibleWork = getVisibleProjectsBySection("work");
  const currentIndex = visibleWork.findIndex((entry) => entry.id === project.id);
  const next =
    currentIndex >= 0 && visibleWork.length > 1
      ? visibleWork[(currentIndex + 1) % visibleWork.length]
      : undefined;

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Work", path: "/work" },
          { name: project.title, path: getWorkDetailHref(project.slug) }
        ])}
      />
      <WorkDetailShell
        project={project}
        hasCoverAsset={availability.coverImage}
        hasVideoAsset={availability.video}
        nextProject={next ? { title: next.title, href: getWorkDetailHref(next.slug) } : undefined}
      />
    </>
  );
}
