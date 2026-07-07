import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { DisplayHeading } from "@/components/typography/display-heading";
import { Reveal } from "@/components/ui/reveal";
import { lensesContent, lensesStatement } from "@/data/home";

export function HomeLensesSection() {
  return (
    <Section className="pt-5 md:pt-6 pb-8 md:pb-10">
      <Container>
        <div className="border-t border-border pt-10 md:pt-14">
          <Reveal>
            <DisplayHeading as="h2" className="text-4xl md:text-[3.15rem]">
              {lensesContent.headingLineOne}
              <br />
              <span className="font-serif italic">{lensesContent.headingLineTwo}</span>
            </DisplayHeading>
          </Reveal>

          <Reveal delay={0.08}>
            <p className="mt-8 max-w-[38ch] font-display text-[clamp(1.5rem,2.6vw,2.3rem)] leading-[1.32] tracking-tight text-foreground md:mt-10">
              {lensesStatement.map((segment, index) =>
                segment.accent ? (
                  <em
                    key={index}
                    className="font-serif italic underline decoration-accent decoration-[0.1em] underline-offset-[0.22em]"
                  >
                    {segment.text}
                  </em>
                ) : (
                  <span key={index}>{segment.text}</span>
                )
              )}
            </p>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
