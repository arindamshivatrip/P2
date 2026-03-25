import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/ui/reveal";
import { getVisibleProjectsBySection } from "@/data/projects";
import { getProjectAssetAvailability } from "@/lib/project-assets.server";
import type { Project } from "@/types/project";
import { ExperimentArtifactTile } from "@/components/experiments/experiment-artifact-tile";
import { ExperimentHeroTile } from "@/components/experiments/experiment-hero-tile";
import { ExperimentNoteTile } from "@/components/experiments/experiment-note-tile";

const pickExperiment = (
  projects: Project[],
  used: Set<string>,
  matcher: (project: Project) => boolean
): Project | undefined => {
  const found = projects.find((project) => !used.has(project.id) && matcher(project));
  if (found) {
    used.add(found.id);
  }
  return found;
};

export async function ExperimentsGrid() {
  const experiments = getVisibleProjectsBySection("experiments");

  if (experiments.length === 0) {
    return null;
  }

  const used = new Set<string>();
  const hero =
    pickExperiment(experiments, used, (project) => project.slug === "ai-assisted-portfolio-platform") ??
    pickExperiment(experiments, used, () => true);
  const artifact =
    pickExperiment(experiments, used, (project) => project.slug === "trailtales-local-discovery-app") ??
    pickExperiment(experiments, used, () => true);
  const note =
    pickExperiment(experiments, used, (project) => project.slug === "pico-game-jam-vr-flight-game") ??
    pickExperiment(experiments, used, () => true);
  const hybrid =
    pickExperiment(experiments, used, (project) => project.slug === "intronus-interaction-design-project") ??
    pickExperiment(experiments, used, () => true);

  const availabilityEntries = await Promise.all(
    experiments.map(async (project) => [project.id, await getProjectAssetAvailability(project)] as const)
  );
  const availability = new Map(availabilityEntries);
  const hasCover = (project: Project | undefined): boolean =>
    project ? availability.get(project.id)?.coverImage ?? false : false;

  return (
    <Section spacing="compact" className="pt-0 pb-7 md:pb-9">
      <Container>
        <div className="border-t border-border/55 pt-2 md:pt-2.5">
          <div className="grid gap-3.5 md:gap-4 lg:grid-cols-12">
            {hero ? (
              <Reveal className="lg:col-span-7">
                <ExperimentHeroTile project={hero} hasCoverAsset={hasCover(hero)} />
              </Reveal>
            ) : null}

            {artifact ? (
              <Reveal className="lg:col-span-5" delay={0.06}>
                <ExperimentArtifactTile project={artifact} hasCoverAsset={hasCover(artifact)} />
              </Reveal>
            ) : null}

            {note ? (
              <Reveal className="lg:col-span-5" delay={0.1}>
                <ExperimentNoteTile project={note} />
              </Reveal>
            ) : null}

            {hybrid ? (
              <Reveal className="lg:col-span-7" delay={0.14}>
                <ExperimentArtifactTile project={hybrid} hasCoverAsset={hasCover(hybrid)} />
              </Reveal>
            ) : null}
          </div>
        </div>
      </Container>
    </Section>
  );
}
