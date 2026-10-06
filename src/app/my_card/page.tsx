import type { Metadata, Viewport } from "next";
import { MobileCardPage } from "@/components/mobile-card/mobile-card-page";

// Owner copy of the card, opened from a home-screen bookmark to show the QR.
// Kept out of search; visitors only ever get /mobile_card.
export const metadata: Metadata = {
  title: "My Card",
  description: "Owner copy of Arindam Tripathi's mobile card, QR first.",
  robots: { index: false, follow: false }
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f4ed" },
    { media: "(prefers-color-scheme: dark)", color: "#0f1113" }
  ]
};

export default function MyCardRoute() {
  return <MobileCardPage qrFirst />;
}
