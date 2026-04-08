import type { ComponentPropsWithoutRef, ElementType } from "react";
import { cn } from "@/lib/utils";

type BodyTextProps<T extends ElementType = "p"> = {
  as?: T;
  tone?: "default" | "secondary" | "muted";
} & Omit<ComponentPropsWithoutRef<T>, "as">;

export function BodyText<T extends ElementType = "p">({
  as,
  className,
  tone = "default",
  ...props
}: BodyTextProps<T>) {
  const Component = as ?? "p";

  return (
    <Component
      className={cn(
        "font-body font-light text-base leading-relaxed [&_b]:font-medium [&_b]:text-foreground [&_strong]:font-medium [&_strong]:text-foreground",
        tone === "default" && "text-foreground",
        tone === "secondary" && "text-text-secondary",
        tone === "muted" && "text-text-muted",
        className
      )}
      {...props}
    />
  );
}
