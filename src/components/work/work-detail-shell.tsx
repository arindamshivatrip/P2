import { BodyText } from "@/components/typography/body-text";
import { Container } from "@/components/layout/container";
import { DisplayHeading } from "@/components/typography/display-heading";
import { Section } from "@/components/layout/section";
import { getProjectCoverSrc } from "@/data/projects";
import { getFallbackCoverImage } from "@/components/work/tile-media";
import type { Project } from "@/types/project";

type WorkDetailShellProps = {
  project: Project;
  hasCoverAsset?: boolean;
  hasVideoAsset?: boolean;
};

function getProjectTypeLine(project: Project): string {
  if (project.projectTypeLine) {
    return project.projectTypeLine;
  }

  if (project.contributionTag) {
    return `${project.entryType} - ${project.contributionTag}`;
  }

  return project.entryType;
}

function getMetaValues(project: Project) {
  return {
    role: project.role,
    teamOrOrg: project.metaStrip?.teamValue ?? project.meta.org ?? "Not specified",
    timeline: project.meta.dateRange,
    skills: project.metaStrip?.focusValue ?? project.tech
  };
}

function getStarterBody(project: Project): string[] {
  const lines = [
    project.summary,
    "This page is a structured work-detail boilerplate. Expanded case-study sections will be added in a future pass."
  ];

  if (project.visibility === "confidential-summary") {
    lines.push("Some implementation details are intentionally summarized due to project confidentiality.");
  }

  return lines;
}

export function WorkDetailShell({
  project,
  hasCoverAsset = false,
  hasVideoAsset = false
}: WorkDetailShellProps) {
  const subtitle = project.subtitle ?? project.oneLiner;
  const cover = getProjectCoverSrc(project);
  const fallbackCover = getFallbackCoverImage(project, "flagship");
  const hasRealCover = hasCoverAsset && !cover.includes("placeholder");
  const mediaBackground = hasRealCover ? `url(${cover})` : fallbackCover;
  const meta = getMetaValues(project);
  const starterBody = getStarterBody(project);

  return (
    <Section spacing="compact" className="pt-0 pb-10 md:pb-14">
      <Container size="default">
        <div className="border-t border-border/55 pt-5 md:pt-6">
          <div className="mx-auto max-w-[46rem] min-w-0">
            <p className="font-body text-[0.66rem] uppercase tracking-[0.13em] text-text-muted">
              {getProjectTypeLine(project)}
            </p>

            <DisplayHeading as="h1" className="mt-3 text-5xl md:text-[4rem]">
              {project.title}
            </DisplayHeading>

            <BodyText tone="secondary" className="mt-3 text-lg md:text-xl">
              {subtitle}
            </BodyText>

            <div
              className="relative mt-6 min-h-[280px] overflow-hidden rounded-[0.95rem] bg-cover bg-center md:min-h-[460px]"
              style={{ backgroundImage: mediaBackground }}
              aria-hidden="true"
            >
              {hasVideoAsset && project.video?.src ? (
                <video
                  className="absolute inset-0 h-full w-full object-cover"
                  src={project.video.src}
                  poster={project.video.poster}
                  autoPlay
                  loop
                  muted
                  playsInline
                  controls={false}
                  preload="metadata"
                  tabIndex={-1}
                  title={project.video.title}
                />
              ) : null}
            </div>

            <dl className="mt-4 max-w-3xl border-t border-border/45 pt-3 font-body text-sm text-text-secondary">
              <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
                <div>
                  <dt className="text-[0.68rem] uppercase tracking-[0.12em] text-text-muted">Role</dt>
                  <dd className="mt-1.5 text-foreground/88">{meta.role}</dd>
                </div>
                <div>
                  <dt className="text-[0.68rem] uppercase tracking-[0.12em] text-text-muted">Team / Org</dt>
                  <dd className="mt-1.5 text-foreground/88">{meta.teamOrOrg}</dd>
                </div>
                <div>
                  <dt className="text-[0.68rem] uppercase tracking-[0.12em] text-text-muted">Timeline</dt>
                  <dd className="mt-1.5 text-foreground/88">{meta.timeline}</dd>
                </div>
                <div>
                  <dt className="text-[0.68rem] uppercase tracking-[0.12em] text-text-muted">Skills / Tools</dt>
                  <dd className="mt-1.5">
                    <ul className="space-y-1">
                      {meta.skills.map((skill) => (
                        <li key={skill} className="text-foreground/88">
                          {skill}
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              </div>
            </dl>

            <section className="mt-10 border-t border-border/40 pt-8">
              <h2 className="font-display text-3xl leading-tight tracking-tight md:text-[2.35rem]">
                Overview
              </h2>
              <div className="mt-4 max-w-3xl space-y-3">
                {starterBody.map((line, index) => (
                  <BodyText key={index} tone="secondary">
                    {line}
                  </BodyText>
                ))}
              </div>
            </section>
          </div>
        </div>
      </Container>
    </Section>
  );
}
