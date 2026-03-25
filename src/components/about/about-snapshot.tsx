import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { DisplayHeading } from "@/components/typography/display-heading";
import { aboutContent } from "@/data/about";
import { cn } from "@/lib/utils";

export function AboutSnapshot() {
  return (
    <Section spacing="compact" className="pt-0 pb-4 md:pb-5">
      <Container>
        <div className="border-t border-border/60">
          {aboutContent.snapshot.map((block) => (
            <article
              key={block.title}
              className={cn(
                "grid gap-3.5 border-b border-border/50 py-4 md:grid-cols-[10.5rem_minmax(0,1fr)] md:gap-6 md:py-5",
                block.title === "Interested in" && "py-3.5 md:py-[0.95rem]"
              )}
            >
              <div>
                <span className="mb-2 block h-px w-8 bg-accent/55" />
                <DisplayHeading as="h2" className="mt-1 text-[1.82rem] md:text-[2.08rem]">
                  {block.title}
                </DisplayHeading>
              </div>
              <ul className={cn("space-y-2.5", block.title === "Interested in" && "space-y-2")}>
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
