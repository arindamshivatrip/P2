import { Instrument_Serif } from "next/font/google";
import localFont from "next/font/local";

export const instrumentSerif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
  style: "normal",
  display: "swap"
});

// Display renders at a single real weight everywhere — heavier cuts were
// shipped but never used, so they are no longer loaded.
export const neueRegrade = localFont({
  variable: "--font-display",
  display: "swap",
  src: [
    {
      path: "./fonts/neue-regrade/Neue Regrade Regular.otf",
      weight: "400",
      style: "normal"
    },
    {
      path: "./fonts/neue-regrade/Neue Regrade Regular Italic.otf",
      weight: "400",
      style: "italic"
    }
  ]
});

// Epoch has exactly one cut (400). Never pair it with font-medium/semibold —
// browsers synthesize fake weights and body copy turns muddy.
export const epoch = localFont({
  variable: "--font-body",
  display: "swap",
  src: [{ path: "./fonts/epoch/Epoch.otf", weight: "400", style: "normal" }]
});
