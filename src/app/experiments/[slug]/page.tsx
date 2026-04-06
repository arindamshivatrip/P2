import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExperimentDetailShell } from "@/components/experiments/experiment-detail-shell";
import { ExperimentDetailLegacyShell } from "@/components/experiments/experiment-detail-legacy-shell";
import { getProjectBySlug, getProjectsBySection } from "@/data/projects";
import { getProjectAssetAvailability } from "@/lib/project-assets.server";
import type { Project } from "@/types/project";

type ExperimentDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function getExperimentProject(slug: string) {
  const project = getProjectBySlug(slug);
  if (!project || project.section !== "experiments" || !project.visible) {
    return undefined;
  }

  return project;
}

function getExperimentRenderer(project: Project): "structured" | "legacy" {
  const template = project.detailTemplate ?? "legacy";
  const hasStructuredSections = Boolean(project.detailSections?.length);

  if (template === "structured" && hasStructuredSections) {
    return "structured";
  }

  return "legacy";
}

export async function generateStaticParams() {
  return getProjectsBySection("experiments")
    .filter((project) => project.visible)
    .map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params
}: ExperimentDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getExperimentProject(slug);

  if (!project) {
    return {
      title: "Experiment not found"
    };
  }

  return {
    title: `${project.title} | Experiments`,
    description: project.summary
  };
}

export default async function ExperimentDetailPage({ params }: ExperimentDetailPageProps) {
  const { slug } = await params;
  const project = getExperimentProject(slug);

  if (!project) {
    notFound();
  }

  const availability = await getProjectAssetAvailability(project);
  const renderer = getExperimentRenderer(project);

  if (renderer === "structured") {
    return (
      <ExperimentDetailShell
        project={project}
        hasCoverAsset={availability.coverImage}
        hasVideoAsset={availability.video}
      />
    );
  }

  return (
    <ExperimentDetailLegacyShell
      project={project}
      hasCoverAsset={availability.coverImage}
      hasVideoAsset={availability.video}
    />
  );
}
