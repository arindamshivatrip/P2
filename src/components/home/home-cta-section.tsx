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
          <div className="rounded-[1.25rem] bg-surface px-6 py-10 shadow-card md:px-10 md:py-14">
            <div className="max-w-4xl text-left">
              <DisplayHeading as="h2" className="text-5xl md:text-[4rem]">
                {closingCtaContent.heading}
              </DisplayHeading>
              <BodyText tone="secondary" className="mt-5 max-w-xl">
                {closingCtaContent.supporting}
              </BodyText>
              <div className="mt-8 flex flex-wrap items-center justify-start gap-3">
                <Button asChild>
                  <Link href="/work">{closingCtaContent.primaryCta}</Link>
                </Button>
                <Button asChild variant="ghost">
                  <Link href="/contact">{closingCtaContent.secondaryCta}</Link>
                </Button>
              </div>
              <Link
                href={`mailto:${closingCtaContent.contactLine}`}
                className="mt-6 inline-block font-body text-sm text-text-secondary underline-offset-4 transition-colors hover:text-foreground hover:underline"
              >
                {closingCtaContent.contactLine}
              </Link>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
