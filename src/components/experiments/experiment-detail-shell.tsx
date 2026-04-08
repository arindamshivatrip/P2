import { BodyText } from "@/components/typography/body-text";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { DisplayHeading } from "@/components/typography/display-heading";
import { Section } from "@/components/layout/section";
import { ExperimentBackLink } from "@/components/experiments/experiment-back-link";
import { getProjectCoverSrc } from "@/data/projects";
import { getFallbackCoverImage } from "@/components/work/tile-media";
import type { Project, ProjectDetailSection, ProjectDetailSectionInlineMedia } from "@/types/project";
import Image from "next/image";

type ExperimentDetailShellProps = {
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
    role: project.detailMetadata?.role ?? project.role,
    team: project.detailMetadata?.team ?? project.metaStrip?.teamValue ?? "Not specified",
    timeline: project.detailMetadata?.timeline ?? project.meta.dateRange,
    skills: project.detailMetadata?.skills ?? project.tech
  };
}

function getPrimaryExternalCta(project: Project) {
  const chromeStoreLink = project.links?.find(
    (link) => link.kind === "external" && link.href.includes("chromewebstore.google.com")
  );
  if (chromeStoreLink) {
    return chromeStoreLink;
  }

  return project.links?.find((link) => link.kind === "external");
}

function renderMediaBlock(section: ProjectDetailSection) {
  if (!section.media) {
    return (
      <div className="min-h-[220px] rounded-[0.85rem] bg-background/70 md:min-h-[320px]" aria-hidden="true" />
    );
  }

  const media = section.media;

  if (media.kind === "video") {
    return (
      <div className="relative min-h-[220px] overflow-hidden rounded-[0.85rem] bg-background/70 md:min-h-[320px]">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={media.src}
          poster={media.poster}
          autoPlay
          loop
          muted
          playsInline
          controls={false}
          preload="metadata"
          tabIndex={-1}
          title={media.title}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/25" />
      </div>
    );
  }

  return (
    <div
      className="min-h-[220px] rounded-[0.85rem] bg-cover bg-center md:min-h-[320px]"
      style={{ backgroundImage: `url(${media.src})` }}
      role="img"
      aria-label={media.alt ?? section.title}
    />
  );
}

function renderInlineMediaBlock(block: ProjectDetailSectionInlineMedia, key: string) {
  const mediaTopSpacing = block.spacing === "tight" ? "mt-3" : "mt-5";
  const captionTopSpacing = block.spacing === "tight" ? "mt-1" : "mt-2";
  const caption = block.caption ? (
    <p className={`${captionTopSpacing} font-body text-xs tracking-[0.01em] text-text-secondary`}>{block.caption}</p>
  ) : null;

  if (block.secondaryMedia) {
    const rightMedia = block.secondaryMedia;
    return (
      <div key={key} className={mediaTopSpacing}>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="relative h-[240px] overflow-hidden rounded-[0.85rem] bg-background/60 md:h-[320px]">
            <Image
              src={block.media.src}
              alt={block.media.alt ?? "Section media"}
              fill
              className="object-contain p-2"
              sizes="(max-width: 767px) 100vw, 50vw"
            />
          </div>
          <div className="relative h-[240px] overflow-hidden rounded-[0.85rem] bg-background/60 md:h-[320px]">
            <Image
              src={rightMedia.src}
              alt={rightMedia.alt ?? "Section media"}
              fill
              className="object-contain p-2"
              sizes="(max-width: 767px) 100vw, 50vw"
            />
          </div>
        </div>
        {caption}
      </div>
    );
  }

  if (block.media.kind === "video") {
    return (
      <div key={key} className={mediaTopSpacing}>
        <div className="relative min-h-[220px] overflow-hidden rounded-[0.85rem] bg-background/70 md:min-h-[320px]">
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src={block.media.src}
            poster={block.media.poster}
            autoPlay
            loop
            muted
            playsInline
            controls={false}
            preload="metadata"
            tabIndex={-1}
            title={block.media.title}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/25" />
        </div>
        {caption}
      </div>
    );
  }

  if (block.media.width && block.media.height) {
    return (
      <div key={key} className={mediaTopSpacing}>
        <Image
          src={block.media.src}
          alt={block.media.alt ?? "Section media"}
          width={block.media.width}
          height={block.media.height}
          className="h-auto w-full rounded-[0.85rem]"
          sizes="100vw"
        />
        {caption}
      </div>
    );
  }

  return (
    <div key={key} className={mediaTopSpacing}>
      <div className="relative h-[240px] overflow-hidden rounded-[0.85rem] bg-background/60 md:h-[360px]">
        <Image
          src={block.media.src}
          alt={block.media.alt ?? "Section media"}
          fill
          className="object-contain p-2"
          sizes="100vw"
        />
      </div>
      {caption}
    </div>
  );
}

function renderLineWithLeadingEmphasis(line: string) {
  const match = line.match(/^\*\*(.+?)\*\*(?:\s*)(.*)$/);
  if (!match) {
    return line;
  }

  const [, label, rest] = match;
  return (
    <>
      <strong className="font-medium text-foreground">{label}</strong>
      {rest ? (
        <>
          {" "}
          <span>{rest}</span>
        </>
      ) : null}
    </>
  );
}

