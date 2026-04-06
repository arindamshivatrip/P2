import { Container } from "@/components/layout/container";
import { ResponsiveMasonry } from "@/components/layout/responsive-masonry";
import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/ui/reveal";
import {
  getVisibleProjectsBySection,
  getFeaturedProjectsBySection
} from "@/data/projects";
import { ProjectTile } from "@/components/work/project-tile";
import { WorkArchiveRail } from "@/components/work/work-archive-rail";
import type { Project, ProjectSection } from "@/types/project";
import { getProjectAssetAvailability } from "@/lib/project-assets.server";

type WorkGridProps = {
  section: ProjectSection;
  activeFilter: string;
};

const matchesFilter = (project: Project, filter: string): boolean => {
  if (filter === "all") {
    return true;
  }

  if (filter === "ai") {
    return project.categories.includes("AI Systems");
  }

  if (filter === "interaction") {
    return project.categories.includes("Interaction Design");
  }

  if (filter === "research") {
    return project.categories.includes("Research");
  }

  if (filter === "xr") {
    return (
      project.categories.includes("XR / Spatial") || project.categories.includes("Mobile AR")
    );
  }

  return true;
};

const pickFirst = (
  source: Project[],
  used: Set<string>,
  matcher: (project: Project) => boolean
): Project | undefined => {
  const found = source.find((project) => !used.has(project.id) && matcher(project));
  if (found) {
    used.add(found.id);
  }
  return found;
};

export async function WorkGrid({ section, activeFilter }: WorkGridProps) {
  const visible = getVisibleProjectsBySection(section).filter((project) =>
    matchesFilter(project, activeFilter)
  );
  const featured = getFeaturedProjectsBySection(section).filter((project) =>
    matchesFilter(project, activeFilter)
  );
  const used = new Set<string>();

  const flagship = pickFirst(featured, used, () => true) ?? visible[0];
  if (flagship) {
    used.add(flagship.id);
  }

  const researchTile = pickFirst(visible, used, (project) => project.entryType === "research");
  const confidentialTile = pickFirst(
    visible,
    used,
    (project) => project.visibility === "confidential-summary"
  );
  const shootItTile = pickFirst(
    visible,
    used,
    (project) => project.slug === "shoot-it-ar-laser-tag-system"
  );
  const engineeringTile = pickFirst(
    visible,
    used,
    (project) => project.categories.includes("Engineering")
  );
  const xrTile = pickFirst(
    visible,
    used,
    (project) => project.slug === "vr-heatstroke-education-simulator"
  ) ??
    pickFirst(visible, used, (project) => project.categories.includes("XR / Spatial"));
  const utilityTile = pickFirst(visible, used, () => true);

  if (!flagship) {
    return null;
  }

  const selectedProjects = [
    flagship,
    researchTile,
    confidentialTile,
    shootItTile ?? engineeringTile,
    xrTile,
    utilityTile
  ].filter((project): project is Project => Boolean(project));

  const availabilityEntries = await Promise.all(
    visible.map(async (project) => [
      project.id,
      await getProjectAssetAvailability(project)
    ] as const)
  );

  const availability = new Map(availabilityEntries);
  const hasCover = (project: Project): boolean =>
    availability.get(project.id)?.coverImage ?? false;

  const selectedIds = new Set(selectedProjects.map((project) => project.id));
  const remainingProjects = visible.filter((project) => !selectedIds.has(project.id));
  const featuredTileOrder = [
    { project: flagship, variant: "featured" as const, delay: 0 },
    { project: researchTile, variant: "research" as const, delay: 0.06 },
    { project: confidentialTile, variant: "confidential" as const, delay: 0.1 },
    { project: shootItTile ?? engineeringTile, variant: "assertive" as const, delay: 0.14 },
    { project: xrTile, variant: "immersive" as const, delay: 0.18 },
    { project: utilityTile, variant: "utility" as const, delay: 0.22 }
  ].filter(
    (
      tile
    ): tile is {
      project: Project;
      variant: "featured" | "research" | "confidential" | "assertive" | "immersive" | "utility";
      delay: number;
    } => Boolean(tile.project)
  );

  return (
    <Section spacing="compact" className="pt-0">
      <Container>
        <ResponsiveMasonry
          className="-ml-4 flex w-auto md:-ml-5"
          columnClassName="space-y-4 pl-4 md:space-y-5 md:pl-5"
        >
          {featuredTileOrder.map((tile) => (
            <Reveal key={tile.project.id} delay={tile.delay}>
              <ProjectTile
                project={tile.project}
                variant={tile.variant}
                hasCoverAsset={hasCover(tile.project)}
              />
            </Reveal>
          ))}
        </ResponsiveMasonry>

        {remainingProjects.length > 0 ? (
          <Reveal delay={0.18}>
            <WorkArchiveRail
              items={remainingProjects.map((project) => ({
                project,
                hasCoverAsset: hasCover(project)
              }))}
            />
          </Reveal>
        ) : null}
      </Container>
    </Section>
  );
}
