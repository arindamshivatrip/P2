import Link from "next/link";
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
  nextProject?: { title: string; href: string };
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
    teamOrOrg: project.metaStrip?.teamValue ?? project.meta.org ?? "Independent",
    timeline: project.meta.dateRange,
    skills: project.metaStrip?.focusValue ?? project.tech
  };
}

export function WorkDetailShell({
  project,
  hasCoverAsset = false,
  hasVideoAsset = false,
  nextProject
}: WorkDetailShellProps) {
  const subtitle = project.subtitle ?? project.oneLiner;
  const cover = getProjectCoverSrc(project);
  const fallbackCover = getFallbackCoverImage(project, "flagship");
  const hasRealCover = hasCoverAsset && !cover.includes("placeholder");
  const mediaBackground = hasRealCover ? `url(${cover})` : fallbackCover;
  const meta = getMetaValues(project);
  const highlights = project.highlights ?? [];
  const metrics =
    project.detailPage?.showMetrics === false ? [] : project.metrics ?? [];
  const isConfidential = project.visibility === "confidential-summary";

  return (
    <Section spacing="compact" className="pt-0 pb-10 md:pb-14">
      <Container size="default">
        <div className="border-t border-border/55 pt-5 md:pt-6">
          <div className="mx-auto max-w-[46rem] min-w-0">
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
              <Link
                href="/work"
                className="font-body text-label-lg uppercase text-text-muted transition-colors hover:text-foreground"
              >
                ← All work
              </Link>
              <p className="font-body text-label uppercase text-text-muted">
                {getProjectTypeLine(project)}
              </p>
            </div>

            <DisplayHeading as="h1" className="mt-4 text-display-md">
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
                  <dt className="text-label uppercase text-text-muted">Role</dt>
                  <dd className="mt-1.5 text-foreground/88">{meta.role}</dd>
                </div>
                <div>
                  <dt className="text-label uppercase text-text-muted">Team / Org</dt>
                  <dd className="mt-1.5 text-foreground/88">{meta.teamOrOrg}</dd>
                </div>
                <div>
                  <dt className="text-label uppercase text-text-muted">Timeline</dt>
                  <dd className="mt-1.5 text-foreground/88">{meta.timeline}</dd>
                </div>
                <div>
                  <dt className="text-label uppercase text-text-muted">Skills / Tools</dt>
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
              <h2 className="font-display text-display-xs tracking-tight">
                Overview
              </h2>
              <div className="mt-4 max-w-3xl space-y-3">
                <BodyText tone="secondary">{project.summary}</BodyText>
                {isConfidential && project.nda?.note ? (
                  <BodyText tone="muted" className="text-sm">
                    {project.nda.note}
                  </BodyText>
                ) : isConfidential ? (
                  <BodyText tone="muted" className="text-sm">
                    Some details are summarized here — this work is under NDA. I can walk
                    through more in a conversation.
                  </BodyText>
                ) : null}
              </div>
            </section>

            {highlights.length > 0 ? (
              <section className="mt-10 border-t border-border/40 pt-8">
                <h2 className="font-display text-display-xs tracking-tight">
                  What I did
                </h2>
                <ul className="mt-4 max-w-3xl space-y-3">
                  {highlights.map((highlight) => (
                    <li key={highlight} className="flex gap-3">
                      <span aria-hidden="true" className="mt-[0.72rem] h-px w-5 shrink-0 bg-accent/70" />
                      <BodyText tone="secondary">{highlight}</BodyText>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {metrics.length > 0 ? (
              <section className="mt-10 border-t border-border/40 pt-8">
                <h2 className="font-display text-display-xs tracking-tight">
                  Outcomes
                </h2>
                <dl className="mt-5 grid max-w-3xl gap-x-8 gap-y-5 sm:grid-cols-2">
                  {metrics.map((metric) => (
                    <div key={metric.label} className="border-t border-border/45 pt-3">
                      <dd className="font-display text-2xl tracking-tight text-foreground">
                        {metric.value}
                      </dd>
                      <dt className="mt-1 font-body text-label-lg uppercase text-text-muted">
                        {metric.label}
                      </dt>
                    </div>
                  ))}
                </dl>
              </section>
            ) : null}

            <footer className="mt-12 flex flex-wrap items-center justify-between gap-x-8 gap-y-4 border-t border-border/55 pt-6">
              <Link
                href="/contact"
                className="font-body text-sm text-text-secondary transition-colors hover:text-foreground"
              >
                Questions about this project? <span className="text-accent">Get in touch</span>
              </Link>
              {nextProject ? (
                <Link href={nextProject.href} className="group text-right">
                  <span className="block font-body text-label uppercase text-text-muted">
                    Next project
                  </span>
                  <span className="mt-1 block font-display text-xl tracking-tight text-foreground transition-colors group-hover:text-accent md:text-2xl">
                    {nextProject.title} →
                  </span>
                </Link>
              ) : null}
            </footer>
          </div>
        </div>
      </Container>
    </Section>
  );
}
