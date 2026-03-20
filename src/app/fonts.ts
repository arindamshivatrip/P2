import { Instrument_Serif } from "next/font/google";
import localFont from "next/font/local";

export const instrumentSerif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
  style: "normal",
  display: "swap"
});

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
    },
    {
      path: "./fonts/neue-regrade/Neue Regrade Medium.otf",
      weight: "500",
      style: "normal"
    },
    {
      path: "./fonts/neue-regrade/Neue Regrade Medium Italic.otf",
      weight: "500",
      style: "italic"
    },
    {
      path: "./fonts/neue-regrade/Neue Regrade Semibold.otf",
      weight: "600",
      style: "normal"
    },
    {
      path: "./fonts/neue-regrade/Neue Regrade SemiBold Italic.otf",
      weight: "600",
      style: "italic"
    },
    {
      path: "./fonts/neue-regrade/Neue Regrade Bold.otf",
      weight: "700",
      style: "normal"
    },
    {
      path: "./fonts/neue-regrade/Neue Regrade Bold Italic.otf",
      weight: "700",
      style: "italic"
    }
  ]
});

export const epoch = localFont({
  variable: "--font-body",
  display: "swap",
  src: [{ path: "./fonts/epoch/Epoch.otf", weight: "400", style: "normal" }]
});
