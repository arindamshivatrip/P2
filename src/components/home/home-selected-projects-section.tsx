import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { DisplayHeading } from "@/components/typography/display-heading";
import { ProjectCard } from "@/components/ui/project-card";
import { Reveal } from "@/components/ui/reveal";
import { homeProjects, projectsContent } from "@/data/home";

const featuredProject = homeProjects.find((project) => project.featured);
const supportingProjects = homeProjects.filter((project) => !project.featured);

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
    <Section className="bg-background">
      <Container>
        <Reveal>
          <DisplayHeading as="h2" className="text-4xl md:text-[3.2rem]">
            {projectsContent.title}
          </DisplayHeading>
        </Reveal>

        <div className="mt-10 grid gap-5 lg:grid-cols-12">
          <Reveal className="lg:col-span-8">
            <ProjectCard
              title={featuredProject.title}
              summary={featuredProject.description}
              tags={featuredProject.tags}
              tone={featuredProject.visualTone}
              visualClassName={visualByTone[featuredProject.visualTone]}
              className="h-full p-5 md:p-6"
              interactive
            />
          </Reveal>

          <div className="grid gap-5 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-1">
            {supportingProjects[0] ? (
              <Reveal delay={0.06}>
                <ProjectCard
                  title={supportingProjects[0].title}
                  summary={supportingProjects[0].description}
                  tags={supportingProjects[0].tags}
                  tone={supportingProjects[0].visualTone}
                  visualClassName={visualByTone[supportingProjects[0].visualTone]}
                  interactive
                />
              </Reveal>
            ) : null}

            {supportingProjects[1] ? (
              <Reveal delay={0.12}>
                <ProjectCard
                  title={supportingProjects[1].title}
                  summary={supportingProjects[1].description}
                  tags={supportingProjects[1].tags}
                  tone={supportingProjects[1].visualTone}
                  visualClassName={visualByTone[supportingProjects[1].visualTone]}
                  interactive
                />
              </Reveal>
            ) : null}
          </div>
        </div>
      </Container>
    </Section>
  );
}
