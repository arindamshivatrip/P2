import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { BodyText } from "@/components/typography/body-text";
import { DisplayHeading } from "@/components/typography/display-heading";
import { Eyebrow } from "@/components/typography/eyebrow";
import { messagesContent } from "@/data/messages";

export function MessagesHero() {
  const { heading, accentWord } = messagesContent;
  const [before, after] = heading.split(accentWord);

  return (
    <Section spacing="compact" className="pb-2 md:pb-3">
      <Container>
        <Eyebrow>{messagesContent.eyebrow}</Eyebrow>
        <DisplayHeading as="h1" className="mt-2.5 max-w-[18ch] text-display-md">
          {after !== undefined ? (
            <>
              {before}
              <span className="font-serif italic text-accent-strong">{accentWord}</span>
              {after}
            </>
          ) : (
            heading
          )}
        </DisplayHeading>
        <BodyText tone="secondary" className="mt-4.5 max-w-3xl text-body-lg">
          {messagesContent.supporting}
        </BodyText>
      </Container>
    </Section>
  );
}
