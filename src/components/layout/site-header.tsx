"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/layout/container";
import { homeHeader } from "@/data/home";
import { navItems } from "@/data/site";
import { cn } from "@/lib/utils";

type HeaderNavLinkProps = {
  href: string;
  label: string;
  isActive: boolean;
};

function HeaderNavLink({ href, label, isActive }: HeaderNavLinkProps) {
  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "relative pb-1 font-body text-base font-medium text-foreground/80 hover:text-foreground",
        isActive && "text-foreground"
      )}
    >
      <span>{label}</span>
      {isActive ? (
        <span
          aria-hidden="true"
          className="absolute -bottom-[2px] left-0 h-px w-full bg-accent"
        />
      ) : null}
    </Link>
  );
}

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/80 backdrop-blur">
      <Container className="flex h-[4.4rem] items-center justify-between md:h-[4.8rem]">
        <Link
          href="/"
          className="max-w-[60%] truncate font-display text-sm tracking-tight sm:text-base md:max-w-none md:text-lg"
        >
          {homeHeader.wordmark}
        </Link>
        <nav aria-label="Primary" className="hidden gap-8 lg:flex">
          {navItems.map((item) => {
            const isHome = item.href === "/";
            const isActive = isHome ? pathname === "/" : pathname.startsWith(item.href);

            return (
              <HeaderNavLink
                key={item.href}
                href={item.href}
                label={item.label}
                isActive={isActive}
              />
            );
          })}
        </nav>
      </Container>
    </header>
  );
}
