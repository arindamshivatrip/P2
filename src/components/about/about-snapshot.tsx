import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { DisplayHeading } from "@/components/typography/display-heading";
import { Reveal } from "@/components/ui/reveal";
import { aboutContent } from "@/data/about";
import { cn } from "@/lib/utils";

export function AboutSnapshot() {
  return (
    <Section spacing="compact" className="pt-0 pb-4 md:pb-5">
      <Container>
        <div className="border-t border-border/60">
          {aboutContent.snapshot.map((block, index) => (
            <Reveal key={block.title} delay={index * 0.06}>
            <article
              className={cn(
                "group grid gap-3.5 border-b border-border/50 py-4 md:grid-cols-[10.5rem_minmax(0,1fr)] md:gap-6 md:py-5",
                block.title === "Interested in" && "py-3.5 md:py-[0.95rem]"
              )}
            >
              <div>
                <span className="mb-2 block h-px w-8 bg-accent/55 transition-all duration-300 motion-safe:group-hover:w-14 motion-safe:group-hover:bg-accent" />
                <DisplayHeading as="h2" className="mt-1 text-display-xs">
                  {block.title}
                </DisplayHeading>
              </div>
              <ul
                className={cn(
                  "space-y-2.5 transition-transform duration-300 ease-out motion-safe:group-hover:translate-x-1",
                  block.title === "Interested in" && "space-y-2"
                )}
              >
                {block.items.map((item) => (
                  <li
                    key={item}
                    className="group/item flex items-baseline gap-3 font-body text-base leading-relaxed text-text-secondary transition-colors duration-200 hover:text-foreground"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-[0.65rem] h-px w-3 shrink-0 bg-border transition-colors duration-200 group-hover/item:bg-accent motion-safe:transition-all motion-safe:group-hover/item:w-6"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