function renderSectionBody(lines: string[], inlineMedia?: ProjectDetailSectionInlineMedia[]) {
  const blocksByParagraph = new Map<number, ProjectDetailSectionInlineMedia[]>();
  const tightNextParagraphIndexes = new Set<number>();
  inlineMedia?.forEach((block) => {
    const existing = blocksByParagraph.get(block.afterParagraph) ?? [];
    existing.push(block);
    blocksByParagraph.set(block.afterParagraph, existing);
    if (block.spacing === "tight") {
      tightNextParagraphIndexes.add(block.afterParagraph);
    }
  });

  return (
    <>
      {lines.map((line, index) => (
        <div key={index}>
          <BodyText
            tone="secondary"
            className={
              index > 0 ? (tightNextParagraphIndexes.has(index) ? "mt-2" : "mt-3") : ""
            }
          >
            {renderLineWithLeadingEmphasis(line)}
          </BodyText>
          {(blocksByParagraph.get(index + 1) ?? []).map((block, blockIndex) =>
            renderInlineMediaBlock(block, `${index + 1}-${blockIndex}`)
          )}
        </div>
      ))}
      {(blocksByParagraph.get(0) ?? []).map((block, blockIndex) =>
        renderInlineMediaBlock(block, `0-${blockIndex}`)
      )}
    </>
  );
}

function ExperimentDetailSectionBlock({ section }: { section: ProjectDetailSection }) {
  if (section.type === "text") {
    return (
      <section id={section.id} className="scroll-mt-24 border-t border-border/40 pt-8">
        <h2 className="font-display text-3xl leading-tight tracking-tight md:text-[2.35rem]">
          {section.title}
        </h2>
        <div className="mt-4 max-w-3xl">{renderSectionBody(section.body, section.inlineMedia)}</div>
      </section>
    );
  }

  if (section.type === "text-bullets") {
    return (
      <section id={section.id} className="scroll-mt-24 border-t border-border/40 pt-8">
        <h2 className="font-display text-3xl leading-tight tracking-tight md:text-[2.35rem]">
          {section.title}
        </h2>
        <div className="mt-4 max-w-3xl">{renderSectionBody(section.body, section.inlineMedia)}</div>
        {section.bullets?.length ? (
          <ul className="mt-4 space-y-2 font-body text-base leading-relaxed text-text-secondary">
            {section.bullets.map((bullet) => (
              <li key={bullet} className="pl-4">
                <span className="-ml-4 inline-block w-4 text-text-muted">-</span>
                {bullet}
              </li>
            ))}
          </ul>
        ) : null}
      </section>
    );
  }

  if (section.type === "split-media") {
    const mediaFirst = section.layout === "media-left";

    return (
      <section id={section.id} className="scroll-mt-24 border-t border-border/40 pt-8">
        <h2 className="font-display text-3xl leading-tight tracking-tight md:text-[2.35rem]">
          {section.title}
        </h2>
        <div className="mt-5 grid gap-5 md:grid-cols-2 md:gap-6">
          {mediaFirst ? renderMediaBlock(section) : <div className="max-w-3xl">{renderSectionBody(section.body, section.inlineMedia)}</div>}
          {mediaFirst ? <div className="max-w-3xl">{renderSectionBody(section.body, section.inlineMedia)}</div> : renderMediaBlock(section)}
        </div>
        {section.caption ? (
          <p className="mt-2 font-body text-xs uppercase tracking-[0.11em] text-text-secondary">{section.caption}</p>
        ) : null}
      </section>
    );
  }

  if (section.type === "media") {
    return (
      <section id={section.id} className="scroll-mt-24 border-t border-border/40 pt-8">
        <h2 className="font-display text-3xl leading-tight tracking-tight md:text-[2.35rem]">
          {section.title}
        </h2>
        <div className="mt-5">{renderMediaBlock(section)}</div>
        {section.caption ? (
          <p className="mt-2 font-body text-xs uppercase tracking-[0.11em] text-text-secondary">{section.caption}</p>
        ) : null}
      </section>
    );
  }

  if (section.type === "quote") {
    return (
      <section id={section.id} className="scroll-mt-24 border-t border-border/40 pt-8">
        <h2 className="font-display text-3xl leading-tight tracking-tight md:text-[2.35rem]">
          {section.title}
        </h2>
        <blockquote className="mt-5 border-l border-border/70 pl-4 md:pl-6">
          {section.body.map((line, index) => (
            <p
              key={index}
              className={index > 0 ? "mt-3 font-serif text-xl italic text-foreground/85" : "font-serif text-xl italic text-foreground/85"}
            >
              {line}
            </p>
          ))}
        </blockquote>
        {section.caption ? (
          <p className="mt-2 font-body text-xs uppercase tracking-[0.11em] text-text-secondary">{section.caption}</p>
        ) : null}
      </section>
    );
  }

  return (
    <section id={section.id} className="scroll-mt-24 border-t border-border/40 pt-8">
      <h2 className="font-display text-3xl leading-tight tracking-tight md:text-[2.35rem]">
        {section.title}
      </h2>
      <div className="mt-4 max-w-3xl">{renderSectionBody(section.body, section.inlineMedia)}</div>
    </section>
  );
}

