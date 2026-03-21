import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { BodyText } from "@/components/typography/body-text";
import { DisplayHeading } from "@/components/typography/display-heading";

export function WorkHeader() {
  return (
    <Section spacing="compact" className="pb-6 md:pb-8">
      <Container>
        <DisplayHeading as="h1" className="text-5xl md:text-7xl">
          Work
        </DisplayHeading>
        <BodyText tone="secondary" className="mt-4 max-w-2xl">
          Selected projects across AI systems, interaction design, research, and XR.
        </BodyText>
      </Container>
    </Section>
  );
}
