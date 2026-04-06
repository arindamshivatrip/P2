import type { ReactNode } from "react";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { ResponsiveMasonry } from "@/components/layout/responsive-masonry";
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

type ExperimentTile = {
  key: string;
  delay: number;
  node: ReactNode;
};

export async function ExperimentsGrid() {
  const experiments = getVisibleProjectsBySection("experiments");

  if (experiments.length === 0) {
    return null;
  }

  const used = new Set<string>();
  const hero =
    pickExperiment(experiments, used, (project) => project.slug === "snapt") ??
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
  const hasVideo = (project: Project | undefined): boolean =>
    project ? (availability.get(project.id)?.video ?? false) || Boolean(project.video?.src) : false;

  const tiles: ExperimentTile[] = [];

  if (hero) {
    tiles.push({
      key: hero.id,
      delay: 0,
      node: (
        <ExperimentHeroTile
          project={hero}
          hasCoverAsset={hasCover(hero)}
          hasVideoAsset={hasVideo(hero)}
        />
      )
    });
  }

  if (artifact) {
    tiles.push({
      key: artifact.id,
      delay: 0.06,
      node: <ExperimentArtifactTile project={artifact} hasCoverAsset={hasCover(artifact)} />
    });
  }

  if (note) {
    tiles.push({
      key: note.id,
      delay: 0.1,
      node: <ExperimentNoteTile project={note} />
    });
  }

  if (hybrid) {
    tiles.push({
      key: hybrid.id,
      delay: 0.14,
      node: <ExperimentArtifactTile project={hybrid} hasCoverAsset={hasCover(hybrid)} />
    });
  }

  return (
    <Section spacing="compact" className="pt-0 pb-7 md:pb-9">
      <Container>
        <div className="border-t border-border/55 pt-2 md:pt-2.5">
          <ResponsiveMasonry>
            {tiles.map((tile) => (
              <Reveal key={tile.key} delay={tile.delay}>
                {tile.node}
              </Reveal>
            ))}
          </ResponsiveMasonry>
        </div>
      </Container>
    </Section>
  );
}
