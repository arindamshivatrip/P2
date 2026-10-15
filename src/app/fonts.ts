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

// Excon (Fontshare, variable 100–900). Body copy sits at 350 so it reads lighter
// than the old single-cut Epoch; small labels step up to 400 (see tailwind fontSize).
export const excon = localFont({
  variable: "--font-body",
  display: "swap",
  src: [{ path: "./fonts/excon/Excon-Variable.woff2", weight: "100 900", style: "normal" }]
});
