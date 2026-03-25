import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { DisplayHeading } from "@/components/typography/display-heading";
import { BodyText } from "@/components/typography/body-text";
import { Button } from "@/components/ui/button";

export function WorkCta() {
  return (
    <Section>
      <Container>
        <div className="max-w-4xl text-left">
          <DisplayHeading as="h2" className="text-5xl md:text-[4rem]">
            Curious about the work?
          </DisplayHeading>
          <BodyText tone="secondary" className="mt-3 max-w-[58ch] text-[1.02rem] leading-relaxed">
            I&apos;m happy to share more context on process, decisions, and outcomes behind any of
            these projects.
          </BodyText>
          <div className="mt-5 flex flex-wrap items-center justify-start gap-3">
            <Button asChild>
              <Link href="/contact">Get in touch</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/cv">View CV</Link>
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
