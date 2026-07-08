import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Custom font-size tokens must be registered so twMerge treats them as sizes,
// not text colors — otherwise `cn("text-label", "text-accent")` drops the size.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "label-xs",
            "label",
            "label-lg",
            "caption",
            "body-sm",
            "body",
            "body-lg",
            "display-xs",
            "display-sm",
            "display-md",
            "display-lg",
            "display-xl"
          ]
        }
      ]
    }
  }
});

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
