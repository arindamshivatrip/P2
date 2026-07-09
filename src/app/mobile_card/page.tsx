import type { Metadata } from "next";
import { MobileCardPage } from "@/components/mobile-card/mobile-card-page";

export const metadata: Metadata = {
  title: "Mobile Card",
  description: "A mobile networking card for Arindam Tripathi."
};

export default function MobileCardRoute() {
  return <MobileCardPage />;
}
