import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { DisplayHeading } from "@/components/typography/display-heading";
import { aboutContent } from "@/data/about";

export function AboutSnapshot() {
  return (
    <Section spacing="compact" className="pt-0 pb-6 md:pb-8">
      <Container>
        <div className="border-t border-border/60">
          {aboutContent.snapshot.map((block) => (
            <article
              key={block.title}
              className="grid gap-4 border-b border-border/50 py-5 md:grid-cols-[11rem_minmax(0,1fr)] md:gap-6 md:py-6"
            >
              <div>
                <span className="mb-2 block h-px w-8 bg-accent/55" />
                <DisplayHeading as="h2" className="mt-1 text-[1.9rem] md:text-[2.2rem]">
                  {block.title}
                </DisplayHeading>
              </div>
              <ul className="space-y-2.5">
                {block.items.map((item) => (
                  <li key={item} className="font-body text-base leading-relaxed text-text-secondary">
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}
