import { Container } from "@/components/layout/container";
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

  return (
    <Section spacing="compact" className="pt-0">
      <Container>
        <div className="grid gap-5 lg:grid-cols-12">
          <Reveal className="lg:col-span-8">
            <ProjectTile
              project={flagship}
              variant="featured"
              hasCoverAsset={hasCover(flagship)}
            />
          </Reveal>

          {researchTile ? (
            <Reveal className="lg:col-span-4" delay={0.06}>
              <ProjectTile
                project={researchTile}
                variant="research"
                hasCoverAsset={hasCover(researchTile)}
              />
            </Reveal>
          ) : null}

          {confidentialTile ? (
            <Reveal className="lg:col-span-5" delay={0.1}>
              <ProjectTile
                project={confidentialTile}
                variant="confidential"
                hasCoverAsset={hasCover(confidentialTile)}
              />
            </Reveal>
          ) : null}

          {shootItTile ?? engineeringTile ? (
            <Reveal className="lg:col-span-7" delay={0.14}>
              <ProjectTile
                project={shootItTile ?? engineeringTile!}
                variant="assertive"
                hasCoverAsset={hasCover(shootItTile ?? engineeringTile!)}
              />
            </Reveal>
          ) : null}

          {xrTile ? (
            <Reveal className="lg:col-span-8" delay={0.18}>
              <ProjectTile
                project={xrTile}
                variant="immersive"
                hasCoverAsset={hasCover(xrTile)}
              />
            </Reveal>
          ) : null}

          {utilityTile ? (
            <Reveal className="lg:col-span-4" delay={0.22}>
              <ProjectTile
                project={utilityTile}
                variant="utility"
                hasCoverAsset={hasCover(utilityTile)}
              />
            </Reveal>
          ) : null}
        </div>

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
