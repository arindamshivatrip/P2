import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import type { LabItem } from "@/components/experiments/experiment-card";
import { ExperimentsCanvas } from "@/components/experiments/experiments-canvas";
import {
  getExperimentMetaLine,
  getExperimentStamp
} from "@/components/experiments/experiment-meta";
import { getProjectDestinationHref, getVisibleProjectsBySection } from "@/data/projects";
import { getProjectAssetAvailability } from "@/lib/project-assets.server";

export async function ExperimentsLab() {
  const projects = getVisibleProjectsBySection("experiments");

  if (projects.length === 0) {
    return null;
  }

  const items: LabItem[] = await Promise.all(
    projects.map(async (project) => {
      const availability = await getProjectAssetAvailability(project);
      const cover =
        availability.coverImage && project.coverImage && !project.coverImage.includes("placeholder")
          ? project.coverImage
          : undefined;
      return {
        id: project.id,
        href: getProjectDestinationHref(project),
        title: project.title,
        oneLiner: project.oneLiner,
        metaLine: getExperimentMetaLine(project),
        stamp: getExperimentStamp(project),
        tech: project.tech.slice(0, 3),
        cover
      };
    })
  );

  return (
    <Section spacing="compact" className="pt-0 pb-8 md:pb-10">
      <Container>
        <div className="border-t border-border/55 pt-4 md:pt-5">
          <ExperimentsCanvas items={items} />
        </div>
      </Container>
    </Section>
  );
}
