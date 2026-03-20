import { DisplayHeading } from "@/components/typography/display-heading";
import { BodyText } from "@/components/typography/body-text";
import { Eyebrow } from "@/components/typography/eyebrow";
import { PageShell } from "@/components/layout/page-shell";

type RoutePlaceholderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function RoutePlaceholder({ eyebrow, title, description }: RoutePlaceholderProps) {
  return (
    <PageShell>
      <Eyebrow>{eyebrow}</Eyebrow>
      <DisplayHeading className="mt-3">{title}</DisplayHeading>
      <BodyText tone="secondary" className="mt-5 max-w-2xl">
        {description}
      </BodyText>
    </PageShell>
  );
}
