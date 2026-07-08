import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { getFallbackCoverImage } from "@/components/work/tile-media";
import { WorkIndex, type WorkIndexItem } from "@/components/work/work-index";
import { getProjectDestinationHref, getVisibleProjectsBySection } from "@/data/projects";
import { getProjectAssetAvailability } from "@/lib/project-assets.server";
import type { Project, ProjectSection } from "@/types/project";

type WorkGridProps = {
  section: ProjectSection;
};

// Honest, single-word context per project — derived, never hand-badged.
function getStatusLabel(project: Project): string {
  if (project.nda?.isRestricted) {
    return "Confidential";
  }
  if (project.entryType === "research") {
    return "Research";
  }
  if (project.status === "In Progress") {
    return "In progress";
  }
  if (project.status === "Case Study") {
    return "Case study";
  }
  return project.status;
}

export async function WorkGrid({ section }: WorkGridProps) {
  const visible = getVisibleProjectsBySection(section);

  const items: WorkIndexItem[] = await Promise.all(
    visible.map(async (project) => {
      const availability = await getProjectAssetAvailability(project);
      return {
        id: project.id,
        href: getProjectDestinationHref(project),
        title: project.title,
        oneLiner: project.oneLiner,
        year: project.meta.year,
        org: project.meta.org,
        statusLabel: getStatusLabel(project),
        categories: project.categories,
        featured: project.featured,
        fallbackGradient: getFallbackCoverImage(project, "standard"),
        cover: availability.coverImage ? project.coverImage : undefined,
        video: availability.video ? project.video?.src : undefined
      };
    })
  );

  if (items.length === 0) {
    return null;
  }

  return (
    <Section spacing="compact" className="pt-0">
      <Container>
        <WorkIndex items={items} />
      </Container>
    </Section>
  );
}
