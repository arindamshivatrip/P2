import type { ReactNode } from "react";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";

type PageShellProps = {
  children: ReactNode;
};

export function PageShell({ children }: PageShellProps) {
  return (
    <main>
      <Section spacing="compact">
        <Container>{children}</Container>
      </Section>
    </main>
  );
}
