import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { BodyText } from "@/components/typography/body-text";
import { DisplayHeading } from "@/components/typography/display-heading";

export function ExperimentsHeader() {
  return (
    <Section spacing="compact" className="pt-5 pb-2 md:pt-6 md:pb-3">
      <Container>
        <DisplayHeading as="h1" className="text-5xl md:text-7xl">
          Experiments
        </DisplayHeading>
        <BodyText tone="secondary" className="mt-2 max-w-[62ch] text-[1rem] leading-[1.55]">
          Prototypes and technical studies in AI, interaction, and spatial systems.
        </BodyText>
      </Container>
    </Section>
  );
}
