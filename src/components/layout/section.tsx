import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionProps = ComponentPropsWithoutRef<"section"> & {
  children: ReactNode;
  spacing?: "default" | "compact" | "hero";
};

export function Section({ children, className, spacing = "default", ...props }: SectionProps) {
  return (
    <section
      className={cn(
        spacing === "default" && "py-section",
        spacing === "compact" && "py-8 md:py-10",
        spacing === "hero" && "pt-10 pb-10 md:pt-14 md:pb-12",
        className
      )}
      {...props}
    >
      {children}
    </section>
  );
}
