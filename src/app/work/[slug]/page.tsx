import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WorkDetailShell } from "@/components/work/work-detail-shell";
import { getProjectBySlug, getProjectsBySection } from "@/data/projects";
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

  return (
    <WorkDetailShell
      project={project}
      hasCoverAsset={availability.coverImage}
      hasVideoAsset={availability.video}
    />
  );
}
