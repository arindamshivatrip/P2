import type { Metadata } from "next";
import { ResonanceFieldPage } from "@/components/experiments/resonance-field/resonance-field-page";

export const metadata: Metadata = {
  title: "Resonance Field | Experiments",
  description: "A hand-tracked audio visualizer for sculpting sound into light."
};

export default function ResonanceFieldRoute() {
  return <ResonanceFieldPage />;
}