export function ExperimentDetailShell({
  project,
  hasCoverAsset = false,
  hasVideoAsset = false
}: ExperimentDetailShellProps) {
  const subtitle = project.subtitle ?? project.oneLiner;
  const cover = getProjectCoverSrc(project);
  const fallbackCover = getFallbackCoverImage(project, "flagship");
  const hasRealCover = hasCoverAsset && !cover.includes("placeholder");
  const mediaBackground = hasRealCover ? `url(${cover})` : fallbackCover;
  const meta = getMetaValues(project);
  const primaryCta = getPrimaryExternalCta(project);
  const sections = project.detailSections ?? [];
  const hasStructuredSections = sections.length > 0;

  return (
    <Section spacing="compact" className="pt-0 pb-10 md:pb-14">
      <Container size="default">
        <div className="border-t border-border/55 pt-5 md:pt-6">
          <div
            className={
              hasStructuredSections
                ? "lg:grid lg:grid-cols-[13.5rem_minmax(0,45rem)] lg:items-start lg:gap-x-24 lg:pl-2"
                : "mx-auto max-w-[46rem]"
            }
          >
            {hasStructuredSections ? (
              <aside className="hidden lg:-mt-1 lg:block">
                <div className="sticky top-16 border-l border-border/45 pl-3">
                  <ExperimentBackLink />
                  <nav className="mt-6" aria-label="Section index">
                    <p className="font-body text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-foreground/72">
                      Sections
                    </p>
                    <ol className="mt-2.5 space-y-1.5">
                      {sections.map((section) => (
                        <li key={section.id}>
                          <a
                            href={`#${section.id}`}
                            className="font-body text-xs leading-snug tracking-[0.01em] text-text-muted transition-colors hover:text-foreground"
                          >
                            {section.title}
                          </a>
                        </li>
                      ))}
                    </ol>
                  </nav>
                </div>
              </aside>
            ) : null}

            <div className="min-w-0">
              <p className="font-body text-[0.66rem] uppercase tracking-[0.13em] text-text-muted">
                {getProjectTypeLine(project)}
              </p>

              <DisplayHeading as="h1" className="mt-3 text-5xl md:text-[4rem]">
                {project.title}
              </DisplayHeading>

              <BodyText tone="secondary" className="mt-3 text-lg md:text-xl">
                {subtitle}
              </BodyText>

              {primaryCta ? (
                <div className="mt-4">
                  <Button asChild variant="primary">
                    <a href={primaryCta.href} target="_blank" rel="noreferrer">
                      {primaryCta.label}
                    </a>
                  </Button>
                </div>
              ) : null}

              <div
                className="relative mt-6 min-h-[280px] overflow-hidden rounded-[0.95rem] bg-cover bg-center md:min-h-[460px]"
                style={{ backgroundImage: mediaBackground }}
                aria-hidden="true"
              >
                {hasVideoAsset && project.video?.src ? (
                  <>
                    <video
                      className="absolute inset-0 h-full w-full object-cover"
                      src={project.video.src}
                      autoPlay
                      loop
                      muted
                      playsInline
                      controls={false}
                      preload="metadata"
                      tabIndex={-1}
                      title={project.video.title}
                    />
                  </>
                ) : null}
              </div>

              <dl className="mt-4 max-w-3xl border-t border-border/45 pt-3 font-body text-sm text-text-secondary">
                <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-[0.68rem] uppercase tracking-[0.12em] text-text-muted">Role</dt>
                    <dd className="mt-1.5 text-foreground/88">{meta.role}</dd>
                  </div>
                  <div>
                    <dt className="text-[0.68rem] uppercase tracking-[0.12em] text-text-muted">Team</dt>
                    <dd className="mt-1.5 text-foreground/88">{meta.team}</dd>
                  </div>
                  <div>
                    <dt className="text-[0.68rem] uppercase tracking-[0.12em] text-text-muted">Timeline</dt>
                    <dd className="mt-1.5 text-foreground/88">{meta.timeline}</dd>
                  </div>
                  <div>
                    <dt className="text-[0.68rem] uppercase tracking-[0.12em] text-text-muted">Skills</dt>
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

              {hasStructuredSections ? (
                <div className="mt-10 space-y-10">
                <nav className="lg:hidden" aria-label="Section index">
                    <p className="font-body text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-foreground/72">
                      Sections
                    </p>
                    <ol className="mt-2.5 grid gap-1.5 sm:grid-cols-2">
                      {sections.map((section) => (
                        <li key={section.id}>
                          <a
                            href={`#${section.id}`}
                            className="font-body text-xs leading-snug tracking-[0.01em] text-text-muted transition-colors hover:text-foreground"
                          >
                            {section.title}
                          </a>
                        </li>
                      ))}
                    </ol>
                  </nav>

                  {sections.map((section) => (
                    <ExperimentDetailSectionBlock key={section.id} section={section} />
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
