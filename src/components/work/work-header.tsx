import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { BodyText } from "@/components/typography/body-text";
import { DisplayHeading } from "@/components/typography/display-heading";
import { TextReveal } from "@/components/ui/text-reveal";

export function WorkHeader() {
  return (
    <Section spacing="compact" className="pb-4 md:pb-5">
      <Container>
        <DisplayHeading as="h1" className="text-display-lg">
          <TextReveal lines={[<span key="work">Work</span>]} />
        </DisplayHeading>
        <BodyText tone="secondary" className="mt-4 max-w-[62ch]">
          Case studies across AI systems, interaction design, research, and XR — with
          outcomes where I can share them.
        </BodyText>
      </Container>
    </Section>
  );
}
