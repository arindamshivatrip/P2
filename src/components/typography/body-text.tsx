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
        "font-body text-base leading-relaxed",
        tone === "default" && "text-foreground",
        tone === "secondary" && "text-text-secondary",
        tone === "muted" && "text-text-muted",
        className
      )}
      {...props}
    />
  );
}
