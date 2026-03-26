import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { DisplayHeading } from "@/components/typography/display-heading";
import { ProjectCard } from "@/components/ui/project-card";
import { Reveal } from "@/components/ui/reveal";
import { projectsContent } from "@/data/home";
import { getHomeFeaturedProjects, getProjectDestinationHref } from "@/data/projects";

const featuredProjects = getHomeFeaturedProjects();
const featuredProject = featuredProjects[0];
const supportingProjects = featuredProjects.slice(1, 3);

const visualByTone = {
  featured: "min-h-[260px] md:min-h-[420px] bg-gradient-to-br from-zinc-700 via-zinc-900 to-[#17343f]",
  supportingA: "min-h-[180px] bg-gradient-to-br from-emerald-900 via-zinc-800 to-zinc-700",
  supportingB: "min-h-[170px] bg-gradient-to-br from-zinc-500 via-zinc-700 to-zinc-900"
} as const;

export function HomeSelectedProjectsSection() {
  if (!featuredProject) {
    return null;
  }

  return (
    <Section className="bg-background pt-3 md:pt-5 pb-8 md:pb-10">
      <Container>
        <div className="flex items-end justify-between gap-4">
          <Reveal>
            <DisplayHeading as="h2" className="text-4xl md:text-[3.2rem]">
              {projectsContent.title}
            </DisplayHeading>
          </Reveal>
          <Reveal delay={0.04}>
            <Link
              href="/work"
              className="pb-1 font-body text-sm uppercase tracking-[0.12em] text-text-muted transition-colors hover:text-foreground"
            >
              View all work
            </Link>
          </Reveal>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-12">
          <Reveal className="lg:col-span-8">
            <Link href={getProjectDestinationHref(featuredProject)} className="block">
              <ProjectCard
                title={featuredProject.title}
                summary={featuredProject.oneLiner}
                tags={(featuredProject.tags ?? featuredProject.categories).slice(0, 3)}
                tone="featured"
                visualClassName={visualByTone.featured}
                visualVideoSrc={featuredProject.video?.src}
                visualVideoTitle={featuredProject.video?.title}
                className="h-full p-5 md:p-6"
                interactive
              />
            </Link>
          </Reveal>

          <div className="grid gap-5 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-1">
            {supportingProjects[0] ? (
              <Reveal delay={0.06}>
                <Link href={getProjectDestinationHref(supportingProjects[0])} className="block">
                  <ProjectCard
                    title={supportingProjects[0].title}
                    summary={supportingProjects[0].oneLiner}
                    tags={(supportingProjects[0].tags ?? supportingProjects[0].categories).slice(0, 3)}
                    tone="supportingA"
                    visualClassName={visualByTone.supportingA}
                    interactive
                  />
                </Link>
              </Reveal>
            ) : null}

            {supportingProjects[1] ? (
              <Reveal delay={0.12}>
                <Link href={getProjectDestinationHref(supportingProjects[1])} className="block">
                  <ProjectCard
                    title={supportingProjects[1].title}
                    summary={supportingProjects[1].oneLiner}
                    tags={(supportingProjects[1].tags ?? supportingProjects[1].categories).slice(0, 3)}
                    tone="supportingB"
                    visualClassName={visualByTone.supportingB}
                    interactive
                  />
                </Link>
              </Reveal>
            ) : null}
          </div>
        </div>
      </Container>
    </Section>
  );
}
