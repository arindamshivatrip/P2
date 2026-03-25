import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { DisplayHeading } from "@/components/typography/display-heading";

export function WorkHeader() {
  return (
    <Section spacing="compact" className="pb-4 md:pb-5">
      <Container>
        <DisplayHeading as="h1" className="text-5xl md:text-7xl">
          Work
        </DisplayHeading>
      </Container>
    </Section>
  );
}
