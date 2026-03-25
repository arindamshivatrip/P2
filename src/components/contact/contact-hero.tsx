import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { BodyText } from "@/components/typography/body-text";
import { DisplayHeading } from "@/components/typography/display-heading";
import { Eyebrow } from "@/components/typography/eyebrow";
import { Button } from "@/components/ui/button";
import { contactContent } from "@/data/contact";

export function ContactHero() {
  const [beforeThoughtful, afterThoughtful] = contactContent.heading.split("thoughtful");

  return (
    <Section spacing="compact" className="pb-2 md:pb-3">
      <Container>
        <Eyebrow>{contactContent.eyebrow}</Eyebrow>
        <DisplayHeading as="h1" className="mt-2.5 max-w-[16ch] text-5xl leading-[0.98] md:text-7xl">
          {afterThoughtful !== undefined ? (
            <>
              {beforeThoughtful}
              <span className="font-serif italic text-accent">thoughtful</span>
              {afterThoughtful}
            </>
          ) : (
            contactContent.heading
          )}
        </DisplayHeading>
        <BodyText tone="secondary" className="mt-4.5 max-w-3xl text-[1.02rem]">
          {contactContent.supporting}
        </BodyText>

        <div className="mt-7 flex flex-wrap items-center gap-2.5">
          <Button asChild variant="ghost" className="px-3 py-1.5 text-[0.68rem] md:text-xs">
            <Link href={contactContent.secondaryCta.href}>{contactContent.secondaryCta.label}</Link>
          </Button>
        </div>
      </Container>
    </Section>
  );
}
