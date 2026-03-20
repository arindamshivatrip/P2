import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { BodyText } from "@/components/typography/body-text";
import { DisplayHeading } from "@/components/typography/display-heading";
import { Eyebrow } from "@/components/typography/eyebrow";
import { Reveal } from "@/components/ui/reveal";
import { lensItems, lensesContent } from "@/data/home";

export function HomeLensesSection() {
  return (
    <Section>
      <Container>
        <div className="rounded-[1.25rem] bg-surface p-6 shadow-card md:p-10">
          <Reveal>
            <DisplayHeading as="h2" className="text-4xl md:text-[3.15rem]">
              {lensesContent.headingLineOne}
              <br />
              <span className="font-serif italic">{lensesContent.headingLineTwo}</span>
            </DisplayHeading>
            <BodyText tone="secondary" className="mt-5 max-w-3xl">
              {lensesContent.intro}
            </BodyText>
          </Reveal>

          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {lensItems.map((lens, index) => (
              <Reveal key={lens.id} delay={index * 0.05}>
                <article className="h-full rounded-card bg-background/75 p-4 shadow-[0_10px_24px_rgba(38,31,24,0.08)] transition-shadow hover:shadow-[0_14px_28px_rgba(38,31,24,0.12)]">
                  <Eyebrow className="text-accent/90">{lens.title}</Eyebrow>
                  <BodyText tone="secondary" className="mt-3 text-sm leading-relaxed">
                    {lens.body}
                  </BodyText>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
