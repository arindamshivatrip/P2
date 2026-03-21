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
        <div className="rounded-[1.25rem] bg-surface px-6 py-10 text-center shadow-card md:px-10 md:py-14">
          <DisplayHeading as="h2" className="text-5xl md:text-[3.8rem]">
            Let&apos;s discuss <span className="font-serif italic">systems</span>.
          </DisplayHeading>
          <BodyText tone="secondary" className="mx-auto mt-4 max-w-2xl">
            If a project resonates, I&apos;m happy to share deeper case-study context.
          </BodyText>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
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
