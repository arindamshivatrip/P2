import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { homeHeader } from "@/data/home";
import { navItems } from "@/data/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/80 backdrop-blur">
      <Container className="flex h-[4.4rem] items-center justify-between gap-4 md:h-[4.8rem]">
        <Link
          href="/"
          className="max-w-[60%] truncate font-display text-sm tracking-tight sm:text-base md:max-w-none md:text-lg"
        >
          {homeHeader.wordmark}
        </Link>
        <nav aria-label="Primary" className="hidden gap-7 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-body text-base font-medium text-foreground/80 hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Button
          asChild
          className="px-3.5 py-2 text-[0.72rem] uppercase tracking-[0.11em] md:text-[0.78rem]"
        >
          <Link href="/contact">{homeHeader.cta}</Link>
        </Button>
      </Container>
    </header>
  );
}
