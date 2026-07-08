import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WorkDetailShell } from "@/components/work/work-detail-shell";
import {
  getProjectBySlug,
  getProjectsBySection,
  getVisibleProjectsBySection,
  getWorkDetailHref
} from "@/data/projects";
import { getProjectAssetAvailability } from "@/lib/project-assets.server";

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
    return {
      title: "Work",
      description: "Selected work projects."
    };
  }

  return {
    title: `${project.title} | Work`,
    description: project.summary
  };
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
    <WorkDetailShell
      project={project}
      hasCoverAsset={availability.coverImage}
      hasVideoAsset={availability.video}
      nextProject={next ? { title: next.title, href: getWorkDetailHref(next.slug) } : undefined}
    />
  );
}
