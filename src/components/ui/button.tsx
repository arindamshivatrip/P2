import {
  cloneElement,
  isValidElement,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type ReactElement
} from "react";
import { cn } from "@/lib/utils";

type SharedProps = {
  variant?: "primary" | "ghost";
  asChild?: boolean;
  className?: string;
};

type ButtonElementProps = SharedProps & ButtonHTMLAttributes<HTMLButtonElement>;
type AnchorElementProps = SharedProps & AnchorHTMLAttributes<HTMLAnchorElement>;
type ButtonProps = ButtonElementProps | AnchorElementProps;

const buttonClasses =
  "inline-flex items-center justify-center rounded-button border px-4 py-2 font-body text-sm transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60";

export function Button({ className, variant = "primary", asChild = false, ...props }: ButtonProps) {
  if (asChild) {
    const { children } = props as AnchorElementProps;
    if (!isValidElement(children)) {
      return null;
    }

    const child = children as ReactElement<{ className?: string }>;

    return (
      <>
        {cloneElement(child, {
          className: cn(
            buttonClasses,
            variant === "primary" &&
              "border-accent bg-accent text-foreground hover:bg-accent/90 hover:shadow-[0_10px_20px_rgba(255,153,50,0.2)]",
            variant === "ghost" &&
              "border-border bg-transparent text-foreground hover:border-accent/40 hover:bg-surface",
            child.props.className,
            className
          )
        })}
      </>
    );
  }

  const buttonProps = props as ButtonElementProps;
  return (
    <button
      type={buttonProps.type ?? "button"}
      className={cn(
        buttonClasses,
        variant === "primary" &&
          "border-accent bg-accent text-foreground hover:bg-accent/90 hover:shadow-[0_10px_20px_rgba(255,153,50,0.2)]",
        variant === "ghost" &&
          "border-border bg-transparent text-foreground hover:border-accent/40 hover:bg-surface",
        className
      )}
      {...buttonProps}
    />
  );
}
