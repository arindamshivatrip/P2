import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { BodyText } from "@/components/typography/body-text";
import { DisplayHeading } from "@/components/typography/display-heading";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { closingCtaContent } from "@/data/home";

export function HomeCtaSection() {
  return (
    <Section>
      <Container>
        <Reveal>
          <div className="max-w-4xl text-left">
            <DisplayHeading as="h2" className="mb-5 text-5xl md:mb-6 md:text-[4rem]">
              {closingCtaContent.heading}
            </DisplayHeading>
            <BodyText tone="secondary" className="max-w-2xl">
              {closingCtaContent.supporting}
            </BodyText>
            <div className="mt-6 flex flex-wrap items-center justify-start gap-3">
              <Button asChild>
                <Link href="/work">{closingCtaContent.primaryCta}</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href="/contact">{closingCtaContent.secondaryCta}</Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
