import type { Metadata, Viewport } from "next";
import { MobileCardPage } from "@/components/mobile-card/mobile-card-page";

export const metadata: Metadata = {
  title: "Mobile Card",
  description: "A mobile networking card for Arindam Tripathi."
};

// Browser chrome follows the device theme, like the card itself.
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f4ed" },
    { media: "(prefers-color-scheme: dark)", color: "#0f1113" }
  ]
};

export default function MobileCardRoute() {
  return <MobileCardPage />;
}
