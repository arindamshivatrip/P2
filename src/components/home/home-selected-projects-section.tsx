import Link from "next/link";
import { HomeSelectedProjects, type SelectedWorkItem } from "@/components/home/home-selected-projects";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { getFallbackCoverImage } from "@/components/work/tile-media";
import { DisplayHeading } from "@/components/typography/display-heading";
import { Reveal } from "@/components/ui/reveal";
import { projectsContent } from "@/data/home";
import { getHomeFeaturedProjects, getProjectDestinationHref } from "@/data/projects";
import { getProjectAssetAvailability } from "@/lib/project-assets.server";
import type { Project } from "@/types/project";

// Honest, single-word context per project — derived, mirrors the /work index.
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

export async function HomeSelectedProjectsSection() {
  const featured = getHomeFeaturedProjects().slice(0, 3);

  if (featured.length === 0) {
    return null;
  }

  const items: SelectedWorkItem[] = await Promise.all(
    featured.map(async (project) => {
      const availability = await getProjectAssetAvailability(project);
      return {
        id: project.id,
        href: getProjectDestinationHref(project),
        title: project.title,
        oneLiner: project.oneLiner,
        year: project.meta.year,
        org: project.meta.org,
        statusLabel: getStatusLabel(project),
        fallbackGradient: getFallbackCoverImage(project, "standard"),
        cover: availability.coverImage ? project.coverImage : undefined,
        video: availability.video ? project.video?.src : undefined
      };
    })
  );

  return (
    <Section className="bg-background pt-3 pb-8 md:pt-5 md:pb-10">
      <Container>
        <div className="flex items-end justify-between gap-4">
          <Reveal>
            <DisplayHeading as="h2">{projectsContent.title}</DisplayHeading>
          </Reveal>
          <Reveal delay={0.04}>
            <Link
              href="/work"
              className="pb-1 font-body text-label-lg uppercase text-text-muted transition-colors hover:text-foreground"
            >
              View all work
            </Link>
          </Reveal>
        </div>

        <HomeSelectedProjects items={items} />
      </Container>
    </Section>
  );
}
