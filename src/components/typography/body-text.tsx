import { createElement, type ComponentPropsWithoutRef, type ElementType } from "react";
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
  const Component = (as ?? "p") as ElementType;

  return createElement(Component, {
    className: cn(
        // inherits the 350 body weight from <body>
        "font-body text-body [&_b]:text-foreground [&_strong]:text-foreground",
        tone === "default" && "text-foreground",
        tone === "secondary" && "text-text-secondary",
        tone === "muted" && "text-text-muted",
        className
    ),
    ...props
  });
}
