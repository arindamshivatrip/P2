import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExperimentDetailShell } from "@/components/experiments/experiment-detail-shell";
import { ExperimentDetailLegacyShell } from "@/components/experiments/experiment-detail-legacy-shell";
import { JsonLd } from "@/components/seo/json-ld";
import {
  getExperimentDetailHref,
  getProjectBySlug,
  getProjectsBySection
} from "@/data/projects";
import { getProjectAssetAvailability } from "@/lib/project-assets.server";
import { breadcrumbJsonLd, buildPageMetadata, projectOgImage } from "@/lib/seo";
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
    return buildPageMetadata({
      title: "Experiments",
      description:
        "Smaller prototypes and explorations across XR, mobile, AI-assisted tools, creative coding, and interaction design.",
      path: "/experiments"
    });
  }

  // Only reference a real OG image that exists on disk; otherwise the helper
  // falls back to the sitewide default.
  const availability = await getProjectAssetAvailability(project);
  const image = projectOgImage(availability, project);

  return buildPageMetadata({
    title: project.title,
    description: project.summary,
    path: getExperimentDetailHref(project.slug),
    image,
    imageAlt: project.title
  });
}

export default async function ExperimentDetailPage({ params }: ExperimentDetailPageProps) {
  const { slug } = await params;
  const project = getExperimentProject(slug);

  if (!project) {
    notFound();
  }

  const availability = await getProjectAssetAvailability(project);
  const renderer = getExperimentRenderer(project);

  const breadcrumb = (
    <JsonLd
      data={breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Experiments", path: "/experiments" },
        { name: project.title, path: getExperimentDetailHref(project.slug) }
      ])}
    />
  );

  if (renderer === "structured") {
    return (
      <>
        {breadcrumb}
        <ExperimentDetailShell
          project={project}
          hasCoverAsset={availability.coverImage}
          hasVideoAsset={availability.video}
        />
      </>
    );
  }

  return (
    <>
      {breadcrumb}
      <ExperimentDetailLegacyShell
        project={project}
        hasCoverAsset={availability.coverImage}
        hasVideoAsset={availability.video}
      />
    </>
  );
}
